---
name: rs-devops-configurando-o-loki-1
description: "Generates Loki configuration files for Docker Compose observability stacks. Use when user asks to 'configure Loki', 'setup log aggregation', 'add Loki to docker-compose', 'configure log storage with S3/MinIO', or 'setup observability stack'. Applies Loki YAML config patterns with S3-compatible storage, member list for ring balancing, and schema config. Make sure to use this skill whenever setting up Loki or log pipelines in containerized environments. Not for Prometheus metrics, Grafana dashboards, or application-level logging libraries."
---

# Configurando o Loki

> Configurar o Loki como sistema de logs com storage S3-compativel, member list para distribuicao, e integracao via Docker Compose.

## Prerequisites

- Docker Compose com stack de observabilidade (Grafana, Mimir, MinIO)
- MinIO ou S3-compativel rodando e acessivel
- Buckets criados: `loki-data` (logs) e `loki-rule` (regras)

## Steps

### Step 1: Criar estrutura de configuracao

Criar pasta `config/loki/` com arquivo `loki.yaml`:

```
config/
└── loki/
    └── loki.yaml
```

### Step 2: Configurar o servico no Docker Compose

```yaml
loki:
  image: grafana/loki:latest
  command:
    - -config.file=/etc/loki/loki.yaml
    - -config.expand-env=true
  volumes:
    - ./config/loki/loki.yaml:/etc/loki/loki.yaml
  depends_on:
    - minio
```

`-config.expand-env=true` permite usar variaveis de ambiente dentro do `loki.yaml`. Sem isso, qualquer `${VAR}` no config causa erro.

### Step 3: Escrever o loki.yaml

```yaml
auth_enabled: false

server:
  http_listen_address: 0.0.0.0
  http_listen_port: 3100

memberlist:
  join_members:
    - loki
  dead_node_reclaim_time: 30s
  gossip_to_dead_nodes_time: 15s
  left_ingesters_timeout: 10s
  bind_addr:
    - 0.0.0.0
  bind_port: 7946
  rejoin_interval: 2s

schema_config:
  configs:
    - from: "2025-01-01"
      store: tsdb
      object_store: s3
      schema: v13
      index:
        prefix: index_
        period: 24h

limits_config:
  discover_log_levels: false

common:
  path_prefix: /loki
  replication_factor: 1
  compactor_address: loki:3100
  storage:
    s3:
      endpoint: minio:9000
      insecure: true
      bucketnames: loki-data
      access_key_id: loki
      secret_access_key: supersecretloki
      s3forcepathstyle: true

ruler:
  storage:
    s3:
      bucketnames: loki-rule
```

### Step 4: Subir e verificar

```bash
docker compose up -d
docker logs loki
```

Se aparecer erro de `send request` ao MinIO, dar restart — Loki pode ter subido antes do MinIO estar pronto:

```bash
docker restart loki
docker logs loki
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Ambiente produtivo com carga alta | Separar replicas de leitura (`loki-read`) e escrita (`loki-write`) no `join_members` com ingress/load balancer na frente |
| Usando AWS S3 real | Mudar `endpoint` para o da AWS, remover `insecure: true`, usar access keys com escopo restrito ao bucket |
| Multiplos buckets | Criar access keys com escopo restrito por bucket — `loki-data` separado de `loki-rule` |
| `discover_log_levels: false` | Logs aparecem sem nivel (cinza no Grafana). Mudar para `true` quando quiser classificacao automatica |
| Loki falha ao subir | Verificar se MinIO esta ready. Usar `depends_on` com `condition: service_healthy` se possivel |
| Ruler config | Herda credenciais S3 do `common`, so precisa sobrescrever `bucketnames` |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Hardcoded secrets no yaml em producao | Use `${LOKI_S3_SECRET}` com `expand-env=true` |
| Replicar credenciais S3 em cada secao | Defina no `common.storage.s3`, sobrescreva so o bucket onde necessario |
| `replication_factor: 3` sem replicas | Mantenha `1` para single-instance |
| Ignorar erro de startup do Loki | Verificar logs — geralmente e race condition com MinIO |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
