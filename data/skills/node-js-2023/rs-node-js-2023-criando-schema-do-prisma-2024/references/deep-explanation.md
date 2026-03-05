# Deep Explanation: Criando Schema do Prisma

## Por que nomear relacionamentos?

Quando um model tem duas ou mais references para a mesma tabela, o Prisma nao consegue inferir automaticamente qual campo pertence a qual relacionamento. No caso da `Question`:

- `bestAnswer Answer?` — relacao 1:1 opcional (a melhor resposta)
- `answers Answer[]` — relacao 1:N (todas as respostas)

Ambas apontam para `Answer`. Sem nomes explicitos, o Prisma gera erro de ambiguidade. A solucao e usar `@relation("bestAnswer")` em ambos os lados do par bestAnswer, e implicitamente (ou explicitamente) nomear o outro par.

## Por que `@unique` no bestAnswerId?

O instrutor explica que o Prisma sugere isso por dois motivos:

1. **Indice de performance** — `@unique` cria um indice no banco, acelerando buscas por bestAnswerId
2. **Integridade de dominio** — uma answer so pode ser a melhor resposta de UMA question. Nao faz sentido a mesma resposta ser "best answer" de duas perguntas diferentes, porque cada resposta esta atrelada a uma unica pergunta.

## O problema do `null` vs `undefined`

Campos opcionais no Prisma retornam `null` (nao `undefined`) quando vazios no banco. Isso afeta o mapeamento para o dominio:

```typescript
// No mapper, tratar null explicitamente
const bestAnswerId = raw.bestAnswerId
  ? new UniqueEntityId(raw.bestAnswerId)
  : null

// No domain entity, o tipo precisa aceitar null
bestAnswerId: UniqueEntityId | null
```

O metodo setter tambem precisa aceitar `null`:
```typescript
set bestAnswerId(value: UniqueEntityId | null | undefined) { ... }
```

Sem isso, ha incompatibilidade entre o que o Prisma retorna e o que o dominio aceita.

## Enums no Postgres via Prisma

O Prisma traduz `enum` para um tipo enum nativo do Postgres. Isso e melhor que uma String porque:

- O banco valida os valores (nao aceita "admin" se so existe STUDENT/INSTRUCTOR)
- Queries com enum sao mais performaticas
- Migracao automatica cria o tipo no banco

O `@default(STUDENT)` garante que todo usuario criado sem role explicita sera aluno.

## Extensao do Prisma e Format on Save

O instrutor menciona que a extensao do Prisma no VS Code com "format on save" cria automaticamente os relacionamentos inversos. Ao definir `authorId` com `@relation` em Answer, o Prisma adiciona automaticamente `answers Answer[]` no model User. Isso economiza trabalho mas requer revisao — os nomes gerados automaticamente nem sempre sao ideais (o instrutor renomeia `answer` para `answers`).

## Estrategia incremental

O instrutor opta por criar apenas Question e Answer primeiro, deixando Attachment e Comment para depois. A justificativa e pragmatica: criar tudo de uma vez dificulta lembrar das decisoes e aumenta risco de erro. Migrations incrementais sao mais seguras.

## Comando de migration

```bash
pnpm prisma migrate dev --name create-answers-and-user-role
```

O nome da migration descreve TODAS as alteracoes feitas (nao apenas uma). Isso facilita o historico.