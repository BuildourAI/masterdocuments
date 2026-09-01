#!/usr/bin/env python3
"""Render the Master Copy from the skill itself (single source of truth).

Concatenates SKILL.md and the reference files into one document, pours it
into the v2 drawing shell, and renders the .md / .html / .pdf triplet named
"Master Copy - Creating the AI Systems Blueprint". Edit the skill, re-run
this, and the master document can never drift from what the skill does.

Usage (from the skill root):
    python scripts/render_master.py [output-dir]

Output dir defaults to the current working directory.
"""

import re
import subprocess
import sys
from datetime import date
from pathlib import Path
from urllib.request import pathname2url

try:
    import markdown
except ImportError:
    sys.exit("needs the 'markdown' package: pip install markdown")

SKILL_ROOT = Path(__file__).resolve().parent.parent
DOC_NAME = "Master Copy - Creating the AI Systems Blueprint"
DWG = "BOA-2026-MST-01"
REV = "B"

# The parts, in reading order. (title, path, one-line role)
PARTS = [
    ("The Method", SKILL_ROOT / "SKILL.md",
     "Entry gate, prime directive, pipeline, inputs, evidence pass, system design, roadmap, voice."),
    ("Document Structure", SKILL_ROOT / "references/document-structure.md",
     "The two-part running order, cover anatomy, and the compression rules."),
    ("The Infographic", SKILL_ROOT / "references/infographic-spec.md",
     "Part A: the ten-panel spine, the diagnostic menu, sourcing rules."),
    ("Design and Production", SKILL_ROOT / "references/design-spec.md",
     "Tokens, components, pages, the render pipeline."),
    ("The Quality Gate", SKILL_ROOT / "references/quality-gate.md",
     "The 14 checks run before anything ships."),
    ("Revisions", SKILL_ROOT / "references/revisions.md",
     "Rev B and the delta discipline."),
]

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>__TITLE__</title>
<style>
  :root { --orange:#e8590c; --orange-soft:#fdeee2; --orange-faint:#fdf6f0; --ink:#1f2430;
    --grid:rgba(232,89,12,0.07); --rule:#e9c7ae;
    --mono:"Consolas","Courier New",monospace; --sans:"Segoe UI","Helvetica Neue",Arial,sans-serif; }
  * { box-sizing:border-box; margin:0; padding:0; }
  @page { size:A4; margin:84px 44px 84px;
    @top-left { content:"Buildour AI \\00b7 Master SOP"; font-family:"Consolas",monospace; font-size:9.5px;
      letter-spacing:2px; color:#e8590c; text-transform:uppercase; vertical-align:bottom; padding-bottom:24px; }
    @top-right { content:"DWG NO. __DWG__ \\00b7 REV __REV__"; font-family:"Consolas",monospace; font-size:9.5px;
      letter-spacing:2px; color:#e8590c; text-transform:uppercase; vertical-align:bottom; padding-bottom:24px; }
    @bottom-left { content:"Creating the AI Systems Blueprint"; font-family:"Consolas",monospace; font-size:9.5px;
      letter-spacing:2px; color:#e8590c; text-transform:uppercase; vertical-align:top; padding-top:20px; }
    @bottom-right { content:"Sheet " counter(page) " / " counter(pages); font-family:"Consolas",monospace;
      font-size:9.5px; letter-spacing:2px; color:#e8590c; text-transform:uppercase; vertical-align:top; padding-top:20px; } }
  html { background:linear-gradient(var(--grid) 1px,transparent 1px),
    linear-gradient(90deg,var(--grid) 1px,transparent 1px),#fdfbf9; background-size:24px 24px; }
  body { font-family:var(--sans); color:var(--ink); font-size:12.5px; line-height:1.6; }
  .coverpage { page-break-after:always; }
  .coverframe { border:2.5px solid var(--orange); padding:8px; }
  .coverinner { border:1px solid var(--orange); padding:42px 42px 28px; background:rgba(255,255,255,0.75); }
  .coverbar { display:flex; justify-content:space-between; font-family:var(--mono); font-size:10.5px;
    letter-spacing:3px; color:var(--orange); text-transform:uppercase; border-bottom:1px dotted var(--rule);
    padding-bottom:12px; margin-bottom:32px; }
  h1.cover { font-size:40px; line-height:1.06; font-weight:800; letter-spacing:-0.5px; }
  h1.cover .accent { color:var(--orange); }
  .coversub { font-family:var(--mono); font-size:11.5px; letter-spacing:2.5px; text-transform:uppercase;
    margin:16px 0 28px; }
  table.titleblock { width:100%; border-collapse:collapse; font-size:12px; }
  table.titleblock td { border:1px solid var(--orange); padding:9px 13px; vertical-align:top; }
  table.titleblock .lbl { font-family:var(--mono); font-size:9px; letter-spacing:2px; text-transform:uppercase;
    color:var(--orange); font-weight:700; display:block; margin-bottom:3px; }
  .covernote { font-family:var(--mono); font-size:9.5px; letter-spacing:1.5px; color:#8a7361;
    text-transform:uppercase; text-align:center; margin-top:26px; border-top:1px dotted var(--rule); padding-top:14px; }
  .parthead { display:flex; align-items:stretch; border:1.5px solid var(--orange); margin:30px 0 16px;
    background:#fff; page-break-after:avoid; page-break-inside:avoid; page-break-before:always; }
  .parthead:first-of-type { page-break-before:auto; }
  .partnum { background:var(--orange); color:#fff; font-family:var(--mono); font-weight:700; font-size:16px;
    padding:8px 14px; display:flex; align-items:center; }
  .parttitle { padding:8px 14px; font-size:16px; font-weight:700; flex:1; display:flex; align-items:center; }
  .parttag { font-family:var(--mono); font-size:9px; letter-spacing:2px; color:var(--orange);
    text-transform:uppercase; display:flex; align-items:center; padding-right:14px; text-align:right; max-width:280px; }
  .md h1 { display:none; }
  .md h2 { font-size:15px; font-weight:700; margin:20px 0 8px; padding-bottom:4px;
    border-bottom:1.5px solid var(--rule); page-break-after:avoid; }
  .md h3 { font-size:13px; font-weight:700; margin:14px 0 6px; page-break-after:avoid; }
  .md p { margin-bottom:10px; text-align:justify; }
  .md ul, .md ol { margin:0 0 10px 22px; }
  .md li { margin-bottom:5px; }
  .md table { width:100%; border-collapse:collapse; margin:12px 0; font-size:11.5px; background:#fff; }
  .md th { background:var(--orange); color:#fff; text-align:left; padding:6px 10px; font-family:var(--mono);
    font-size:9px; letter-spacing:1.5px; text-transform:uppercase; }
  .md td { border:1px solid var(--rule); padding:6px 10px; vertical-align:top; }
  .md tr { page-break-inside:avoid; }
  .md blockquote { border-left:3px solid var(--orange); background:var(--orange-faint);
    padding:9px 13px; margin:9px 0 14px; page-break-inside:avoid; }
  .md blockquote p { margin-bottom:4px; text-align:left; }
  .md code { font-family:var(--mono); font-size:11px; background:var(--orange-soft); padding:1px 5px; }
  .md pre { background:#fff; border:1px solid var(--rule); padding:10px 14px; margin:10px 0;
    font-size:11px; overflow:hidden; page-break-inside:avoid; }
  .md pre code { background:none; padding:0; }
  .traceline { font-family:var(--mono); font-size:9.5px; letter-spacing:1.5px; color:#8a7361;
    text-transform:uppercase; text-align:center; margin-top:24px; border-top:1.5px solid var(--orange);
    padding-top:12px; line-height:1.8; }
</style>
</head>
<body>
__BODY__
</body>
</html>
"""


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4:].lstrip("\n")
    return text


def main() -> None:
    out_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    out_dir.mkdir(parents=True, exist_ok=True)
    today = date.today().strftime("%d.%m.%Y")

    md_engine = markdown.Markdown(extensions=["tables", "fenced_code"])

    # ---- assemble the combined .md (a deliverable in its own right) ----
    md_parts = [
        f"# Master Copy: Creating the AI Systems Blueprint\n\n"
        f"**BuildOur AI \u00b7 Master SOP \u00b7 DWG NO. {DWG} \u00b7 REV {REV}**\n\n"
        f"*Rendered from the ai-systems-blueprint skill on {today}. "
        f"The skill is the single source of truth: edit the skill, re-run "
        f"`scripts/render_master.py`, never edit this document directly.*\n"
    ]
    body_parts = []
    for idx, (title, path, role) in enumerate(PARTS, start=1):
        text = strip_frontmatter(path.read_text(encoding="utf-8"))
        md_parts.append(f"\n---\n\n# PART {idx:02d} \u00b7 {title}\n\n{text.strip()}\n")
        md_engine.reset()
        html = md_engine.convert(text)
        body_parts.append(
            f'<div class="parthead"><div class="partnum">{idx:02d}</div>'
            f'<div class="parttitle">{title.upper()}</div>'
            f'<div class="parttag">{role}</div></div>\n<div class="md">{html}</div>'
        )

    cover = f"""
<div class="coverpage"><div class="coverframe"><div class="coverinner">
  <div class="coverbar"><span>Buildour AI</span><span>Master SOP</span></div>
  <h1 class="cover">CREATING THE<br><span class="accent">AI SYSTEMS BLUEPRINT</span></h1>
  <div class="coversub">The method behind every client blueprint: infographic + in-depth, one document</div>
  <table class="titleblock">
    <tr><td colspan="2"><span class="lbl">Purpose</span>One repeatable method for turning a client's filled audit
    form and audit call into their AI Systems Blueprint: the one-shot infographic capture followed by the in-depth
    document, delivered as a .md / .html / .pdf triplet in the fixed technical-drawing format.</td></tr>
    <tr><td colspan="2"><span class="lbl">Single source of truth</span>This document is rendered from the
    ai-systems-blueprint Claude Code skill (SKILL.md plus its reference files) by scripts/render_master.py.
    Edit the skill, re-render; never edit this document directly.</td></tr>
    <tr><td style="width:50%;"><span class="lbl">Prepared by</span>BuildOur AI</td>
    <td><span class="lbl">Rendered</span>{today} \u00b7 REV {REV} (supersedes REV A, which predates the infographic)</td></tr>
    <tr><td><span class="lbl">Parts</span>{len(PARTS)}: method \u00b7 structure \u00b7 infographic \u00b7 design \u00b7 gate \u00b7 revisions</td>
    <td><span class="lbl">Companion</span>assets/blueprint-template.html (the v3 template) \u00b7 scripts/render_pdf.py</td></tr>
  </table>
  <div class="covernote">The documents govern the code \u00b7 the guardrails govern the documents \u00b7 the client's words govern everything</div>
</div></div></div>
"""
    trace = (f'<div class="traceline">Rendered from the ai-systems-blueprint skill, {today}. '
             f"The skill is the single source of truth; this document restates it and never overrides it.</div>")

    html_doc = (SHELL.replace("__TITLE__", DOC_NAME).replace("__DWG__", DWG)
                .replace("__REV__", REV).replace("__BODY__", cover + "\n".join(body_parts) + trace))

    md_file = out_dir / f"{DOC_NAME}.md"
    html_file = out_dir / f"{DOC_NAME}.html"
    pdf_file = out_dir / f"{DOC_NAME}.pdf"
    md_file.write_text("\n".join(md_parts), encoding="utf-8")
    html_file.write_text(html_doc, encoding="utf-8")
    print(f"wrote {md_file.name}, {html_file.name}")

    # ---- render the PDF with headless Chrome/Edge ----
    for exe in CHROME_CANDIDATES:
        if Path(exe).exists():
            url = "file:" + pathname2url(str(html_file.resolve()))
            subprocess.run([exe, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                            f"--print-to-pdf={pdf_file.resolve()}", url],
                           check=True, capture_output=True)
            print(f"wrote {pdf_file.name}")
            return
    sys.exit("no Chrome/Edge found; render the HTML to PDF manually")


if __name__ == "__main__":
    main()
