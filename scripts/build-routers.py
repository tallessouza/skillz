#!/usr/bin/env python3
"""
Build ONE skill router per course from individual skills in data/skills/.

Each course gets:
  .claude/skills/rs-{course}/SKILL.md     — Router with engineered description + grouped index
  .claude/skills/rs-{course}/references/  — Individual skills as reference files

Usage:
    python3 build-routers.py                      # All courses
    python3 build-routers.py --course clean-code   # Single course
    python3 build-routers.py --dry-run             # Show grouping only
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).parent.parent
DATA_DIR = BASE / "data" / "skills"
SKILLS_DIR = BASE / ".claude" / "skills"


def get_skill_summaries(course_dir: Path) -> list[dict]:
    """Read all skills in a course and extract name + title + description."""
    skills = []
    for skill_dir in sorted(course_dir.iterdir()):
        skill_file = skill_dir / "SKILL.md"
        if not skill_file.exists():
            continue

        content = skill_file.read_text()
        name = ""
        description = ""
        title = ""

        for line in content.split("\n"):
            if line.startswith("name:"):
                name = line.replace("name:", "").strip()
            elif line.startswith("description:"):
                description = line.replace("description:", "").strip().strip('"')
            elif line.startswith("# ") and not title:
                title = line.replace("# ", "").strip()

        has_deep = (skill_dir / "references" / "deep-explanation.md").exists()
        has_code = (skill_dir / "references" / "code-examples.md").exists()

        skills.append({
            "slug": skill_dir.name,
            "name": name,
            "title": title,
            "description": description,
            "has_deep": has_deep,
            "has_code": has_code,
        })

    return skills


CHUNK_SIZE = 200


def _call_claude(prompt: str, timeout: int = 300) -> str | None:
    """Call claude -p and return the text result, or None on failure."""
    env = os.environ.copy()
    env.pop("CLAUDECODE", None)

    try:
        result = subprocess.run(
            ["claude", "-p", "--output-format", "json", "--max-turns", "1"],
            input=prompt,
            capture_output=True,
            text=True,
            timeout=timeout,
            env=env,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        print(f"  ERROR: claude -p failed: {e}")
        return None

    output = result.stdout.strip()

    # Unwrap JSON envelope
    text = output
    try:
        envelope = json.loads(output)
        if isinstance(envelope, dict) and "result" in envelope:
            text = envelope["result"]
    except json.JSONDecodeError:
        pass

    return text


def _parse_json_response(text: str) -> dict | None:
    """Extract JSON with description+groups from Claude's text response."""
    if not text:
        return None

    # Try direct parse
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict) and "groups" in parsed:
            return parsed
    except json.JSONDecodeError:
        pass

    # Try markdown code block
    if "```" in text:
        lines = text.split("\n")
        in_block = False
        json_lines = []
        for line in lines:
            if line.strip().startswith("```"):
                if in_block:
                    break
                in_block = True
                continue
            if in_block:
                json_lines.append(line)
        if json_lines:
            try:
                parsed = json.loads("\n".join(json_lines))
                if isinstance(parsed, dict) and "groups" in parsed:
                    return parsed
            except json.JSONDecodeError:
                pass

    # Try first { to last }
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        try:
            parsed = json.loads(text[start:end])
            if isinstance(parsed, dict) and "groups" in parsed:
                return parsed
        except json.JSONDecodeError:
            pass

    return None


def _generate_groups_for_chunk(course: str, skills: list[dict], chunk_idx: int, total_chunks: int) -> list[dict] | None:
    """Generate groups for a chunk of skills."""
    skill_list = "\n".join([f"- {s['slug']}: {s['title']}" for s in skills])

    chunk_note = ""
    if total_chunks > 1:
        chunk_note = f"\nThis is chunk {chunk_idx + 1}/{total_chunks}. Group ONLY the skills listed below.\n"

    prompt = f"""You are creating semantic groups for a SKILL ROUTER. Organize these {len(skills)} skills from the "{course}" course.
{chunk_note}
Skills to organize:
{skill_list}

Output ONLY valid JSON:
{{
  "groups": [
    {{
      "name": "Group Name",
      "skills": ["slug-1", "slug-2"],
      "context": "When writing/implementing X"
    }}
  ]
}}

Rules:
- Every skill must appear in exactly one group
- Groups should have 3-50 skills (merge small groups)
- Group names should be clear domain concepts
- 3-8 groups total
"""

    text = _call_claude(prompt)
    parsed = _parse_json_response(text)

    if parsed and "groups" in parsed:
        return parsed["groups"]

    print(f"  ERROR: Could not parse groups for chunk {chunk_idx + 1}")
    if text:
        print(f"  Text (first 300): {text[:300]}")
    return None


