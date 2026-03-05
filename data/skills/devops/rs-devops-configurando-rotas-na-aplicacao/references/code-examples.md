# Code Examples: Rotas de Health Check para Kubernetes

## Exemplo completo da aula

### Estrutura de arquivos

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── health/
    ├── health.controller.ts
    └── health.service.ts
```

### health/health.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Rota para Startup Probe e Liveness Probe
  // Testa: "a aplicacao esta viva?"
  @Get('health')
  checkHealth() {
    return this.healthService.checkHealth();
  }

  // Rota para Readiness Probe
  // Testa: "a aplicacao esta pronta para receber trafego?"
  @Get('ready')
  checkReady() {
    return this.healthService.checkReady();
  }
}
```

### health/health.service.ts

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  // Verifica vivacidade — apenas se o processo esta rodando
  checkHealth(): string {
    return 'ok';
  }

  // Verifica prontidao — aqui entraria teste de dependencias
  // Como esta app nao tem dependencias externas, retorna ok direto
  checkReady(): string {
    return 'ok';
  }
}
```

### app.module.ts (atualizado)

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
```

## Variacao: com Terminus para dependencias externas

```typescript
// health/health.module.ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

```typescript
// health/health.controller.ts (com Terminus)
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  checkHealth() {
    // Liveness: apenas verifica se o processo responde
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  checkReady() {
    // Readiness: pinga banco e servico externo
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.http.pingCheck('api-externa', 'https://api.example.com/health'),
    ]);
  }
}
```

## Testando localmente

```bash
# Iniciar aplicacao
npm run start:dev

# Testar liveness
curl http://localhost:3000/health
# Resposta: ok

# Testar readiness
curl http://localhost:3000/ready
# Resposta: ok
```

## Build e push da imagem Docker

```bash
# Build com tag versionada
docker build -t minha-app:v6 .

# Push para registry
docker push minha-app:v6
```

## Mapeamento para probes do Kubernetes (preview)

```yaml
# Sera configurado no deployment (proxima aula)
livenessProbe:
  httpGet:
    path: /health
    port: 3000

readinessProbe:
  httpGet:
    path: /ready
    port: 3000

startupProbe:
  httpGet:
    path: /health
    port: 3000
```