# Task: Analyze Transcript

## Purpose
Analisar transcrições de um curso Rocketseat, classificando cada aula e extraindo metadados estruturados que guiam a extração de skills.

## Agent
`@transcript-analyst`

## Input
- `rocketseat-scraper/transcricoes/{course}/manifest.json` — estrutura do curso
- `rocketseat-scraper/transcricoes/{course}/**/*.txt` — transcrições das aulas
- `data/mind-lenses.yaml` — heurísticas dos elite minds
- `data/course-coverage.yaml` — mapa de cobertura existente

## Process

### Step 1: Load Course Structure
```bash
cat rocketseat-scraper/transcricoes/{course}/manifest.json
```
Extrair: módulos, aulas, slugs, descrições.

### Step 2: Classify Each Lesson
Para cada aula:
1. Ler transcrição (primeiras 500 palavras geralmente suficientes para classificar)
2. Classificar tipo: `coding_lens` | `workflow` | `reference` | `meta`
3. Determinar dificuldade: `fundamentals` | `intermediate` | `advanced`
4. Classificar fase 3X: `explore` | `expand` | `extract`

### Step 3: Extract Concepts
Para cada aula não-meta:
1. Identificar conceitos-chave ensinados
2. Nomear com nomes canônicos (Repository, Observer, MVC, etc.)
3. Categorizar: `pattern` | `principle` | `tool` | `technique`

### Step 4: Cross-Reference
1. Ler SKILL.md de cada router em `.claude/skills/rs-*/SKILL.md`
2. Para cada conceito encontrado, verificar se já existe
3. Marcar: `duplicate` | `extends` | `prerequisite` | `new`

### Step 5: Map Lenses
Baseado no tipo e conceitos:
- Architecture decisions → [MF_01, MF_03, RH_01, DHH_02]
- Code quality → [LT_01, LT_02, GB_01, TH_04]
- Testing → [KB_02, AK_04]
- Deployment → [AK_03, DHH_01]
- Fundamentals → [TH_01, TH_02, TH_03]

## Output
`outputs/{course}/analysis.yaml` — ver formato no agent transcript-analyst.md

## Veto Conditions
- >30% aulas sem classificação → re-analisar com mais contexto
- Zero cross-references → verificar se routers foram consultados
- Conceitos sem nome canônico → pesquisar nome correto antes de prosseguir

## Completion Criteria
- [ ] Todas as aulas classificadas
- [ ] Conceitos nomeados com nomes canônicos
- [ ] Cross-references identificadas
- [ ] Lenses mapeadas
- [ ] analysis.yaml salvo em outputs/{course}/