def _generate_description(course: str, groups: list[dict]) -> str:
    """Generate the router description from the final groups."""
    group_summary = "\n".join([
        f"- {g['name']}: {len(g['skills'])} skills — {g.get('context', '')}"
        for g in groups
    ])

    prompt = f"""Generate a description for a Claude Code SKILL ROUTER for the "{course}" course.

The router has these groups:
{group_summary}

Output ONLY valid JSON:
{{
  "description": "Enforces {course} best practices when... [your text here]"
}}

Rules for description:
- Third person verb: "Enforces...", "Applies...", "Follows..."
- Include 3-5 trigger phrases users would naturally say
- Include "Make sure to use this skill whenever..." clause
- Include "Not for..." boundary
- Single line, no angle brackets, 200-500 chars
- Strong behavioral verbs only
"""

    text = _call_claude(prompt, timeout=120)
    parsed = _parse_json_response(text)

    if parsed and "description" in parsed:
        return parsed["description"]

    # Fallback description
    return f"Enforces {course.replace('-', ' ')} best practices when writing code. Make sure to use this skill whenever working on {course.replace('-', ' ')} related code. Not for unrelated domains."


def generate_router_with_claude(course: str, skills: list[dict]) -> dict | None:
    """Use claude -p to generate a router SKILL.md with grouped index.

    For large courses (>CHUNK_SIZE skills), splits into chunks and merges.
    """

    if len(skills) <= CHUNK_SIZE:
        # Small course: single call with description + groups
        skill_list = "\n".join([f"- {s['slug']}: {s['title']}" for s in skills])

        prompt = f"""You are creating a SKILL ROUTER for Claude Code. This router organizes {len(skills)} individual skills from the "{course}" Skillz course into semantic groups.

Skills to organize:
{skill_list}

Generate a JSON with:
1. An engineered description (200-500 chars) for auto-discovery
2. Semantic groups (3-8 groups) with skills assigned to each

Output ONLY valid JSON:
{{
  "description": "Enforces {course} best practices when... [3rd person, trigger phrases, 'Make sure to use...', 'Not for...']",
  "groups": [
    {{
      "name": "Group Name",
      "skills": ["slug-1", "slug-2"],
      "context": "When writing/implementing X"
    }}
  ]
}}

Rules for description:
- Third person verb: "Enforces...", "Applies...", "Follows..."
- Include 3-5 trigger phrases users would naturally say
- Include "Make sure to use this skill whenever..." clause
- Include "Not for..." boundary
- Single line, no angle brackets, 200-500 chars
- Strong behavioral verbs only

Rules for groups:
- Every skill must appear in exactly one group
- Groups should have 3-50 skills (merge small groups)
- Group names should be clear domain concepts
"""

        text = _call_claude(prompt)
        parsed = _parse_json_response(text)
        if parsed and "description" in parsed and "groups" in parsed:
            return parsed

        print(f"  ERROR: Could not parse JSON")
        if text:
            print(f"  Text (first 300): {text[:300]}")
        return None

    # Large course: chunk → merge
    chunks = [skills[i:i + CHUNK_SIZE] for i in range(0, len(skills), CHUNK_SIZE)]
    print(f"  Large course ({len(skills)} skills) — splitting into {len(chunks)} chunks of ~{CHUNK_SIZE}")

    all_groups = []
    for i, chunk in enumerate(chunks):
        print(f"  Chunk {i + 1}/{len(chunks)} ({len(chunk)} skills)...")
        groups = _generate_groups_for_chunk(course, chunk, i, len(chunks))
        if groups:
            all_groups.extend(groups)
        else:
            # Fallback: single group for this chunk
            all_groups.append({
                "name": f"Group {i + 1}",
                "skills": [s["slug"] for s in chunk],
                "context": "When writing code",
            })

    # Generate unified description from merged groups
    print(f"  Generating description for {len(all_groups)} groups...")
    description = _generate_description(course, all_groups)

    return {"description": description, "groups": all_groups}


