---
name: rs-devops-rapida-config-fluxo-tracer
description: "Configures bidirectional navigation between Grafana Loki logs and Tempo traces using derived fields and tracesToLogsV2. Use when user asks to 'link logs to traces', 'configure Grafana datasources', 'navigate from log to trace', 'derived fields Loki', or 'tracesToLogsV2 Tempo'. Make sure to use this skill whenever setting up observability correlation between logs and traces in Grafana. Not for alerting, dashboards, or metric configuration."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
