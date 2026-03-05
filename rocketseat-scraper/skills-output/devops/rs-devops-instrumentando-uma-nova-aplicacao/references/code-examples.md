# Code Examples: Instrumentando uma Nova Aplicacao

## Estrutura de arquivos do app2

```
app2/
├── src/
│   ├── tracer.ts          # Copiado do app1, com serviceName alterado
│   ├── infra/
│   │   └── log.ts         # Configuracao do Pino logger (copiado do app1)
│   ├── app.module.ts      # Modulo padrao NestJS
│   ├── app.controller.ts  # Controller padrao
│   ├── app.service.ts     # Service padrao
│   └── main.ts            # Entry point com tracer init
├── package.json
└── .yarnrc.yml
```

## main.ts completo do app2

```typescript
import './tracer'; // Primeira linha — OBRIGATORIO

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from './infra/log';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
  log.info('Aplicacao 2 subiu');
}

bootstrap().catch(() => {
  log.error('Aplicacao 2 nao subiu');
});
```

## tracer.ts — diferencas para app2

```typescript
// Unicas alteracoes necessarias em relacao ao app1:
const serviceName = 'app-rocketseat-2';  // Era 'app-rocketseat'
const serviceVersion = '2.0';            // Era '1.0'
```

## Configuracao do package.json

```json
{
  "name": "app2",
  "packageManager": "yarn@3.4.1",
  "scripts": {
    "start:dev": "nest start --watch"
  }
}
```

## Comandos de setup completos

```bash
# 1. Criar app
nest new app2 --package-manager yarn

# 2. Entrar no diretorio
cd app2

# 3. Copiar arquivos de instrumentacao do app1
cp ../app/src/tracer.ts src/
cp -r ../app/src/infra src/

# 4. Instalar dependencias de OpenTelemetry + logging
yarn add @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-grpc \
  @opentelemetry/exporter-logs-otlp-grpc \
  @opentelemetry/sdk-logs \
  @opentelemetry/resources \
  @opentelemetry/semantic-conventions \
  pino pino-pretty

# 5. Configurar variavel de ambiente
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# 6. Iniciar
yarn run start:dev
```

## Verificacao no Grafana — Loki

Query para ver logs do app2:
```
{service_name="app-rocketseat-2"}
```

Resultado esperado:
```json
{
  "service_name": "app-rocketseat-2",
  "service_version": "2.0",
  "message": "Aplicacao 2 subiu"
}
```

## Verificacao no Grafana — Tempo

Ao buscar traces, o servico `app-rocketseat-2` deve aparecer como opcao no dropdown de `service.name`. O `service.version` aparece como atributo do resource nos spans.

## Arquitetura das duas apps rodando

```
┌─────────────┐     ┌─────────────┐
│   app1      │     │   app2      │
│  :3001      │     │  :3002      │
│  v1.0       │     │  v2.0       │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └───────┬───────────┘
               │
        ┌──────▼──────┐
        │  OTel       │
        │  Collector  │
        │  :4317      │
        └──────┬──────┘
               │
       ┌───────┼───────┐
       │       │       │
  ┌────▼──┐ ┌─▼────┐ ┌▼─────┐
  │ Tempo │ │ Loki │ │ ...  │
  └───────┘ └──────┘ └──────┘
```