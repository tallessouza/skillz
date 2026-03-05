# Deep Explanation: Grafana Tempo

## Por que um arquivo de configuracao explicito?

O instrutor enfatiza que Tempo funciona sem arquivo YAML — ele sobe com defaults. Porem, ter o arquivo explicito e fundamental por duas razoes:

1. **Controle sobre receivers**: Sem config, voce nao sabe quais protocolos estao ativos. Com o YAML, voce declara explicitamente OTLP com HTTP e gRPC.
2. **Evolucao futura**: A stack de observabilidade cresce. Ter o arquivo desde o inicio evita reconfiguracoes emergenciais depois.

O instrutor introduz o YAML de config do Tempo "ja para introduzir esse conhecimento" mesmo que pudesse ser adiado — a mesma abordagem sera usada depois para o Loki.

## Arquitetura do Tempo no Docker

O fluxo e:
1. Arquivo `tempo.yaml` local montado via volume para `/etc/tempo/tempo.yaml`
2. Comando `--config.file=/etc/tempo/tempo.yaml` diz ao Tempo onde encontrar o config
3. Tempo roda na porta 3200 (somente rede interna Docker)
4. Grafana conecta via `http://tempo:3200` usando DNS interno do Docker

Nao ha necessidade de expor portas porque:
- O Tempo nao tem interface propria que o usuario acesse
- Tudo e visualizado pelo Grafana
- A aplicacao envia traces via OpenTelemetry Collector (nao diretamente ao Tempo na maioria dos casos)

## Distributor e Receivers

O `distributor` e o componente que recebe traces de fontes externas. O conceito chave e que voce pode configurar multiplos receivers simultaneamente:

```yaml
distributor:
  receivers:
    otlp:        # OpenTelemetry Protocol
      protocols:
        http:
        grpc:
    zipkin:       # Se precisar compatibilidade Zipkin
    jaeger:       # Se precisar compatibilidade Jaeger
      protocols:
        grpc:
        thrift_http:
```

O instrutor mostra isso como possibilidade mas configura somente OTLP, porque e o padrao OpenTelemetry que sera usado no curso.

## O erro de indentacao e a licao

O instrutor encontrou um erro real durante a aula: o Tempo ficava reiniciando. O log dizia que nao encontrava a opcao `wal` dentro de `storage config`. A causa era indentacao incorreta — `wal` e `local` estavam fora do bloco `trace`.

**Errado:**
```yaml
storage:
  trace:
    backend: local
  wal:              # Fora de trace!
    path: /tmp/...
```

**Correto:**
```yaml
storage:
  trace:
    backend: local
    wal:            # Dentro de trace
      path: /tmp/...
    local:          # Dentro de trace
      path: /tmp/...
```

Licao: em YAML de observabilidade, indentacao incorreta causa falhas silenciosas ou restarts em loop. Sempre verifique `docker logs` quando um container reinicia.

## Datasource provisionado vs manual

O Grafana permite adicionar datasources pela UI, mas o instrutor configura via `datasources.yaml` com `editable: false`. Razoes:

- **Reprodutibilidade**: `docker compose down && up` recria tudo identico
- **Seguranca**: ninguem altera configuracao pela UI acidentalmente
- **Infraestrutura como codigo**: tudo versionado no repositorio

O campo `isDefault: true` faz o Tempo ser o datasource padrao no Explorer — quando voce abre o Explorer, ja vem selecionado.

## TraceQL vs LogQL

O instrutor menciona a diferenca de linguagens de query:
- **Loki** usa **LogQL** (Log Query Language) para buscas em logs
- **Tempo** usa **TraceQL** (Trace Query Language) para buscas em traces

No TraceQL voce pode buscar por Trace ID diretamente ou construir queries mais elaboradas para filtrar spans.

## Sobre storage local vs distribuido

O backend `local` armazena traces no filesystem do container. O instrutor menciona que:
- Para producao, substitua por MinIO (armazenamento S3-compativel local)
- MinIO sera abordado em aula futura
- O storage local e suficiente para desenvolvimento e aprendizado