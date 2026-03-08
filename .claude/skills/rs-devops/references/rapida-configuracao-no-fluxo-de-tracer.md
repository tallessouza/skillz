---
name: rs-devops-rapida-configuracao-no-fluxo-de-tracer
description: "Applies Grafana Loki-Tempo bidirectional navigation patterns when configuring observability datasources. Use when user asks to 'link logs to traces', 'configure derived fields', 'setup tracesToLogsV2', 'navigate from log to trace', or 'integrate loki with tempo'. Enforces YAML-based datasource configuration with proper UIDs. Make sure to use this skill whenever configuring Grafana observability stack. Not for application instrumentation, Kubernetes manifests, or CI/CD pipelines."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observability-grafana
  tags: [grafana, loki, tempo, traces, logs, derived-fields, datasource, observability]
---

# Navegacao Bidirecional Logs-Traces no Grafana

> Configure campos derivados no Loki e tracesToLogsV2 no Tempo para navegar entre logs e traces com um clique.

## Rules

1. **Configure no datasource YAML, nao na UI** — use o arquivo `datasources.yaml` dentro de `config/grafana/datasources/`, porque garante reproducibilidade via Docker
2. **Loki aponta pro Tempo via derived fields** — o campo derivado usa o `traceId` do log como link para o Tempo, porque a investigacao sempre parte do log
3. **Tempo aponta pro Loki via tracesToLogsV2** — configure tags, time range e custom query no Tempo, porque permite voltar do trace ao log com contexto
4. **Defina datasourceUid em ambos os lados** — sem o UID correto o link aparece mas nao redireciona, porque o Grafana precisa saber qual datasource consultar
5. **Limpe volumes e cache ao testar** — `docker volume prune` + `docker system prune` antes de resubir, porque o Grafana cacheia configuracoes de datasource

## Steps

### Step 1: Configurar Loki → Tempo (derived fields)

No datasource do Loki, adicione `jsonData` com `derivedFields`:

```yaml
# datasources.yaml - secao do Loki
- name: loki
  type: loki
  uid: loki
  jsonData:
    derivedFields:
      - name: traceId
        matcherType: label
        matcherRegex: ""
        url: "${__value.raw}"
        urlDisplayLabel: traces
        datasourceUid: tempo
```

**Campos chave:**
- `matcherType: label` — busca pelo label `traceId` no log (nao por regex)
- `urlDisplayLabel: traces` — nome do link que aparece no log
- `datasourceUid: tempo` — UID do datasource Tempo configurado

### Step 2: Configurar Tempo → Loki (tracesToLogsV2)

No datasource do Tempo, adicione `jsonData` com `tracesToLogsV2`:

```yaml
# datasources.yaml - secao do Tempo
- name: tempo
  type: tempo
  uid: tempo
  jsonData:
    tracesToLogsV2:
      datasourceUid: loki
      spanStartTimeShift: -1h
      spanEndTimeShift: 1h
      filterByTraceID: false
      filterBySpanID: false
      customQuery: true
      query: "{${__tags}} | trace_id=\"${__span.traceId}\""
      tags:
        - key: service.name
          value: service_name
```

**Campos chave:**
- `spanStartTimeShift: -1h` / `spanEndTimeShift: 1h` — janela de tempo ampla para nao perder logs
- `tags` com `service.name` → `service_name` — mapeia o atributo OTel para o label indexado no Loki
- `query` usa `${__tags}` (das tags definidas) e `${__span.traceId}` (do trace atual)

### Step 3: Reiniciar com cache limpo

```bash
docker-compose down
docker volume prune -f
docker system prune -f
docker-compose up -d
# Se der erro de volume na primeira vez, rode novamente
docker-compose up -d
```

## Verification

1. Gere requests que produzam logs com traceId
2. No Grafana Explorer → Loki: verifique se aparece o link "traces" nos logs
3. Clique no link — deve redirecionar para o trace correspondente no Tempo
4. No Grafana Explorer → Tempo: verifique se aparece opcao "Logs" no trace
5. Se o link inverso (Tempo→Loki) nao aparecer, pode ser cache — aguarde algumas execucoes

## Error handling

- Se o link nao aparece no Loki: verifique se `datasourceUid` do Tempo esta correto e se o log possui o label `traceId`
- Se o redirect nao funciona: confirme que o UID no YAML corresponde ao `uid` definido no datasource do Tempo
- Se Tempo→Loki nao funciona mas Loki→Tempo sim: verifique se `datasourceUid: loki` esta definido no `tracesToLogsV2` (erro mais comum)
- Se nada muda apos editar o YAML: o Grafana cacheia datasources — remova volumes Docker e reinicie

## Heuristics

| Situacao | Acao |
|----------|------|
| Investigando erro a partir de um alerta | Va ao Loki, ache o log, clique no link "traces" |
| Analisando latencia de um trace | Use Tempo, clique em "Logs" para ver contexto |
| traceId nao aparece no log | Verifique se o OpenTelemetry esta injetando traceId nos logs |
| Link aparece mas redireciona errado | Confira o `datasourceUid` — deve ser o UID exato do datasource alvo |

## Troubleshooting

### Link de traces aparece no log mas redireciona para trace vazio
**Symptom:** Clicando no link "traces" no Loki, o Tempo abre mas nao encontra o trace
**Cause:** `datasourceUid` no derived field nao corresponde ao UID real do datasource Tempo configurado
**Fix:** Verificar que o `uid` definido na secao do Tempo no datasources.yaml corresponde exatamente ao `datasourceUid` usado no derived field do Loki

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Navegacao Bidirecional Logs-Traces

## Por que essa configuracao importa

