---
name: rs-devops-configurando-rotas-health
description: "Applies Kubernetes health check route patterns when building NestJS applications with liveness, readiness, or startup probes. Use when user asks to 'add health check', 'create readiness endpoint', 'configure k8s probes', 'add liveness route', or 'setup health controller'. Ensures proper separation between /health and /ready endpoints with correct probe mapping. Make sure to use this skill whenever creating health check infrastructure for containerized NestJS apps. Not for general REST API design, database health checks with Terminus, or Kubernetes manifest configuration."
---

# Rotas de Health Check para Kubernetes

> Separe rotas de health check por escopo: vivacidade (/health) e prontidão (/ready), porque cada probe do Kubernetes tem uma responsabilidade distinta.

## Rules

1. **Crie um modulo Health separado** — controller e service dedicados em pasta `health/`, porque health checks nao sao logica de negocio e devem ser isolados
2. **Duas rotas minimas: `/health` e `/ready`** — `/health` para liveness/startup probe, `/ready` para readiness probe, porque cada probe valida um aspecto diferente da aplicacao
3. **Readiness testa dependencias externas** — se a app tem banco, cache ou API externa, `/ready` deve pingar essas dependencias, porque readiness significa "pronto para receber trafego"
4. **Liveness testa apenas a propria aplicacao** — `/health` retorna OK se o processo esta vivo, sem testar dependencias externas, porque liveness so precisa saber se o container travou
5. **Use Terminus para dependencias complexas** — quando ha multiplos servicos externos, `@nestjs/terminus` faz ping automatico e agrega resultados, porque evita reimplementar health checks manualmente
6. **Registre controller e service no AppModule** — declare `HealthController` em controllers e `HealthService` em providers, porque NestJS nao descobre automaticamente

## How to write

### Health Controller

```typescript
// health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  checkHealth() {
    return this.healthService.checkHealth();
  }

  @Get('ready')
  checkReady() {
    return this.healthService.checkReady();
  }
}
```

### Health Service

```typescript
// health/health.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  checkHealth(): string {
    return 'ok';
  }

  checkReady(): string {
    // Sem dependencias externas: retorna ok direto
    // Com dependencias: pingar banco, cache, APIs aqui
    return 'ok';
  }
}
```

### Registro no AppModule

```typescript
@Module({
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
```

## Example

**Before (rota unica generica):**
```typescript
@Get('health')
health() {
  return 'ok'; // Mesma rota para tudo — sem separacao de escopo
}
```

**After (separacao por responsabilidade):**
```typescript
@Get('health')   // Liveness + Startup: app esta viva?
checkHealth() { return this.healthService.checkHealth(); }

@Get('ready')    // Readiness: app esta pronta para trafego?
checkReady() { return this.healthService.checkReady(); }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App sem dependencias externas | `/health` e `/ready` retornam `ok` diretamente |
| App com banco de dados | `/ready` pinga o banco antes de retornar ok |
| App com multiplas dependencias | Use `@nestjs/terminus` no `/ready` |
| Precisa de uma unica rota por simplicidade | Pode usar so `/health`, mas perde granularidade de probes |
| Antes de configurar probes no K8s | Teste as rotas localmente com `npm run start:dev` + curl |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Health check dentro do AppController | Controller dedicado em pasta `health/` |
| Testar banco de dados no liveness | Testar banco apenas no readiness (`/ready`) |
| Rota unica para todas as probes | Separar `/health` (liveness) e `/ready` (readiness) |
| Esquecer de registrar no AppModule | Declarar controller e service no module |
| Implementar ping manual para cada servico | Usar `@nestjs/terminus` para agregar health checks |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
