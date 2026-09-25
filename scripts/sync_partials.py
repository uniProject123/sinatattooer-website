#!/usr/bin/env python3
"""Sync the shared nav and footer into every page as static HTML.

Why: the nav and footer used to be injected by components.js at runtime, so
crawlers and no-JS visitors saw pages with no navigation. They now live in the
HTML itself. This script is the single source of truth for that markup.

Usage (from the repo root):
    python3 scripts/sync_partials.py          # rewrite pages in place
    python3 scripts/sync_partials.py --check  # exit 1 if any page is out of date

Edit build_nav() / STYLE_LINKS / build_footer() below, run the script, commit.
Pages mark the synced regions with:
    <!-- partial:nav page="portfolio" --> ... <!-- /partial:nav -->
    <!-- partial:footer --> ... <!-- /partial:footer -->
"""
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TALLY = "https://tally.so/r/LZJBLj"

PAGES = [
    "index.html", "portfolio.html",
    "blackwork-tattoos-york.html", "fineline-tattoos-york.html",
    "watercolour-tattoos-york.html", "oldschool-tattoos-york.html",
    "geometric-tattoos-york.html", "cover-up-tattoos-york.html",
    "tattoo-preparation.html", "tattoo-aftercare.html",
]

STYLE_LINKS = [
    ("/blackwork-tattoos-york", "Blackwork"),
    ("/fineline-tattoos-york", "Fine Line"),
    ("/watercolour-tattoos-york", "Watercolour"),
    ("/oldschool-tattoos-york", "Old School"),
    ("/geometric-tattoos-york", "Geometric"),
    ("/cover-up-tattoos-york", "Cover-ups"),
]


def build_nav(page: str) -> str:
    is_home = page == "home"
    p = "#" if is_home else "/#"
    home = "#top" if is_home else "/"

    def lnk(href, label, id_):
        cur = ' aria-current="page"' if id_ == page else ""
        return f'<li><a href="{href}" class="nav-link"{cur}>{label}</a></li>'

    items = "\n".join("        " + x for x in [
        lnk(home, "Home", "home"),
        lnk(p + "about", "About", "about"),
        lnk("/portfolio", "Portfolio", "portfolio"),
        lnk(p + "booking", "Booking", "booking"),
        lnk(p + "faq", "FAQ", "faq"),
        lnk(p + "contact", "Find Us", "contact"),
        f'<li class="nav-mobile-cta"><a href="{TALLY}" target="_blank" rel="noopener noreferrer" class="nav-cta nav-cta--mobile">Book a Tattoo</a></li>',
    ])
    back = "top" if is_home else "home"
    return (
        '<nav class="site-nav" id="site-nav" aria-label="Main navigation">\n'
        '    <div class="nav-inner">\n'
        f'      <a href="{home}" class="nav-logo" aria-label="Sina Tattooer — back to {back}">Sina Tattooer</a>\n'
        '      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navMenu" aria-label="Open menu"><span></span><span></span><span></span></button>\n'
        '      <ul class="nav-links" id="navMenu" role="list">\n'
        f'{items}\n'
        '      </ul>\n'
        f'      <a href="{TALLY}" target="_blank" rel="noopener noreferrer" class="nav-cta">Book a Tattoo</a>\n'
        '    </div>\n'
        '  </nav>'
    )