O fluxo natural de investigacao de problemas em observabilidade e: **alerta → log → trace**. Sem a configuracao de campos derivados, o processo e manual: voce ve um log com traceId, copia o ID, vai ate o Tempo, cola e busca. Isso e lento e propenso a erro.

Com a configuracao bidirecional, um unico clique leva do log ao trace (e vice-versa), reduzindo drasticamente o tempo de investigacao.

## Campos Derivados (Derived Fields) no Loki

O conceito de campo derivado no Loki permite criar links dinamicos baseados em valores de labels ou padroes regex nos logs. O instrutor escolheu `matcherType: label` em vez de regex porque o `traceId` ja esta indexado como label — nao ha necessidade de expressao regular.

O `url: "${__value.raw}"` pega o valor bruto do campo e usa como identificador para redirecionar ao Tempo. O `urlDisplayLabel` define o texto clicavel — sem ele, o Grafana mostra "tempo" como nome generico.

## tracesToLogsV2 no Tempo

A configuracao `tracesToLogsV2` e a versao mais recente (v2) da integracao Tempo→Loki. Pontos importantes:

- **Time range shift**: O instrutor usa `-1h` para tras e `+1h` para frente. Isso cria uma janela de 2 horas centrada no span, garantindo que logs relacionados sejam encontrados mesmo com pequenas diferencas de timing.

- **Tags como mapeamento**: A tag `service.name` (atributo OpenTelemetry) e mapeada para `service_name` (label indexado no Loki). Essa traducao e necessaria porque o OTel usa pontos e o Loki usa underscores na indexacao.

- **Custom query**: A query `{${__tags}} | trace_id="${__span.traceId}"` combina o filtro por service name (via tags) com o filtro por trace ID especifico. O `${__tags}` e expandido automaticamente com base nas tags definidas.

- **filterByTraceID e filterBySpanID como false**: O instrutor desabilitou ambos para evitar filtros automaticos que poderiam "baguncar" a query customizada. A filtragem e feita explicitamente na custom query.

## Problema de Cache

O instrutor encontrou um problema real: apos reconfigurar e reiniciar os containers, a navegacao Tempo→Loki nao funcionou imediatamente. Ele identificou como cache local do Grafana — um problema conhecido quando se sobe/desce containers repetidamente. A solucao e limpar volumes Docker completamente e, se necessario, aguardar algumas execucoes.

## Ferramentas de mercado vs. internalizado

O instrutor menciona brevemente que essa configuracao manual e o que voce faz ao internalizar a stack (Grafana + Loki + Tempo). Ferramentas de mercado como Datadog, New Relic, etc., oferecem essa correlacao log-trace nativamente, sem configuracao manual. A tradeoff e custo vs. controle.

---

# Code Examples: Navegacao Bidirecional Logs-Traces

## Exemplo completo do datasources.yaml

```yaml
apiVersion: 1

datasources:
  # Loki - Log aggregation
  - name: loki
    type: loki
    access: proxy
    uid: loki
    url: http://loki:3100
    jsonData:
      derivedFields:
        - name: traceId
          matcherType: label
          matcherRegex: ""
          url: "${__value.raw}"
          urlDisplayLabel: traces
          datasourceUid: tempo

  # Tempo - Distributed tracing
  - name: tempo
    type: tempo
    access: proxy
    uid: tempo
    url: http://tempo:3200
    jsonData:
      tracesToLogsV2:
        datasourceUid: loki
        spanStartTimeShift: -1h
        spanEndTimeShift: 1h
        filterByTraceID: false
        filterBySpanID: false
        customQuery: true
        query: "{${__tags}} | trace_id=\"${__span.traceId}\""
        tags:
          - key: service.name
            value: service_name
```

## Breakdown da query customizada

```
{${__tags}} | trace_id="${__span.traceId}"
```

Expandida, fica algo como:

```
{service_name="AppSkillzCity2"} | trace_id="abc123def456"
```

Onde:
- `${__tags}` → expandido para `service_name="AppSkillzCity2"` (baseado na tag configurada)
- `${__span.traceId}` → expandido para o trace ID real do span selecionado

## Configuracao do derived field — variantes

### Com matcherType label (usado na aula)

```yaml
derivedFields:
  - name: traceId
    matcherType: label
    matcherRegex: ""
    url: "${__value.raw}"
    urlDisplayLabel: traces
    datasourceUid: tempo
```

### Com matcherType regex (alternativa)

```yaml
derivedFields:
  - name: traceId
    matcherType: regex
    matcherRegex: "trace_id=(\\w+)"
    url: "${__value.raw}"
    urlDisplayLabel: traces
    datasourceUid: tempo
```

Use regex quando o traceId nao esta como label separado, mas embutido no corpo do log.

## Comandos Docker para reset completo

```bash
# Parar tudo
docker-compose down

# Limpar volumes (remove dados do Grafana, Loki, Tempo)
docker volume prune -f

# Limpar cache de build
docker system prune -f

# Subir novamente (pode precisar rodar 2x se volume nao existir)
docker-compose up -d

# Se der erro de pasta de volume na primeira vez:
docker-compose up -d
```

## Fluxo de verificacao no Grafana

1. **Gerar logs**: Acesse o endpoint da aplicacao para gerar requests com traces
2. **Explorer → Loki**: Selecione o service name (ex: `AppSkillzCity2`)
3. **Verificar link**: Nos logs com traceId, deve aparecer link "traces"
4. **Clicar**: Redireciona ao Tempo com o trace correspondente
5. **Explorer → Tempo**: No trace, verificar se aparece opcao "Logs for this span"
6. **Clicar**: Redireciona ao Loki com query filtrada por service name + trace ID
