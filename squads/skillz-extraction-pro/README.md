# Skillz Extraction Pro

Squad para extração de skills de produção a partir de transcrições Rocketseat, aplicando lentes de elite developers.

## Problema

- 37 cursos Rocketseat, 5,323 aulas
- Apenas 40.3% cobertos por skill routers (12 routers, ~2,145 aulas)
- 59.7% sem cobertura (~3,178 aulas)
- Extração atual é genérica — sem opinião de engenharia

## Solução

Pipeline de 4 fases com mind lenses de 8 elite developers:

```
Transcrição → Análise → Extração → Router → Audit
                 ↑          ↑          ↑        ↑
              Akita      Linus      Hickey    All
              Beck       Fowler     DHH       minds
                         Bernhardt  Hunt
```

## Agents

| Agent | Papel | Mind Lenses |
|-------|-------|-------------|
| `@skillz-chief` | Orchestrator | Todos |
| `@transcript-analyst` | Classificação e análise | Akita, Kent Beck |
| `@skill-extractor` | Extração com opinião | Linus, Fowler, Bernhardt, Hunt, Akita |
| `@router-architect` | Design de routers | Hickey, DHH, Hunt |

## Mind Lenses

| Mind | Framework | Lente |
|------|-----------|-------|
| Fabio Akita | XP + AI / Anti-Complexity | Pragmatic Production |
| Kent Beck | TDD / XP / 3X | Methodology Meta |
| Linus Torvalds | Good Taste / Linux Style | Engineering Taste |
| Martin Fowler | Refactoring / EAA Patterns | Architecture Quality |
| Rich Hickey | Simple Made Easy | Complexity Radar |
| DHH | Rails Doctrine / Monolith | Anti-Overengineering |
| Gary Bernhardt | Functional Core / Imperative Shell | Architecture Boundary |
| Thomas & Hunt | Pragmatic Programmer | Fundamentals Checklist |

## Uso

```bash
# Ativar o squad
@skillz-chief

# Extrair um curso completo
*extract-course go

# Extrair múltiplos cursos
*extract-batch go,kotlin,angular

# Criar/atualizar router
*build-router rs-go

# Auditar qualidade
*audit-skills rs-go

# Ver cobertura
*coverage-report

# Próximo curso a extrair
*prioritize
```

## Workflow Principal

`wf-transcript-to-router.yaml` — 4 fases:

1. **Transcript Analysis** — Classificação, conceitos, cross-references
2. **Skill Extraction** — SKILL.md + references com mind lenses
3. **Router Building** — Decision tree, deduplicação, merge
4. **Quality Audit** — Score 1-10, verdicts, issues

## Estrutura

```
squads/skillz-extraction-pro/
├── config.yaml
├── README.md
├── agents/
│   ├── skillz-chief.md
│   ├── transcript-analyst.md
│   ├── skill-extractor.md
│   └── router-architect.md
├── tasks/
│   ├── analyze-transcript.md
│   ├── extract-skill.md
│   ├── build-router.md
│   └── audit-quality.md
├── workflows/
│   └── wf-transcript-to-router.yaml
└── data/
    ├── mind-lenses.yaml
    └── course-coverage.yaml
```
