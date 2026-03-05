# Deep Explanation: Configurando o Prometheus

## Mimir como Time Series Database

O Mimir e um banco de dados de series temporais (TSDB) escalavel, desenvolvido especificamente para metricas e compativel com o formato Prometheus. Por isso, no Grafana, o Mimir aparece com `type: prometheus` — ele fala o mesmo "idioma" que o Prometheus.

A separacao de responsabilidades fica assim:
- **Mimir**: armazena e serve metricas da aplicacao (long-term storage)
- **Prometheus**: monitora o proprio stack de observabilidade (scrape health, targets up/down)

Essa separacao permite que voce use o Prometheus para entender "como as metricas estao sendo enviadas" e o Mimir para "o que a aplicacao esta fazendo".

## Remote Write Receiver

O protocolo `remote_write` permite que outros servicos (como o OpenTelemetry Collector) enviem metricas diretamente ao Prometheus via HTTP POST. Por padrao, o Prometheus so faz **pull** (scrape). Para aceitar **push**, e necessario ativar explicitamente com:

```
--web.enable-remote-write-receiver
```

Isso ja estava configurado no OpenTelemetry Collector (exportador `prometheusremotewrite`), entao o Prometheus precisa estar preparado para receber.

## Scrape Interval e Evaluation Interval

- **scrape_interval**: de quanto em quanto tempo o Prometheus busca metricas nos targets. 10s = near real-time. 1min = default.
- **evaluation_interval**: de quanto em quanto tempo o Prometheus avalia as recording rules e alerting rules.

Mesmo que voce queira manter o default de 1 minuto, o instrutor enfatiza: **declare explicitamente**. Configuracao declarativa evita que alguem no futuro se pergunte "qual e o intervalo?" — esta escrito no arquivo.

## Honor Labels

Quando `honor_labels: true`, o Prometheus respeita os labels que ja vem no payload das metricas (do OpenTelemetry, por exemplo) ao inves de sobrescrever com seus proprios labels. Isso evita conflitos e perda de informacao.

## Rede Docker e DNS Interno

Dentro do Docker Compose, todos os servicos compartilham a mesma rede por padrao. O Prometheus consegue resolver `otel-collector:8889` porque o Docker DNS interno resolve o nome do servico para o IP do container. Por isso:
- Nos targets, use o **nome do servico** (nao localhost, nao IP)
- Portas internas do container sao acessiveis entre servicos sem precisar de `ports:` — bastaria `expose:`

O instrutor menciona que expor a porta 8889 na interface nao seria estritamente necessario para o Prometheus acessar, pois estao na mesma rede. E feito mais para visibilidade e debugging.

## Portas do OpenTelemetry Collector

O collector tem multiplas portas com funcoes distintas:

| Porta | Funcao | Protocolo |
|-------|--------|-----------|
| 4317 | Receiver OTLP | gRPC |
| 4318 | Receiver OTLP | HTTP |
| 8888 | Self-monitoring do collector | Prometheus scrape |
| 8889 | Export de metricas coletadas | Prometheus scrape |
| 1888 | pprof (profiling) | HTTP |
| 13133 | Health check | HTTP |
| 55679 | zPages (debug) | HTTP |

## Sobre Tempo (Grafana Tempo)

O instrutor tambem aproveita para ajustar o servico do Tempo no Docker Compose: remove o `ports:` e usa `expose:` para as portas 3200, 4317, 4318. Isso porque o Tempo nao precisa ser acessado diretamente pela interface do host — apenas por outros servicos dentro da rede Docker.

## Datasource do Grafana

O Grafana precisa de um datasource configurado para cada fonte de dados. A configuracao via arquivo (provisioning) permite que o datasource exista automaticamente ao subir o container, sem configuracao manual na UI.

Diferencas entre o datasource do Mimir e do Prometheus:
- Mimir: URL inclui path `/prometheus` (ex: `http://mimir:9009/prometheus`)
- Prometheus: URL e apenas `http://prometheus:9090` (sem path adicional)