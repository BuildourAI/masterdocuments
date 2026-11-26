/**
 * The safety policy for writes. All checks live here so every front-end enforces the same rules.
 */
import { TallyCliError } from './errors.mjs';
import { levelAllows } from './config.mjs';

export class Policy {
  /**
   * @param {object} profile effective profile
   * @param {string} frontend cli | mcp | http | relay
   */
  constructor(profile, frontend = 'cli') {
    this.profile = profile;
    this.frontend = frontend;
  }

  get ceiling() {
    return this.profile.frontends?.[this.frontend] || (this.frontend === 'cli' ? 'destructive' : 'read');
  }

  /** Front-end ceiling check for an op level (read | write | destructive). */
  assertLevel(level, opId) {
    if (!levelAllows(this.ceiling, level)) {
      throw new TallyCliError('E_POLICY', `${opId} needs "${level}" access, but the ${this.frontend} front-end is limited to "${this.ceiling}".`, {
        hint: `A person can raise it in tally.config.json: profiles.<name>.frontends.${this.frontend} = "${level}".`,
      });
    }
  }

  assertWritesEnabled(opId) {
    if (this.profile.writeMode === 'off') {
      throw new TallyCliError('E_POLICY', `${opId} writes to Tally, but writes are switched off for this profile (writeMode "off").`, {
        hint: 'Run "tally init" or set writeMode to "optional" or "on" in tally.config.json. Use --dry-run to preview without writing.',
      });
    }
  }

  assertMasterWrites(opId) {
    this.assertWritesEnabled(opId);
    if (!this.profile.allowMasterWrites) {
      throw new TallyCliError('E_POLICY', `${opId} changes masters (ledgers, items...), which this profile does not allow.`, {
        hint: 'Set allowMasterWrites: true in the profile to permit it.',
      });
    }
  }

  assertDestructive(opId, input) {
    this.assertWritesEnabled(opId);
    if (this.profile.writeMode !== 'on' || !this.profile.allowDestructive) {
      throw new TallyCliError('E_POLICY', `${opId} alters, cancels or deletes existing records, which this profile does not allow.`, {
        hint: 'Requires writeMode "on" and allowDestructive: true in tally.config.json.',
      });
    }
    if (!input?.yes && !input?.dryRun) {
      throw new TallyCliError('E_POLICY', `${opId} needs explicit confirmation.`, { hint: 'Add --yes (or "yes": true) after checking the record. Use --dry-run to preview.' });
    }
  }

  /** Voucher-specific limits. Returns {forceOptional}. */
  checkVoucher({ voucherType, baseType, date, total }, opId) {
    const p = this.profile;
    if (p.allowedVoucherTypes && p.allowedVoucherTypes.length) {
      const ok = p.allowedVoucherTypes.some((t) => [voucherType, baseType].filter(Boolean).some((v) => v.toLowerCase() === String(t).toLowerCase()));
      if (!ok) throw new TallyCliError('E_POLICY', `Voucher type "${voucherType}" is not in allowedVoucherTypes for this profile.`, { hint: `Allowed: ${p.allowedVoucherTypes.join(', ')}` });
    }
    if (p.lockBefore && date && date < p.lockBefore) {
      throw new TallyCliError('E_POLICY', `${opId}: date ${date} is before the lock date ${p.lockBefore}.`, { hint: 'Books before the lock date are closed for this tool.' });
    }
    if (p.maxAmount && total && total > Number(p.maxAmount)) {
      throw new TallyCliError('E_POLICY', `${opId}: total ${total} exceeds the per-voucher limit of ${p.maxAmount}.`, { hint: 'Post it manually in Tally, or raise maxAmount in the profile.' });
    }
    return { forceOptional: p.writeMode === 'optional' };
  }

  checkRunSize(count, opId) {
    const max = this.profile.maxPerRun;
    if (max && count > max) {
      throw new TallyCliError('E_POLICY', `${opId}: ${count} vouchers exceed the per-run limit of ${max}.`, { hint: 'Split the file, or raise maxPerRun in the profile.' });
    }
  }
}
