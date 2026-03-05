# Code Examples: Diagnostico Cultural DevOps com CALMS

## Nota sobre esta aula

Esta aula e conceitual/cultural — nao contem exemplos de codigo. Os "exemplos" sao cenarios de processo. Abaixo, traduzo os cenarios do instrutor em formatos acionaveis.

## Cenario 1: Branch Policy como mitigacao

O instrutor menciona branch policy como solucao para deploys nao autorizados.

```yaml
# Exemplo de branch protection (GitHub)
# Settings > Branches > Branch protection rules

branch_protection:
  branch: main
  rules:
    require_pull_request: true
    required_approving_reviews: 1        # "pelo menos uma pessoa aprovadora"
    dismiss_stale_reviews: true
    require_status_checks: true
    require_branches_up_to_date: true
    restrict_pushes: true                 # Impede push direto em main
```

```bash
# GitHub CLI - configurar branch protection
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field enforce_admins=true
```

## Cenario 2: Template de Post-mortem

Baseado nas perguntas que o instrutor levanta durante a aula:

```markdown
# Post-mortem: [Titulo do Incidente]

**Data:** YYYY-MM-DD
**Severidade:** P1/P2/P3
**Duracao:** XX minutos
**Responsavel pelo post-mortem:** [Nome]

## O que aconteceu?
[Descricao factual do incidente, sem atribuir culpa]

## Linha do tempo
- HH:MM — [Evento]
- HH:MM — [Deteccao]
- HH:MM — [Acao tomada]
- HH:MM — [Resolucao]

## Por que aconteceu?
[Analise de causa raiz — foco em PROCESSO, nao pessoa]

## Qual furo de processo permitiu isso?
[Ex: "Nao havia branch policy impedindo deploy direto em main"]

## Acoes tomadas (imediatas)
- [ ] [Acao 1]
- [ ] [Acao 2]

## Acoes para mitigacao futura
- [ ] [Acao 1 — ex: implementar branch policy]
- [ ] [Acao 2 — ex: adicionar testes de contrato]
- [ ] [Acao 3 — ex: configurar alertas]

## Aprendizados
[O que o time aprendeu com este incidente]
```

## Cenario 3: Checklist de diagnostico cultural

Traduzindo as perguntas do instrutor em formato de avaliacao:

```yaml
# diagnostico-cultural-devops.yaml
# Baseado no CALMS - Dimensao C (Culture)

diagnostico:
  nome: "Diagnostico Cultural DevOps"
  referencia: "The DevOps Handbook - CALMS Framework"

  perguntas:
    - id: 1
      pergunta: "Quando ocorre um incidente, a equipe busca culpado individual?"
      resposta_devops: "Nao — resolve como time, foco no processo"
      resposta_anti_devops: "Sim — busca quem causou o problema"
      peso: alto

    - id: 2
      pergunta: "Apos corrigir um incidente, existe processo de post-mortem?"
      resposta_devops: "Sim — reuniao para entender causa, mitigar, documentar acoes"
      resposta_anti_devops: "Nao — corrigiu e segue em frente"
      peso: alto

    - id: 3
      pergunta: "Deploys em producao exigem aprovacao de pelo menos uma pessoa?"
      resposta_devops: "Sim — branch policy com aprovador obrigatorio"
      resposta_anti_devops: "Nao — qualquer pessoa pode deployar a qualquer momento"
      peso: medio

    - id: 4
      pergunta: "Incidentes similares se repetem com frequencia?"
      resposta_devops: "Raramente — acoes mitigatorias sao implementadas"
      resposta_anti_devops: "Sim — mesmo tipo de problema recorrente"
      peso: alto

    - id: 5
      pergunta: "Existe cultura de testes (unitarios, contrato, integracao)?"
      resposta_devops: "Sim — testes fazem parte do pipeline"
      resposta_anti_devops: "Nao — deploys sem cobertura de testes"
      peso: medio

  avaliacao:
    0_2_devops: "Distante da cultura DevOps — iniciar transformacao cultural"
    3_4_devops: "Em transicao — fortalecer praticas existentes"
    5_devops: "Cultura DevOps presente — manter e evoluir"
```