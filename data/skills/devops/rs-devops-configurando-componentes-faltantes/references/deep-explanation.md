# Deep Explanation: Configurando Mimir na Stack LGTM

## O que e o Mimir

O Mimir e um banco de dados de series temporais desenvolvido pela Grafana Labs. Ele e otimizado para armazenar metricas de forma performatica. Na stack LGTM (Loki, Grafana, Tempo, Mimir), o Mimir ocupa o papel de backend de metricas — equivalente ao papel que o Prometheus tradicionalmente ocupa, mas com capacidades de escala horizontal e multi-tenancy nativas.

## Conceitos-chave do Mimir

### Ring e Replicacao Consistente

O Mimir trabalha com o conceito de **ring** — um mecanismo de consistencia para sincronizar dados entre multiplas replicas. Mesmo com uma unica replica (como no setup de desenvolvimento), o ring precisa ser configurado em todos os componentes:

- **Ingester**: recebe metricas e as armazena temporariamente
- **Distributor**: distribui metricas recebidas para os ingesters corretos
- **Compactor**: compacta blocos de metricas para otimizar storage
- **Store Gateway**: serve queries de blocos compactados

Com `kvstore.store: inmemory`, o ring funciona sem dependencia externa (como Consul ou etcd). Em producao com multiplas replicas, voce usaria um backend distribuido.

### Multi-tenancy

O Mimir suporta multi-tenancy nativo — multiplos tenants compartilhando a mesma infraestrutura com isolamento de dados. No setup base, desabilitamos com `multitenancy_enabled: false`. Quando habilitado, cada request precisa do header `X-Scope-OrgID` para identificar o tenant.

### Blocks Storage

O Mimir armazena metricas em blocos no filesystem local (`/data/mimir`). O instrutor enfatiza que isso e **efemero** — se o container cair, as metricas sao perdidas. Para persistencia real:
- Volume Docker nomeado (dev/staging)
- MinIO ou S3 (producao)

### Por que o Datasource e type `prometheus`?

O Mimir expoe uma API 100% compativel com Prometheus no endpoint `/prometheus`. O Grafana nao tem um tipo nativo "mimir" — ele simplesmente usa o tipo `prometheus` apontando para o Mimir. Isso significa que qualquer dashboard feito para Prometheus funciona diretamente com Mimir.

## Integracao Tempo → Mimir

O Tempo (backend de traces) pode gerar metricas a partir de traces usando o `metrics_generator`. Essas metricas sao enviadas via **remote_write** para o Mimir:

- `service_graphs`: gera metricas de relacionamento entre servicos
- `span_metrics`: gera metricas a partir de spans individuais

O `external_labels` adiciona labels fixos em todas as metricas geradas, util para identificar a origem (ex: `source: tempo`, `cluster: docker-compose`).

O path `/api/v1/push` e a API de ingestao do Mimir — diferente do `/prometheus` que e para queries.

## Resolucao de DNS entre containers

O instrutor destaca que containers na mesma rede Docker Compose se encontram pelo nome do container. Entao `http://mimir:9090` funciona porque `mimir` e o `container_name` definido no docker-compose.yaml, e o Docker resolve isso via DNS interno.

## Erros comuns mencionados

1. **Typo no YAML**: o instrutor cometeu um erro de digitacao (`exemplar` vs `exemplars`) e o Tempo crashou. A licao: sempre verificar logs apos subir containers (`docker logs <container>`)
2. **Provisioning nao reflete alteracoes**: ao alterar o datasource YAML, o Grafana pode nao recarregar automaticamente. Solucao: `docker compose down && docker compose up`
3. **Erros de YAML mal formatado**: o container crasha na subida com erro relativamente amigavel — facil de diagnosticar

## Stack LGTM completa

Ao final desta configuracao, a stack tem:
- **L** — Loki (logs)
- **G** — Grafana (visualizacao)
- **T** — Tempo (traces)
- **M** — Mimir (metricas)

O que falta: OpenTelemetry Collector para instrumentacao, e Prometheus para scraping de metricas de aplicacao (proximo modulo).