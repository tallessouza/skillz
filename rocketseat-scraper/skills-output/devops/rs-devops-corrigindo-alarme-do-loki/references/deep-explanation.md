# Deep Explanation: Alertas no Loki com count_over_time

## Por que logs nao sao metricas

O instrutor destaca uma distincao fundamental: **logs nao sao contaveis como metricas**. Metricas no Prometheus ja sao valores numericos (counters, gauges, histograms). Logs no Loki sao texto — entradas de texto com timestamps.

Alertas no Grafana funcionam com base em **calculos e quantidades**. Eles precisam de um numero para comparar com um threshold. Um log sozinho nao e um numero — e uma string. Por isso, a funcao `count_over_time` existe: ela **transforma entradas de log em uma contagem numerica** dentro de uma janela de tempo.

Sem essa transformacao, o motor de alertas do Grafana simplesmente nao consegue avaliar a condicao, e o alerta nunca dispara.

## O papel do count_over_time

`count_over_time` e uma funcao de agregacao temporal do LogQL. Ela:

1. Recebe um log stream (resultado de uma query LogQL com selectors e filtros)
2. Conta quantas entradas existem dentro da janela de tempo especificada (`[5m]`, `[1h]`, etc.)
3. Retorna um **valor numerico** que pode ser usado em condicoes de alerta

### Sintaxe

```
count_over_time({label_selector} | filtros [janela])
```

A janela de tempo (`[5m]`) define o periodo retroativo de contagem. Se voce usa `[5m]`, ele conta quantas entradas de log matcharam nos ultimos 5 minutos a cada avaliacao.

## Fluxo completo no Grafana

O instrutor demonstrou o fluxo:

1. Na tela de alertas do Grafana, criar uma nova regra
2. Na query, usar a fonte de dados Loki
3. Escrever a query LogQL com `count_over_time`
4. Na condicao, usar `WHEN last() OF [query] IS ABOVE 0`
5. O alerta dispara quando a contagem de logs excede o threshold

## Estrategias de filtragem

O instrutor mencionou que alem de contar todos os logs, voce pode refinar:

- **Filtro por texto**: `|= "error"` — busca logs que contenham a palavra "error"
- **Filtro por status code**: buscar por status code 500 especificamente
- **Combinacao de filtros**: multiplos pipes para refinar a busca

Isso permite criar alertas granulares — nao apenas "tem log novo", mas "tem log de erro 500 no servico X".

## Reutilizando queries de dashboards

Um ponto pratico mencionado: se voce ja tem um dashboard no Grafana mostrando logs, voce pode **extrair a query desse painel** e adapta-la para alerta. A unica diferenca e adicionar o `count_over_time` ao redor da query existente e definir o threshold.

## Metricas vs Logs para alertas

| Aspecto | Metrica (Prometheus) | Log (Loki) |
|---------|---------------------|------------|
| Natureza | Numerica | Texto |
| Precisa de count_over_time | Nao | Sim |
| Exemplo de query | `rate(http_requests_total[5m])` | `count_over_time({job="app"}[5m])` |
| Granularidade | Pre-definida pela metrica | Flexivel via filtros de texto |