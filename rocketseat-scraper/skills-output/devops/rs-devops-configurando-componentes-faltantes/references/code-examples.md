# Code Examples: Configurando Mimir

## Exemplo 1: Servico Mimir no docker-compose.yaml

```yaml
services:
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

**Notas:**
- `restart: always` garante que o container reinicia em caso de crash
- O volume mapeia o arquivo de config local para dentro do container
- A porta 9090 e a porta padrao do Mimir HTTP server

## Exemplo 2: Arquivo mimir.yaml completo

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

**Walkthrough:**
1. `multitenancy_enabled: false` — desabilita isolamento por tenant
2. `blocks_storage` com `filesystem` — armazena blocos localmente em `/data/mimir`
3. Cada componente (compactor, distributor, ingester, store_gateway) configura seu ring com `inmemory` — sem dependencia de Consul/etcd
4. `replication_factor: 1` no ingester — single replica, sem replicacao
5. `server.http_listen_port: 9090` — porta HTTP do Mimir

## Exemplo 3: Datasource provisioning para Grafana

```yaml
apiVersion: 1

datasources:
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

**Pontos criticos:**
- `type: prometheus` — NAO existe `type: mimir`
- `url` termina em `/prometheus` — endpoint de query do Mimir
- `uid: mimir` — identificador unico para referencia em dashboards

## Exemplo 4: Configuracao do Tempo com metrics_generator

```yaml
# Dentro do tempo.yaml, adicionar abaixo do compactor existente:
metrics_generator:
  registry:
    external_labels:
      source: tempo
      cluster: docker-compose
  storage:
    path: /tmp/tempo/generator/wal
    remote_write:
      - url: http://mimir:9090/api/v1/push

overrides:
  defaults:
    metrics_generator:
      processors:
        - service_graphs
        - span_metrics
```

**Walkthrough:**
1. `metrics_generator.registry.external_labels` — labels fixos adicionados a todas metricas geradas
2. `storage.path` — WAL (Write-Ahead Log) local do generator
3. `remote_write.url` — endpoint de ingestao do Mimir (`/api/v1/push`)
4. `overrides.defaults.metrics_generator.processors` — habilita geracao de service_graphs e span_metrics

## Exemplo 5: Variacao — Mimir com volume persistente

```yaml
services:
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
      - mimir-data:/data/mimir  # Volume persistente

volumes:
  mimir-data:
```

**Quando usar:** quando voce precisa que metricas sobrevivam a restarts do container.

## Exemplo 6: Variacao — Mimir com MinIO (producao)

```yaml
# mimir.yaml com backend S3/MinIO
blocks_storage:
  backend: s3
  s3:
    endpoint: minio:9000
    bucket_name: mimir-blocks
    access_key_id: ${MINIO_ACCESS_KEY}
    secret_access_key: ${MINIO_SECRET_KEY}
    insecure: true
```

## Comandos de verificacao usados na aula

```bash
# Subir stack
docker compose up --build -d

# Verificar containers rodando
docker ps

# Ver logs do Mimir
docker logs mimir

# Ver logs do Tempo (para verificar remote_write)
docker logs tempo

# Derrubar tudo e recriar (quando provisioning nao atualiza)
docker compose down && docker compose up --build -d
```

## Estrutura de diretorios resultante

```
project/
├── docker-compose.yaml
├── config/
│   ├── mimir/
│   │   └── mimir.yaml
│   ├── tempo/
│   │   └── tempo.yaml
│   └── grafana/
│       └── datasources.yaml
```