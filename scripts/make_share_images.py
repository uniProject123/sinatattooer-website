#!/usr/bin/env python3
"""Build the 1200x630 social share images (og:image / twitter:image).

Why: Facebook, WhatsApp and X crop share images to about 1.91:1. The site
used portrait photos, so the tattoo got cut off in link previews. Each card
is a photo on the left and the page name on the right, in the site's colours
and fonts.

Usage (from the repo root, needs Pillow):
    python3 scripts/make_share_images.py

Writes images/share/<name>.jpg. Edit CARDS below to change a photo or title
(e.g. when the landscape hero photo or style galleries arrive), re-run,
commit. Pages reference the files in their og:image and twitter:image tags.

/images/* is cached as immutable for a year, and Facebook/WhatsApp cache
previews too, so when a card's picture or text (e.g. the rating) changes, save it under a new name
(e.g. home-2.jpg) and update the page's og:image + twitter:image.
"""
import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "share"
W, H = 1200, 630
PHOTO_W = 540

BG = (14, 13, 12)        # --color-bg
TEXT = (245, 240, 232)   # --color-text
MUTED = (168, 159, 148)  # --color-text-muted
GOLD = (197, 165, 90)    # --color-accent

# name -> (photo, title lines)
CARDS = {
    "home": ("tattoo1.webp", ["Tattoo Artist", "in York"]),
    "portfolio": ("style-abstract.webp", ["Tattoo Portfolio", "York"]),
    "blackwork": ("style-blackwork.webp", ["Blackwork Tattoos", "in York"]),
    "fineline": ("style-fineline.webp", ["Fine Line Tattoos", "in York"]),
    "watercolour": ("style-watercolour.webp", ["Watercolour Tattoos", "in York"]),
    "oldschool": ("style-oldschool.webp", ["Old School Tattoos", "in York"]),
    "geometric": ("style-geometric.webp", ["Geometric Tattoos", "in York"]),
    "cover-up": ("style-blackwork.webp", ["Cover-Up Tattoos", "in York"]),
    "preparation": ("tattoo1.webp", ["Tattoo Preparation", "Guide"]),
    "aftercare": ("tattoo1.webp", ["Tattoo Aftercare", "Guide"]),
}
SUBLINE = "Custom designs · Private studio · Rated 5.0 on Google"


def font(name, size, weight):
    f = ImageFont.truetype(str(ROOT / "fonts" / f"{name}.woff2"), size)
    f.set_variation_by_axes([weight])
    return f


def cover(img, w, h):
    """Scale and centre-crop to exactly w x h (like CSS object-fit: cover)."""
    scale = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (img.width - w) // 2
    top = (img.height - h) // 2
    return img.crop((left, top, left + w, top + h))


def fit(text, name, weight, max_w, size):
    """Largest font size (down from `size`) at which `text` fits in max_w."""
    while size > 20:
        f = font(name, size, weight)
        if f.getlength(text) <= max_w:
            return f
        size -= 2
    return font(name, size, weight)


def tracked(draw, xy, text, f, fill, spacing):
    """Draw text with extra letter spacing (CSS letter-spacing)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += f.getlength(ch) + spacing


def make(photo, lines):
    card = Image.new("RGB", (W, H), BG)
    pic = cover(Image.open(ROOT / "images" / photo).convert("RGB"), PHOTO_W, H)
    card.paste(pic, (0, 0))

    # Soft fade from the photo into the background.
    fade = Image.new("L", (160, H))
    fd = ImageDraw.Draw(fade)
    for x in range(160):
        fd.line([(x, 0), (x, H)], fill=round(255 * (x / 159) ** 1.6))
    card.paste(Image.new("RGB", (160, H), BG), (PHOTO_W - 160, 0), fade)

    d = ImageDraw.Draw(card)
    x = PHOTO_W + 50
    max_w = W - x - 60

    eyebrow = font("work-sans-latin", 22, 700)
    tracked(d, (x, 170), "SINA TATTOOER", eyebrow, GOLD, 5)

    title_f = fit(max(lines, key=len), "cormorant-garamond-latin", 600, max_w, 78)
    y = 215
    for line in lines:
        d.text((x, y), line, font=title_f, fill=TEXT)
        y += round(title_f.size * 1.08)

    y += 22
    d.line([(x, y), (x + 72, y)], fill=GOLD, width=2)
    y += 26
    sub = fit(SUBLINE, "work-sans-latin", 400, max_w, 24)
    d.text((x, y), SUBLINE, font=sub, fill=MUTED)
    d.text((x, H - 70), "sinatattooer.co.uk", font=font("work-sans-latin", 22, 500), fill=MUTED)
    return card


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (photo, lines) in CARDS.items():
        path = OUT / f"{name}.jpg"
        make(photo, lines).save(path, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
