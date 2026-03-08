---
name: rs-devops-chamadas-distribuidas
description: "Applies distributed tracing patterns when structuring inter-service HTTP calls in NestJS applications. Use when user asks to 'call another service', 'make HTTP request between microservices', 'configure service-to-service communication', 'setup distributed tracing', or 'instrument API calls'. Ensures proper module organization, Undici usage for performance, and observability-ready code structure. Make sure to use this skill whenever building communication between NestJS services in an observable architecture. Not for single-app REST endpoints, database queries, or message queue setups."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: observabilidade-traces-distribuidos
  tags: [nestjs, undici, distributed-tracing, microservices, opentelemetry]
---

# Estrutura de Chamadas Distribuidas entre Aplicacoes

> Ao configurar chamadas entre servicos, organize cada dominio em modulo proprio e use Undici para performance, garantindo que a instrumentacao de traces funcione corretamente.

## Rules

1. **Um modulo por dominio** — crie `domain/{entity}/` com controller, service e module separados, porque o controller raiz cresce de forma insustentavel e quebra a visibilidade nos traces
2. **Use Undici ao inves de Axios** — Undici tem performance significativamente superior e e compativel com instrumentacao OpenTelemetry out-of-the-box
3. **Servico upstream retorna dados, servico downstream consome** — o app que possui o dominio serve os dados, o app que precisa faz a chamada HTTP
4. **Deserialize o body explicitamente** — use `await body.json()` do Undici, nunca confie em deserializacao implicita
5. **Logue status code e payload** — cada chamada inter-servico deve logar o resultado para correlacao com traces
6. **Tipagem minima no retorno** — defina a shape do retorno (mesmo sem Zod), porque traces sem tipo dificultam debug

## Steps

### Step 1: Criar estrutura de dominio no servico upstream (quem serve)

```
app2/src/domain/users/
├── user.module.ts
├── user.controller.ts
└── user.service.ts
```

```typescript
// user.service.ts
@Injectable()
export class UserService {
  list(): { name: string; email: string }[] {
    return [
      { name: 'user1', email: 'user1@site.com' },
      { name: 'user2', email: 'user2@site.com' },
    ];
  }
}
```

```typescript
// user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  list(): { name: string; email: string }[] {
    return this.userService.list();
  }
}
```

```typescript
// user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

### Step 2: Registrar modulo no app.module

```typescript
// app.module.ts
@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Step 3: Configurar chamada no servico downstream (quem consome)

```bash
yarn add undici
```

```typescript
// app1/src/domain/users/user.service.ts
import { request } from 'undici';

@Injectable()
export class UserService {
  async list(): Promise<{ name: string; email: string }[]> {
    const { statusCode, body } = await request(
      'http://localhost:3002/users',
    );
    const payload = await body.json();
    console.info({ statusCode, payload });
    return JSON.stringify(payload);
  }
}
```

### Step 4: Verificar instrumentacao

- Acesse o endpoint downstream (ex: `localhost:3000/users`)
- Confirme no Grafana/Jaeger que o trace mostra a cadeia completa: controller → servico HTTP → app2
- Verifique o tempo gasto em cada span (ex: 5ms na app2)

## Heuristics

| Situacao | Faca |
|----------|------|
| Servico precisa de dados de outro servico | Crie modulo espelho no downstream com service que faz HTTP call |
| Performance e critica nas chamadas | Use Undici em vez de Axios |
| Precisa validar shape do retorno | Use Zod no service do downstream |
| Trace nao mostra chamada distribuida | Verifique se OpenTelemetry HttpInstrumentation esta ativo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar rota de users no AppController | Criar UserController em modulo proprio |
| Usar Axios para chamadas internas | Usar Undici (performance superior) |
| Ignorar deserializacao do body | Sempre `await body.json()` explicitamente |
| Chamada HTTP sem log do resultado | Logar statusCode e payload para correlacao |
| Hardcode de URL sem variavel | Usar config/env para URLs de servicos |

## Troubleshooting

### Trace nao mostra a chamada HTTP entre servicos
**Symptom:** No Grafana/Jaeger o trace mostra apenas o servico downstream, sem o span da chamada ao upstream
**Cause:** HttpInstrumentation do OpenTelemetry nao esta ativo ou Undici nao esta sendo instrumentado
**Fix:** Verifique se `getNodeAutoInstrumentations()` esta configurado no tracer.ts e que Undici esta instalado corretamente

## Deep reference library

- [deep-explanation.md](../../../data/skills/devops/rs-devops-configurando-chamadas-distribuidas-na-nossa-nova-aplicacao/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/devops/rs-devops-configurando-chamadas-distribuidas-na-nossa-nova-aplicacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
