# Raw requests

Send any of these with `tally raw <file>` (command line only). Import/Execute requests need
`writeMode: "on"` and `--yes`, and are audited.

- `list-companies.xml`: open companies (inline collection)
- `trial-balance.xml`: Tally's built-in Trial Balance report
- `ledger-object.xml`: one ledger by name with chosen fields
- `json-export-ledgers.json`: TallyPrime 7.0+ JSON interface (metadata travels in HTTP headers):

```bash
tally raw templates/raw/json-export-ledgers.json --content-type "application/json" --header "version: 1" --header "tallyrequest: Export" --header "type: Collection" --header "id: List of Ledgers"
```
