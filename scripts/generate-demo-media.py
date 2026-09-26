from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "demo-media-source"
MANIFEST = ROOT / "data" / "catalog-source-manifest.json"
SIZE = (800, 1000)

PRODUCTS = [
    ("top-alba", "top", "#e8d8ce", "#171717"),
    ("remera-nube", "tee", "#dfe5e6", "#f7f2eb"),
    ("jean-roma", "jeans", "#d9d4cc", "#476b8b"),
    ("pantalon-marea", "pants", "#e7dfd3", "#232323"),
    ("camisa-lino", "shirt", "#ece4d7", "#d8c5a9"),
    ("camisa-arena", "shirt", "#e2d5c4", "#b79672"),
    ("sweater-bruma", "sweater", "#e1dfe2", "#8d8790"),
    ("buzo-niebla", "hoodie", "#d7d9dc", "#9aa0a6"),
    ("vestido-lila", "dress", "#e4d7e8", "#a57cb3"),
    ("falda-siena", "skirt", "#e6ddd4", "#76503d"),
    ("top-vela", "top", "#ded8d7", "#54262f"),
    ("jean-capri", "jeans", "#dce4ea", "#7fa1bd"),
    ("vestido-mora", "dress", "#e2d7db", "#6b3445"),
    ("falda-sol", "skirt", "#e1e4e8", "#587b9b"),
]


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def gradient(bg: str) -> Image.Image:
    base = hex_rgb(bg)
    image = Image.new("RGB", SIZE)
    px = image.load()
    for y in range(SIZE[1]):
        lift = int(18 * (1 - y / SIZE[1]))
        row = tuple(min(255, channel + lift) for channel in base)
        for x in range(SIZE[0]):
            px[x, y] = row
    return image


def draw_garment(image: Image.Image, kind: str, color: str) -> None:
    draw = ImageDraw.Draw(image, "RGBA")
    fill = hex_rgb(color) + (255,)
    shadow = (20, 20, 20, 40)
    if kind in {"top", "tee", "shirt", "sweater", "hoodie"}:
        body = [(250, 260), (550, 260), (610, 720), (190, 720)]
        draw.polygon([(x + 14, y + 18) for x, y in body], fill=shadow)
        draw.polygon(body, fill=fill)
        draw.polygon([(250, 285), (145, 390), (195, 500), (285, 410)], fill=fill)
        draw.polygon([(550, 285), (655, 390), (605, 500), (515, 410)], fill=fill)
        if kind == "shirt":
            draw.line((400, 300, 400, 690), fill=(255, 255, 255, 100), width=5)
            for y in range(360, 650, 85):
                draw.ellipse((390, y, 410, y + 20), fill=(255, 255, 255, 150))
        if kind == "hoodie":
            draw.arc((310, 205, 490, 370), 190, 350, fill=(255, 255, 255, 150), width=8)
            draw.rectangle((300, 560, 500, 680), outline=(255, 255, 255, 100), width=5)
        if kind == "sweater":
            for y in range(320, 700, 36):
                draw.line((235, y, 565, y), fill=(255, 255, 255, 32), width=3)
    elif kind in {"jeans", "pants"}:
        draw.polygon([(290, 230), (510, 230), (555, 820), (430, 820), (400, 500), (370, 820), (245, 820)], fill=fill)
        draw.line((400, 245, 400, 500), fill=(255, 255, 255, 80), width=5)
        if kind == "jeans":
            draw.line((300, 315, 500, 315), fill=(255, 255, 255, 60), width=4)
            draw.arc((300, 245, 390, 355), 270, 60, fill=(255, 255, 255, 55), width=4)
    elif kind == "dress":
        draw.polygon([(330, 220), (470, 220), (525, 390), (620, 810), (180, 810), (275, 390)], fill=fill)
        draw.polygon([(330, 235), (220, 360), (275, 445), (355, 355)], fill=fill)
        draw.polygon([(470, 235), (580, 360), (525, 445), (445, 355)], fill=fill)
        draw.arc((335, 205, 465, 315), 0, 180, fill=(255, 255, 255, 120), width=6)
    elif kind == "skirt":
        draw.polygon([(300, 270), (500, 270), (600, 780), (200, 780)], fill=fill)
        draw.line((300, 305, 500, 305), fill=(255, 255, 255, 90), width=6)

    draw.rounded_rectangle((54, 50, 746, 950), radius=26, outline=(255, 255, 255, 55), width=3)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_slug = {item["slug"]: item for item in manifest["products"]}
    for slug, kind, bg, garment in PRODUCTS:
        image = gradient(bg).filter(ImageFilter.GaussianBlur(radius=0.25))
        draw_garment(image, kind, garment)
        target = OUT / f"{slug}.webp"
        image.save(target, "WEBP", quality=90, method=6)
        digest = hashlib.sha256(target.read_bytes()).hexdigest()
        item = by_slug[slug]
        item["media"] = [{
            "source_kind": "demo_generated",
            "source_file": f"data/demo-media-source/{target.name}",
            "sha256": digest,
            "width": SIZE[0],
            "height": SIZE[1],
            "r2_key_original": None,
            "r2_key_small": None,
            "r2_key_large": None,
        }]
    manifest["generated_at"] = "2026-09-17T15:20:00Z"
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"generated={len(PRODUCTS)} dir={OUT}")


if __name__ == "__main__":
    main()
