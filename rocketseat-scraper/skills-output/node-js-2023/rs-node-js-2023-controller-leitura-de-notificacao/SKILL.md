---
name: rs-node-js-2023-controller-leitura-notificacao
description: "Applies NestJS controller creation pattern for read/update operations following Clean Architecture. Use when user asks to 'create a controller', 'add a PATCH endpoint', 'mark as read', 'create notification endpoint', or 'wire use case to controller'. Enforces PATCH for single-field updates, 204 No Content for void routes, recipient authorization, and e2e test with factory pattern. Make sure to use this skill whenever creating NestJS controllers that update a single field or trigger a state change. Not for full CRUD generation, GraphQL resolvers, or event-driven notification sending."
---

# Controller de Leitura (PATCH para Atualização Parcial)

> Quando um controller atualiza uma unica informacao de uma entidade, use PATCH com 204 No Content e valide ownership pelo usuario autenticado.

## Rules

1. **Use PATCH para atualizacao de campo unico** — `@Patch()` nao `@Put()`, porque PATCH semanticamente indica atualizacao parcial de um recurso, nao substituicao completa
2. **Retorne 204 No Content para rotas sem body de resposta** — `@HttpCode(204)` porque a operacao nao produz dados para o cliente, apenas muda estado
3. **Valide ownership pelo recipient** — sempre compare `recipientId` com `user.sub` do token, porque o usuario so pode ler/modificar notificacoes destinadas a ele
4. **Registre controller e use case no modulo HTTP** — adicione o controller em `controllers` e o use case em `providers` do modulo, porque NestJS precisa de ambos registrados para injecao funcionar
5. **Adicione `@Injectable()` no use case** — sem o decorator, o NestJS nao consegue injetar o repositorio no use case
6. **Erros genericos usam BadRequest** — quando os erros do use case sao genericos (sem tipo especifico), lance `BadRequestException` como fallback

## How to write

### Controller PATCH com 204

```typescript
@Controller('/notifications/:notificationId')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch('/read')
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
```

### Registro no modulo HTTP

```typescript
// http.module.ts
@Module({
  controllers: [
    // ... outros controllers
    ReadNotificationController,
  ],
  providers: [
    // ... outros use cases
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
```

### E2E test com factory de notificacao

```typescript
describe('ReadNotificationController (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  let prisma: PrismaService
  let jwt: JwtService

  // ... setup

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const notificationId = notification.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: { recipientId: user.id.toString() },
    })

    expect(notificationOnDatabase.readAt).not.toBeNull()
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualiza um unico campo (readAt, status) | PATCH + 204 No Content |
| Substitui o recurso inteiro | PUT + 200 com body |
| Cria um sub-recurso (evento de leitura) | POST tambem seria aceitavel |
| Rota sem retorno de dados | HttpCode(204), sem return |
| Use case nao tem erros especificos | BadRequestException generico |
| Factory existe no dominio mas nao no Prisma | Criar PrismaFactory estendendo a de dominio |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `@Put()` para marcar como lido | `@Patch()` para atualizacao parcial |
| `return { message: 'ok' }` em rota void | `@HttpCode(204)` sem return |
| Ler notificacao sem checar recipientId | Passar `recipientId: user.sub` ao use case |
| Use case sem `@Injectable()` | Adicionar decorator para habilitar DI |
| Testar todos controllers de uma vez | `--source` flag para testar controller especifico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
