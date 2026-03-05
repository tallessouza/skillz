# Deep Explanation: Analisando Traces e Metricas

## O que e um Trace ID e por que ele importa

O Trace ID e o identificador unico que acompanha uma requisicao desde o ponto de entrada ate todos os servicos que ela percorre. Se a aplicacao A chama a aplicacao B, o Trace ID da chamada na B sera o mesmo da A. Isso e o chamado **trace distribuido** — a capacidade de correlacionar chamadas entre multiplas aplicacoes que participaram do mesmo fluxo.

Na pratica, isso significa que voce pode pegar um unico ID e reconstruir toda a jornada de uma requisicao, independente de quantos servicos ela atravessou.

## Auto-instrumentacao vs instrumentacao custom

O OpenTelemetry cuida das "tres linhas" (logs, traces, metricas) automaticamente atraves da auto-instrumentacao. Isso significa que, sem escrever codigo adicional, voce ja recebe:

- **Traces** com spans para cada operacao do framework (Express bootstrap, JSON parser, route handlers)
- **Metricas** como `http_server_duration_seconds_bucket` e `http_server_request_total`
- **Logs** correlacionados

O instrutor destaca que as metricas auto-instrumentadas sao "ate meio dificeis de interpretar" porque sao genericas (tempo de requisicao do server e do client). A evolucao natural e adicionar metricas custom da propria aplicacao para ter dados mais significativos ao negocio.

## Breakdown temporal de um trace

Quando voce clica em um Trace ID no Grafana Tempo, ele mostra a cascata de operacoes:

```
[Wrapping Skillz Seed] ─── 3.4ms total
  ├── Express init ────── 0.1ms
  ├── JSON Parser ─────── 0.5ms
  ├── Query ───────────── 0.5ms
  └── Response ────────── 0.3ms
```

Cada barra representa um **span** — uma operacao individual dentro do trace. Se um servico externo fosse chamado, apareceria como um span adicional com o nome do servico. Isso permite identificar exatamente ONDE o tempo esta sendo gasto.

O instrutor corrigiu durante a aula: "falei meio segundo, e meio milissegundo". Atencao as unidades e critico na analise de traces.

## Pipeline de validacao

A sequencia recomendada pelo instrutor para validar que o pipeline funciona:

1. `docker ps` — containers estao rodando?
2. `docker logs` — algum erro no coletor?
3. Gerar requests de teste nos endpoints
4. Verificar no Tempo se traces aparecem
5. Verificar no Mimir se metricas aparecem
6. Somente entao: evoluir para dashboards e graficos

## Evolucoes mencionadas pelo instrutor

- Adicionar o Trace ID nos logs da requisicao (correlacao log-trace)
- Criar metricas custom da aplicacao (alem da auto-instrumentacao)
- Montar dashboards e graficos de monitoramento
- Aprofundar no Prometheus para explorar melhor o campo de metricas
- Fazer instrumentacoes dentro da aplicacao para dados mais ricos

## TraceQL

O Grafana Tempo suporta TraceQL, uma linguagem de consulta para traces. Na forma mais simples, voce cola o Trace ID direto no campo de busca e ele retorna o trace correspondente. Em cenarios mais avancados, voce pode fazer queries complexas filtrando por servico, duracao, status, etc.