# Deep Explanation: Logging Estruturado com Pino

## Por que nao console.log?

O instrutor enfatiza que `console.log` nao oferece nenhuma estrutura: sem colorizacao, sem log levels, sem filtros, sem timestamps. Em ambiente de observabilidade, isso torna impossivel a investigacao de problemas. O log precisa ser **estruturado** para ser util.

## Pino vs OpenTelemetry — separacao de responsabilidades

Ponto critico do instrutor: **Pino e pino-pretty nao tem nenhuma relacao com OpenTelemetry**. Sao libs de padronizacao de stdout apenas. A confusao e comum porque ambos aparecem juntos no stack de observabilidade, mas:

- **Pino** = formata a saida do log (level, timestamp, colorize)
- **OpenTelemetry SDK** = intercepta os logs e envia para o Collector
- **OTel Collector** = recebe, processa e exporta para backends (Loki/Grafana)

## Organizacao em `infra/`

O instrutor sugere a pasta `infra/` para agrupar concerns de infraestrutura. Dentro dela, pode ser um arquivo (`logger.ts`) ou subpasta (`logger/index.ts`), dependendo da complexidade. Outros possiveis vizinhos: `tracer/`, `metrics/`.

## Anatomia do transport do Pino

O Pino usa um sistema de **targets** no transport. Cada target define:
- `target`: qual lib processa (ex: `pino-pretty`)
- `level`: nivel minimo para esse target
- `options`: configuracoes especificas

Isso permite ter multiplos destinos com niveis diferentes (ex: pretty no terminal a partir de error, JSON para arquivo a partir de debug).

## Options do pino-pretty

- `colorize: true` — cores no terminal para diferenciar levels visualmente
- `levelFirst: true` — level aparece antes da mensagem (facilita scan visual)
- `include: "level,time"` — campos incluidos na saida
- `translateTime: "SYS:dd/MM/yyyy HH:mm:ss"` — formata timestamp legivel em vez de epoch

## Debugging do pipeline OTel (caso real da aula)

O instrutor simulou propositalmente um erro para ensinar troubleshooting:

1. **Sintoma**: logs nao apareciam no Grafana
2. **Investigacao**: `docker ps` para pegar container ID, `docker logs <id>` para ver erros do Collector
3. **Causa raiz**: endpoint configurado como `/v1/logs` no exporter, mas o OTel Collector ja concatena `/v1/logs` automaticamente
4. **Solucao**: mudar endpoint para apenas `/otlp` (sem `/v1/logs`)
5. **Licao**: o exporter do OTel ja sabe o path completo, nao duplique

### Arquivo do OTel Collector (fluxo)

```yaml
exporters:
  otlphttp:
    endpoint: "http://loki:3100/otlp"  # SEM /v1/logs

service:
  pipelines:
    logs:
      receivers: [otlp]
      processors: [batch, resource]
      exporters: [otlphttp]
```

## Persistencia de logs

O instrutor alertou: sem volumes Docker configurados, ao rodar `docker-compose down` e `up`, todos os logs sao perdidos. O Collector e o Loki perdem os dados. Isso sera resolvido em aulas futuras com volumes, mas e importante saber que:

- Logs sobrevivem restart de containers da **aplicacao** (porque estao no Collector/Loki)
- Logs NAO sobrevivem restart do **Collector/Loki** sem volumes

## Auto-instrumentacao do OTel

O instrutor mostrou que o OpenTelemetry, quando auto-instrumentado, captura automaticamente metadados como:
- Nome do host
- Arquitetura do host
- Versao do Node.js
- Service name, environment, version

Isso aparece nos logs no Grafana sem configuracao adicional no codigo.

## LogQL no Grafana

O instrutor demonstrou brevemente o LogQL:
- Converter logs para JSON: `| json`
- Filtrar por campos: ex. filtrar por versao `1.0`
- Buscar por severidade (info vs error)