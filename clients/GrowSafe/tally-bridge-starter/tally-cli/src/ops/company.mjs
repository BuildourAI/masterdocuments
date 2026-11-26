import { defineOp } from './registry.mjs';
import { listCompanies, targetCompany, probeLicence, booksPeriod } from '../domain/company.mjs';
import { fromTally } from '../core/dates.mjs';

defineOp({
  id: 'company.list',
  kind: 'read',
  summary: 'List the companies currently open in Tally (and which one is active).',
  examples: ['company list'],
  run: async (ctx) => (await listCompanies(ctx)).map((c) => ({ name: c.name, active: c.active, booksFrom: c.booksFrom, state: c.state || null, guid: c.guid })),
});

defineOp({
  id: 'company.info',
  kind: 'read',
  summary: 'Details of the target company: period, state, licence mode, Tally version, change counters.',
  examples: ['company info'],
  run: async (ctx) => {
    const c = await targetCompany(ctx);
    const [licence, period] = [await probeLicence(ctx), await booksPeriod(ctx)];
    return {
      name: c.name,
      guid: c.guid,
      booksFrom: c.booksFrom,
      period: { from: fromTally(period.from), to: fromTally(period.to) },
      state: c.state || null,
      country: c.country || null,
      counters: { masters: c.altMstId, vouchers: c.altVchId },
      tally: licence,
      openCompanies: c.all.map((x) => x.name),
    };
  },
});

defineOp({
  id: 'company.status',
  kind: 'read',
  summary: 'Change counters (highest alter ids) for masters and vouchers; compare with the last sync.',
  examples: ['company status'],
  run: async (ctx) => {
    const c = await targetCompany(ctx);
    const cursors = ctx.state.read('sync.json', {})[ctx.scope] || null;
    return {
      company: c.name,
      altMstId: c.altMstId,
      altVchId: c.altVchId,
      lastSync: cursors ? { altMstId: cursors.altMstId, altVchId: cursors.altVchId, at: cursors.at } : null,
      changedSinceLastSync: cursors ? c.altMstId !== cursors.altMstId || c.altVchId !== cursors.altVchId : null,
    };
  },
});
