---
name: rs-node-js-2023-testando-detalhes-pergunta
description: "Enforces test maintenance when in-memory repository dependencies change in NestJS clean architecture projects. Use when user asks to 'add dependency to repository', 'update in-memory repository constructor', 'fix failing tests after refactor', or 'test response details with relations'. Ensures all test files instantiating affected repositories are updated with new dependencies, even when unused. Make sure to use this skill whenever changing repository constructors or adding relations to use cases. Not for production code, database migrations, or E2E tests."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [testing, repository-dependencies, in-memory, constructor, type-safety]
---

# Manutenção de Testes ao Alterar Dependências de Repositórios

> Quando um repositório in-memory ganha novas dependências, TODOS os testes que o instanciam devem ser atualizados, mesmo que não usem essas dependências.

## Rules

1. **Atualize TODOS os arquivos de teste que instanciam o repositório alterado** — porque TypeScript exige os parâmetros mesmo que o teste não use aquela funcionalidade
2. **Testes passam mesmo sem a correção** — porque Vitest não faz checagem de tipos antes de rodar, o erro é apenas de tipagem. Corrija mesmo assim para manter o código correto
3. **Mantenha a ordem dos parâmetros do constructor** — passe dependências na mesma ordem definida no constructor do repositório
4. **Ao testar detalhes com relações, crie e persista as entidades relacionadas** — crie o autor, salve no repositório de estudantes, crie anexos, salve nos repositórios correspondentes
5. **Verifique que dados relacionados retornam corretamente** — teste que `author`, `attachments` e outros campos de relação aparecem na resposta do use case

## Steps

### Step 1: Identificar repositórios afetados

Quando um `InMemory*Repository` ganha novas dependências no constructor, liste todos os arquivos de teste que o instanciam.

### Step 2: Criar instâncias das novas dependências em cada teste

```typescript
// No beforeEach de cada teste afetado
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository

inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
inMemoryStudentsRepository = new InMemoryStudentsRepository()

// Passe na ordem correta do constructor
inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
  inMemoryAttachmentsRepository,
  inMemoryStudentsRepository,
)
```

### Step 3: Testar retorno de detalhes com relações

```typescript
it('should return question details with author and attachments', async () => {
  const student = makeStudent({ name: 'John Doe' })
  inMemoryStudentsRepository.items.push(student)

  const question = makeQuestion({ authorId: student.id })
  inMemoryQuestionsRepository.items.push(question)

  const attachment = makeAttachment({ title: 'Some attachment' })
  inMemoryAttachmentsRepository.items.push(attachment)

  inMemoryQuestionAttachmentsRepository.items.push(
    makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    }),
  )

  const result = await sut.execute({ slug: question.slug.value })

  expect(result.value).toMatchObject({
    question: expect.objectContaining({
      title: question.title,
      author: 'John Doe',
      attachments: [
        expect.objectContaining({ title: 'Some attachment' }),
      ],
    }),
  })
})
```

## Heuristics

| Situação | Ação |
|----------|------|
| Adicionou dependência ao constructor de repositório | Busque TODOS os `.spec.ts` que instanciam esse repositório |
| Teste passa mas IDE mostra erro de tipo | Corrija — é dependência faltando no constructor |
| Muitos arquivos para atualizar | Copie as linhas de criação e vá colando em cada `beforeEach` |
| Repositório tem dependência que também tem dependência | Crie a dependência interna primeiro (ex: `StudentsRepository` antes de `AnswerCommentsRepository`) |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Ignorar erro de tipo porque o teste passa | Adicionar as dependências faltantes |
| Passar `null` ou `undefined` como dependência | Criar instância real do repositório in-memory |
| Criar a pergunta sem `authorId` quando testa detalhes | Criar um `student` e passar `authorId: student.id` |
| Testar apenas o título sem verificar relações | Verificar `author`, `attachments` e outros campos |

## Troubleshooting

### Erro de tipo ao instanciar repositorio in-memory apos refactor
**Symptom:** IDE mostra erro no constructor do InMemoryQuestionsRepository mas testes passam
**Cause:** Repositorio ganhou novas dependencias no constructor mas os testes nao foram atualizados — Vitest nao checa tipos
**Fix:** Atualize TODOS os arquivos de teste que instanciam o repositorio, passando as novas dependencias na ordem correta

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
