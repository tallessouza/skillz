# Code Examples: Debugando o Envio de Logs

## 1. Verificando containers e logs do collector

```bash
# Listar todos os containers rodando
docker ps

# Output esperado inclui algo como:
# CONTAINER ID   IMAGE                           PORTS                    NAMES
# abc123         otel/opentelemetry-collector     0.0.0.0:4318->4318/tcp  otel-collector
# def456         grafana/grafana                  0.0.0.0:3000->3000/tcp  grafana

# Ver logs do collector
docker logs abc123

# Se nao esta recebendo dados, output sera algo como:
# "Everything is ready. Begin running and processing data."
# (sem linhas adicionais de dados recebidos)
```

## 2. Habilitando DiagSetLog no tracer

```typescript
// No arquivo de setup do tracer (ex: tracer.ts)
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Habilitar ANTES de inicializar o SDK
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Agora ao rodar a aplicacao, voce vera logs como:
// @opentelemetry/api: Registered a global for diag v1.x
// @opentelemetry/exporter-trace-otlp-http: POST http://localhost:4318/v1/traces
// Error: connect ECONNREFUSED 127.0.0.1:4318
```

## 3. Configurando endpoint via codigo

```typescript
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Opcao A: URL explicita
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318'
});

// Opcao B: URL com IP direto (se localhost nao resolver)
const exporter = new OTLPTraceExporter({
  url: 'http://127.0.0.1:4318'
});
```

## 4. Configurando endpoint via variavel de ambiente (RECOMENDADO)

```bash
# Exportar variavel antes de rodar a aplicacao
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318

# Rodar a aplicacao normalmente
yarn run dev

# A lib do OpenTelemetry automaticamente busca essa variavel
# Nenhuma configuracao adicional no codigo e necessaria
```

```typescript
// No codigo, basta instanciar sem url:
const exporter = new OTLPTraceExporter();
// A lib busca OTEL_EXPORTER_OTLP_ENDPOINT automaticamente
```

## 5. Docker Compose — porta do collector

```yaml
# docker-compose.yml (trecho relevante)
services:
  otel-collector:
    image: otel/opentelemetry-collector
    ports:
      - "4318:4318"  # OTLP HTTP receiver
    # ...

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"  # Grafana UI
    # ...
```

## 6. Evitando conflito de porta

```typescript
// Se Grafana esta na 3000, use 3001 para a API
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Aplicacao subiu na porta ${PORT}`);
});
```

## 7. Logs simples vs estruturados (o problema)

```typescript
// NAO FUNCIONA com OpenTelemetry pipeline:
console.log("aplicacao subiu");
console.error("aplicacao nao subiu");

// O collector IGNORA esses logs porque nao estao em formato OTLP
// Na proxima aula: configurar Winston/Pino para formato estruturado
```

## 8. Checklist de debug completo

```bash
# 1. Verificar se collector esta rodando
docker ps | grep otel

# 2. Verificar logs do collector
docker logs <container_id>

# 3. Verificar se porta esta acessivel
curl -v http://localhost:4318/v1/traces

# 4. Habilitar DiagSetLog na aplicacao e verificar output

# 5. Se erro de conexao: verificar docker-compose ports

# 6. Se sem erro mas sem dados no Grafana: problema de formatacao de logs
```