#!/usr/bin/env python3
"""
Batch skill extraction using claude -p.

Usage:
    python3 batch-extract.py                        # Process all pending
    python3 batch-extract.py --course clean-code    # Process single course
    python3 batch-extract.py --dry-run              # Show what would be processed
    python3 batch-extract.py --parallel 5           # Run 5 concurrent extractions
"""

import json
import os
import subprocess
import sys
import time
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
CATALOG = SCRIPT_DIR / "catalog.json"
PROMPT_FILE = SCRIPT_DIR / "extraction-prompt.md"
SKILLS_DIR = SCRIPT_DIR / "skills-output"
LOG_DIR = SCRIPT_DIR / "logs"
PROGRESS_FILE = SCRIPT_DIR / "progress.json"


def load_progress():
    if PROGRESS_FILE.exists():
        try:
            return json.loads(PROGRESS_FILE.read_text())
        except json.JSONDecodeError:
            return {}
    return {}


def save_progress(progress):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2))


def split_multi_file_output(output):
    """Split ===FILE: path=== delimited output into {path: content} dict."""
    files = {}
    current_path = None
    current_lines = []

    for line in output.split("\n"):
        if line.startswith("===FILE:") and line.endswith("==="):
            # Save previous file
            if current_path:
                files[current_path] = "\n".join(current_lines).strip()
            # Start new file
            current_path = line.replace("===FILE:", "").replace("===", "").strip()
            current_lines = []
        else:
            current_lines.append(line)

    # Save last file
    if current_path:
        files[current_path] = "\n".join(current_lines).strip()

    return files


def extract_lesson(index, total, lesson, prompt_file):
    """Extract a single lesson into SKILL.md + references/ files."""
    skill_slug = lesson["skill_slug"]
    course = lesson["course"]
    skill_dir = SKILLS_DIR / course / skill_slug
    skill_file = skill_dir / "SKILL.md"
    log_file = LOG_DIR / f"{skill_slug}.log"

    # Skip if already extracted
    if skill_file.exists() and skill_file.stat().st_size > 100:
        print(f"[{index}/{total}] SKIP {skill_slug} (already exists)")
        return {"slug": skill_slug, "status": "skipped"}

    skill_dir.mkdir(parents=True, exist_ok=True)
    (skill_dir / "references").mkdir(exist_ok=True)

    print(f"[{index}/{total}] Extracting: {course} / {lesson['lesson_title']}")

    # Read transcript
    transcript_path = lesson["transcript_file"]
    try:
        transcript = Path(transcript_path).read_text(encoding="utf-8")
    except Exception as e:
        print(f"[{index}/{total}] FAIL {skill_slug} - can't read transcript: {e}")
        return {"slug": skill_slug, "status": "fail", "error": str(e)}

    # Build user prompt
    desc = lesson.get("lesson_description") or "N/A"
    user_prompt = f"""COURSE: {course}
MODULE: {lesson['module_title']}
LESSON_TITLE: {lesson['lesson_title']}
LESSON_SLUG: {lesson['lesson_slug']}
LESSON_DESCRIPTION: {desc}

TRANSCRIPT:
{transcript}

---
Extract the skill now. Output ALL files using ===FILE: path=== delimiters. Start with ===FILE: SKILL.md==="""

    # Call claude -p
    start = time.time()

    env = os.environ.copy()
    env.pop("CLAUDECODE", None)

    try:
        result = subprocess.run(
            [
                "claude", "-p",
                "--append-system-prompt-file", str(prompt_file),
                "--dangerously-skip-permissions",
                "--max-turns", "1",
                "--output-format", "text",
            ],
            input=user_prompt,
            capture_output=True,
            text=True,
            timeout=300,
            env=env,
        )
    except subprocess.TimeoutExpired:
        print(f"[{index}/{total}] TIMEOUT {skill_slug}")
        return {"slug": skill_slug, "status": "timeout"}
    except Exception as e:
        print(f"[{index}/{total}] ERROR {skill_slug}: {e}")
        return {"slug": skill_slug, "status": "error", "error": str(e)}

    duration = int(time.time() - start)

    if result.stderr:
        log_file.write_text(result.stderr)

    if result.returncode != 0:
        print(f"[{index}/{total}] FAIL {skill_slug} (exit {result.returncode}, {duration}s) - see {log_file}")
        log_file.write_text(f"EXIT CODE: {result.returncode}\nSTDERR:\n{result.stderr}\nSTDOUT:\n{result.stdout}")
        return {"slug": skill_slug, "status": "fail", "duration": duration}

    output = result.stdout.strip()

    # Try multi-file split first
    if "===FILE:" in output:
        files = split_multi_file_output(output)
    else:
        # Fallback: treat entire output as SKILL.md
        idx = output.find("---")
        if idx > 0:
            output = output[idx:]
        files = {"SKILL.md": output}

    # Validate SKILL.md has frontmatter
    skill_content = files.get("SKILL.md", "")
    if not skill_content.startswith("---"):
        bad_file = skill_dir / "SKILL.md.bad"
        bad_file.write_text(output)
        print(f"[{index}/{total}] WARN {skill_slug} - no frontmatter ({duration}s)")
        return {"slug": skill_slug, "status": "bad_format", "duration": duration}

    # Write all files
    file_count = 0
    total_chars = 0
    for path, content in files.items():
        if not content.strip():
            continue
        full_path = skill_dir / path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content)
        file_count += 1
        total_chars += len(content)

    print(f"[{index}/{total}] OK {skill_slug} ({duration}s, {file_count} files, {total_chars} chars)")
    return {"slug": skill_slug, "status": "ok", "duration": duration, "chars": total_chars, "files": file_count}


