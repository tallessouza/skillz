# Code Examples: Lean no DevOps

## Nota sobre exemplos

Esta aula e conceitual (pilar Lean do CALMS), sem codigo direto. Os exemplos abaixo traduzem os conceitos em artefatos praticos que um time DevOps usaria.

## Exemplo 1: Priorizacao de Backlog com Matriz Valor x Complexidade

```yaml
# backlog-prioritization.yaml
features:
  - name: "Cadastro basico de usuarios"
    value: high
    complexity: low
    decision: "DO_NOW"
    rationale: "Core do produto, valida hipotese principal"

  - name: "Integracao com 5 gateways de pagamento"
    value: high
    complexity: high
    decision: "SLICE"
    rationale: "Fatiar: comecar com 1 gateway, iterar conforme demanda"

  - name: "Tema dark mode"
    value: low
    complexity: low
    decision: "LATER"
    rationale: "Nao valida hipotese, fazer so se sobrar capacidade"

  - name: "Sistema de gamificacao complexo"
    value: low
    complexity: high
    decision: "DONT_DO"
    rationale: "Pior cenario: alto custo, baixo retorno"
```

## Exemplo 2: Fatiamento de Feature em User Stories

```markdown
## Horizonte: Sistema de Notificacoes

### MVP (Semana 1-2)
- [ ] Notificacao in-app basica (texto simples)
- [ ] Marcar como lida
→ Lancamento + coleta de feedback

### Iteracao 1 (se feedback positivo)
- [ ] Notificacao por email
- [ ] Preferencias de notificacao (on/off)

### Iteracao 2 (se metricas justificarem)
- [ ] Push notification mobile
- [ ] Agrupamento de notificacoes

### Descartado (se sem aderencia)
- [ ] Notificacao por SMS
- [ ] Sistema de digest semanal
```

## Exemplo 3: Smoke Test para Diagnostico Rapido

```yaml
# smoke-test.yaml (conceito mencionado pelo instrutor)
smoke_tests:
  - name: "Health check pos-deploy"
    endpoint: "/health"
    expected_status: 200
    timeout_seconds: 5
    on_failure: "rollback_automatic"

  - name: "Fluxo critico - cadastro"
    steps:
      - POST /api/users with valid payload
      - expect 201
    on_failure: "alert_team + rollback"

  - name: "Integracao banco de dados"
    query: "SELECT 1"
    expected: true
    on_failure: "alert_critical + rollback"

# Principio: o TIME descobre o erro, nao o cliente
# Diagnostico tem que ser automatico e imediato
```

## Exemplo 4: Decision Log para Experimentacao

```markdown
## Feature: Recomendacao de produtos

### Hipotese
Usuarios que veem recomendacoes compram 15% mais.

### MVP lancado
- Recomendacao simples baseada em categoria (2 dias de dev)
- Lancado para 10% dos usuarios

### Resultado (1 semana)
- Aumento de 3% em cliques, 0% em conversao
- Feedback: "recomendacoes nao parecem relevantes"

### Decisao
- **Nao descontinuar ainda** — fatiar mais fino
- Proxima iteracao: recomendacao baseada em historico de compra
- Se em 2 semanas nao melhorar → descontinuar

### Custo total ate agora
- 2 dias de desenvolvimento
- Aprendizado: categoria sozinha nao e suficiente
```