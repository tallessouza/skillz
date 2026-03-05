# Code Examples: Alertas no Loki com count_over_time

## Exemplo 1: Query basica com count_over_time

Demonstrado na aula — a forma mais simples de transformar logs em algo alertavel:

```logql
# Antes (nao funciona como alerta):
{job="my-app"}

# Depois (contavel, funciona como alerta):
count_over_time({job="my-app"}[5m])
```

## Exemplo 2: Condicao de alerta no Grafana

Configuracao da condicao no painel de alertas:

```yaml
# Query A (Loki datasource):
count_over_time({job="my-app"}[5m])

# Expression B (Classic condition):
WHEN last() OF A IS ABOVE 0

# Isso significa: se houve qualquer log nos ultimos 5 minutos, dispare o alerta
```

## Exemplo 3: Filtrando por erro

```logql
# Conta logs que contem a palavra "error" nos ultimos 5 minutos
count_over_time({job="my-app"} |= "error"[5m])
```

## Exemplo 4: Filtrando por status code 500

```logql
# Se os logs sao JSON e tem campo status_code:
count_over_time({job="my-app"} | json | status_code="500"[5m])

# Se o status code aparece no texto do log:
count_over_time({job="my-app"} |= "status=500"[5m])
```

## Exemplo 5: Combinando filtros

```logql
# Erros 500 no servico de pagamento
count_over_time(
  {job="payment-service", environment="production"} 
  | json 
  | level="error" 
  | status_code="500"
  [5m]
)
```

## Exemplo 6: Thresholds diferentes por severidade

```yaml
# Alerta CRITICO: qualquer erro 500
count_over_time({job="api"} | json | status_code="500"[1m]) > 0

# Alerta WARNING: muitos erros 4xx (mais de 50 em 5 min)
count_over_time({job="api"} | json | status_code=~"4.."[5m]) > 50

# Alerta INFO: volume alto de logs (mais de 1000 em 5 min)
count_over_time({job="api"}[5m]) > 1000
```

## Exemplo 7: Extraindo query de dashboard para alerta

Se voce tem um painel no Grafana com esta query:

```logql
# Query do dashboard (mostra logs):
{job="my-app"} |= "error" | json | line_format "{{.message}}"
```

Para transformar em alerta, remova formatacao visual e adicione `count_over_time`:

```logql
# Query adaptada para alerta:
count_over_time({job="my-app"} |= "error"[5m])
```

## Exemplo 8: Configuracao completa de alert rule no Grafana (JSON)

```json
{
  "alert": {
    "name": "Loki Error Alert",
    "conditions": [
      {
        "evaluator": { "type": "gt", "params": [0] },
        "operator": { "type": "and" },
        "query": { "params": ["A", "5m", "now"] },
        "reducer": { "type": "last" }
      }
    ],
    "frequency": "1m",
    "for": "5m"
  },
  "targets": [
    {
      "datasource": "Loki",
      "expr": "count_over_time({job=\"my-app\"} |= \"error\"[5m])"
    }
  ]
}
```