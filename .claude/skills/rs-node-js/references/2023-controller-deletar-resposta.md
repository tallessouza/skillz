---
name: rs-node-js-2023-controller-deletar-resposta
description: "Applies NestJS delete controller pattern when building REST endpoints for deleting resources. Use when user asks to 'create a delete endpoint', 'add delete controller', 'implement resource deletion in NestJS', or 'create CRUD delete'. Follows pattern: copy similar controller, swap entity, wire use case, create e2e test with factories. Make sure to use this skill whenever creating delete endpoints in NestJS Clean Architecture projects. Not for database layer, use case logic, or non-NestJS frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controller: Deletar Recurso (NestJS Clean Architecture)

> Ao criar um controller de delete, copie o controller de delete mais similar, troque a entidade, conecte o use case, e crie o teste e2e com factories.

## Rules

1. **Copie o controller similar mais proximo** — nao comece do zero, copie o delete de outra entidade e troque os nomes, porque a estrutura e identica entre deletes
2. **Use HTTP 204 No Content** — delete bem-sucedido retorna 204, sem body, porque nao ha conteudo para retornar apos exclusao
3. **Receba o ID via parametro de rota** — `@Param('id')` para identificar o recurso, porque delete opera sobre um recurso especifico
4. **Registre o controller no modulo e conecte o use case** — marque o use case com `@Injectable()` e adicione nos providers, porque NestJS precisa do registro para injecao de dependencia
5. **Crie factories no teste e2e para todas as dependencias** — se deletar Answer precisa de Question, crie ambas as factories, porque o teste precisa de dados reais no banco
6. **Verifique que o registro foi removido do banco** — apos o delete, busque pelo ID e confirme que nao existe, porque 204 sozinho nao garante que deletou

## How to write

### Controller de Delete

```typescript
@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') answerId: string) {
    await this.deleteAnswer.execute({ answerId })
  }
}
```

### Teste E2E

```typescript
test('[DELETE] /answers/:id', async () => {
  const user = await studentFactory.makePrismaStudent()
  const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
  const answer = await answerFactory.makePrismaAnswer({
    authorId: user.id,
    questionId: question.id,
  })

  const answerId = answer.id.toString()

  const response = await request(app.getHttpServer())
    .delete(`/answers/${answerId}`)
    .set('Authorization', `Bearer ${jwt}`)

  expect(response.statusCode).toBe(204)

  const answerOnDatabase = await prisma.answer.findUnique({
    where: { id: answerId },
  })

  expect(answerOnDatabase).toBeNull()
})
```

## Example

**Before (erro comum — factory faltando nos providers):**
```typescript
// Esqueceu de registrar AnswerFactory nos providers do teste
// Esqueceu de instanciar answerFactory no beforeAll
// Resultado: erro de injecao de dependencia
```

**After (correto):**
```typescript
beforeAll(async () => {
  // Registrar TODAS as factories nos providers
  const moduleRef = await Test.createTestingModule({
    providers: [AnswerFactory, QuestionFactory, StudentFactory],
  }).compile()

  // Instanciar TODAS as factories
  answerFactory = moduleRef.get(AnswerFactory)
  questionFactory = moduleRef.get(QuestionFactory)
  studentFactory = moduleRef.get(StudentFactory)
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo delete controller | Copie o delete mais similar, troque nomes |
| Erro 500 no teste e2e | Adicione try-catch com console.log para ver o erro real |
| "Record to delete does not exist" | Verifique se o repositorio esta operando na entidade correta |
| Teste falha com erro de DI | Verifique se factory esta nos providers E instanciada no beforeAll |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Retornar 200 em delete | Retornar `@HttpCode(204)` |
| Testar so o status code | Verificar que o registro foi removido do banco |
| Esquecer factories de dependencias | Criar factories para toda a cadeia (Student → Question → Answer) |
| Copiar repositorio sem revisar imports | Verificar que todos os imports apontam para a entidade correta |
| Ignorar erro 500 no teste | Adicionar try-catch temporario para debugar |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-deletar-resposta/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controller-deletar-resposta/references/code-examples.md) — Todos os exemplos de código expandidos com variações
