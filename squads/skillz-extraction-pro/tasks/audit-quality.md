# Task: Audit Quality

## Purpose
Auditar qualidade de skills extraídas e routers criados contra quality gates + mind lenses.

## Agent
`@skillz-chief`

## Input
- `rocketseat-scraper/skills-output/{course}/**/SKILL.md` — skills extraídas
- `.claude/skills/rs-{domain}/SKILL.md` — router
- `data/mind-lenses.yaml` — heurísticas para validação

## Process

### Step 1: Frontmatter Audit
Para cada SKILL.md:
- [ ] `name` kebab-case, max 64 chars
- [ ] `name` não contém "claude" ou "anthropic"
- [ ] `description` 200-1024 chars
- [ ] `metadata.author` = "Rocketseat"
- [ ] `metadata.version` presente
- [ ] `metadata.course` presente
- [ ] `metadata.tags` presente e relevante

### Step 2: Description Audit
Para cada description:
- [ ] Começa com verbo 3a pessoa (Enforces, Applies, Generates, etc.)
- [ ] Contém 3-5 trigger phrases entre aspas simples
- [ ] Contém "Make sure to use this skill whenever..."
- [ ] Contém "Not for..." com referência a skills vizinhas
- [ ] Linha única (sem multi-line)
- [ ] Sem angle brackets `<>`
- [ ] Sem verbos fracos (Helps, Provides, Assists)

### Step 3: Body Audit
Para cada body:
- [ ] Forma imperativa
- [ ] Framing positivo (diz O QUE FAZER, não o que não fazer)
- [ ] Cada regra tem "because" reasoning
- [ ] Pelo menos 1 before/after example
- [ ] Under 300 lines
- [ ] Under 5,000 words
- [ ] Sem seções vazias
- [ ] Anti-patterns como pares de substituição (X → Y)
- [ ] Sem "nesta aula", "vamos aprender"
- [ ] Troubleshooting section presente
- [ ] "Deep reference library" no final

### Step 4: Mind Lens Audit
Verificar se lenses foram aplicadas:
- [ ] Código segue "good taste" (Linus) — edge cases por design, não if/else
- [ ] Padrões nomeados (Fowler) — Repository, Observer, etc.
- [ ] Separação Core/Shell (Bernhardt) — side effects nas bordas
- [ ] Complexidade justificada (Akita) — não over-engineered
- [ ] WHY explicado (Thomas & Hunt) — não "just works"

### Step 5: Router Audit
Para o router:
- [ ] Under 200 lines
- [ ] Max 12 top-level branches
- [ ] Max 15 skills per branch
- [ ] Branches nomeados por ação do dev
- [ ] Description não conflita com outros routers
- [ ] Todas as references existem

### Step 6: Score
```
Frontmatter:  _/10
Description:  _/10
Body:         _/10
Mind Lenses:  _/10
Router:       _/10
──────────────────
Overall:      _/10
```

Verdicts:
- >= 7/10: PASS
- 5-6/10: NEEDS_WORK — re-extract problemas específicos
- < 5/10: FAIL — re-extração completa

## Output
`outputs/{course}/audit-report.yaml`

```yaml
course: {course}
router: rs-{domain}
date: {date}
overall_score: X/10
verdict: PASS | NEEDS_WORK | FAIL

skills_audited: N
skills_passed: N
skills_needs_work: N
skills_failed: N

issues:
  - skill: {name}
    severity: CRITICAL | HIGH | MEDIUM
    issue: "{description}"
    fix: "{suggested fix}"

router_audit:
  lines: N
  branches: N
  max_skills_in_branch: N
  description_conflicts: []
  missing_references: []
```

## Completion Criteria
- [ ] Todos os skills auditados
- [ ] Router auditado
- [ ] audit-report.yaml salvo
- [ ] Issues listadas com severity e fix sugerido
- [ ] Score calculado
