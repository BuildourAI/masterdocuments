#!/usr/bin/env python3
"""Render a blueprint HTML file to PDF.

Tries WeasyPrint first (cleanest @page support). Falls back to headless Chrome
or Edge, which is what works on Windows machines lacking the GTK/Pango
libraries WeasyPrint needs. Both engines honour the template's @page rules, so
the output is equivalent: A4 sheets, running heads and feet, self-numbering
sheet counters.

Usage:
    python render_pdf.py "Client AI Systems Blueprint.html"
    python render_pdf.py in.html out.pdf
"""

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.request import pathname2url

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]


def find_chrome():
    for name in ("google-chrome", "chromium", "chrome", "msedge"):
        found = shutil.which(name)
        if found:
            return found
    for path in CHROME_CANDIDATES:
        if os.path.exists(path):
            return path
    return None


def render_weasyprint(src: Path, dst: Path) -> bool:
    # Run as a subprocess rather than importing. WeasyPrint prints a multi-line
    # installation lecture when its native GTK/Pango libraries are missing,
    # which is a normal condition on Windows where the Chrome path takes over.
    # A subprocess keeps that noise fully captured instead of leaking through
    # import-time stderr writes.
    try:
        result = subprocess.run(
            [sys.executable, "-m", "weasyprint", str(src), str(dst)],
            capture_output=True, text=True, timeout=300,
        )
    except Exception:
        return False
    if result.returncode == 0 and dst.exists() and dst.stat().st_size > 0:
        return True
    return False


def render_chrome(src: Path, dst: Path) -> bool:
    chrome = find_chrome()
    if not chrome:
        return False
    file_url = "file:" + pathname2url(str(src.resolve()))
    with tempfile.TemporaryDirectory() as profile:
        cmd = [
            chrome,
            "--headless",
            "--disable-gpu",
            "--no-first-run",
            "--no-pdf-header-footer",
            f"--user-data-dir={profile}",
            f"--print-to-pdf={dst.resolve()}",
            file_url,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    if dst.exists() and dst.stat().st_size > 0:
        return True
    print(result.stderr[-2000:] if result.stderr else "Chrome produced no output.")
    return False


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    src = Path(sys.argv[1])
    if not src.exists():
        print(f"Not found: {src}")
        return 1
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else src.with_suffix(".pdf")

    # Unfilled placeholders are the most common first-draft defect, so warn loudly
    # rather than shipping a PDF with {{COMPANY}} printed on the cover.
    text = src.read_text(encoding="utf-8", errors="ignore")
    if "{{" in text:
        leftovers = sorted({s.split("}}")[0] for s in text.split("{{")[1:] if "}}" in s})
        shown = [p if len(p) <= 40 else p[:37] + "..." for p in leftovers[:8]]
        more = f" (+{len(leftovers) - 8} more)" if len(leftovers) > 8 else ""
        print(f"WARNING: {len(leftovers)} unfilled placeholder(s) still in the HTML.")
        print("  " + " | ".join(shown) + more)
        print("  Fill or delete every {{...}} before this goes to a client.\n")

    for engine, fn in (("WeasyPrint", render_weasyprint), ("Chrome", render_chrome)):
        if fn(src, dst):
            print(f"Rendered with {engine}: {dst}")
            print("Now read every page: check no card breaks across a sheet, "
                  "the cover fits one sheet, and the count is 7 to 10 sheets.")
            return 0

    print("No renderer available. Install WeasyPrint (pip install weasyprint) "
          "or Chrome/Edge.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
