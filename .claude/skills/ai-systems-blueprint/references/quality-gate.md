# The Quality Gate

Run every check before the blueprint leaves the building. One failure blocks shipping. This gate is what makes the outcome repeatable regardless of who wrote the document, and it is deliberately mechanical so that a tired writer at the end of a long draft cannot talk themselves past it.

| # | Check | Passes when |
|---|---|---|
| 0 | Entry gate (precondition) | Both required inputs are on file: the filled audit form and the audit call with its transcript. If this fails, nothing below applies, because the document should not exist yet. |
| 1 | Traceability | Every system's SOLVES points at a §1 subsection; every §1 pain is addressed by a system or explicitly deferred. |
| 2 | Quotes | Every quote verified against the form or transcript: verbatim, or marked (paraphrase). Call-only material marked. |
| 3 | Guardrails | §4 matches form §10; unanswered guardrails carry a conservative default and appear in Next Steps. |
| 4 | Numbers | §5 table matches the form character for character, estimates marked; every rupee figure and percentage in the document traces to a source. |
| 5 | Contradictions | Flagged as numbered confirm items in §5 and repeated in Next Steps. None silently resolved. |
| 6 | Roadmap | Hours per week, deadline anchor and busy season named in the intro; every phase has a testable DONE WHEN; the final one echoes the client's "worth it if". |
| 7 | Cover | Chips are the client's money path with the first build highlighted; DWG number correct; Sources complete and dated; deadline anchor present. |
| 8 | Design | Template untouched; no card or panel broken across sheets; 8 to 12 sheets (2-3 wide + 6-9 A4); running heads and feet correct on every sheet; no `{{` placeholders survive. |
| 9 | Language | No em dashes; jargon explained on first use; client-language quotes intact; no selling. |
| 10 | Trace line | Present, dated, and true. |
| 11 | Files | The .md / .html / .pdf triplet saved in the client's folder; prior revisions archived, not deleted. |
| 12 | Infographic figures | Every figure, quote and claim on every panel already exists in Part B or the form; nothing appears first on a panel. Hot tiles mark findings the evidence pass named. |
| 13 | Infographic spine | Panels numbered 01-10 with no gaps; the 7 fixed panels present; each diagnostic panel points at the section 1 evidence that earned it; no diagnostic panel invented to fill a slot. |
| 14 | Cross-agreement | Panel 06 chains match the system cards; panel 07 bars match the phase cards and done-whens; panel 09 lanes match section 04's verbatim rules; panel 10 matches section 06. One story, two renderings. |

## How to run it honestly

Checks 1, 2 and 4 are the ones that actually catch damage, and they cannot be done by skimming. Take the rendered PDF and the source documents side by side:

- For check 1, list every system and write the § number it solves next to it. A system you have to think hard about is a system that does not belong.
- For check 2, search the draft for every quotation mark and confirm each one against the source text. A quote you cannot find is a quote you reconstructed, which means it has to become a paraphrase or come out.
- For check 4, take each number in the §5 table back to the form. Then scan the prose for any figure that is not in the table and confirm it too.

If a check fails, fix the document rather than the check. The gate exists because the alternative, a blueprint whose claims cannot be verified, costs the client's trust in everything else the engagement produces.
