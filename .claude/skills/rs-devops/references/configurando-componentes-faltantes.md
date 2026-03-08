---
name: rs-devops-configurando-componentes-faltantes
description: "Applies Mimir time-series database configuration with Docker Compose and Grafana datasource provisioning. Use when user asks to 'configure Mimir', 'add metrics backend', 'setup LGTM stack', 'provision Grafana datasource', or 'configure remote write for Tempo'. Follows patterns: Mimir docker-compose service, YAML config with ring replication, Grafana datasource provisioning, Tempo metrics_generator with remote_write to Mimir. Make sure to use this skill whenever setting up observability infrastructure with Grafana Mimir. Not for Prometheus scraping config, Loki log pipelines, or application-level instrumentation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-mimir
  tags: [mimir, grafana, lgtm-stack, docker-compose, tempo, metrics]
---

# Configurando Mimir — Banco de Métricas da Stack LGTM

> Configure o Mimir como backend de métricas integrado ao Grafana e Tempo via Docker Compose, seguindo o padrão de provisioning declarativo.

## Rules

1. **Porta interna do Mimir é sempre 9090** — a porta externa pode variar, mas o lado direito do mapeamento deve ser `9090` porque é a porta do processo interno do container
2. **Use volume efêmero apenas para dev** — em produção, associe volume persistente ou backend externo (MinIO, S3) para evitar perda de métricas em container drop
3. **Datasource do Mimir usa type `prometheus`** — não existe type `mimir` no Grafana provisioning; o Mimir expõe API compatível com Prometheus
4. **URL do datasource termina em `/prometheus`** — o path correto é `http://mimir:9090/prometheus`, porque o Mimir expõe queries nesse endpoint
5. **Ring config é obrigatório** — mesmo com réplica única, configure `kvstore.store: inmemory` e `replication_factor: 1` em todos os componentes (ingester, distributor, compactor, store_gateway)
6. **Remote write do Tempo aponta para `/api/v1/push`** — essa é a API de ingestão do Mimir para métricas geradas pelo Tempo

## How to write

### Docker Compose — Serviço Mimir

```yaml
mimir:
  image: grafana/mimir:latest
  container_name: mimir
  restart: always
  ports:
    - "9090:9090"
  command:
    - --config.file=/etc/mimir/mimir.yaml
  volumes:
    - ./config/mimir/mimir.yaml:/etc/mimir/mimir.yaml
```

### Config — mimir.yaml base

```yaml
multitenancy_enabled: false

blocks_storage:
  backend: filesystem
  filesystem:
    dir: /data/mimir

compactor:
  ring:
    kvstore:
      store: inmemory

distributor:
  ring:
    kvstore:
      store: inmemory

ingester:
  ring:
    kvstore:
      store: inmemory
    replication_factor: 1

store_gateway:
  sharding_ring:
    kvstore:
      store: inmemory

server:
  http_listen_port: 9090
```

### Grafana Datasource provisioning — Mimir

```yaml
- name: Mimir
  type: prometheus
  access: proxy
  url: http://mimir:9090/prometheus
  basicAuth: false
  isDefault: false
  editable: false
  version: 1
  uid: mimir
```

### Tempo — metrics_generator com remote_write para Mimir

```yaml
metrics_generator:
  registry:
    external_labels:
      source: tempo
      cluster: docker-compose
  storage:
    path: /tmp/tempo/generator/wal
    remote_write:
      - url: http://mimir:9090/api/v1/push
  processor:
    service_graphs: {}
    span_metrics: {}

overrides:
  defaults:
    metrics_generator:
      processors:
        - service_graphs
        - span_metrics
```

## Example

**Before (Mimir não integrado, Tempo sem remote_write):**

```yaml
# docker-compose.yaml — apenas Tempo e Grafana
tempo:
  image: grafana/tempo:latest
  # ... sem metrics_generator configurado

# datasources.yaml — sem Mimir
datasources:
  - name: Tempo
    type: tempo
    url: http://tempo:3200
```

**After (stack LGTM completa com Mimir):**

```yaml
# docker-compose.yaml — com Mimir
mimir:
  image: grafana/mimir:latest
  container_name: mimir
  restart: always
  ports:
    - "9090:9090"
  command:
    - --config.file=/etc/mimir/mimir.yaml
  volumes:
    - ./config/mimir/mimir.yaml:/etc/mimir/mimir.yaml

# datasources.yaml — com Mimir adicionado
datasources:
  - name: Mimir
    type: prometheus
    url: http://mimir:9090/prometheus
    basicAuth: false
    isDefault: false
    editable: false
    version: 1
    uid: mimir

# tempo.yaml — metrics_generator com remote_write
metrics_generator:
  registry:
    external_labels:
      source: tempo
      cluster: docker-compose
  storage:
    path: /tmp/tempo/generator/wal
    remote_write:
      - url: http://mimir:9090/api/v1/push
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Container Mimir crasha na subida | Verificar YAML com `docker logs mimir` — erros de config sao claros |
| Datasource nao aparece no Grafana | Rodar `docker compose down && docker compose up` — volume de provisioning pode estar cached |
| Mimir dashboard mostra avisos | Normal em single-replica — avisos de HA sao esperados sem cluster |
| Precisa persistir metricas | Adicionar volume nomeado ou backend S3/MinIO no `blocks_storage` |
| Multi-tenant necessario | Setar `multitenancy_enabled: true` e configurar `X-Scope-OrgID` header |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `type: mimir` no datasource | `type: prometheus` (Mimir expoe API Prometheus) |
| URL datasource sem `/prometheus` | `http://mimir:9090/prometheus` |
| Remote write sem path `/api/v1/push` | `http://mimir:9090/api/v1/push` |
| Esquecer ring config em componentes | Configurar `kvstore.store: inmemory` em todos (ingester, distributor, compactor, store_gateway) |
| Mapear porta `8080:9090` sem saber | Porta interna sempre `9090`, externa pode variar |

## Troubleshooting

### Datasource Mimir nao aparece no Grafana
**Symptom:** Mimir esta rodando mas o Grafana nao mostra o datasource ou mostra como undefined
**Cause:** O type do datasource esta como 'mimir' em vez de 'prometheus', ou a URL nao termina em /prometheus
**Fix:** Use `type: prometheus` e `url: http://mimir:9090/prometheus` no arquivo de provisioning do Grafana

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-configurando-componentes-faltantes/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-configurando-componentes-faltantes/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
