# Code Examples: Configurando o Loki

## Docker Compose — Servico Loki completo

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

## loki.yaml — Configuracao completa da aula

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

## Variacao: Loki com replicas de leitura e escrita

```yaml
memberlist:
  join_members:
    - loki-read
    - loki-write
```

Nesse cenario, o Docker Compose teria servicos separados:

```yaml
loki-read:
  image: grafana/loki:latest
  command:
    - -config.file=/etc/loki/loki.yaml
    - -target=read
  # ...

loki-write:
  image: grafana/loki:latest
  command:
    - -config.file=/etc/loki/loki.yaml
    - -target=write
  # ...
```

## Variacao: Usando AWS S3 real

```yaml
common:
  storage:
    s3:
      endpoint: s3.us-east-1.amazonaws.com
      insecure: false
      bucketnames: my-loki-data
      access_key_id: ${AWS_ACCESS_KEY_ID}
      secret_access_key: ${AWS_SECRET_ACCESS_KEY}
      s3forcepathstyle: false
      region: us-east-1
```

Requer `-config.expand-env=true` no command para interpolar as env vars.

## Variacao: Access keys com escopo restrito

No MinIO, criar policy restrita:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": [
        "arn:aws:s3:::loki-data",
        "arn:aws:s3:::loki-data/*"
      ]
    }
  ]
}
```

Aplicar ao usuario/key que o Loki usa, garantindo que so acessa `loki-data`.

## Comandos de verificacao

```bash
# Subir stack
docker compose up -d

# Verificar se todos containers subiram
docker ps

# Ver logs do Loki
docker logs loki

# Restart se houve race condition com MinIO
docker restart loki

# Verificar logs apos restart
docker logs loki

# Derrubar tudo para rebuild
docker compose down
```

## Estrutura de pastas esperada

```
project/
├── docker-compose.yaml
└── config/
    ├── grafana/
    │   └── ...
    ├── mimir/
    │   └── ...
    └── loki/
        └── loki.yaml
```