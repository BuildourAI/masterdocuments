// Talks to TallyPrime's XML server on the Tally server itself (localhost:9000 by default).
// Never expose this port outside the accounts LAN.
import { buildCollectionRequest, decodeTallyResponse, parseXml, parseImportResponse } from './xml.js';
import { companyRows } from './normalize.js';

export class Tally {
  constructor({ host = 'localhost', port = 9000, timeoutSeconds = 600 } = {}) {
    this.url = `http://${host}:${port}`;
    this.timeoutMs = timeoutSeconds * 1000;
  }

  async post(xml) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/xml;charset=utf-8' },
        body: xml,
        signal: ctrl.signal
      });
      const buf = Buffer.from(await res.arrayBuffer());
      if (!res.ok) throw new Error(`Tally answered HTTP ${res.status}`);
      return decodeTallyResponse(buf);
    } catch (err) {
      if (err.name === 'AbortError') throw new Error(`Tally did not answer within ${this.timeoutMs / 1000}s`);
      if (err.cause?.code === 'ECONNREFUSED') throw new Error(`Tally is not answering at ${this.url}: is TallyPrime open, with Connectivity set to Both and port ${this.url.split(':').pop()}?`);
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  async exportCollection(opts) {
    const body = await this.post(buildCollectionRequest(opts));
    if (/<LINEERROR>/i.test(body)) {
      const tree = parseXml(body);
      throw new Error(`Tally refused the export ${opts.id}: ${JSON.stringify(tree).slice(0, 300)}`);
    }
    return parseXml(body);
  }

  async listCompanies() {
    const tree = await this.exportCollection({
      id: 'GSCompanies', type: 'Company', fetch: ['GUID', 'NAME', 'BOOKSFROM', 'STARTINGFROM']
    });
    return companyRows(tree);
  }

  async importXml(xml) {
    const body = await this.post(xml);
    return { ...parseImportResponse(body), raw: body.slice(0, 4000) };
  }
}
