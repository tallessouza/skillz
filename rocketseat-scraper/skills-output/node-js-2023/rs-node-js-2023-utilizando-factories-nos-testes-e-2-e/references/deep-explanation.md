# Deep Explanation: Factories nos Testes E2E

## Por que duas camadas de factory?

O instrutor explica que ja existem factories no projeto (em `test/factories/`) que criam entidades a nivel de dominio. Porem, nos testes E2E, as entidades precisam existir no banco de dados real (Prisma). A abordagem ingenua seria usar a factory de dominio + mapper manualmente em cada teste:

```typescript
const question = makeQuestion()
await prisma.question.create({
  data: PrismaQuestionMapper.toPrisma(question),
})
```

Isso funciona, mas gera duas linhas repetidas em cada teste. A solucao e encapsular esse padrao em uma factory de persistencia que faz ambos os passos internamente.

## O problema do PrismaService nao encontrado

Um ponto critico que o instrutor destaca: ao rodar os testes com a factory injetavel, o NestJS reclama que `PrismaService` nao faz parte do `RootTestModule`. Isso acontece porque:

1. `AppModule` importa `HttpModule`
2. `HttpModule` importa `DatabaseModule` (que tem o `PrismaService`)
3. `DatabaseModule` exporta `PrismaService` — mas apenas para `HttpModule`
4. `HttpModule` **nao reexporta** `PrismaService` para o `AppModule`

Portanto, o `PrismaService` nao esta disponivel no escopo raiz do modulo de teste. A solucao e importar `DatabaseModule` diretamente no `createTestingModule`.

## Relacao entre entidades nos testes

Quando uma entidade depende de outra (ex: `Question` precisa de `authorId`), o instrutor mostra que voce deve:

1. Criar a entidade pai primeiro via factory
2. Passar o ID como override na factory filha
3. Usar `.id` direto (sem `.toString()`) quando a factory aceita `UniqueEntityId`

## Valores fixos vs aleatorios

O instrutor encontra um bug ao rodar os testes: o teste esperava `question-01` como slug, mas a factory gerou um valor aleatorio. A licao e clara: **sempre que o teste valida um valor especifico, passe esse valor como override na factory**. Nunca confie em valores gerados aleatoriamente quando o assert depende deles.

## Testes E2E vivem na camada de infraestrutura

O instrutor justifica que nao ha problema em depender de Prisma nos testes E2E porque esses testes ja vivem na camada de infraestrutura. A separacao de camadas se aplica ao codigo de producao, nao aos testes que validam a integracao real.