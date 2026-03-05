---
name: rs-devops-debugando-envio-de-logs
description: "Applies OpenTelemetry log debugging workflow when troubleshooting observability pipelines. Use when user asks to 'debug logs', 'fix OpenTelemetry', 'logs not showing in Grafana', 'collector not receiving data', or 'troubleshoot observability'. Guides systematic diagnosis: check collector logs, enable DiagSetLog, configure exporter URL or OTEL_EXPORTER_OTLP_ENDPOINT env var. Make sure to use this skill whenever debugging log/metric delivery in OpenTelemetry pipelines. Not for application business logic debugging, frontend debugging, or general Node.js error handling."
---

# Debugando o Envio de Logs para OpenTelemetry

> Quando logs nao aparecem no Grafana, depure sistematicamente: collector primeiro, depois aplicacao, depois formatacao.

## Rules

1. **Evite conflitos de porta** — se Grafana usa 3000, coloque a API na 3001, porque dois servicos na mesma porta causam falhas silenciosas
2. **Depure de fora para dentro** — verifique collector (`docker logs`) antes de mexer na aplicacao, porque o problema pode ser infraestrutura
3. **Use DiagSetLog para debug do SDK** — a lib `@opentelemetry/api` tem `diag.setLogLevel` que mostra erros de envio do lado da aplicacao
4. **Prefira variavel de ambiente ao hardcode** — `OTEL_EXPORTER_OTLP_ENDPOINT` remove responsabilidade da aplicacao e centraliza config no cluster
5. **console.log nao e log estruturado** — OpenTelemetry precisa de formatacao minima para processar logs, console.log puro nao sera coletado
6. **Verifique a porta 4318** — e a porta padrao HTTP do OTLP receiver no OpenTelemetry Collector

## Steps

### Step 1: Verificar se o Collector esta recebendo dados

```bash
# Listar containers
docker ps

# Ver logs do collector (copie o ID do container)
docker logs <container_id_otel_collector>
```

Se o collector mostra apenas "ready" sem dados recebidos, o problema esta no envio da aplicacao.

### Step 2: Habilitar debug no SDK OpenTelemetry

```typescript
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Ativar logs de diagnostico do SDK
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
```

Procure erros como "connection refused on port 4318" — indica que a aplicacao nao alcanca o collector.

### Step 3: Configurar endpoint do exporter

**Opcao A — Via codigo (menos recomendado):**
```typescript
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318'
});
```

**Opcao B — Via variavel de ambiente (recomendado):**
```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
yarn run dev
```

A lib do OpenTelemetry busca automaticamente essa variavel — nenhuma config no codigo necessaria.

### Step 4: Verificar novamente o collector

```bash
docker logs <container_id_otel_collector>
```

Se ainda nao recebe dados, o problema e formatacao dos logs (console.log puro nao e processado).

### Step 5: Estruturar os logs

Console.log simples nao sera coletado. E necessario usar uma lib de logging estruturado (Winston, Pino) com formatacao compativel com OpenTelemetry.

## Heuristics

| Situacao | Acao |
|----------|------|
| Logs nao aparecem no Grafana Loki | Comece verificando `docker logs` do collector |
| Collector sem dados recebidos | Problema esta na aplicacao → habilite DiagSetLog |
| Erro "connection refused 4318" | Verifique se collector esta expondo a porta no docker-compose |
| Funciona local mas nao no cluster | Use `OTEL_EXPORTER_OTLP_ENDPOINT` como env var |
| Collector recebe mas Grafana vazio | Verifique config do exporter no `otel-collector-config.yaml` |
| Porta 3000 ocupada | Grafana e API competindo — mude API para 3001 |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Hardcode URL do collector no codigo | Use `OTEL_EXPORTER_OTLP_ENDPOINT` env var |
| Depurar a aplicacao sem checar o collector | `docker logs` do collector primeiro |
| Enviar console.log puro como telemetria | Use logging estruturado (Winston/Pino) |
| Usar mesma porta para API e Grafana | API em 3001, Grafana em 3000 |
| Remover DiagSetLog antes de confirmar que funciona | Mantenha ate pipeline estavel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
