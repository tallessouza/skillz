# Deep Explanation: Consultas com Prisma ORM

## Por que `contains` em vez de igualdade exata?

Quando voce passa um valor direto no `where` (ex: `where: { title: "Prisma" }`), o Prisma gera um `WHERE title = 'Prisma'` no SQL. Isso significa:

- "prisma" (minusculo) → nao encontra
- "Prisma " (com espaco) → nao encontra
- "Pris" (substring) → nao encontra

O instrutor demonstrou isso ao vivo: ao buscar "Prisma" com igualdade exata, qualquer variacao minima (um espaco a mais, casing diferente) fazia a busca retornar vazio.

A solucao e usar `contains`, que gera um `WHERE title LIKE '%valor%'` no SQL, permitindo busca por substring.

## O problema do case sensitivity

Por padrao, o Prisma (e a maioria dos bancos) faz distincao entre maiusculas e minusculas. O instrutor mostrou que:

- "ORM" (maiusculo) → encontra
- "orm" (minusculo) → nao encontra
- "Prisma" (P maiusculo) → encontra
- "prisma" (p minusculo) → nao encontra

A propriedade `mode: 'insensitive'` resolve isso, gerando uma busca case-insensitive no banco. No PostgreSQL, isso usa `ILIKE` internamente.

## Por que `.trim()` e importante

O instrutor demonstrou que ao digitar um espaco extra no parametro de busca, a consulta falhava. Espacos invisíveis sao um problema comum em query parameters vindos de formularios ou URLs. O `.trim()` remove espacos no inicio e fim da string.

## Por que `.toString()` nos query params

Query parameters em frameworks como Fastify podem vir como `string | undefined`. O Prisma espera uma string no `contains`. Usar `?.toString()` garante a conversao segura, e se for `undefined`, o optional chaining retorna `undefined` (que pode ser tratado com conditional spread).

## Posicionamento do `orderBy`

O `findMany` do Prisma aceita um objeto com propriedades como `where`, `orderBy`, `take`, `skip`, `include`, etc. Todas sao propriedades no mesmo nivel. Um erro comum e colocar `orderBy` dentro do `where`, o que nao causa erro de compilacao mas nao aplica a ordenacao.

```typescript
// ERRADO - orderBy dentro do where
prisma.question.findMany({
  where: {
    title: { contains: 'prisma' },
    orderBy: { title: 'asc' }, // IGNORADO!
  },
})

// CORRETO - orderBy como irma de where
prisma.question.findMany({
  where: {
    title: { contains: 'prisma' },
  },
  orderBy: { title: 'asc' },
})
```

## Filtro condicional (quando o parametro e opcional)

Quando o usuario nao passa nenhum filtro, a consulta deve retornar todos os registros. O instrutor mostrou que ao desmarcar o parametro no teste, a API retornava tudo. Isso e feito condicionalmente:

- Se `title` existe → aplica `where` com `contains`
- Se `title` nao existe → omite `where` (retorna tudo)

Isso pode ser implementado com conditional spread (`...()`) ou ternario para o `where`.