# Skillz

**5,000+ development skills extracted from 37 Rocketseat courses, structured for AI agent consumption.**

Skills are organized as progressive-disclosure references that AI coding agents (Claude Code, Cursor, etc.) can navigate via decision trees — from high-level routing to specific code patterns.

## What's Inside

### Skill Routers (`.claude/skills/`)

13 auto-discovered routers that Claude Code loads automatically. Each router contains a decision tree that points to specific skill references.

| Router | Skills | Domain |
|--------|--------|--------|
| `rs-full-stack` | 832 | HTML, CSS, JS, Express, SQL, Docker, Webpack, JWT |
| `rs-node-js` | 272 | Streams, HTTP, Fastify, NestJS, DDD, Clean Architecture |
| `rs-devops` | 223 | Docker, Kubernetes, Terraform, CI/CD, Observability |
| `rs-next-js` | 174 | App Router, SSR/SSG/ISR, Server Components, API Routes |
| `rs-saa-s` | 106 | Monorepo, RBAC, multi-tenant auth, CASL permissions |
| `rs-testes-e` | 74 | Unit tests, E2E, Playwright, Jest, RTL, CI pipelines |
| `rs-seguranca-para` | 54 | Auth, XSS, CSRF, injection, headers, MFA |
| `rs-ia-node` | 50 | LLM integration, embeddings, function calling |
| `rs-masterizando` | 37 | Tailwind CSS, Radix UI, dark mode, responsive |
| `rs-api-com` | 34 | Bun + ElysiaJS + Drizzle ORM |
| `rs-clean-code` | 21 | SOLID, DDD, naming, component decomposition |
| `rs-redux-zustand` | 22 | Redux Toolkit, Zustand, state management |
| `rs-implementation-workflow` | — | Meta-router: orchestrates DDD → SOLID → Implementation |

### Raw Skills (`data/skills/`)

5,027 individual skills across 37 courses, each with:

```
data/skills/{course}/{skill-slug}/
├── SKILL.md              # Skill summary and metadata
└── references/
    ├── deep-explanation.md   # Detailed concept breakdown
    └── code-examples.md      # Ready-to-use code patterns
```

**Courses covered:** Angular, React Native, Vue.js, Go, Kotlin, Ruby, Swift, C#/.NET MAUI, Machine Learning, Data Analytics, Electron, n8n AI Agents, AWS, Kubernetes, Prompt Engineering, and more.

## Architecture: Progressive Disclosure

Skills use a 3-level progressive disclosure pattern optimized for LLM context windows:

```
Level 1: Router description (~400 chars)
  → Always in context, triggers auto-discovery

Level 2: Router SKILL.md (~200 lines)
  → Decision tree with grouped index + links to references

Level 3: references/{skill}.md
  → Full skill content with deep explanations and code examples
```

This means the agent only loads what it needs, when it needs it — keeping context lean while having access to 5,000+ skills.

## How It Works with Claude Code

### Activation via `/` command

Skills are registered as Claude Code skills and can be activated directly with the `/` slash command pipeline:

```
/rs-node-js           → Activates Node.js skill router
/rs-clean-code        → Activates clean code patterns
/rs-devops            → Activates DevOps skill router
/rs-next-js           → Activates Next.js skill router
/rs-full-stack        → Activates full-stack fundamentals
/rs-implementation-workflow → Activates the full DDD → SOLID → Code pipeline
...
```

When you type `/` in Claude Code, all 13 skill routers appear in the autocomplete menu. Selecting one loads the router's decision tree into context, which then guides you to the specific `references/` files for your task.

### Auto-discovery

Skills also activate automatically based on what you're doing. If you ask Claude Code to "create a Fastify API", it pattern-matches the router descriptions and loads the relevant ones without you needing to type `/`.

### Example flow

"Create a Fastify API" triggers:

```
rs-implementation-workflow → Phase 1: DDD modeling
  → rs-clean-code/references/principios-de-ddd.md
  → rs-node-js/references/2023-entidades-e-casos-de-uso.md

rs-implementation-workflow → Phase 3: Implementation
  → rs-node-js/references/2023-conhecendo-o-fastify.md
  → rs-node-js/references/2023-separando-rotas-da-aplicacao.md
  → rs-node-js/references/2023-handler-de-erros-global.md
  → rs-node-js/references/2023-tratando-env-com-zod.md
```

