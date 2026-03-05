---
name: rs-devops-grafana-tempo
description: "Generates Grafana Tempo configuration for distributed tracing in Docker Compose environments. Use when user asks to 'configure tracing', 'setup Tempo', 'add traces to Grafana', 'configure distributed tracing', or 'setup OpenTelemetry collector'. Applies Docker Compose service definition, tempo.yaml configuration, and Grafana datasource integration. Make sure to use this skill whenever setting up observability tracing infrastructure with Grafana stack. Not for application-level instrumentation code, Prometheus metrics, or log collection with Loki/Promtail."
---

# Grafana Tempo — Configuracao de Tracing

> Configurar Grafana Tempo como backend de traces com Docker Compose, YAML configurativo e integracao como datasource no Grafana.

## Rules

1. **Sempre crie um arquivo YAML de configuracao** — mesmo que Tempo funcione com defaults, o arquivo explicito garante controle e evita quebras futuras quando a stack evolui
2. **Monte o YAML via volume no Docker Compose** — copie o arquivo local para `/etc/tempo/tempo.yaml` dentro do container, porque o Tempo espera o config nesse path padrao
3. **Use o comando `--config.file` no container** — referencie explicitamente o arquivo de configuracao no start do container, porque sem isso o Tempo usa defaults que podem nao atender
4. **Declare receivers OTLP com HTTP e gRPC** — porque aplicacoes podem enviar traces por qualquer um dos dois protocolos, e ambos devem estar disponiveis
5. **Nao exponha portas do Tempo no host** — o Tempo roda na porta 3200 internamente e o Grafana acessa via rede Docker, sem necessidade de exposicao externa
6. **Registre Tempo como datasource via YAML provisionado** — no `datasources.yaml` do Grafana, com `editable: false`, porque configuracoes nao devem ser modificaveis pela UI

## Steps

### Step 1: Declarar servico no Docker Compose

```yaml
tempo:
  image: grafana/tempo:latest
  container_name: tempo
  restart: always
  volumes:
    - ./config/tempo/tempo.yaml:/etc/tempo/tempo.yaml
  command:
    - "--config.file=/etc/tempo/tempo.yaml"
```

Nao declare `ports:` — Tempo sera acessado internamente pelo Grafana.

### Step 2: Criar arquivo de configuracao

Criar `config/tempo/tempo.yaml`:

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
```

### Step 3: Adicionar Tempo como dependencia do Grafana

```yaml
grafana:
  depends_on:
    - loki
    - tempo
```

### Step 4: Registrar datasource no Grafana

No `datasources.yaml` do Grafana:

```yaml
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

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de tracing distribuido | Configure Tempo com receivers OTLP |
| App envia traces via HTTP | OTLP HTTP ja esta habilitado |
| App envia traces via gRPC | OTLP gRPC ja esta habilitado |
| Quer adicionar Jaeger/Zipkin | Declare receivers adicionais no distributor |
| Storage em producao | Substitua backend `local` por MinIO ou S3 |
| Tempo reiniciando com erro | Verifique indentacao do YAML — `storage.trace` deve conter `backend`, `wal` e `local` |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Subir Tempo sem arquivo de config | Sempre crie `tempo.yaml` explicito |
| Expor porta 3200 no host | Acesse via rede interna Docker |
| Configurar datasource pela UI do Grafana | Provisione via `datasources.yaml` com `editable: false` |
| Colocar `wal` e `local` fora do bloco `trace` | Indente corretamente dentro de `storage.trace` |
| Usar somente HTTP ou somente gRPC | Declare ambos protocolos no receiver OTLP |

## Error Handling

- Se Tempo reinicia em loop: verifique `docker logs tempo` — erro de "wall not found in storage config" indica indentacao errada no YAML (wal/local devem estar dentro de `storage.trace`)
- Se Grafana nao mostra Tempo como datasource: verifique se `datasources.yaml` foi montado corretamente e se `depends_on` inclui `tempo`
- Se traces nao aparecem no Explorer: verifique se a aplicacao esta enviando para a porta correta (4317 gRPC ou 4318 HTTP do OTLP)

## Verification

- `docker ps` mostra container `tempo` rodando sem restarts
- `docker logs tempo` mostra "Tempo started" sem erros
- Grafana > Connections > Data Sources mostra Tempo listado
- Grafana > Explore com Tempo selecionado mostra interface TraceQL

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
