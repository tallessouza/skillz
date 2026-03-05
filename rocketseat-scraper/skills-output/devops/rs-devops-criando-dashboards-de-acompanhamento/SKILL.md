---
name: rs-devops-criando-dashboards-grafana
description: "Guides Grafana dashboard creation and organization when setting up observability. Use when user asks to 'create a dashboard', 'set up Grafana panels', 'organize monitoring views', 'add Grafana variables', or 'configure observability dashboards'. Covers folder structure, panel types, data source selection (Loki/Prometheus/Tempo), query building, dashboard variables, and versioning. Make sure to use this skill whenever building or organizing Grafana dashboards for monitoring. Not for alerting rules, Prometheus query language (PromQL), or infrastructure provisioning."
---

# Criando Dashboards de Acompanhamento no Grafana

> Organize dashboards em folders por aplicacao/time, monte queries pre-prontas por data source, e use variaveis para dashboards dinamicos.

## Rules

1. **Organize dashboards em folders** — crie folders por aplicacao ou time (ex: `Rocketseat`), porque sem organizacao os dashboards viram uma lista caótica impossivel de navegar
2. **Selecione o tipo de visualizacao correto para o data source** — Loki = Table view para logs, Prometheus = Time Series para metricas, Tempo = traces, porque usar Time Series para logs nao exibe nada util
3. **Use variaveis para dashboards dinamicos** — environment (staging/producao) como variavel evita duplicar dashboards inteiros, porque a aplicacao e a mesma, so muda o contexto
4. **Adicione contexto aos paineis** — titulo descritivo, descricao, e links de runbooks, porque quem olha o dash em emergencia precisa de contexto imediato
5. **Aproveite o versionamento built-in** — cada alteracao gera um JSON versionado com rollback, porque dashboards sao infraestrutura e precisam de rastreabilidade

## How to write

### Estrutura de folders

```
Grafana Dashboards/
├── {App ou Time}/           # Folder por aplicacao/time
│   ├── Logs App 1           # Dashboard de logs
│   ├── Logs App 2           # Dashboard de logs
│   ├── Metricas App 1       # Dashboard de metricas
│   └── Traces               # Dashboard de traces
```

### Painel de logs (Loki + Table)

```
Data source: Loki
Visualization: Table (NAO Time Series)
Query: selecionar service_name = "app-rocket-seat-exemplo"
Opcoes: limit, interval
```

### Variavel de environment

```
Settings > Variables > New Variable
Type: Custom
Name: environment
Label: Environment
Custom values: staging, producao
Referencia na query: $environment
```

### Rows para agrupamento

```
Dashboard > Add > Row
Nome: "Logs"
  └── Painel: Logs App 1
  └── Painel: Logs App 2
Row Nome: "Metricas"
  └── Painel: Request Duration
  └── Painel: Error Rate
```

## Example

**Before (sem organizacao):**
- Dashboards soltos na raiz do Grafana
- Um dashboard por environment (staging-logs, prod-logs)
- Paineis sem descricao ou links
- Logs exibidos como Time Series (nao mostra nada)

**After (com este skill aplicado):**
- Folder "Rocketseat" agrupa todos os dashboards do time
- Variavel `$environment` alterna entre staging/producao no mesmo dash
- Paineis com titulo descritivo, descricao e links de runbooks
- Logs exibidos como Table, metricas como Time Series
- Rows agrupam paineis por categoria (Logs, Metricas, Traces)

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado vem do Loki (logs) | Use Table view, nunca Time Series |
| Dado vem do Prometheus (metricas) | Use Time Series, Gauge, ou Histogram |
| Dado vem do Tempo (traces) | Use visualizacao de traces |
| Mesmo dash para multiplos environments | Crie variavel Custom com os valores |
| Precisa agrupar paineis por tema | Use Rows dentro do dashboard |
| Dashboard importado de outro Grafana | Use Import > JSON file |
| Precisa de rollback em alteracao | Use o versionamento built-in (Dashboard Settings > Versions) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Dashboards soltos na raiz | Organize em folders por app/time |
| Um dashboard por environment | Um dashboard com variavel `$environment` |
| Time Series para exibir logs | Table view para logs do Loki |
| Painel sem titulo/descricao | Titulo descritivo + descricao + links de runbook |
| Duplicar dashboard para importar | Export/Import via JSON |
| Editar dash sem verificar versao | Confie no versionamento, faca rollback se necessario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
