# Deep Explanation: Instrumentando uma Nova Aplicacao

## Por que criar uma lib compartilhada?

O instrutor enfatiza repetidamente: **duplicar o arquivo `tracer.ts` entre microservicos nao escala.** A razao e simples — se voce precisa atualizar uma dependencia do OpenTelemetry ou corrigir um bug na configuracao do tracer, tera que fazer isso em TODOS os servicos manualmente.

A recomendacao concreta:
- Crie uma lib (no universo Node, e "simplesmente uma abstracao")
- A lib exporta funcoes de inicializacao do tracer e do logger
- Parametros como `serviceName` e `serviceVersion` sao passados via variaveis de ambiente ou argumentos
- Use versionamento semantico para controlar rollout de mudancas
- Todos os microservicos consomem essa lib como dependencia

O instrutor reconhece que criar a lib "sai um pouco do conceito de observabilidade" e por isso nao implementa na aula, mas deixa como recomendacao forte para contextos reais.

## Ordem de inicializacao importa

O `import './tracer'` DEVE ser a primeira linha do `main.ts`. Isso porque o OpenTelemetry precisa fazer monkey-patching das bibliotecas (HTTP, gRPC, Express) ANTES delas serem importadas. Se o tracer inicializa depois, a auto-instrumentacao nao captura as chamadas.

## Diferenciacao de servicos

Cada microservico precisa de identidade propria no ecossistema de observabilidade:
- `serviceName`: identifica QUAL servico gerou o trace/log (ex: `app-rocketseat` vs `app-rocketseat-2`)
- `serviceVersion`: permite diferenciar versoes em deploys canary ou rolling updates

No Grafana, isso permite filtrar logs por `service_name` e ver traces separados por servico no Tempo.

## Problema do OTEL_EXPORTER_OTLP_ENDPOINT

O instrutor mostra que sem configurar a variavel `OTEL_EXPORTER_OTLP_ENDPOINT`, o servico reclama que "nao teve conexao". A solucao:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

Isso aponta para o collector do OpenTelemetry que roda localmente (geralmente via Docker). O collector e o intermediario que recebe traces/logs e envia para backends como Tempo e Loki.

## Proximos passos mencionados

O instrutor prepara o terreno: na proxima aula, sera implementada uma requisicao do app1 para o app2 para demonstrar **distributed tracing** — como um trace propaga contexto entre microservicos e como isso aparece no Tempo como spans conectados.