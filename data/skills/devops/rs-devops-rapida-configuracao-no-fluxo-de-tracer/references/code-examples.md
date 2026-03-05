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