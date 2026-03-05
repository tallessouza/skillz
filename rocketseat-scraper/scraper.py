#!/usr/bin/env python3
"""
Rocketseat Course Transcript Scraper v2
========================================
Extrai transcrições (VTT → texto limpo) de qualquer curso da Rocketseat.
Auto-descobre módulos a partir da URL do curso.

Uso:
  python3 scraper.py --course-url "https://app.rocketseat.com.br/jornada/full-stack" --token "eyJ..."
  python3 scraper.py --courses full-stack node-js machine-learning-em-inteligencia-artificial --token "eyJ..."

Pipeline:
  1. Extrair journey slug da URL
  2. GET /v2/journeys/{slug}/content → auto-descobrir module slugs
  3. GET /journey-nodes/{moduleSlug}?journey_slug={slug} → listar aulas + video IDs
  4. GET https://vz-dc851587-83d.b-cdn.net/{videoId}/captions/pt.vtt → baixar legendas
  5. VTT → texto limpo
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path

# ============================================================
# CONFIG
# ============================================================
CDN_BASE = "https://vz-dc851587-83d.b-cdn.net"
API_BASE = "https://skylab-api.rocketseat.com.br"
DEFAULT_OUTPUT = "./transcricoes"
RATE_LIMIT_SECONDS = 0.3  # delay between API calls
VTT_RATE_LIMIT = 0.15     # delay between VTT downloads


# ============================================================
# HELPERS
# ============================================================

def slugify(text: str) -> str:
    text = text.lower()
    for src, dst in [("àáâãä","a"),("èéêë","e"),("ìíîï","i"),("òóôõö","o"),("ùúûü","u"),("ç","c")]:
        for c in src:
            text = text.replace(c, dst)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def api_get(endpoint: str, token: str) -> dict:
    url = f"{API_BASE}{urllib.parse.quote(endpoint, safe='/?&=')}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  [HTTP {e.code}] {endpoint}")
        raise


def extract_journey_slug(course_url: str) -> str:
    match = re.search(r'/jornada/([^/]+)', course_url)
    if not match:
        raise ValueError(f"URL inválida: {course_url}")
    return match.group(1)


# ============================================================
# AUTO-DISCOVERY
# ============================================================

def discover_modules(journey_slug: str, token: str) -> list:
    """
    Auto-descobre todos os content slugs de um curso.
    Endpoint: GET /v2/journeys/{slug}/content → levels[].contents[].slug

    Estrutura: Journey → Levels → Contents
    - Level pode ser "cluster" (container) ou "group" (com aulas)
    - Contents dentro de cada level são os nós reais com aulas
    - Iteramos TODOS os contents, não apenas os levels
    """
    print(f"  Discovering modules for '{journey_slug}'...")
    data = api_get(f"/v2/journeys/{journey_slug}/content", token)

    levels = data.get("levels", [])
    modules = []
    global_order = 0

    for level in levels:
        level_title = level.get("title", "")
        contents = level.get("contents", [])

        if not contents:
            # Level sem contents — tenta usar o próprio slug do level
            global_order += 1
            modules.append({
                "order": global_order,
                "slug": level["slug"],
                "title": level_title,
                "level_title": level_title,
            })
        else:
            # Level com contents — itera cada content individualmente
            for content in contents:
                content_slug = content.get("slug", "")
                content_title = content.get("title", level_title)
                if not content_slug:
                    continue
                # Skip quizzes, micro-certificados, feedbacks (não têm vídeo)
                skip_prefixes = ("quiz-", "micro-certificado-", "feedback-")
                if any(content_slug.startswith(p) for p in skip_prefixes):
                    print(f"    SKIP (non-video): {content_title}")
                    continue
                global_order += 1
                modules.append({
                    "order": global_order,
                    "slug": content_slug,
                    "title": content_title,
                    "level_title": level_title,
                })

    print(f"  Found {len(modules)} content nodes (from {len(levels)} levels)")
    return modules


def get_module_lessons(module_slug: str, journey_slug: str, token: str) -> list:
    """
    Obtém todas as aulas de um módulo com video IDs.
    Recursivamente extrai de groups e children.
    """
    data = api_get(f"/journey-nodes/{module_slug}?journey_slug={journey_slug}", token)
    lessons = []

    def extract_from_group(group):
        for lesson in group.get("lessons", []):
            last = lesson.get("last", {})
            if last and last.get("resource"):
                lessons.append({
                    "title": last.get("title", ""),
                    "slug": last.get("slug", ""),
                    "video_id": last.get("resource", ""),
                    "has_transcription": last.get("has_transcription", False),
                    "description": last.get("description", ""),
                    "duration": last.get("duration", 0),
                    "type": lesson.get("type", "video"),
                })

    def extract(node):
        # Handle "group" type nodes
        group = node.get("group")
        if group:
            extract_from_group(group)
        # Handle "cluster" type nodes (contain multiple groups)
        cluster = node.get("cluster")
        if cluster:
            for grp in cluster.get("groups", []):
                extract_from_group(grp)
        for child in node.get("children", []):
            extract(child)

    extract(data)
    return lessons


# ============================================================
# VTT
# ============================================================

def download_vtt(video_id: str) -> str | None:
    url = f"{CDN_BASE}/{video_id}/captions/pt.vtt?ver=1"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            return resp.read().decode("utf-8")
    except urllib.error.HTTPError:
        return None


def vtt_to_text(vtt_content: str) -> str:
    lines = vtt_content.split("\n")
    text_lines = []
    for line in lines:
        line = line.strip()
        if not line or line == "WEBVTT" or line.startswith("WEBVTT "):
            continue
        if re.match(r"^\d+$", line):
            continue
        if re.match(r"\d{2}:\d{2}:\d{2}\.\d{3}\s*-->", line):
            continue
        line = re.sub(r"<[^>]+>", "", line)
        text_lines.append(line)
    return re.sub(r"\s+", " ", " ".join(text_lines)).strip()


# ============================================================
# MAIN PIPELINE
# ============================================================

def scrape_course(journey_slug: str, token: str, output_dir: str) -> dict:
    """Scrape completo de um curso."""
    print(f"\n{'='*60}")
    print(f"  SCRAPING: {journey_slug}")
    print(f"{'='*60}")

    # Auto-discover modules
    time.sleep(RATE_LIMIT_SECONDS)
    try:
        modules = discover_modules(journey_slug, token)
    except urllib.error.HTTPError as e:
        print(f"  SKIP COURSE (HTTP {e.code}) - possibly Plus/paid content")
        return {"journey_slug": journey_slug, "modules": [], "stats": {"total_lessons": 0, "with_vtt": 0, "without_vtt": 0, "total_chars": 0}}

    course_dir = os.path.join(output_dir, journey_slug)
    os.makedirs(course_dir, exist_ok=True)

    manifest = {
        "journey_slug": journey_slug,
        "modules": [],
        "stats": {"total_lessons": 0, "with_vtt": 0, "without_vtt": 0, "total_chars": 0},
    }

    for mod in modules:
        mod_slug = mod["slug"]
        mod_order = mod["order"]
        mod_title = mod["title"]

        print(f"\n  [{mod_order}/{len(modules)}] {mod_title} ({mod_slug})")

        time.sleep(RATE_LIMIT_SECONDS)
        try:
            lessons = get_module_lessons(mod_slug, journey_slug, token)
        except urllib.error.HTTPError:
            print(f"    SKIP (error)")
            continue

        if not lessons:
            print(f"    No video lessons found")
            continue

        mod_dir = os.path.join(course_dir, f"{mod_order:02d}-{slugify(mod_slug)}")
        os.makedirs(mod_dir, exist_ok=True)

        mod_data = {"slug": mod_slug, "title": mod_title, "order": mod_order, "lessons": []}

        for j, lesson in enumerate(lessons, 1):
            title = lesson["title"]
            video_id = lesson["video_id"]
            has_trans = lesson["has_transcription"]

            status_prefix = f"    [{j}/{len(lessons)}] {title[:50]}"

            if not has_trans:
                print(f"{status_prefix} [NO CAPTION]")
                manifest["stats"]["without_vtt"] += 1
                mod_data["lessons"].append({**lesson, "file": None, "status": "no_caption"})
                continue

            time.sleep(VTT_RATE_LIMIT)
            vtt = download_vtt(video_id)
            if not vtt:
                print(f"{status_prefix} [VTT 404]")
                manifest["stats"]["without_vtt"] += 1
                mod_data["lessons"].append({**lesson, "file": None, "status": "vtt_404"})
                continue

            text = vtt_to_text(vtt)
            filename = f"{j:03d}-{slugify(title)}"
            txt_path = os.path.join(mod_dir, f"{filename}.txt")

            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(text)

            chars = len(text)
            print(f"{status_prefix} [{chars} chars]")

            manifest["stats"]["with_vtt"] += 1
            manifest["stats"]["total_chars"] += chars
            mod_data["lessons"].append({
                **lesson, "file": os.path.relpath(txt_path, course_dir),
                "chars": chars, "status": "ok"
            })

        manifest["modules"].append(mod_data)
        manifest["stats"]["total_lessons"] += len(lessons)

    # Save manifest
    manifest_path = os.path.join(course_dir, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    s = manifest["stats"]
    print(f"\n  DONE: {journey_slug}")
    print(f"  Lessons: {s['total_lessons']} | VTT: {s['with_vtt']} | Missing: {s['without_vtt']} | Chars: {s['total_chars']:,}")
    print(f"  Manifest: {manifest_path}")

    return manifest


def main():
    global RATE_LIMIT_SECONDS

    parser = argparse.ArgumentParser(description="Rocketseat Transcript Scraper v2")
    parser.add_argument("--course-url", help="URL do curso (ex: .../jornada/full-stack)")
    parser.add_argument("--courses", nargs="+", help="Journey slugs diretos (ex: full-stack next-js)")
    parser.add_argument("--token", required=True, help="JWT token (cookie skylab_next_access_token_v4)")
    parser.add_argument("--output", default=DEFAULT_OUTPUT, help="Diretório de saída")
    parser.add_argument("--rate-limit", type=float, default=0.3, help="Delay entre requests (s)")

    args = parser.parse_args()
    RATE_LIMIT_SECONDS = args.rate_limit

    slugs = args.courses or []
    if args.course_url:
        slugs.append(extract_journey_slug(args.course_url))

    if not slugs:
        print("ERROR: Forneça --course-url ou --courses")
        sys.exit(1)

    print(f"\nRocketseat Transcript Scraper v2")
    print(f"Courses: {', '.join(slugs)}")
    print(f"Output: {args.output}")
    print(f"Rate limit: {RATE_LIMIT_SECONDS}s")

    all_stats = {}
    for slug in slugs:
        manifest = scrape_course(slug, args.token, args.output)
        all_stats[slug] = manifest["stats"]

    print(f"\n{'='*60}")
    print(f"  ALL COURSES COMPLETE")
    print(f"{'='*60}")
    for slug, stats in all_stats.items():
        print(f"  {slug:50s} | {stats['with_vtt']:4d} VTTs | {stats['total_chars']:>10,} chars")
    total_vtts = sum(s["with_vtt"] for s in all_stats.values())
    total_chars = sum(s["total_chars"] for s in all_stats.values())
    print(f"  {'TOTAL':50s} | {total_vtts:4d} VTTs | {total_chars:>10,} chars")


if __name__ == "__main__":
    main()
