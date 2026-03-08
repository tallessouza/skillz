---
name: rs-devops-debugando-o-envio-de-logs
description: "Applies systematic debugging approach for OpenTelemetry log pipeline issues with outside-in methodology. Use when user asks to 'debug logs not showing in Grafana', 'fix OTLP log export', 'troubleshoot collector connection', or 'configure OTEL_EXPORTER_OTLP_ENDPOINT'. Enforces outside-in debugging (collector first, then app), DiagSetLog usage, and environment variable configuration. Make sure to use this skill whenever troubleshooting missing logs in Grafana Loki or debugging OTLP collector connectivity. Not for metric debugging (use debugando-algumas-metricas-auto-instrumentadas) or trace issues."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-opentelemetry
  tags: [opentelemetry, logs, debugging, grafana, loki, otlp, collector, diag]
---

# Debugando o Envio de Logs para OpenTelemetry

> Quando logs nao aparecem no Grafana, depure sistematicamente: collector primeiro, depois aplicacao, depois formatacao.

## Rules

1. **Evite conflitos de porta** — se Grafana usa 3000, coloque a API na 3001
2. **Depure de fora para dentro** — verifique collector (`docker logs`) antes de mexer na aplicacao
3. **Use DiagSetLog para debug do SDK** — `diag.setLogLevel` mostra erros de envio
4. **Prefira variavel de ambiente ao hardcode** — `OTEL_EXPORTER_OTLP_ENDPOINT`
5. **console.log nao e log estruturado** — OpenTelemetry precisa de formatacao minima
6. **Verifique a porta 4318** — porta padrao HTTP do OTLP receiver

## Steps

### Verificar collector

```bash
docker ps
docker logs <container_id_otel_collector>
```

### Habilitar debug no SDK

```typescript
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
```

### Configurar endpoint via env var (recomendado)

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
yarn run dev
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Logs nao aparecem no Grafana Loki | Verifique `docker logs` do collector |
| Erro "connection refused 4318" | Verifique se collector expoe a porta |
| Funciona local mas nao no cluster | Use env var `OTEL_EXPORTER_OTLP_ENDPOINT` |
| Porta 3000 ocupada | Grafana e API competindo — mude API para 3001 |

## Troubleshooting

### Logs nao aparecem no Grafana Loki apos configurar OTLP
**Symptom:** Aplicacao roda sem erros mas logs nao aparecem no Grafana
**Cause:** Collector nao esta recebendo os logs — pode ser porta errada ou collector parado
**Fix:** Rodar `docker logs <collector_container>` para verificar erros no collector antes de mexer na aplicacao

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
