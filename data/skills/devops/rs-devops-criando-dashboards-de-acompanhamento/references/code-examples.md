# Code Examples: Criando Dashboards de Acompanhamento no Grafana

## 1. Criando uma Folder

```
Grafana UI:
1. Menu lateral > Dashboards
2. Clicar em "New" > "New Folder"
3. Nome: "Skillz"
4. Save
```

Resultado: uma folder que pode conter multiplos dashboards, similar a um diretorio.

## 2. Criando um Dashboard dentro da Folder

```
Grafana UI:
1. Entrar na folder "Skillz"
2. Clicar em "Create Dashboard"
3. Escolher "Add visualization"
```

## 3. Painel de Logs com Loki

```
Grafana UI — Add Panel:
1. Data Source: Loki
2. Query Builder:
   - Label: service_name
   - Value: "app-skillz-seat-exemplo"
3. Visualization: Table (trocar de Time Series para Table)
4. Run Query
5. Panel title: "Logs da App 1"
6. Description: "Exibicao dos logs da aplicacao"
7. Links: adicionar runbooks relevantes
8. Save
```

**Erro comum demonstrado na aula:**
- Selecionar Loki como data source mas manter "Time Series" como visualizacao
- Resultado: painel vazio/bugado
- Correcao: mudar para "Table"

## 4. Painel de Metricas com Prometheus

```
Grafana UI — Add Panel:
1. Data Source: Prometheus
2. Query: (sua query PromQL)
3. Visualization: Time Series (padrao, correto para metricas)
4. Configurar opcoes de tempo, refresh
5. Save
```

## 5. Adicionando Rows para Organizacao

```
Grafana UI — Dashboard Edit:
1. Add > Row
2. Renomear Row: "Logs"
3. Arrastar paineis de log para dentro da Row
4. Add > Row
5. Renomear Row: "Metricas"
6. Arrastar paineis de metricas para dentro
7. Save Dashboard
```

## 6. Criando Variavel de Environment

```
Grafana UI — Dashboard Settings > Variables:
1. Add Variable
2. Name: environment
3. Label: Environment
4. Type: Custom
5. Custom options: staging, producao
   (separados por virgula)
6. Preview: deve mostrar "staging" e "producao" como opcoes
7. Apply
```

### Usando a variavel na query do painel:

```
Label filter na query Loki:
  {service_name="app-skillz-seat-exemplo", environment="$environment"}
```

Quando o usuario muda o dropdown de "staging" para "producao", a query automaticamente filtra pelo environment selecionado.

## 7. Import/Export de Dashboard

### Exportar:
```
Dashboard Settings > JSON Model > Copiar JSON
```

### Importar:
```
Grafana UI:
1. Dashboards > New > Import
2. Colar JSON ou upload de arquivo .json/.txt
3. Configurar data sources
4. Import
```

## 8. Versionamento e Rollback

```
Grafana UI — Dashboard Settings > Versions:
- Lista todas as versoes com:
  - Numero da versao
  - Data da alteracao
  - Quem alterou (quando autenticado)
- Para rollback: selecionar versao anterior > Restore
```

## 9. Opcoes de Visualizacao Disponiveis

| Tipo | Uso ideal | Data source tipico |
|------|-----------|-------------------|
| Time Series | Metricas ao longo do tempo | Prometheus |
| Table | Lista de logs/eventos | Loki |
| Gauge | Valor unico atual | Prometheus |
| Bar Chart | Comparacao de valores | Prometheus |
| Heatmap | Distribuicao de valores | Prometheus |
| Histogram | Eventos de histograma | Prometheus (histogram_bucket) |
| Traces | Rastreamento distribuido | Tempo |

## 10. Configuracoes do Painel

```
Panel Options:
- Title: nome descritivo do painel
- Description: contexto sobre o que o painel mostra
- Links: URLs de runbooks ou documentacao
- Transparent background: opcao estetica

Standard Options:
- Unit: unidade de medida (ms, bytes, percent, etc.)
- Decimals: casas decimais
- Thresholds: limites visuais (cores por faixa de valor)

Query Options:
- Limit: numero maximo de resultados
- Interval: intervalo de tempo entre pontos
- Time range: override do range do dashboard
```