def main():
    parser = argparse.ArgumentParser(description="Batch skill extraction")
    parser.add_argument("--course", default="", help="Filter by course slug (comma-separated for multiple)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be processed")
    parser.add_argument("--parallel", type=int, default=3, help="Number of parallel workers")
    parser.add_argument("--limit", type=int, default=0, help="Max lessons to process (0=all)")
    args = parser.parse_args()

    # Ensure catalog exists
    if not CATALOG.exists():
        print("Building catalog...")
        subprocess.run(["python3", str(SCRIPT_DIR / "build-catalog.py")], check=True)

    catalog = json.loads(CATALOG.read_text())

    # Filter by course
    if args.course:
        courses = [c.strip() for c in args.course.split(",")]
        catalog = [l for l in catalog if l["course"] in courses]

    # Limit
    if args.limit > 0:
        catalog = catalog[:args.limit]

    total = len(catalog)

    # Create dirs
    SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    # Summary
    courses = {}
    for l in catalog:
        courses.setdefault(l["course"], 0)
        courses[l["course"]] += 1

    print("=== Rocketseat Skill Extraction Pipeline ===")
    print(f"Total lessons: {total}")
    print(f"Parallel: {args.parallel}")
    print(f"Output: {SKILLS_DIR}")
    print()

    if args.dry_run:
        print(f"[DRY RUN] Would process {total} lessons:")
        for c, n in sorted(courses.items()):
            print(f"  {c}: {n} lessons")
        return

    # Process
    progress = load_progress()
    results = {"ok": 0, "skipped": 0, "fail": 0, "timeout": 0, "bad_format": 0, "error": 0}
    start_time = time.time()

    if args.parallel > 1:
        print(f"Using {args.parallel} parallel workers...")
        with ThreadPoolExecutor(max_workers=args.parallel) as executor:
            futures = {}
            for i, lesson in enumerate(catalog, 1):
                f = executor.submit(extract_lesson, i, total, lesson, PROMPT_FILE)
                futures[f] = lesson["skill_slug"]

            for future in as_completed(futures):
                try:
                    r = future.result()
                    results[r["status"]] = results.get(r["status"], 0) + 1
                    if r.get("status") in ("ok", "bad_format"):
                        progress[r["slug"]] = {"status": r["status"], "duration": r.get("duration", 0)}
                except Exception as e:
                    slug = futures[future]
                    print(f"EXCEPTION for {slug}: {e}")
                    results["error"] += 1
    else:
        print("Running sequentially...")
        for i, lesson in enumerate(catalog, 1):
            r = extract_lesson(i, total, lesson, PROMPT_FILE)
            results[r["status"]] = results.get(r["status"], 0) + 1
            if r.get("status") in ("ok", "bad_format"):
                progress[r["slug"]] = {"status": r["status"], "duration": r.get("duration", 0)}
            # Save progress periodically
            if i % 10 == 0:
                save_progress(progress)

    save_progress(progress)
    elapsed = int(time.time() - start_time)

    print()
    print("=== Extraction Complete ===")
    print(f"OK: {results['ok']} | Skipped: {results['skipped']} | Failed: {results['fail']} | Timeout: {results['timeout']} | Bad format: {results['bad_format']} | Error: {results['error']}")
    print(f"Time: {elapsed // 60}m {elapsed % 60}s")
    print(f"Output: {SKILLS_DIR}/")


if __name__ == "__main__":
    main()
