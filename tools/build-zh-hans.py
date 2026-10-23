"""Generate the Simplified Chinese site (zh-hans/) from the Traditional pages.

The Traditional Chinese pages are the source. Never edit zh-hans/ by hand:
change the Traditional page, then run

    python3 tools/build-zh-hans.py          # regenerate zh-hans/
    python3 tools/build-zh-hans.py --check  # fail if zh-hans/ is out of date

Requires OpenCC: pip install opencc
"""

import re
import sys
from pathlib import Path

import opencc

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "zh-hans"
SITE = "https://hmgvibe.github.io/"

# tw2sp converts characters and Taiwan wording to mainland wording
# (滑鼠→鼠标, 程式→程序, 檔案→文件). PHRASES fixes what it misses or gets wrong.
CONVERTER = opencc.OpenCC("tw2sp.json")
PHRASES = {
    "系统匣": "系统托盘",
    "预设": "默认",
    "激活": "启用",
    "脱机": "离线",
    "透过": "通过",
    "帐号": "账号",
    "身分": "身份",
    "卷动": "滚动",
    "手把": "手柄",
    "全屏幕": "全屏",
    "外置鼠标": "外接鼠标",
    "中继数据": "元数据",
    "设置档": "设置文件",
    "查找": "查询",
    "集成成": "整合成",
    "局域网路": "局域网",
    "回馈": "反馈",
    "辨识": "识别",
    "笔电": "笔记本电脑",
}
PUNCTUATION = str.maketrans({"「": "“", "」": "”", "『": "‘", "』": "’"})
TEXT_ATTRIBUTES = ("aria-label", "alt", "title")


def to_simplified(text: str) -> str:
    text = CONVERTER.convert(text)
    for old, new in PHRASES.items():
        text = text.replace(old, new)
    return text.translate(PUNCTUATION)


def convert_tag(tag: str) -> str:
    def attribute(match: re.Match) -> str:
        return f'{match.group(1)}="{to_simplified(match.group(2))}"'

    tag = re.sub(rf'\b({"|".join(TEXT_ATTRIBUTES)})="([^"]*)"', attribute, tag)
    if tag.startswith('<meta name="description"'):
        tag = re.sub(r'\b(content)="([^"]*)"', attribute, tag)
    return tag


def build_page(source: Path) -> str:
    relative = source.relative_to(ROOT).as_posix()
    html = source.read_text(encoding="utf-8")

    # Convert visible text and text attributes; leave tag names, URLs and classes alone.
    parts = re.split(r"(<[^>]+>)", html)
    html = "".join(convert_tag(part) if part.startswith("<") else to_simplified(part) for part in parts)

    html = html.replace('<html lang="zh-Hant">', '<html lang="zh-Hans">', 1)

    # Shared files live one level up from zh-hans/.
    html = re.sub(
        r'((?:src|href)=")(\./|\.\./)((?:assets/|styles\.css|detail\.css|theme\.js|script\.js))',
        lambda m: m.group(1) + ("../" if m.group(2) == "./" else "../../") + m.group(3),
        html,
    )

    page_url = SITE if relative == "index.html" else SITE + relative
    hans_url = SITE + "zh-hans/" + ("" if relative == "index.html" else relative)
    html = html.replace(f'<link rel="canonical" href="{page_url}" />', f'<link rel="canonical" href="{hans_url}" />', 1)

    back = "../index.html" if relative == "index.html" else f"../../{relative}"
    html, count = re.subn(
        r'<a class="lang-switch"[^>]*>[^<]*</a>',
        f'<a class="lang-switch" href="{back}" hreflang="zh-Hant" lang="zh-Hant" data-lang="zh-Hant" aria-label="切換至繁體中文">繁體</a>',
        html,
    )
    if count != 1:
        raise SystemExit(f"{relative}: expected one .lang-switch link, found {count}")
    return html


def main() -> int:
    check = "--check" in sys.argv[1:]
    sources = [ROOT / "index.html", *sorted((ROOT / "projects").glob("*.html"))]
    expected = {OUT / source.relative_to(ROOT): build_page(source) for source in sources}
    existing = set(OUT.rglob("*.html")) if OUT.exists() else set()

    stale = sorted(
        path.relative_to(ROOT).as_posix()
        for path in expected.keys() | existing
        if path not in expected or not path.exists() or path.read_text(encoding="utf-8") != expected[path]
    )
    if check:
        if stale:
            print("zh-hans/ is out of date:", *stale, sep="\n  ")
            print("Run: python3 tools/build-zh-hans.py")
            return 1
        print("zh-hans/ is up to date.")
        return 0

    for path in existing - expected.keys():
        path.unlink()
    for path, html in expected.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html, encoding="utf-8")
    print(f"Wrote {len(expected)} pages to zh-hans/ ({len(stale)} changed).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
