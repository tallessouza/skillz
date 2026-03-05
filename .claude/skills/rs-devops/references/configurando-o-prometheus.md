---
name: rs-devops-configurando-o-prometheus
description: "Applies Prometheus configuration patterns when setting up observability stacks with Docker Compose. Use when user asks to 'configure Prometheus', 'add metrics monitoring', 'setup observability', 'create prometheus.yaml', or 'add scrape targets'. Covers Docker Compose service definition, prometheus.yaml scrape configs, port management, Mimir integration, and Grafana datasource setup. Make sure to use this skill whenever adding Prometheus to a containerized environment. Not for application-level instrumentation, custom metrics code, or PromQL query writing."
---

# Configurando o Prometheus

> Ao adicionar Prometheus a um stack de observabilidade, configure o servico no Docker Compose, defina scrape configs declarativos e gerencie portas para evitar conflitos.

## Rules

1. **Sempre declare scrape_interval e evaluation_interval explicitamente** — mesmo que o default (1min) seja aceitavel, porque configuracao declarativa evita surpresas e documenta a intencao
2. **Separe Prometheus e Mimir por portas distintas** — Prometheus usa 9090 (default), Mimir deve usar porta diferente (ex: 9009), porque ambos usam 9090 por padrao e conflitam
3. **Ative remote_write_receiver via comando na subida** — passe `--web.enable-remote-write-receiver` no command do container, porque esse protocolo nao vem ativo por padrao
4. **Monte o config file via volume** — crie `config/prometheus/prometheus.yaml` e monte em `/etc/prometheus/prometheus.yaml`, porque o Prometheus precisa do arquivo na inicializacao
5. **Defina job_name para cada fonte de metricas** — um job para o proprio Prometheus (self-monitoring) e outro para cada exporter/collector, porque jobs separados permitem configuracao independente
6. **Use honor_labels: true quando coletar de OpenTelemetry** — porque evita conflito entre labels do collector e labels do Prometheus

## Steps

### Step 1: Adicionar servico Prometheus no Docker Compose

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

### Step 2: Ajustar porta do Mimir para evitar conflito

```yaml
mimir:
  ports:
    - "9009:9009"  # NAO usar 9090, conflita com Prometheus
```

### Step 3: Criar config/prometheus/prometheus.yaml

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

### Step 4: Expor portas do OpenTelemetry Collector

```yaml
otel-collector:
  ports:
    - "4317:4317"   # gRPC receiver
    - "4318:4318"   # HTTP receiver
    - "8888:8888"   # Prometheus self-collect
    - "8889:8889"   # Prometheus metrics export
    - "1888:1888"   # pprof extension
    - "13133:13133" # health_check extension
    - "55679:55679" # zpages extension
```

### Step 5: Adicionar datasource do Prometheus no Grafana

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

## Heuristics

| Situacao | Faca |
|----------|------|
| Mimir e Prometheus no mesmo stack | Mimir em porta diferente de 9090 |
| Quer near real-time | scrape_interval: 10s |
| Quer economizar recursos | scrape_interval: 30s ou 60s |
| Porta do container so precisa ser visivel internamente | Use `expose` ao inves de `ports` |
| Novo exporter adicionado | Crie novo job_name em scrape_configs |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Mimir e Prometheus na mesma porta 9090 | Separe: Prometheus 9090, Mimir 9009 |
| Omitir scrape_interval confiando no default | Declare explicitamente, mesmo se 1m |
| Esquecer `--web.enable-remote-write-receiver` | Sempre passe no command do container |
| Hardcodar IP nos targets dentro do container | Use nome do servico Docker (DNS interno) |
| Criar prometheus.yaml sem montar volume | Monte via volumes no docker-compose |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-configurando-o-prometheus/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-configurando-o-prometheus/references/code-examples.md)
