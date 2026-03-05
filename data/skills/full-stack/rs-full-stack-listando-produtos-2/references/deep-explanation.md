# Deep Explanation: Listando Produtos com Knex.js

## Por que tipar o select?

Quando voce faz `knex("products").select()`, o Knex retorna `any[]`. Isso significa que ao acessar `products[0].`, o TypeScript nao sugere nenhuma propriedade — voce perde completamente o autocomplete.

Ao passar o tipo generico `knex<ProductRepository>("products")`, o retorno do select ja vem tipado. O instrutor demonstrou isso ao vivo: sem tipo, `products[0].` nao mostra nada; com tipo, aparece `name`, `price`, etc.

Isso e especialmente util em projetos sem ORM, onde o Knex e o unico ponto de contato com o banco. A tipagem serve como documentacao viva do schema.

## O padrao whereLike + nullish coalescing

O problema central e: como fazer um filtro que e **opcional**? Se o usuario passa `name=batata`, filtra por batata. Se nao passa nada, mostra tudo.

A solucao e elegante:

```typescript
.whereLike("name", `%${name ?? ""}%`)
```

Decomposicao:
1. `name ?? ""` — se `name` e `null` ou `undefined`, usa string vazia
2. `%${""}%` = `%%` — o LIKE com `%%` faz match com qualquer string (mostra tudo)
3. `%${batata}%` = `%batata%` — busca "batata" em qualquer posicao do texto

### Por que nullish coalescing (`??`) e nao OR logico (`||`)?

O operador `||` trata como falsy: `""`, `0`, `false`, `null`, `undefined`. Se alguem passar uma string vazia deliberadamente, `||` substituiria por outro valor. O `??` so atua em `null` e `undefined`, que e exatamente o caso de query parameter ausente.

## O operador LIKE e os percentuais

O `%` no SQL LIKE funciona como wildcard:
- `%batata%` — "batata" em qualquer posicao (comeco, meio, fim)
- `batata%` — comeca com "batata"
- `%batata` — termina com "batata"

O instrutor demonstrou que pesquisar por "EZ" (pedaco do nome "Executivo") ja retorna o resultado. Isso e possivel porque os `%` estao em ambos os lados.

## Ordenacao por padrao

Sem `orderBy`, o banco de dados retorna registros na ordem de insercao (ou ordem fisica de armazenamento). Isso nao e garantido e pode mudar. O instrutor demonstrou: antes do `orderBy("name")`, "Executivo" aparecia por ultimo (inserido depois); depois do `orderBy`, "Executivo" aparece primeiro (ordem alfabetica).

Sempre adicionar `orderBy` em listagens garante consistencia e previsibilidade para o frontend.

## Query parameters vs route parameters

O instrutor usou `request.query` (query parameters: `?name=batata`) em vez de `request.params` (route parameters: `/products/:name`). Isso e correto porque:
- Query parameters sao opcionais por natureza
- Sao ideais para filtros de busca
- Multiplos filtros podem ser combinados: `?name=batata&category=prato`
- Route parameters sao para identificadores obrigatorios: `/products/:id`