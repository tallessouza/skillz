# Code Examples: Grafana Tempo

## Docker Compose completo (servico Tempo)

```yaml
services:
  tempo:
    image: grafana/tempo:latest
    container_name: tempo
    restart: always
    volumes:
      - ./config/tempo/tempo.yaml:/etc/tempo/tempo.yaml
    command:
      - "--config.file=/etc/tempo/tempo.yaml"
```

Pontos importantes:
- Sem `ports:` — acesso somente via rede Docker interna
- Volume monta o YAML de config para `/etc/tempo/`
- `command` referencia o mesmo path do volume

## Arquivo tempo.yaml completo

```yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        http:
        grpc:

ingester:
  max_block_duration: 5m

compactor:
  compaction:
    block_retention: 30m

storage:
  trace:
    backend: local
    wal:
      path: /tmp/tempo/tempo/wal
    local:
      path: /tmp/tempo/tempo/blocks

# overrides:
#   (configuracao futura para sobrescrever geracoes de metricas)
```

### Secao por secao:

**server**: Define porta HTTP interna (3200). Nao confundir com porta exposta no Docker.

**distributor.receivers**: Quais protocolos o Tempo aceita para receber traces. OTLP com HTTP e gRPC cobre a maioria dos casos.

**ingester**: Controla como traces sao ingeridos. `max_block_duration: 5m` define o tempo maximo de um bloco de ingestao.

**compactor**: Compactacao de dados. `block_retention: 30m` define por quanto tempo blocos sao retidos antes de compactacao.

**storage.trace**: Backend de armazenamento. `local` usa filesystem. `wal` (Write-Ahead Log) e `local` definem paths internos do container.

## Variacao: Multiplos receivers

```yaml
distributor:
  receivers:
    otlp:
      protocols:
        http:
        grpc:
    zipkin:
    jaeger:
      protocols:
        grpc:
        thrift_http:
```

Use quando precisar compatibilidade com sistemas que enviam traces via Zipkin ou Jaeger.

## Datasource no Grafana (datasources.yaml)

```yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: false
    editable: false
    version: 1
    uid: loki

  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    isDefault: true
    editable: false
    version: 1
    uid: tempo
    basicAuth: false
```

Notas:
- `isDefault: true` no Tempo faz ele ser selecionado automaticamente no Explorer
- Somente um datasource pode ser `isDefault: true` — Loki perde o default
- `basicAuth: false` explicito (opcional mas documenta a intencao)
- `editable: false` impede alteracoes pela UI do Grafana

## Docker Compose — Grafana com dependencias

```yaml
grafana:
  image: grafana/grafana:latest
  container_name: grafana
  ports:
    - "3000:3000"
  volumes:
    - ./config/grafana/datasources.yaml:/etc/grafana/provisioning/datasources/datasources.yaml
  depends_on:
    - loki
    - tempo
```

`depends_on` garante que Loki e Tempo subam antes do Grafana (verifica apenas se o container iniciou, nao se esta saudavel).

## Estrutura de arquivos

```
project/
├── docker-compose.yaml
└── config/
    ├── grafana/
    │   └── datasources.yaml
    └── tempo/
        └── tempo.yaml
```

## Comandos de verificacao

```bash
# Subir a stack
docker compose up -d

# Verificar containers rodando
docker ps

# Ver logs do Tempo
docker logs tempo

# Derrubar e recriar (apos mudancas no config)
docker compose down && docker compose up -d
```