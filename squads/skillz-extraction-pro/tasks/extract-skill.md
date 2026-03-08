# Task: Extract Skill

## Purpose
Transformar transcrição analisada em SKILL.md de produção usando extraction-prompt.md + mind lenses.

## Agent
`@skill-extractor`

## Input
- `outputs/{course}/analysis.yaml` — classificação e metadados
- `rocketseat-scraper/transcricoes/{course}/{lesson}.txt` — transcrição
- `rocketseat-scraper/extraction-prompt.md` — prompt de extração base
- `data/mind-lenses.yaml` — heurísticas dos elite minds

## Process

### Step 1: Load Analysis
Ler `analysis.yaml` para a aula específica. Obter:
- Tipo (coding_lens / workflow / reference)
- Dificuldade e fase 3X
- Conceitos com nomes canônicos
- Lenses aplicáveis
- Cross-references

### Step 2: Skip Meta Lessons
Se tipo = `meta` (abertura, encerramento, boas-vindas):
- NÃO extrair skill
- Registrar no log: "SKIP {slug} — meta lesson"
- Prosseguir para próxima aula

### Step 3: Read Full Transcript
Ler transcrição completa. Extrair:
- Analogias e metáforas do instrutor
- Todo código mostrado (COMPLETO, não truncado)
- Raciocínio do instrutor (WHY chains)
- Erros comuns mencionados
- Conexões com outros conceitos

### Step 4: Apply Extraction Prompt
Usar `extraction-prompt.md` como base (Phases 1-7):
1. Confirmar tipo (já validado por analysis.yaml)
2. Engenheirar description com trigger phrases
3. Escrever instruções em forma imperativa
4. Estruturar body pelo template do tipo
5. Validar contra quality gates
6. Gerar name/slug
7. Produzir arquivos (SKILL.md + references/)

### Step 5: Apply Mind Lenses
Para cada lens indicada no analysis.yaml:
1. Ler heurística correspondente do mind-lenses.yaml
2. Avaliar se conteúdo da aula alinha ou conflita
3. Se ALINHA: reforçar como padrão validado
4. Se CONFLITA: adicionar nota de trade-off
5. Se FALTA: adicionar o que falta (ex: WHY ausente, TH_04)

### Step 6: Language Adaptation
Se curso NÃO é JavaScript/TypeScript:
- Adaptar code templates para a linguagem do curso
- Usar idioms da linguagem (Go error handling, Swift optionals, etc.)
- Manter code comments no idioma original quando apropriado

### Step 7: Quality Self-Check
Antes de salvar, validar:
- [ ] Frontmatter completo (name, description, metadata)
- [ ] Description 200-1024 chars com triggers
- [ ] Body < 300 lines
- [ ] Troubleshooting section presente
- [ ] Deep reference library no final
- [ ] Pelo menos 1 before/after example
- [ ] Sem "nesta aula", "vamos aprender"

## Output
```
skills-output/{course}/rs-{course}-{slug}/
├── SKILL.md
└── references/
    ├── deep-explanation.md
    └── code-examples.md
```

## Batch Execution
Para extração em lote, usar `batch-extract.py`:
```bash
python3 rocketseat-scraper/batch-extract.py --course {course} --parallel 3
```

## Veto Conditions
- SKILL.md sem frontmatter → rejeitar e re-extrair
- Description < 200 chars → genérica demais, re-engenheirar
- Sem código quando aula tem código → re-extrair
- Sem troubleshooting → adicionar antes de salvar

## Completion Criteria
- [ ] Todos os 3 arquivos gerados (SKILL.md + 2 references)
- [ ] Quality self-check passed
- [ ] Mind lenses aplicadas
- [ ] Language adaptation aplicada (se não-JS/TS)