def build_router(course: str, skills: list[dict], router_data: dict):
    """Build the router directory with SKILL.md and references/."""

    router_dir = SKILLS_DIR / f"rs-{course}"
    refs_dir = router_dir / "references"
    refs_dir.mkdir(parents=True, exist_ok=True)

    course_dir = DATA_DIR / course

    # Build grouped index sections
    sections = []
    for group in router_data["groups"]:
        group_skills = [s for s in skills if s["slug"] in set(group["skills"])]
        if not group_skills:
            continue

        rows = []
        for s in group_skills:
            ref_name = s["slug"].replace(f"rs-{course}-", "") + ".md"
            rows.append(f"| {s['title']} | [{ref_name}](references/{ref_name}) |")

        table = "\n".join(rows)
        context = group.get("context", "")
        sections.append(f"""### {group['name']}
_{context}_

| Topic | Load |
|-------|------|
{table}
""")

    all_sections = "\n".join(sections)

    # Build SKILL.md
    skill_md = f"""---
name: rs-{course}
description: "{router_data['description']}"
---

# {course.replace('-', ' ').title()} — Skill Router

> Load the specific skill reference based on current coding context.

## Skills Index

{all_sections}"""

    (router_dir / "SKILL.md").write_text(skill_md)

    # Create references (individual skill content)
    ref_count = 0
    for s in skills:
        ref_name = s["slug"].replace(f"rs-{course}-", "") + ".md"
        skill_file = course_dir / s["slug"] / "SKILL.md"

        if not skill_file.exists():
            continue

        content = skill_file.read_text()

        # Append deep dive links
        extra = "\n\n---\n\n## Deep dive\n"
        if s["has_deep"]:
            extra += f"- [Deep explanation](../../../data/skills/{course}/{s['slug']}/references/deep-explanation.md)\n"
        if s["has_code"]:
            extra += f"- [Code examples](../../../data/skills/{course}/{s['slug']}/references/code-examples.md)\n"

        (refs_dir / ref_name).write_text(content + extra)
        ref_count += 1

    return ref_count


def process_course(course: str, dry_run: bool = False):
    """Process a single course."""
    course_dir = DATA_DIR / course
    if not course_dir.exists():
        print(f"  Course not found: {course}")
        return

    skills = get_skill_summaries(course_dir)
    print(f"\n{'='*60}")
    print(f"Course: {course} ({len(skills)} skills)")
    print(f"{'='*60}")

    if not skills:
        print("  No skills, skipping")
        return

    # Use claude -p for description engineering + grouping
    print(f"  Generating router with claude -p...")
    router_data = generate_router_with_claude(course, skills)

    if not router_data:
        # Fallback: generic router
        print(f"  Fallback: generic router")
        router_data = {
            "description": f"Enforces {course.replace('-', ' ')} best practices when writing code. Make sure to use this skill whenever working on {course.replace('-', ' ')} related code. Not for unrelated domains.",
            "groups": [{
                "name": "All Skills",
                "skills": [s["slug"] for s in skills],
                "context": "When writing code"
            }]
        }

    if dry_run:
        print(f"  Description: {router_data['description'][:100]}...")
        for g in router_data["groups"]:
            print(f"  [{g['name']}] {len(g['skills'])} skills — {g.get('context', '')}")
        return

    ref_count = build_router(course, skills, router_data)
    print(f"  Created: rs-{course} ({ref_count} references, {len(router_data['groups'])} groups)")

    # Check unassigned
    assigned = set()
    for g in router_data["groups"]:
        assigned.update(g["skills"])
    unassigned = [s["slug"] for s in skills if s["slug"] not in assigned]
    if unassigned:
        print(f"  WARNING: {len(unassigned)} unassigned: {unassigned[:3]}...")


def main():
    parser = argparse.ArgumentParser(description="Build skill routers (1 per course)")
    parser.add_argument("--course", default="", help="Single course to process")
    parser.add_argument("--dry-run", action="store_true", help="Show grouping only")
    args = parser.parse_args()

    courses = [args.course] if args.course else sorted([d.name for d in DATA_DIR.iterdir() if d.is_dir()])

    print(f"Processing {len(courses)} courses (1 router each)...")

    for course in courses:
        process_course(course, args.dry_run)

    if not args.dry_run:
        routers = list(SKILLS_DIR.glob("rs-*/SKILL.md"))
        total_desc = sum(
            len(line)
            for r in routers
            for line in r.read_text().split("\n")
            if line.startswith("description:")
        )

        print(f"\n{'='*60}")
        print(f"SUMMARY")
        print(f"{'='*60}")
        print(f"Routers: {len(routers)}")
        print(f"Description chars: {total_desc}")
        print(f"Budget (16K): {'OK' if total_desc < 16000 else 'OVER — set SLASH_COMMAND_TOOL_CHAR_BUDGET'}")


if __name__ == "__main__":
    main()
