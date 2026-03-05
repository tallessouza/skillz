# Deep Explanation: Implementando QuestionsRepository

## Por que mappers bidirecionais?

O instrutor explica que quando voce tem uma entidade de dominio com value objects (como `Slug`, `UniqueEntityID`), o Prisma nao entende esses tipos. O `toDomain()` converte de Prisma para dominio, mas voce tambem precisa do caminho inverso — `toPrisma()` — para persistir.

A alternativa seria montar o objeto manualmente dentro de cada metodo do repository, mas isso e "exatamente o trabalho do mapper" — voce estaria convertendo de um formato para outro inline, violando a separacao de responsabilidades.

## UncheckedCreateInput vs CreateInput

O Prisma gera duas tipagens para criacao:
- `QuestionCreateInput`: todos os campos obrigatorios, incluindo `id`
- `QuestionUncheckedCreateInput`: campos como `id` sao opcionais, porque o Prisma pode gera-los automaticamente

O instrutor prefere `UncheckedCreateInput` porque, embora a aplicacao gere o ID internamente, a tipagem e mais flexivel. Ele menciona: "pode ser que talvez para voce nao funcione, mas para mim eu sempre uso essa ai" — indicando que e uma preferencia pratica, nao uma regra absoluta.

## Paginacao com take/skip

A logica de paginacao:
- `take: 20` — quantos itens retornar
- `skip: (page - 1) * 20` — quantos itens pular

Na pagina 1: skip 0 (pula nada). Na pagina 2: skip 20 (pula a primeira pagina). O instrutor destaca que esse calculo "vai pular exatamente 20 itens a partir da segunda pagina".

## Trick do .map com funcao estatica

O instrutor mostra dois estilos equivalentes:

```typescript
// Verboso
questions.map((question) => PrismaQuestionMapper.toDomain(question))

// Conciso — funciona porque toDomain aceita exatamente um argumento
questions.map(PrismaQuestionMapper.toDomain)
```

Ele chama isso de "hackzinho" e explica: "como esse toDomain e uma funcao e o metodo map recebe uma funcao passando para ele o valor de cada um dos itens da iteracao, vai funcionar tambem dessa forma."

## create vs save vs delete

- **create**: `prisma.question.create({ data })` — insere novo registro
- **save**: `prisma.question.update({ where: { id: data.id }, data })` — atualiza registro existente
- **delete**: `prisma.question.delete({ where: { id } })` — remove registro

O instrutor inicialmente confunde create com save no codigo e corrige durante a aula, mostrando que a diferenca principal e `create` vs `update` no Prisma, e que o `update` precisa do `where` para identificar o registro.

## Consistencia com InMemoryRepository

O repositorio Prisma implementa a mesma interface que o `InMemoryQuestionsRepository` usado nos testes. Isso garante que os testes unitarios com o in-memory validam o mesmo contrato que a implementacao real usa.