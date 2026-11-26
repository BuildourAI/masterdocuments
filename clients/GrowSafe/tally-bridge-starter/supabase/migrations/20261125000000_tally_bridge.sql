-- GrowSafe Tally Bridge: the copy of Tally, the sync bookkeeping, the approval queue and the mapping (Akash's point 5).
-- Safe to run twice. Tables named tally_* are a READ-ONLY copy of TallyPrime: only the bridge (secret key) writes them.
-- The app never edits them; it works through bridge_writeback_queue and the app_* tables.

-- profiles may already exist from the F-00 starter tables; create a minimal one if not.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists role text not null default 'staff';
alter table public.profiles enable row level security;

-- ---------- The copy of Tally (read-only for the app) ----------
create table if not exists public.tally_companies (
  guid text primary key,
  name text not null,
  books_from date,
  is_test_company boolean not null default false,
  last_seen_at timestamptz
);

create table if not exists public.tally_groups (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint,
  name text not null, parent text, primary_group text, nature text, is_revenue boolean,
  primary key (company_guid, guid)
);
create table if not exists public.tally_ledgers (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint,
  name text not null, parent text,
  opening_balance numeric(18,2) default 0, closing_balance numeric(18,2) default 0,
  primary_group text, gstin text, gst_registration_type text, pan text, state text, pincode text, email text, mobile text,
  is_bill_wise boolean, credit_days int,
  primary key (company_guid, guid)
);
create table if not exists public.tally_cost_centres (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint, name text not null, parent text, category text,
  primary key (company_guid, guid)
);
create table if not exists public.tally_stock_groups (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint, name text not null, parent text,
  primary key (company_guid, guid)
);
create table if not exists public.tally_stock_items (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint, name text not null, parent text,
  category text, base_unit text, hsn text, gst_rate numeric(6,2),
  opening_qty numeric(18,3) default 0, closing_qty numeric(18,3) default 0, closing_value numeric(18,2) default 0,
  primary key (company_guid, guid)
);
create table if not exists public.tally_units (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint, name text not null, parent text,
  primary key (company_guid, guid)
);
create table if not exists public.tally_godowns (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint, name text not null, parent text,
  primary key (company_guid, guid)
);
create table if not exists public.tally_voucher_types (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint, name text not null, parent text,
  primary key (company_guid, guid)
);
create table if not exists public.tally_vouchers (
  company_guid text not null references public.tally_companies(guid),
  guid text not null, master_id bigint, alter_id bigint,
  date date, voucher_type text, base_type text, voucher_number text, party_ledger text, narration text, reference text,
  is_optional boolean not null default false, is_cancelled boolean not null default false,
  is_invoice boolean not null default false, is_deleted boolean not null default false,
  app_tag text,
  synced_at timestamptz not null default now(),
  primary key (company_guid, guid)
);
create table if not exists public.tally_ledger_entries (
  company_guid text not null, voucher_guid text not null, line_no int not null,
  ledger text not null, amount numeric(18,2) not null default 0, is_party boolean not null default false,
  bill_refs jsonb not null default '[]'::jsonb, cost_centres jsonb not null default '[]'::jsonb,
  primary key (company_guid, voucher_guid, line_no),
  foreign key (company_guid, voucher_guid) references public.tally_vouchers(company_guid, guid) on delete cascade
);
create table if not exists public.tally_inventory_entries (
  company_guid text not null, voucher_guid text not null, line_no int not null,
  item text not null, qty numeric(18,3) default 0, unit text, rate numeric(18,4) default 0,
  amount numeric(18,2) default 0, is_inward boolean not null default false,
  godown text, batches jsonb not null default '[]'::jsonb,
  primary key (company_guid, voucher_guid, line_no),
  foreign key (company_guid, voucher_guid) references public.tally_vouchers(company_guid, guid) on delete cascade
);

-- (for a database created from an earlier draft of this file)
alter table public.tally_vouchers add column if not exists base_type text;
alter table public.tally_groups add column if not exists primary_group text;
alter table public.tally_groups add column if not exists nature text;
alter table public.tally_ledgers add column if not exists primary_group text;
alter table public.tally_ledgers add column if not exists pan text;
alter table public.tally_ledgers add column if not exists credit_days int;
alter table public.tally_stock_items add column if not exists category text;
alter table public.tally_stock_items add column if not exists hsn text;
alter table public.tally_stock_items add column if not exists gst_rate numeric(6,2);
alter table public.tally_ledger_entries add column if not exists cost_centres jsonb not null default '[]'::jsonb;
alter table public.tally_inventory_entries add column if not exists godown text;

create index if not exists tally_vouchers_date on public.tally_vouchers(company_guid, date);
create index if not exists tally_vouchers_party on public.tally_vouchers(company_guid, party_ledger);
create index if not exists tally_vouchers_tag on public.tally_vouchers(company_guid, app_tag) where app_tag is not null;
create index if not exists tally_ledger_entries_ledger on public.tally_ledger_entries(company_guid, ledger);
create index if not exists tally_ledgers_name on public.tally_ledgers(company_guid, name);
create index if not exists tally_groups_name on public.tally_groups(company_guid, name);
create index if not exists tally_stock_items_name on public.tally_stock_items(company_guid, name);

-- ---------- Sync bookkeeping ----------
create table if not exists public.bridge_sync_state (
  company_guid text not null, kind text not null, last_alter_id bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (company_guid, kind)
);
create table if not exists public.bridge_sync_runs (
  id bigint generated always as identity primary key,
  company_guid text, kind text not null, status text,
  started_at timestamptz, finished_at timestamptz, error text, details jsonb
);
create table if not exists public.bridge_reconciliations (
  id bigint generated always as identity primary key,
  company_guid text not null, kind text not null, run_at timestamptz not null default now(),
  mismatches int not null default 0, details jsonb
);

-- ---------- The approval queue: the ONLY way anything reaches Tally ----------
-- status: draft -> approved -> sending -> sent -> in_tally (masters) | in_tally_optional -> converted (vouchers)
--         or failed / check_in_tally / rejected
create table if not exists public.bridge_writeback_queue (
  id uuid primary key default gen_random_uuid(),
  company_guid text not null references public.tally_companies(guid),
  kind text not null check (kind in ('master','voucher')),
  object_type text not null,           -- 'Ledger' for masters; the Tally voucher type name for vouchers
  payload jsonb not null,
  status text not null default 'draft'
    check (status in ('draft','approved','sending','sent','in_tally','in_tally_optional','converted','failed','check_in_tally','rejected')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  approved_by uuid, approved_at timestamptz,
  sent_at timestamptz, confirmed_at timestamptz,
  error text, tally_response jsonb
);
create index if not exists bridge_writeback_queue_status on public.bridge_writeback_queue(company_guid, status);

-- Who may approve what (Akash's guardrails). Seeded with the owner; add roles as the team grows.
create table if not exists public.app_approval_rules (
  kind text not null, object_type text not null default '*', role text not null,
  primary key (kind, object_type, role)
);
insert into public.app_approval_rules(kind, object_type, role) values ('master','*','owner'), ('voucher','*','owner')
  on conflict do nothing;

-- ---------- Akash's point 5: people mapped to Tally, chosen from Tally's own lists ----------
create table if not exists public.app_profile_tally_links (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company_guid text not null references public.tally_companies(guid),
  expense_ledger_guid text, salary_ledger_guid text, cost_centre_guid text,
  primary key (profile_id, company_guid)
);
create table if not exists public.app_salesperson_groups (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company_guid text not null,
  group_guid text not null,
  primary key (profile_id, company_guid, group_guid),
  foreign key (company_guid, group_guid) references public.tally_groups(company_guid, guid)
);

-- ---------- Views ----------
-- Vouchers that post to the books. Orders, delivery and receipt notes, rejections, memoranda and stock-only
-- vouchers are kept in the copy (sales reporting needs orders) but never count in balances.
create or replace function public.tally_affects_books(p_base_type text)
returns boolean language sql immutable as $$
  select coalesce(p_base_type, '') not in ('Sales Order','Purchase Order','Delivery Note','Receipt Note','Rejections In',
    'Rejections Out','Memorandum','Reversing Journal','Stock Journal','Physical Stock','Material In','Material Out',
    'Job Work In Order','Job Work Out Order','Attendance');
$$;

-- Ledger balance computed from the copied vouchers (regular, not cancelled, not deleted, posting to the books).
-- Same sign as Tally: debit negative.
create or replace view public.v_tally_ledger_balance with (security_invoker = on) as
select l.company_guid, l.guid as ledger_guid, l.name,
       l.opening_balance + coalesce(sum(e.amount) filter (where v.guid is not null), 0) as computed_closing
from public.tally_ledgers l
left join public.tally_ledger_entries e on e.company_guid = l.company_guid and e.ledger = l.name
left join public.tally_vouchers v on v.company_guid = e.company_guid and v.guid = e.voucher_guid
     and not v.is_optional and not v.is_cancelled and not v.is_deleted and public.tally_affects_books(v.base_type)
group by l.company_guid, l.guid, l.name, l.opening_balance;

-- Every dealer ledger under each salesperson's Tally group(s), including sub-groups.
create or replace view public.v_salesperson_dealers with (security_invoker = on) as
with recursive tree as (
  select sg.profile_id, g.company_guid, g.name as group_name
  from public.app_salesperson_groups sg
  join public.tally_groups g on g.company_guid = sg.company_guid and g.guid = sg.group_guid
  union
  select t.profile_id, g.company_guid, g.name
  from tree t join public.tally_groups g on g.company_guid = t.company_guid and g.parent = t.group_name
)
select distinct t.profile_id, l.company_guid, l.guid as ledger_guid, l.name as dealer, l.closing_balance
from tree t join public.tally_ledgers l on l.company_guid = t.company_guid and l.parent = t.group_name;

-- ---------- Functions used by the bridge (secret key) ----------
create or replace function public.bridge_upsert_vouchers(p_company_guid text, p_rows jsonb)
returns int language plpgsql security definer set search_path = public as $$
declare r jsonb; n int := 0;
begin
  for r in select * from jsonb_array_elements(p_rows) loop
    insert into tally_vouchers as v (company_guid, guid, master_id, alter_id, date, voucher_type, base_type, voucher_number,
      party_ledger, narration, reference, is_optional, is_cancelled, is_invoice, is_deleted, app_tag, synced_at)
    values (p_company_guid, r->>'guid', (r->>'master_id')::bigint, (r->>'alter_id')::bigint, (r->>'date')::date,
      r->>'voucher_type', r->>'base_type', r->>'voucher_number', r->>'party_ledger', r->>'narration', r->>'reference',
      coalesce((r->>'is_optional')::boolean, false), coalesce((r->>'is_cancelled')::boolean, false),
      coalesce((r->>'is_invoice')::boolean, false), false, r->>'app_tag', now())
    on conflict (company_guid, guid) do update set
      master_id = excluded.master_id, alter_id = excluded.alter_id, date = excluded.date,
      voucher_type = excluded.voucher_type, base_type = excluded.base_type, voucher_number = excluded.voucher_number,
      party_ledger = excluded.party_ledger, narration = excluded.narration, reference = excluded.reference,
      is_optional = excluded.is_optional, is_cancelled = excluded.is_cancelled, is_invoice = excluded.is_invoice,
      is_deleted = false, app_tag = excluded.app_tag, synced_at = now();

    delete from tally_ledger_entries where company_guid = p_company_guid and voucher_guid = r->>'guid';
    delete from tally_inventory_entries where company_guid = p_company_guid and voucher_guid = r->>'guid';

    insert into tally_ledger_entries (company_guid, voucher_guid, line_no, ledger, amount, is_party, bill_refs, cost_centres)
    select p_company_guid, r->>'guid', (e->>'line_no')::int, e->>'ledger', coalesce((e->>'amount')::numeric, 0),
           coalesce((e->>'is_party')::boolean, false), coalesce(e->'bill_refs', '[]'::jsonb), coalesce(e->'cost_centres', '[]'::jsonb)
    from jsonb_array_elements(coalesce(r->'ledger_entries', '[]'::jsonb)) e;

    insert into tally_inventory_entries (company_guid, voucher_guid, line_no, item, qty, unit, rate, amount, is_inward, godown, batches)
    select p_company_guid, r->>'guid', (e->>'line_no')::int, e->>'item', coalesce((e->>'qty')::numeric, 0), e->>'unit',
           coalesce((e->>'rate')::numeric, 0), coalesce((e->>'amount')::numeric, 0),
           coalesce((e->>'is_inward')::boolean, false), e->>'godown', coalesce(e->'batches', '[]'::jsonb)
    from jsonb_array_elements(coalesce(r->'inventory_entries', '[]'::jsonb)) e;
    n := n + 1;
  end loop;
  return n;
end $$;

create or replace function public.bridge_mark_deleted(p_company_guid text, p_guids text[])
returns int language sql security definer set search_path = public as $$
  with u as (update tally_vouchers set is_deleted = true, synced_at = now()
             where company_guid = p_company_guid and guid = any(p_guids) and not is_deleted returning 1)
  select count(*)::int from u;
$$;

-- Picks approved rows and marks them 'sending' in one step, so the same row can never be sent twice.
create or replace function public.bridge_claim_writebacks(p_company_guid text, p_master_types text[], p_voucher_types text[], p_limit int)
returns setof public.bridge_writeback_queue language sql security definer set search_path = public as $$
  update bridge_writeback_queue q set status = 'sending'
  where q.id in (
    select id from bridge_writeback_queue
    where company_guid = p_company_guid and status = 'approved'
      and ((kind = 'master' and object_type = any(p_master_types)) or (kind = 'voucher' and object_type = any(p_voucher_types)))
    order by approved_at nulls last, created_at
    limit p_limit
    for update skip locked
  )
  returning q.*;
$$;

create or replace function public.bridge_writeback_result(p_id uuid, p_status text, p_error text, p_response jsonb)
returns void language sql security definer set search_path = public as $$
  update bridge_writeback_queue set status = p_status, error = p_error, tally_response = p_response,
    sent_at = case when p_status in ('sent','in_tally','in_tally_optional','converted') then coalesce(sent_at, now()) else sent_at end,
    confirmed_at = case when p_status in ('in_tally','in_tally_optional','converted') then now() else confirmed_at end
  where id = p_id;
$$;

-- After each sync: anything the app wrote is matched against what Tally now holds.
create or replace function public.bridge_confirm_writebacks(p_company_guid text)
returns int language plpgsql security definer set search_path = public as $$
declare n int := 0; k int;
begin
  update bridge_writeback_queue q
     set status = case when v.is_optional then 'in_tally_optional' else 'converted' end,
         confirmed_at = coalesce(q.confirmed_at, now())
    from tally_vouchers v
   where q.company_guid = p_company_guid and q.kind = 'voucher'
     and q.status in ('sent','in_tally_optional','check_in_tally')
     and v.company_guid = q.company_guid and v.app_tag = q.id::text and not v.is_deleted
     and q.status is distinct from (case when v.is_optional then 'in_tally_optional' else 'converted' end);
  get diagnostics k = row_count; n := n + k;

  update bridge_writeback_queue q
     set status = 'in_tally', confirmed_at = now()
    from tally_ledgers l
   where q.company_guid = p_company_guid and q.kind = 'master' and q.object_type = 'Ledger'
     and q.status in ('sent','check_in_tally')
     and l.company_guid = q.company_guid and l.name = q.payload->>'name';
  get diagnostics k = row_count; n := n + k;
  return n;
end $$;

-- The bridge talks to the database only through these functions (secret key).
create or replace function public.bridge_save_company(p_guid text, p_name text, p_books_from date, p_is_test boolean)
returns void language sql security definer set search_path = public as $$
  insert into tally_companies(guid, name, books_from, is_test_company, last_seen_at)
  values (p_guid, p_name, p_books_from, p_is_test, now())
  on conflict (guid) do update set name = excluded.name, books_from = excluded.books_from,
    is_test_company = excluded.is_test_company, last_seen_at = now();
$$;

create or replace function public.bridge_get_state(p_company_guid text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(kind, last_alter_id), '{}'::jsonb) from bridge_sync_state where company_guid = p_company_guid;
$$;

create or replace function public.bridge_set_state(p_company_guid text, p_kind text, p_last bigint)
returns void language sql security definer set search_path = public as $$
  insert into bridge_sync_state(company_guid, kind, last_alter_id, updated_at) values (p_company_guid, p_kind, p_last, now())
  on conflict (company_guid, kind) do update set last_alter_id = excluded.last_alter_id, updated_at = now();
$$;

-- Masters: upsert rows (already in column names) into one of the tally_* master tables.
create or replace function public.bridge_upsert_masters(p_table text, p_company_guid text, p_rows jsonb)
returns int language plpgsql security definer set search_path = public as $$
declare cols text; sets text; n int;
begin
  if p_table not in ('tally_groups','tally_ledgers','tally_cost_centres','tally_stock_groups','tally_stock_items',
                     'tally_units','tally_godowns','tally_voucher_types') then
    raise exception 'not a master table: %', p_table;
  end if;
  select string_agg(quote_ident(column_name), ', ' order by ordinal_position),
         string_agg(format('%1$I = excluded.%1$I', column_name), ', ' order by ordinal_position)
           filter (where column_name not in ('company_guid','guid'))
    into cols, sets
    from information_schema.columns where table_schema = 'public' and table_name = p_table;
  execute format(
    'insert into %1$I (%2$s) select %2$s from jsonb_populate_recordset(null::%1$I, $1) on conflict (company_guid, guid) do update set %3$s',
    p_table, cols, sets)
  using (select coalesce(jsonb_agg(e || jsonb_build_object('company_guid', p_company_guid)), '[]'::jsonb) from jsonb_array_elements(p_rows) e);
  get diagnostics n = row_count;
  return n;
end $$;

create or replace function public.bridge_voucher_guids(p_company_guid text, p_from date, p_to date)
returns text[] language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(guid), '{}') from tally_vouchers
  where company_guid = p_company_guid and not is_deleted and date between p_from and p_to;
$$;

create or replace function public.bridge_voucher_by_tag(p_company_guid text, p_tag text)
returns jsonb language sql stable security definer set search_path = public as $$
  select to_jsonb(v) from (select guid, is_optional, is_cancelled from tally_vouchers
    where company_guid = p_company_guid and app_tag = p_tag and not is_deleted limit 1) v;
$$;

create or replace function public.bridge_ledger_balances(p_company_guid text)
returns table(ledger_guid text, name text, computed_closing numeric) language sql stable security definer set search_path = public as $$
  select ledger_guid, name, computed_closing from v_tally_ledger_balance where company_guid = p_company_guid;
$$;

create or replace function public.bridge_log(p_table text, p_row jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_table = 'bridge_sync_runs' then
    insert into bridge_sync_runs(company_guid, kind, status, started_at, finished_at, error, details)
    select company_guid, kind, status, started_at, finished_at, error, details from jsonb_populate_record(null::bridge_sync_runs, p_row);
  elsif p_table = 'bridge_reconciliations' then
    insert into bridge_reconciliations(company_guid, kind, mismatches, details)
    select company_guid, kind, coalesce(mismatches, 0), details from jsonb_populate_record(null::bridge_reconciliations, p_row);
  else
    raise exception 'not a log table: %', p_table;
  end if;
end $$;

-- ---------- Functions used by the app (signed-in users) ----------
create or replace function public.app_can_approve(p_kind text, p_object_type text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles p join app_approval_rules r on r.role = p.role
    where p.id = auth.uid() and r.kind = p_kind and (r.object_type = '*' or r.object_type = p_object_type)
  );
$$;

create or replace function public.app_approve_writeback(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare q bridge_writeback_queue;
begin
  select * into q from bridge_writeback_queue where id = p_id for update;
  if not found then raise exception 'not found'; end if;
  if q.status <> 'draft' then raise exception 'only a draft can be approved (status is %)', q.status; end if;
  if not app_can_approve(q.kind, q.object_type) then raise exception 'you are not allowed to approve this'; end if;
  update bridge_writeback_queue set status = 'approved', approved_by = auth.uid(), approved_at = now() where id = p_id;
end $$;

create or replace function public.app_reject_writeback(p_id uuid, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
declare q bridge_writeback_queue;
begin
  select * into q from bridge_writeback_queue where id = p_id for update;
  if not found then raise exception 'not found'; end if;
  if q.status not in ('draft','failed') then raise exception 'cannot reject at status %', q.status; end if;
  if not app_can_approve(q.kind, q.object_type) then raise exception 'you are not allowed to reject this'; end if;
  update bridge_writeback_queue set status = 'rejected', error = p_reason where id = p_id;
end $$;

-- ---------- Row Level Security ----------
do $$
declare t text;
begin
  foreach t in array array['tally_companies','tally_groups','tally_ledgers','tally_cost_centres','tally_stock_groups',
    'tally_stock_items','tally_units','tally_godowns','tally_voucher_types','tally_vouchers','tally_ledger_entries',
    'tally_inventory_entries','bridge_sync_state','bridge_sync_runs','bridge_reconciliations','bridge_writeback_queue',
    'app_approval_rules','app_profile_tally_links','app_salesperson_groups'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Read access to the Tally copy for signed-in staff. Narrow these per role (field sales: only their dealers)
-- when the Role Board is built; the bridge writes with the secret key, which bypasses RLS.
do $$
declare t text;
begin
  foreach t in array array['tally_companies','tally_groups','tally_ledgers','tally_cost_centres','tally_stock_groups',
    'tally_stock_items','tally_units','tally_godowns','tally_voucher_types','tally_vouchers','tally_ledger_entries',
    'tally_inventory_entries','bridge_sync_runs','bridge_reconciliations','app_approval_rules'] loop
    execute format('drop policy if exists "read for signed-in" on public.%I', t);
    execute format('create policy "read for signed-in" on public.%I for select to authenticated using (true)', t);
  end loop;
end $$;

drop policy if exists "own or approver can read" on public.bridge_writeback_queue;
create policy "own or approver can read" on public.bridge_writeback_queue for select to authenticated
  using (created_by = auth.uid() or public.app_can_approve(kind, object_type));
drop policy if exists "create drafts only" on public.bridge_writeback_queue;
create policy "create drafts only" on public.bridge_writeback_queue for insert to authenticated
  with check (status = 'draft' and created_by = auth.uid());
-- No update/delete policies: status changes only through app_approve_writeback / app_reject_writeback and the bridge.

drop policy if exists "own links" on public.app_profile_tally_links;
create policy "own links" on public.app_profile_tally_links for select to authenticated
  using (profile_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));
drop policy if exists "own groups" on public.app_salesperson_groups;
create policy "own groups" on public.app_salesperson_groups for select to authenticated
  using (profile_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner'));

revoke execute on function public.bridge_upsert_vouchers(text, jsonb) from public, anon, authenticated;
revoke execute on function public.bridge_save_company(text, text, date, boolean) from public, anon, authenticated;
revoke execute on function public.bridge_get_state(text) from public, anon, authenticated;
revoke execute on function public.bridge_set_state(text, text, bigint) from public, anon, authenticated;
revoke execute on function public.bridge_upsert_masters(text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.bridge_voucher_guids(text, date, date) from public, anon, authenticated;
revoke execute on function public.bridge_voucher_by_tag(text, text) from public, anon, authenticated;
revoke execute on function public.bridge_ledger_balances(text) from public, anon, authenticated;
revoke execute on function public.bridge_log(text, jsonb) from public, anon, authenticated;
revoke execute on function public.bridge_mark_deleted(text, text[]) from public, anon, authenticated;
revoke execute on function public.bridge_claim_writebacks(text, text[], text[], int) from public, anon, authenticated;
revoke execute on function public.bridge_writeback_result(uuid, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.bridge_confirm_writebacks(text) from public, anon, authenticated;
grant execute on function public.app_approve_writeback(uuid) to authenticated;
grant execute on function public.app_reject_writeback(uuid, text) to authenticated;
grant execute on function public.app_can_approve(text, text) to authenticated;
