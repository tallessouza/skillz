# Deep Explanation: Prisma Database Seed

## Por que seed existe?

Seed resolve o problema de popular o banco de dados com dados iniciais de forma reproduzivel. Em vez de inserir manualmente via SQL ou Prisma Studio, voce define os dados em codigo — versionavel, compartilhavel, e executavel por qualquer membro do time.

## O padrao createMany

O instrutor usa `prisma.user.createMany` em vez de multiplas chamadas `create` porque:

1. **Performance** — `createMany` gera um unico INSERT com multiplos VALUES, em vez de N queries separadas
2. **Atomicidade** — todos os registros sao inseridos na mesma operacao
3. **Simplicidade** — um unico await em vez de Promise.all ou loop

## Fluxo async/disconnect

O padrao ensinado:

```typescript
seed()
  .then(() => console.log('Database seeded'))
  .finally(async () => await prisma.$disconnect())
```

O `.finally()` garante que a conexao e fechada independente de sucesso ou erro. Isso e importante porque:
- O PrismaClient mantem um connection pool aberto
- Se nao desconectar, o processo Node pode ficar pendurado
- Em scripts one-off (como seed), sempre desconecte

## Configuracao no package.json

A propriedade `prisma` no package.json e lida pelo Prisma CLI — nao e um script npm. Por isso fica FORA de `scripts`. O Prisma CLI procura essa configuracao para saber como executar o seed.

Fluxo:
1. `npx prisma db seed` e executado
2. Prisma CLI le `package.json` → encontra `prisma.seed`
3. Executa o comando definido (`tsx prisma/seed.ts`)

## Quando o seed roda automaticamente

- `npx prisma migrate reset` — reseta o banco e roda seed
- `npx prisma migrate dev` — se o banco foi criado do zero, roda seed
- `npx prisma db seed` — execucao manual explicita

## Limitacoes do createMany

- Nao retorna os registros criados (diferente de `create`)
- Nao suporta relacoes aninhadas (nested creates)
- Para dados com relacoes, use `create` individual ou transacoes