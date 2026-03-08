---
name: rs-skillz-extraction
description: "Orchestrates skill extraction from Rocketseat course transcriptions into decision-flow routers. Use when user asks to 'extract skills', 'build a router', 'analyze transcriptions', 'create skill router', 'map development decisions', or 'convert course to skills'. Coordinates 4 agents: transcript-analyst (classifies lessons by decision position), skill-extractor (creates SKILL.md with mind lenses), router-architect (builds decision-flow trees), and skillz-chief (orchestrates pipeline). Make sure to use this skill whenever working with Rocketseat course content or building skill routers. Not for writing application code, implementing features, or running tests."
---

# Skillz Extraction — Pipeline de Transcrição para Router

> Transcrições viram skills. Skills viram decision trees. Decision trees guiam Claude.

## Squad

Ative os agents via `/skillz-extraction-pro:{agent}`:

| Agent | Comando | Papel |
|-------|---------|-------|
| Orchestrator | `/skillz-extraction-pro:skillz-chief` | Pipeline e cobertura |
| Analyst | `/skillz-extraction-pro:transcript-analyst` | Classifica aulas por posição no fluxo de decisão |
| Extractor | `/skillz-extraction-pro:skill-extractor` | Extrai SKILL.md com mind lenses |
| Architect | `/skillz-extraction-pro:router-architect` | Cria routers como árvores de decisão |

## Pipeline (4 fases)

```
Fase 1: Análise         → analysis.yaml (classificação + decision mapping)
Fase 2: Extração         → SKILL.md + references/ (com mind lenses)
Fase 3: Router Building  → Decision tree router (com tracer bullets)
Fase 4: Quality Audit    → audit-report.yaml (score 1-10)
```

## Comandos principais

```
*extract-course {course}     — Pipeline completo para um curso
*extract-batch {c1,c2,...}   — Múltiplos cursos em lote
*build-decision-router {dom} — Criar router de decisão
*coverage-report             — Status de cobertura
*prioritize                  — Próximo curso a extrair
```

## Mind Lenses (8 elite developers)

| Mind | Lente | Onde aplica |
|------|-------|-------------|
| Akita | Pragmatic Production | Análise + Extração |
| Kent Beck | 3X (Explore/Expand/Extract) | Análise |
| Linus Torvalds | Engineering Taste | Extração |
| Martin Fowler | Architecture Quality | Extração |
| Rich Hickey | Complexity Radar | Router |
| DHH | Anti-Overengineering | Router |
| Gary Bernhardt | FC/IS Boundary | Extração |
| Thomas & Hunt | Fundamentals Checklist | Router + Extração |

## Cobertura atual

- 13 routers existentes (por tópico — serão convertidos para decision flow)
- 37 cursos, 5,323 aulas
- 40.3% coberto, 59.7% sem router

## Referências

- Squad: `squads/skillz-extraction-pro/`
- Extraction prompt: `rocketseat-scraper/extraction-prompt.md`
- Workflow: `squads/skillz-extraction-pro/workflows/wf-transcript-to-router.yaml`
- Mind lenses: `squads/skillz-extraction-pro/data/mind-lenses.yaml`
- Coverage map: `squads/skillz-extraction-pro/data/course-coverage.yaml`
