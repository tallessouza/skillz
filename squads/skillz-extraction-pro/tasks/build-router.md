# Task: Build Router

## Purpose
Criar ou atualizar skill router (SKILL.md com decision tree) a partir de skills extraídas.

## Agent
`@router-architect`

## Input
- `rocketseat-scraper/skills-output/{course}/**/SKILL.md` — skills extraídas
- `outputs/{course}/analysis.yaml` — análise com conceitos e cross-references
- `.claude/skills/rs-*/SKILL.md` — routers existentes
- `data/course-coverage.yaml` — mapa de cobertura

## Process

### Step 1: Decide Strategy
```
Curso tem router existente?
├── SIM → UPDATE mode (adicionar skills ao router)
└── NÃO → Curso overlap com router existente?
    ├── SIM → MERGE mode (adicionar como branch no router existente)
    └── NÃO → CREATE mode (novo router)
```

### Step 2: Inventory Skills
1. Listar todas as skills extraídas do curso
2. Agrupar por conceito (do analysis.yaml)
3. Identificar duplicatas (conceito já existe em outro router)
4. Aplicar deduplication decision tree

### Step 3: Design Decision Tree
Para cada grupo de conceitos:
1. Nomear o branch pelo que o dev quer FAZER (não pelo conceito teórico)
   - BOM: "Criando rotas", "Configurando autenticação"
   - RUIM: "HTTP Routing Patterns", "Authentication Configuration"
2. Ordenar skills dentro do branch por progressão (fundamentals → advanced)
3. Limitar a 15 skills por branch

### Step 4: Engineer Router Description
Usar fórmula do extraction-prompt.md Phase 2:
- 3rd person verb
- What the domain covers
- 3-5 trigger phrases
- "Make sure to use whenever..."
- "Not for..." referenciando routers vizinhos

### Step 5: Copy Skills to Router Directory
```bash
# Para cada skill que entra no router:
cp skills-output/{course}/rs-{course}-{slug}/SKILL.md \
   .claude/skills/rs-{domain}/references/rs-{course}-{slug}.md
```
Note: Na pasta references/ do router, o SKILL.md da skill individual vira um .md nomeado.

### Step 6: Write Router SKILL.md
Formato:
```markdown
---
name: rs-{domain}
description: "..."
---

# {Domain Title}

> {Core principle}

## Decision Tree

### {Branch 1}
- [{skill}](references/{file}.md) — {description}
...
```

### Step 7: Validate
- [ ] Router < 200 linhas
- [ ] Max 12 top-level branches
- [ ] Max 15 skills per branch
- [ ] Description não conflita com routers existentes
- [ ] Todas as skills linkadas existem em references/
- [ ] Cross-references adicionadas para duplicatas

## Output
```
.claude/skills/rs-{domain}/
├── SKILL.md          # Router com decision tree
└── references/       # Skills individuais
    ├── rs-{course}-{slug-1}.md
    ├── rs-{course}-{slug-2}.md
    └── ...
```

## Veto Conditions
- Router > 200 linhas → decompose em sub-branches ou split
- Description overlap >50% com router existente → merge em vez de criar novo
- Branch com >15 skills → split em sub-branches

## Completion Criteria
- [ ] Router SKILL.md criado/atualizado
- [ ] Todas as skills copiadas para references/
- [ ] Decision tree com branches nomeados por ação
- [ ] Description com trigger phrases e "Not for"
- [ ] Deduplicação aplicada
- [ ] course-coverage.yaml atualizado
