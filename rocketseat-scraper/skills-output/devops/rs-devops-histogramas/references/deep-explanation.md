# Deep Explanation: Histogramas no Prometheus

## O que e um histograma no contexto do Prometheus

No Prometheus, histograma nao e apenas um grafico — e um tipo de metrica que faz **distribuicao de valores observados**. Quando voce cria uma unica metrica do tipo histograma, o Prometheus automaticamente gera tres series temporais:

1. **`_bucket`** — Intervalos de distribuicao. Cada bucket tem um label `le` (less or equal) que define o limite superior. Exemplo: `le="250"` conta quantas observacoes foram <= 250ms.
2. **`_count`** — Total de observacoes registradas (equivalente a um counter simples).
3. **`_sum`** — Soma de todos os valores observados (permite calcular medias).

## Por que tres metricas e nao uma

O instrutor enfatiza que essa triade existe porque cada dimensao serve um proposito:
- **Bucket** permite responder "quantas requisicoes ficaram abaixo de X ms?" — essencial para SLOs
- **Count** permite saber o volume total de eventos
- **Sum / Count** juntos permitem calcular a media real

## O label `le` (less or equal)

O `le` e o label especial dos buckets. Ele funciona como um filtro cumulativo:
- `le="100"` = requisicoes que levaram ate 100ms
- `le="250"` = requisicoes que levaram ate 250ms (inclui as de le=100)
- `le="+Inf"` = todas as requisicoes (sempre presente)

O instrutor demonstra filtrando por `le="250"` para ver quantas metricas ficaram abaixo de 250ms.

## Formula de media com rate

A consulta chave demonstrada:

```promql
sum(rate(metric_bucket{service_name="app"}[5m]))
/
sum(rate(metric_count{service_name="app"}[5m]))
```

**Por que usar `rate()` e nao o valor direto?** Porque as metricas sao cumulativas (counters). O `rate()` calcula a taxa de mudanca por segundo dentro da janela de tempo, transformando valores acumulados em taxas instantaneas.

**Por que o `sum()`?** Para agregar todas as series (diferentes labels como rota, metodo HTTP, etc) em um unico valor.

## Filtragem por labels

O Prometheus permite filtrar por qualquer label presente na metrica:
- `service_name` — isolar por aplicacao
- `http_route` — isolar por endpoint especifico
- `http_method` — isolar por verbo HTTP
- `version` — isolar por versao da aplicacao

O instrutor destaca que isso e especialmente importante em ambientes distribuidos com multiplas instancias enviando metricas.

## Counter vs Histograma na instrumentacao manual

- **Counter**: usa `counter.add(valor)` — incrementa um acumulador. Gera metrica com sufixo `_total`.
- **Histograma**: usa `histogram.record(valor)` — registra uma observacao. Gera `_bucket`, `_count`, `_sum`.

Quando a auto-instrumentacao (OpenTelemetry) ja cria metricas HTTP, nao e necessario criar histogramas manuais para o mesmo dado. Histogramas manuais fazem sentido para metricas customizadas como "tempo de processamento entre servico A e B".

## Persistencia de metricas — problema critico

O instrutor demonstra que um `docker compose down` **perde todas as metricas**. Isso porque o Prometheus esta rodando stateless, sem volume persistente.

Solucoes mencionadas:
- **Volume persistente no Docker/Kubernetes** — manter dados entre restarts
- **Custo de armazenamento** — metricas geram volume significativo de dados, e o custo pode ser alto
- O Grafana em si nao precisa de persistencia especial porque e apenas um visualizador; o critico e o data source (Prometheus)

## Metricas internas do Prometheus

O proprio Prometheus expoe metricas sobre si mesmo no endpoint `/metrics`. Isso permite monitorar a saude do proprio cluster de observabilidade — tempo de scrape, quantidade de series, etc.