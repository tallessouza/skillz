# Deep Explanation: Configurando o Collector do OpenTelemetry

## Por que o Collector existe

O instrutor enfatiza que a aplicacao **nunca deve se conectar diretamente** aos servicos de observabilidade. O OTel Collector funciona como um intermediario: ele coleta e exporta. A aplicacao conhece apenas o Collector, e o Collector conhece os backends.

A analogia eh clara: se voce sai do Grafana e vai pro Datadog, voce muda apenas o Collector. A aplicacao permanece **agnostica**. Isso evita retrabalho — a palavra exata usada pelo instrutor.

## Arquitetura de cinco pilares

O arquivo de configuracao do OTel Collector tem cinco secoes fundamentais:

1. **Receivers** — de onde os dados entram (OTLP via gRPC/HTTP, Prometheus scrape)
2. **Processors** — como os dados sao transformados (batch, resource attributes)
3. **Exporters** — para onde os dados vao (Loki, Tempo, Mimir, Prometheus Remote Write)
4. **Extensions** — funcionalidades auxiliares (health_check, pprof, zpages)
5. **Service** — pipeline que conecta receivers → processors → exporters

## Receivers em detalhe

### OTLP
O protocolo nativo do OpenTelemetry. Duas portas:
- **4317**: gRPC — mais eficiente, binario
- **4318**: HTTP — mais compativel, JSON

O instrutor destaca que a aplicacao vai enviar para uma dessas portas. A diferenca sera explorada em aula futura.

### Prometheus
O Collector tambem pode agir como um Prometheus scraper. O job `otel-collector` faz scrape do proprio Collector na porta 8888 a cada 60 segundos. Isso permite monitorar o proprio pipeline de telemetria.

A porta 8888 eh a porta de metricas internas do Collector — por isso ela eh exposta e usada como target.

## Processors: Resource Attributes

O instrutor explica que resource attributes sao fundamentais para **indexacao**. Ao inserir `service.name` e `service.environment`, voce consegue filtrar logs por servico e ambiente (producao, staging).

A action `insert` no `loki.resource.labels` garante que esses atributos sejam adicionados a cada log enviado. Isso eh critico para ambientes com multiplos servicos — sem isso, todos os logs parecem vir do mesmo lugar.

## Exporters: Endpoints dos backends

Cada exporter aponta para um backend especifico via nome do servico Docker:

| Exporter | Endpoint | Backend |
|----------|----------|---------|
| `otlphttp/loki` | `http://loki:3100/otlp/v1/logs` | Loki (logs) |
| `otlp/tempo` | `tempo:3200` | Tempo (traces) |
| `otlphttp/metrics` | `http://mimir:9009/otlp/v1/metrics` | Mimir (metricas) |
| `prometheusremotewrite` | `http://mimir:9090/api/v1/push` | Mimir via Prometheus |

O instrutor consultou a documentacao oficial do Loki para encontrar os exporters corretos. Ele recomenda sempre verificar a documentacao do backend alvo para pegar o endpoint e formato corretos.

### Sobre TLS
Em ambiente Docker local, `tls: insecure: true` eh necessario porque os servicos nao tem certificados configurados. Em producao, isso deve ser removido.

## Extensions

Tres extensions mencionadas:
- **health_check**: verifica se o Collector esta saudavel periodicamente
- **pprof** (performance profiling): auto-instrumentacao para metricas do proprio Collector
- **zpages**: gera paginas web com metricas expostas do pipeline

## Docker Compose: Hierarquia de dependencias

O instrutor organiza o Compose como uma hierarquia:
1. Loki, Tempo, Mimir (base — sem dependencias entre si)
2. Grafana (depende de Loki, Tempo, Mimir)
3. OTel Collector (depende de todos acima)

Essa organizacao garante que os backends estejam prontos quando o Collector iniciar.

## Imagem oficial

A imagem `otel/opentelemetry-collector-contrib` eh da propria OpenTelemetry (nao eh de terceiros). Tamanho aproximado: ~75MB. A tag `latest` eh usada, mas em producao deve-se fixar versao.

## Observacao do instrutor sobre YAML

O instrutor alerta que configuracao YAML eh propensa a erros de indentacao. Ele proprio menciona que pode ter cometido erros durante a aula. Validar o YAML antes de subir o container eh fundamental.