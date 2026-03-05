# Deep Explanation: Configurando o Service do OTEL

## O que e o bloco service

O bloco `service` e o ultimo e mais importante do arquivo de configuracao do OpenTelemetry Collector. Ele e onde voce "liga os fios" — conecta tudo que foi definido nas secoes de receivers, processors, exporters e extensions.

Sem o bloco service, todas as outras definicoes sao apenas declaracoes inertes. O Collector so começa a processar dados quando as pipelines estao definidas.

## Extensions vs Pipelines

O instrutor faz uma distincao clara:

- **Extensions** sao servicos auxiliares do Collector (health check, profiling, debug pages). Eles NAO participam do fluxo de dados. Sao declarados no nivel do service.
- **Pipelines** sao o fluxo de dados propriamente dito. Cada pipeline tem um tipo de sinal (logs, traces, metrics) e define receiver → processor → exporter.

## Por que o processor resource so vai em logs

O instrutor explica que o processor `resource` foi configurado especificamente para enriquecer logs com atributos adicionais. Ele esta "associado ao lock" (log). Por isso, nas pipelines de traces e metrics, so entra o `batch`.

Isso e um ponto importante: processors nao sao globais por padrao. Voce escolhe quais processors aplicar a cada pipeline.

## O processor batch

Aparece em TODAS as pipelines. Sua funcao e agrupar dados antes de enviar (sampling temporal). Em vez de enviar cada log/trace/metrica individualmente, ele acumula por um periodo e envia em lote. Isso reduz overhead de rede.

## Exporters e seus destinos

O instrutor mapeia:
- **Logs** → exporter otlphttp que aponta para o Loki
- **Traces** → exporter otlp que aponta para o Tempo
- **Metrics** → exporter prometheusremotewrite que aponta para o Mimir (via Prometheus)

Um ponto importante levantado: "a gente nao esta mandando direto para o Mimir aqui a nivel de metrics. A gente esta falando direto com o Prometheus." Isso mostra que o prometheusremotewrite envia para o Prometheus, que por sua vez pode usar o Mimir como backend.

## Possibilidade de multiplos receivers

O instrutor menciona que voce poderia adicionar o Jaeger como receiver adicional:
```yaml
receivers: [otlp, jaeger]
```
Mas no caso do curso, so o OTLP esta sendo usado. A estrutura ja suporta multiplos receivers nativamente.

## Debug de erros de conexao

O instrutor encontrou um erro de conexao com o Tempo durante os testes. Pontos chave:
1. O Collector NAO reiniciou por causa do erro — ele continuou rodando
2. Se estivesse reiniciando (crash loop), ai sim seria critico
3. Erros de conexao geralmente sao porta errada ou hostname inacessivel na rede Docker
4. A tentativa de mudar para porta 4317 (porta OTLP padrao) foi uma abordagem de debug
5. O instrutor destaca que "essa porta nao esta exposta na nossa interface mas ela existe dentro do contexto do Tempo" — referindo-se a portas internas da rede Docker

## Verificacao pos-deploy

O fluxo de verificacao do instrutor:
1. `docker-compose up --build -d` — rebuild e sobe
2. `docker ps` — verifica se todos os containers estao rodando
3. `docker logs <container>` — verifica logs por erros
4. Procura por "everything is ready" no log do OTEL Collector
5. Verifica se extensions startaram corretamente

## Proximos passos mencionados

- Explorar Prometheus em mais detalhe
- Criar aplicacao que envia telemetria para o OTEL Collector
- Ver dados aparecerem no Grafana (logs no Loki, traces no Tempo, metrics no Prometheus/Mimir)
- Configurar volumes com MinIO para persistencia local