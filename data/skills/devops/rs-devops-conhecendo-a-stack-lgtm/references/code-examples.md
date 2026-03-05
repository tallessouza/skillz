# Code Examples: Stack LGTM

## Topologia basica dos containers

```yaml
# docker-compose.yml (visao geral — cada componente sera detalhado em aulas futuras)
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    # Conecta com Loki, Tempo, Mimir via datasources

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"
    # Recebe logs da aplicacao

  tempo:
    image: grafana/tempo
    ports:
      - "3200:3200"
    # Recebe traces via OpenTelemetry

  mimir:
    image: grafana/mimir
    ports:
      - "9009:9009"
    # Armazena metricas (time series)

  otel-collector:
    image: otel/opentelemetry-collector
    # Coleta e exporta para Loki, Tempo, Mimir
```

## Imagem all-in-one (para referencia/estudo)

```bash
# Rodar a imagem pre-pronta Hotel LGTM (NAO e o objetivo do curso)
docker run -d \
  --name otel-lgtm \
  -p 3000:3000 \
  -p 4317:4317 \
  -p 4318:4318 \
  grafana/otel-lgtm:latest

# Acesse Grafana em http://localhost:3000
# OpenTelemetry gRPC em :4317, HTTP em :4318
```

## Fluxo de dados

```
# Aplicacao envia dados para o OpenTelemetry Collector
# O Collector distribui para cada backend:

[App] --logs--> [OTel Collector] ---> [Loki :3100]
[App] --traces-> [OTel Collector] ---> [Tempo :3200]
[App] --metrics-> [OTel Collector] ---> [Mimir :9009]

# Grafana (:3000) conecta como datasource em cada um:
# - Datasource Loki: http://loki:3100
# - Datasource Tempo: http://tempo:3200
# - Datasource Mimir: http://mimir:9009
```

## Grafana Cloud (referencia — nao usado no curso)

```
# Ao criar stack no Grafana Cloud, voce recebe:
# Endpoint: https://seu-nome.grafana.net
# 
# Pre-configurado com:
# - Prometheus datasource
# - Loki datasource
# - Tempo datasource
# - Graphite datasource
# - K6 integrado
#
# Free trial: 14 dias
# URL: https://grafana.com → My Account → Add Stack
```