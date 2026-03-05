# Deep Explanation: Debugando Metricas Auto-Instrumentadas

## O papel do Mimir vs Prometheus

O Mimir utiliza o Prometheus por debaixo dos panos. Quando voce consulta metricas no Mimir, esta usando PromQL do Prometheus. A diferenca e que o Mimir oferece armazenamento de longo prazo e multi-tenancy, mas a linguagem de query e a mesma.

## Por que ConsoleMetricExporter nao exporta de verdade

O `ConsoleMetricExporter` foi configurado propositalmente no inicio do curso para fins didaticos. Ele imprime as metricas no stdout da aplicacao (console), mostrando dados como:
- `http_server_duration` — tipo histograma, unidade milissegundos
- Start time / end time da requisicao
- Porta, status code
- Valor minimo, maximo, soma
- Distribuicao por buckets

Porem, essas informacoes ficam APENAS no console. Nao sao enviadas para nenhum backend (Prometheus, Mimir, etc). Por isso, ao olhar nos logs (Loki/Grafana), nao aparece nada — porque metricas nao sao logs.

## O erro UNAVAILABLE e o que ele significa

Quando o `OTLPMetricExporter` e criado sem URL, ele tenta conectar ao endpoint padrao. Se o collector nao estiver rodando nesse endereco, a aplicacao loga:

```
UNAVAILABLE - nao consegue estabelecer conexao
```

O componente que reporta o erro e o `PeriodicExportingMetricReader`, porque e ele quem periodicamente tenta enviar as metricas coletadas para o exporter.

A solucao e passar a URL explicitamente: `http://127.0.0.1:4317` (porta padrao do OpenTelemetry Collector para gRPC).

## Diferenciando metricas no Prometheus

No Prometheus, ao buscar `http`, voce vera dois tipos:
1. **`prometheus_http_*`** — metricas internas do proprio Prometheus (quantas requests o Prometheus recebeu, etc)
2. **`http_server_*`** — metricas da SUA aplicacao, enviadas via OpenTelemetry

O instrutor destaca que e facil confundir as duas. As metricas auto-instrumentadas da aplicacao NAO tem o prefixo `prometheus_`.

## PromQL e filtragem por service

Cada metrica carrega labels associados. Para aplicacoes OpenTelemetry, os labels incluem:
- `service_name` — nome do servico configurado no NodeSDK
- `service_version` — versao do servico
- `host_name` — hostname da maquina
- `instance` — instancia do collector

Quando voce tem multiplas aplicacoes no cluster, todas geram a mesma metrica `http_server_duration`. O filtro PromQL permite fazer scope:

```promql
http_server_duration{service_name="app-skillz", service_version="1.0.0"}
```

## Metricas auto-instrumentadas vs metricas customizadas

Esta aula cobre apenas metricas AUTO-INSTRUMENTADAS — geradas automaticamente pelo OpenTelemetry para cada requisicao HTTP. Exemplos:
- `http_server_duration` — histograma de duracao
- `http_server_request_count` — contagem total

Metricas CUSTOMIZADAS (ex: contar compras, incrementar erros de negocio) sao criadas manualmente na aplicacao e serao cobertas na proxima aula. O instrutor menciona o caso de uso: "quantas compras passaram pela minha API hoje" — isso seria uma metrica customizada, nao auto-instrumentada.

## Refatoracao do tracer.ts

O instrutor remove configuracoes deprecated do NodeSDK:
- `SimpleSpanProcessor` + `ConsoleSpanExporter` → desnecessarios quando `OTLPTraceExporter` ja esta configurado
- `ConsoleMetricExporter` → substituido por `OTLPMetricExporter` + `PeriodicExportingMetricReader`
- Log recorder processor → removido por enquanto

O resultado e uma configuracao mais enxuta onde cada pilar (traces, metrics, logs) tem seu exporter OTLP dedicado.

## Contexto dos tres pilares da observabilidade

Neste ponto do curso, a aplicacao ja tem:
1. **Traces** — via Tempo, para rastrear caminhos das requisicoes
2. **Logs** — via Loki, para registrar eventos da aplicacao
3. **Metrics** — via Prometheus/Mimir, agora com metricas auto-instrumentadas

O proximo passo e criar metricas customizadas para monitoramento de negocio (transacional) em vez de depender apenas de ferramentas de dados (ETL/analytics).