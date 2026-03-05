#!/usr/bin/env python3
"""
Reads all manifest.json files and produces a unified catalog (catalog.json).
Each entry has all metadata needed for the extraction pipeline.
"""

import json
import os
import sys

TRANSCRICOES_DIR = os.path.join(os.path.dirname(__file__), "transcricoes")
OUTPUT = os.path.join(os.path.dirname(__file__), "catalog.json")


def build_catalog():
    catalog = []
    courses = sorted(os.listdir(TRANSCRICOES_DIR))

    for course_slug in courses:
        course_dir = os.path.join(TRANSCRICOES_DIR, course_slug)
        manifest_path = os.path.join(course_dir, "manifest.json")

        if not os.path.isfile(manifest_path):
            print(f"SKIP {course_slug}: no manifest.json", file=sys.stderr)
            continue

        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)

        journey_slug = manifest.get("journey_slug", course_slug)

        for module in manifest.get("modules", []):
            module_slug = module.get("slug", "")
            module_title = module.get("title", "")
            module_order = module.get("order", 0)

            for lesson in module.get("lessons", []):
                if not lesson.get("has_transcription"):
                    continue
                if lesson.get("status") != "ok":
                    continue
                if not lesson.get("file"):
                    continue

                transcript_path = os.path.join(course_dir, lesson["file"])
                if not os.path.isfile(transcript_path):
                    print(f"SKIP {course_slug}/{lesson['file']}: file missing", file=sys.stderr)
                    continue

                catalog.append({
                    "course": journey_slug,
                    "module_slug": module_slug,
                    "module_title": module_title,
                    "module_order": module_order,
                    "lesson_title": lesson.get("title", ""),
                    "lesson_slug": lesson.get("slug", ""),
                    "lesson_description": lesson.get("description"),
                    "duration": lesson.get("duration", 0),
                    "chars": lesson.get("chars", 0),
                    "transcript_file": transcript_path,
                    "skill_slug": f"rs-{journey_slug}-{lesson.get('slug', '')}",
                })

    # Sort by course, module order, then file order
    catalog.sort(key=lambda x: (x["course"], x["module_order"], x["lesson_slug"]))

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"Catalog: {len(catalog)} lessons from {len(courses)} courses → {OUTPUT}")
    return catalog


if __name__ == "__main__":
    build_catalog()
