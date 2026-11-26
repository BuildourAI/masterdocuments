/**
 * Company information, licence/version probes and change counters.
 */
import { TallyCliError } from '../core/errors.mjs';
import { norm } from './common.mjs';

export const COMPANY_FIELDS = [
  { key: 'name', method: 'Name' },
  { key: 'active', expr: '$$IsEqual:$Name:##SVCurrentCompany', type: 'logical' },
  { key: 'booksFrom', method: 'BooksFrom', type: 'date' },
  { key: 'startingFrom', method: 'StartingFrom', type: 'date' },
  { key: 'altMstId', method: 'AltMstId', type: 'number' },
  { key: 'altVchId', method: 'AltVchId', type: 'number' },
  { key: 'guid', method: 'Guid' },
  { key: 'state', method: 'StateName' },
  { key: 'country', method: 'CountryName' },
];

export async function listCompanies(ctx) {
  return ctx.client.rows({ collection: { type: 'Company' }, fields: COMPANY_FIELDS }, { company: null });
}

/** The company this profile targets: the configured one, or the active one. */
export async function targetCompany(ctx) {
  const rows = await listCompanies(ctx);
  if (!rows.length) {
    throw new TallyCliError('E_TALLY', 'No company is open in Tally.', { hint: 'Open the company in Tally (F3 / Alt+F3: Select Company), then retry.' });
  }
  const want = ctx.profile.company;
  if (want) {
    const hit = rows.find((r) => norm(r.name) === norm(want));
    if (!hit) {
      throw new TallyCliError('E_NOT_FOUND', `Company "${want}" is not open in Tally.`, {
        hint: `Open companies: ${rows.map((r) => r.name).join(', ')}. Open it in Tally, or change "company" in the profile / --company.`,
        details: { open: rows.map((r) => r.name) },
      });
    }
    if (ctx.profile.companyGuid && hit.guid && hit.guid !== ctx.profile.companyGuid) {
      throw new TallyCliError('E_CONFLICT', `The open company "${hit.name}" is not the one this profile was set up for (different id).`, {
        hint: 'A different data folder or a restored copy may be open. Check in Tally, or re-run "tally init" to pin the current company.',
      });
    }
    return { ...hit, all: rows };
  }
  const active = rows.find((r) => r.active) || rows[0];
  if (rows.length > 1) ctx.warn(`Several companies are open (${rows.map((r) => r.name).join(', ')}); using "${active.name}". Set "company" in the profile to be explicit.`);
  return { ...active, all: rows };
}

/** Licence and version probes. Each probe is a separate tiny request so one failure does not hide the rest. */
export const PROBES = [
  ['product', '@@VersionReleaseString'],
  ['isTallyPrime', 'if $$IsProdTallyPrime then "Yes" else "No"'],
  ['serialNumber', '$$LicenseInfo:SerialNumber'],
  ['educationalMode', 'if $$LicenseInfo:IsEducationalMode then "Yes" else "No"'],
  ['silver', 'if $$LicenseInfo:IsSilver then "Yes" else "No"'],
  ['gold', 'if $$LicenseInfo:IsGold then "Yes" else "No"'],
  ['applicationPath', '$$SysInfo:ApplicationPath'],
  ['dataPath', '##SVCurrentPath'],
];

export async function probeLicence(ctx) {
  const out = {};
  for (const [key, expr] of PROBES) {
    try {
      const rows = await ctx.client.rows({ collection: { type: 'Company', filters: ['$$IsEqual:$Name:##SVCurrentCompany'] }, fields: [{ key: 'v', expr }] }, { company: null });
      out[key] = rows.length ? rows[0].v : null;
    } catch (err) {
      out[key] = null;
      out[`${key}Error`] = err.message;
    }
  }
  const yes = (v) => v === 'Yes';
  return {
    product: out.product || null,
    isTallyPrime: out.isTallyPrime ? yes(out.isTallyPrime) : null,
    serialNumber: out.serialNumber || null,
    educationalMode: out.educationalMode ? yes(out.educationalMode) : null,
    edition: yes(out.gold) ? 'Gold (multi-user)' : yes(out.silver) ? 'Silver (single user)' : out.educationalMode && yes(out.educationalMode) ? 'Educational' : null,
    applicationPath: out.applicationPath || null,
    dataPath: out.dataPath || null,
    errors: Object.fromEntries(Object.entries(out).filter(([k]) => k.endsWith('Error'))),
  };
}

export async function booksPeriod(ctx) {
  const res = {};
  for (const [k, f] of [
    ['from', '$$SystemPeriodFrom'],
    ['to', '$$SystemPeriodTo'],
  ]) {
    try {
      res[k] = await ctx.client.func(f);
    } catch {
      res[k] = null;
    }
  }
  return res;
}
