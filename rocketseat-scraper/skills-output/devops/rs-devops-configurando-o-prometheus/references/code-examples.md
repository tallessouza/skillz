# Code Examples: Configurando o Prometheus

## Docker Compose completo do Prometheus

```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: prometheus
  restart: always
  ports:
    - "9090:9090"
  command:
    - '--web.enable-remote-write-receiver'
    - '--config.file=/etc/prometheus/prometheus.yaml'
  volumes:
    - ./config/prometheus/prometheus.yaml:/etc/prometheus/prometheus.yaml
```

### Notas:
- `command` e uma lista YAML — cada flag e um item separado
- As flags ficam entre aspas simples para evitar problemas com caracteres especiais
- O volume monta o arquivo local diretamente no path esperado pelo Prometheus

## prometheus.yaml completo

```yaml
global:
  scrape_interval: 10s
  evaluation_interval: 10s

scrape_configs:
  - job_name: prometheus
    honor_labels: true
    static_configs:
      - targets:
          - localhost:9090

  - job_name: otel-collector
    metrics_path: /metrics
    honor_labels: true
    static_configs:
      - targets:
          - otel-collector:8889
```

### Variacao: intervalo de 30 segundos (menos carga)

```yaml
global:
  scrape_interval: 30s
  evaluation_interval: 30s
```

### Variacao: multiplos targets no mesmo job

```yaml
scrape_configs:
  - job_name: application-exporters
    static_configs:
      - targets:
          - service-a:8889
          - service-b:8889
          - service-c:8889
```

## Portas do OpenTelemetry Collector

```yaml
otel-collector:
  ports:
    - "4317:4317"   # gRPC receiver
    - "4318:4318"   # HTTP receiver
    - "8888:8888"   # Prometheus collector self-metrics
    - "8889:8889"   # Prometheus metrics exporter
    - "1888:1888"   # pprof extension
    - "13133:13133" # health_check extension
    - "55679:55679" # zpages extension
```

## Ajuste de portas do Mimir (evitar conflito)

### Antes (conflito com Prometheus):
```yaml
mimir:
  ports:
    - "9090:9090"  # CONFLITO: mesma porta do Prometheus
```

### Depois:
```yaml
mimir:
  ports:
    - "9009:9009"  # Porta propria, sem conflito
```

## Ajuste do Tempo (expose vs ports)

### Antes:
```yaml
tempo:
  ports:
    - "3200:3200"
    - "4317:4317"
    - "4318:4318"
```

### Depois (apenas expose interno):
```yaml
tempo:
  expose:
    - "3200"
    - "4317"
    - "4318"
```

## Datasource do Grafana (provisioning)

### Mimir datasource:
```yaml
- name: Mimir
  type: prometheus
  access: proxy
  url: http://mimir:9009/prometheus
  isDefault: true
  editable: false
  version: 1
  uid: mimir
```

### Prometheus datasource:
```yaml
- name: Prometheus
  type: prometheus
  access: proxy
  url: http://prometheus:9090
  isDefault: false
  editable: false
  version: 1
  uid: prometheus
```

## Estrutura de diretorios

```
config/
├── prometheus/
│   └── prometheus.yaml
├── mimir/
│   └── mimir.yaml
├── grafana/
│   └── datasources.yaml
└── otel-collector/
    └── otel-collector.yaml
```