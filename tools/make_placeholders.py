"""Generate elegant placeholder photos so the site can be previewed before real images are added."""

from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "photos"
OUT.mkdir(parents=True, exist_ok=True)

PALETTES = [
    ((242, 226, 208), (201, 143, 145), (111, 35, 53)),
    ((248, 238, 222), (185, 146, 74), (96, 54, 44)),
    ((236, 226, 221), (160, 122, 128), (64, 48, 56)),
    ((250, 243, 232), (205, 170, 130), (120, 70, 64)),
    ((238, 230, 214), (176, 134, 120), (86, 46, 58)),
]


def lerp(a, b, t):
    return tuple(int(round(x + (y - x) * t)) for x, y in zip(a, b))


def gradient(size, top, bottom):
    w, h = size
    base = Image.new("RGB", (1, h))
    px = base.load()
    for y in range(h):
        px[0, y] = lerp(top, bottom, y / max(h - 1, 1))
    return base.resize((w, h), Image.BICUBIC)


def glow(img, palette, rng):
    w, h = img.size
    layer = Image.new("RGB", (w, h), palette[0])
    draw = ImageDraw.Draw(layer)
    for _ in range(5):
        r = rng.randint(int(min(w, h) * 0.25), int(min(w, h) * 0.7))
        cx = rng.randint(0, w)
        cy = rng.randint(0, h)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=palette[rng.randint(1, 2)])
    layer = layer.filter(ImageFilter.GaussianBlur(radius=min(w, h) // 5))
    return Image.blend(img, layer, 0.45)


def botanical(img, palette, rng):
    """Draw soft line-art stems so the placeholder still looks intentional."""
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    ink = palette[2] + (70,)

    for _ in range(rng.randint(2, 4)):
        bx = rng.randint(int(w * 0.1), int(w * 0.9))
        by = h + rng.randint(0, int(h * 0.1))
        length = rng.randint(int(h * 0.35), int(h * 0.75))
        sway = rng.uniform(-0.45, 0.45)

        points = []
        for i in range(60):
            t = i / 59
            x = bx + math.sin(t * math.pi * 1.1) * length * sway
            y = by - t * length
            points.append((x, y))
        draw.line(points, fill=ink, width=max(2, w // 500))

        for i in range(6, 56, 8):
            x, y = points[i]
            leaf = max(10, int(length * 0.055))
            side = -1 if (i // 8) % 2 else 1
            draw.ellipse(
                (min(x, x + side * leaf * 2), y - leaf // 2,
                 max(x, x + side * leaf * 2), y + leaf // 2),
                outline=ink,
                width=max(1, w // 800),
            )

    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=1))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def grain(img, rng, amount=7):
    w, h = img.size
    noise = Image.new("L", (w, h))
    noise.putdata([128 + rng.randint(-amount, amount) for _ in range(w * h)])
    return Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.05)


def label(img, text, palette):
    draw = ImageDraw.Draw(img)
    w, h = img.size
    size = max(16, w // 26)

    font = None
    for name in ("georgia.ttf", "constan.ttf", "times.ttf", "seguisb.ttf", "arial.ttf"):
        try:
            font = ImageFont.truetype(name, size)
            break
        except OSError:
            continue
    if font is None:
        font = ImageFont.load_default()

    box = draw.textbbox((0, 0), text, font=font)
    tw, th = box[2] - box[0], box[3] - box[1]
    x, y = (w - tw) / 2, (h - th) / 2

    pad_x, pad_y = size * 1.3, size * 0.85
    draw.rectangle(
        (x - pad_x, y - pad_y, x + tw + pad_x, y + th + pad_y),
        outline=palette[0],
        width=max(1, w // 600),
    )
    draw.text((x, y - box[1]), text, font=font, fill=palette[0])


def make(name, size, text, seed):
    rng = random.Random(seed)
    palette = PALETTES[seed % len(PALETTES)]

    img = gradient(size, palette[0], palette[2])
    img = glow(img, palette, rng)
    img = botanical(img, palette, rng)
    img = grain(img, rng)

    vignette = Image.new("L", size, 0)
    ImageDraw.Draw(vignette).ellipse(
        (-size[0] * 0.2, -size[1] * 0.2, size[0] * 1.2, size[1] * 1.2), fill=255
    )
    vignette = vignette.filter(ImageFilter.GaussianBlur(min(size) // 7))
    img = Image.composite(img, Image.new("RGB", size, palette[2]), vignette)

    label(img, text, palette)
    img.save(OUT / name, "JPEG", quality=82, optimize=True, progressive=True)
    return name


jobs = [
    ("hero.jpg", (1600, 2000), "YOUR PHOTO", 1),
    ("chapter-hello.jpg", (1400, 1000), "HOW WE MET", 2),
    ("chapter-knew.jpg", (1600, 900), "WHEN WE KNEW", 3),
    ("chapter-proposal.jpg", (1400, 1000), "THE PROPOSAL", 4),
]
jobs += [(f"moments-0{i}.jpg", (900, 1100), f"MEMORY {i}", 10 + i) for i in range(1, 5)]
jobs += [(f"gallery-0{i}.jpg", (1200, 1500 if i % 3 else 900), f"PHOTO {i}", 20 + i) for i in range(1, 9)]

for name, size, text, seed in jobs:
    make(name, size, text, seed)
    print("created", name)