def build_footer() -> str:
    styles = "\n".join(f'          <li><a href="{h}">{l}</a></li>' for h, l in STYLE_LINKS)
    return (
        '<footer class="site-footer">\n'
        '    <div class="footer-inner">\n'
        '      <div class="footer-brand">\n'
        '        <a href="/" class="footer-logo">Sina Tattooer</a>\n'
        '        <p class="footer-tagline">Custom tattoos in York.<br>Appointments preferred.</p>\n'
        '        <nav class="footer-social" aria-label="Social media">'
        '<a href="https://instagram.com/sinatattooer" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>'
        '<a href="https://facebook.com/sinatattooer" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>'
        '<a href="https://g.page/r/CVRKmF0wOcODEAE/review" target="_blank" rel="noopener noreferrer" aria-label="Google Reviews">Google</a>'
        '</nav>\n'
        '      </div>\n'
        '      <div class="footer-col">\n'
        '        <h3>Navigate</h3>\n'
        '        <ul>\n'
        '          <li><a href="/">Home</a></li>\n'
        '          <li><a href="/portfolio">Portfolio</a></li>\n'
        '          <li><a href="/#booking">Booking</a></li>\n'
        '          <li><a href="/#faq">FAQ</a></li>\n'
        '          <li><a href="/#contact">Find Us</a></li>\n'
        '        </ul>\n'
        '      </div>\n'
        '      <div class="footer-col">\n'
        '        <h3>Styles</h3>\n'
        '        <ul>\n'
        f'{styles}\n'
        '        </ul>\n'
        '      </div>\n'
        '      <div class="footer-col">\n'
        '        <h3>Resources</h3>\n'
        '        <ul>\n'
        '          <li><a href="/tattoo-preparation">Preparation Guide</a></li>\n'
        '          <li><a href="/tattoo-aftercare">Aftercare Guide</a></li>\n'
        '        </ul>\n'
        '      </div>\n'
        '      <div class="footer-col footer-contact">\n'
        '        <h3>Studio</h3>\n'
        '        <address><strong>Mr Snips Barbers</strong><br>23 Yarburgh Way<br>York, YO10 5HD<br><br>'
        '<a href="tel:+447356030600">07356 030600</a><br>'
        '<a href="mailto:contact@sinatattooer.co.uk">contact@sinatattooer.co.uk</a></address>\n'
        '        <p class="footer-hours">Open daily, 11 am – 6 pm</p>\n'
        '      </div>\n'
        '    </div>\n'
        '    <div class="footer-bottom">\n'
        '      <p>&copy; <span id="footer-year">2026</span> Sina Tattooer &mdash; York, UK</p>\n'
        '    </div>\n'
        '  </footer>'
    )


def build_breadcrumbs(items) -> str:
    parts = []
    for i, it in enumerate(items):
        label = html.escape(it["label"], quote=False)
        if i == len(items) - 1:
            parts.append(f'<li><span aria-current="page">{label}</span></li>')
        else:
            parts.append(f'<li><a href="{it["href"]}">{label}</a></li>')
    return '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>' + "".join(parts) + "</ol></nav>"


NAV_PLACEHOLDER = re.compile(r'<div data-component="nav" data-page="([^"]*)"></div>')
NAV_BLOCK = re.compile(r'<!-- partial:nav page="([^"]*)" -->.*?<!-- /partial:nav -->', re.S)
FOOTER_PLACEHOLDER = re.compile(r'<div data-component="footer"></div>')
FOOTER_BLOCK = re.compile(r'<!-- partial:footer -->.*?<!-- /partial:footer -->', re.S)
BC_PLACEHOLDER = re.compile(r"<div data-component=\"breadcrumbs\" data-items='([^']*)'></div>")


def render(text: str) -> str:
    nav = lambda page: f'<!-- partial:nav page="{page}" -->\n  {build_nav(page)}\n  <!-- /partial:nav -->'
    foot = f'<!-- partial:footer -->\n  {build_footer()}\n  <!-- /partial:footer -->'
    text = NAV_PLACEHOLDER.sub(lambda m: nav(m.group(1)), text)
    text = NAV_BLOCK.sub(lambda m: nav(m.group(1)), text)
    text = FOOTER_PLACEHOLDER.sub(lambda m: foot, text)
    text = FOOTER_BLOCK.sub(lambda m: foot, text)
    text = BC_PLACEHOLDER.sub(lambda m: build_breadcrumbs(json.loads(m.group(1))), text)
    return text


def main() -> int:
    check = "--check" in sys.argv
    stale = []
    for name in PAGES:
        path = ROOT / name
        raw = path.read_bytes().decode("utf-8")
        crlf = "\r\n" in raw
        text = raw.replace("\r\n", "\n")
        out = render(text)
        if crlf:
            out = out.replace("\n", "\r\n")
        if out != raw:
            stale.append(name)
            if not check:
                path.write_bytes(out.encode("utf-8"))
    if check and stale:
        print("Out of date:", ", ".join(stale))
        return 1
    print(("Would update: " if check else "Updated: ") + (", ".join(stale) or "nothing"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
