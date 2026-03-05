# Code Examples: Dashboards com Metricas Customizadas

## Fluxo completo de criacao de dashboard no Grafana

### 1. Criar o dashboard

Dentro da pasta organizada (ex: "Skillz"):
- Add → Row → Nomear como "Metricas"
- Add → Visualization

### 2. Configurar painel com counter

```
Data source: Prometheus
Metrica: hello_success_total
Label filter: service_name = "app-skillz"
```

Resultado: grafico Time Series mostrando chamadas de sucesso ao longo do tempo.

### 3. Configurar threshold

Na aba de configuracao do painel:
```
Thresholds:
  - Base: verde (green)
  - 30: vermelho (red)
```

Isso faz com que quando o valor ultrapasse 30, a visualizacao mude para vermelho.

### 4. Painel de histograma (request duration)

```
Data source: Prometheus
Metrica: request_duration_bucket
Label filter: service_name = "app-skillz"
Visualization type: Histogram
```

O Histogram e mais apropriado que Time Series para metricas de duracao porque segmenta visualmente por bucket.

### 5. Salvar dashboard

Ao salvar:
- O Grafana mostra o diff do JSON alterado
- Permite adicionar comentario (como um commit message)
- Funciona como versionamento do dashboard

### 6. Organizar com rows

```
Dashboard
├── Row: Metricas de Erro
│   ├── Painel: hello_error_total (Time Series, threshold vermelho)
│   └── Painel: request_duration_bucket (Histogram)
├── Row: Acompanhamento
│   └── Painel: hello_success_total (Time Series)
```

### 7. Filtro por environment

Adicionar variavel de dashboard:
```
Variable name: environment
Type: Query
Data source: Prometheus
Query: label_values(environment)
```

Usar nos paineis:
```promql
hello_success_total{service_name="app-skillz", environment="$environment"}
```

### Metricas disponiveis na aplicacao (app1/appService)

| Metrica | Tipo | Descricao |
|---------|------|-----------|
| `hello_success_total` | Counter | Chamadas com sucesso |
| `hello_error_total` | Counter | Chamadas com erro |
| `request_duration_bucket` | Histogram | Duracao das requisicoes |