## Using in Your Project

### Option 1: Copy skill routers

Copy `.claude/skills/` into your project's `.claude/skills/` directory. Claude Code auto-discovers them.

### Option 2: Copy specific skills

Browse `data/skills/` and copy only the courses relevant to your stack.

### Option 3: Reference as submodule

```bash
git submodule add https://github.com/tallessouza/skillz.git .skillz
```

## Structure

```
skillz/
├── .claude/
│   ├── skills/rs-{domain}/       # 13 skill routers (auto-discovered)
│   │   ├── SKILL.md              # Decision tree + grouped index
│   │   └── references/           # Individual skill content
│   └── CLAUDE.md                 # Project instructions
├── data/skills/{course}/         # 5,027 raw skills (37 courses)
│   └── {skill-slug}/
│       ├── SKILL.md
│       └── references/
├── scripts/                      # Build and extraction scripts
└── src/                          # Project source code
```

## Extraction Pipeline (`rocketseat-scraper/`)

The full pipeline that scraped, transcribed, and transformed 5,028 lessons into structured skills.

### Pipeline stages

```
1. Scrape          scraper.py         Rocketseat API → VTT captions → clean text
2. Catalog         build-catalog.py   manifest.json files → unified catalog.json
3. Extract         batch-extract.py   Transcripts + prompt → claude -p → SKILL.md + references/
4. Output          skills-output/     Raw extracted skills (moved to data/skills/)
```

### How it works

**Stage 1 — Scraping** (`scraper.py`): Hits the Rocketseat API to auto-discover course modules, fetches VTT subtitle files from their CDN, and converts them to clean text transcripts.

```bash
python3 scraper.py --course-url "https://app.rocketseat.com.br/jornada/full-stack" --token "eyJ..."
```

**Stage 2 — Catalog** (`build-catalog.py`): Reads all `manifest.json` files from `transcricoes/` and produces a unified `catalog.json` (5,028 entries) with metadata for each lesson.

**Stage 3 — Extraction** (`batch-extract.py`): The core of the pipeline. For each lesson in the catalog, it pipes the transcript + `extraction-prompt.md` into `claude -p` (Claude CLI in pipe mode) to generate structured skill files. Supports parallel execution and progress tracking.

```bash
python3 batch-extract.py --parallel 10              # All pending lessons
python3 batch-extract.py --course clean-code         # Single course
python3 batch-extract.py --dry-run                   # Preview only
```

The `extraction-prompt.md` is a detailed prompt engineering spec that instructs Claude to:
- Classify the skill type (coding lens, workflow, or reference)
- Write trigger-optimized descriptions (solving the 56% undertrigger rate)
- Generate progressive-disclosure structure (SKILL.md + references/)
- Differentiate from neighboring skills in a 5,000+ skill corpus

### Runner scripts

| Script | Purpose |
|--------|---------|
| `run-all.sh` | Full extraction: all 5,028 lessons, 10 parallel workers (~7h) |
| `run-selected.sh` | Tier 1 courses only: ~1,040 lessons (Node, Next, Clean Code, etc.) |
| `batch-extract.sh` | Bash version of batch-extract.py with budget control |

### Directory contents

| Path | Size | Description |
|------|------|-------------|
| `transcricoes/` | 53 MB | 5,028 clean text transcripts across 37 courses |
| `skills-output/` | 78 MB | Raw extracted skills (source for `data/skills/`) |
| `logs/` | 19 MB | 4,715 extraction logs (one per lesson) |
| `catalog.json` | 5.6 MB | Unified lesson catalog with metadata |
| `progress.json` | — | Extraction progress tracker (resumable) |
| `extraction-prompt.md` | — | The prompt spec that drives skill generation |
| `plannings/` | — | Initial planning sessions and discovery notes |
| `discovery.md` | — | API discovery and reverse-engineering notes |
| `engineering-principles.md` | — | Description engineering research |
| `aios-v2-extraction.md` | — | V2 extraction architecture documentation |

## Source

All skills were extracted and structured from [Rocketseat](https://rocketseat.com.br) courses using the pipeline above. Content is educational reference material organized for AI agent consumption.

## License

MIT
