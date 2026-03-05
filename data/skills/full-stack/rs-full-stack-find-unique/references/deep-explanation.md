# Deep Explanation: Prisma findUnique

## Por que findUnique e nao findMany com filtro?

O instrutor destaca uma distincao fundamental: **findMany retorna um array**, **findUnique retorna um objeto direto**. Isso nao e apenas semantico — afeta como o frontend consome a resposta.

Quando voce usa findMany com where para buscar por ID, recebe `[{ id, name, ... }]` (array com um elemento). O consumidor precisa fazer `response[0]` ou `response.data[0]`. Com findUnique, recebe `{ id, name, ... }` diretamente.

O Prisma tambem otimiza findUnique internamente — ele sabe que o campo e unico e pode usar indices de forma mais eficiente.

## Organizacao e limpeza do codigo

O instrutor enfatiza o conceito de "clean code" na extracao de parametros. Comparando:

```typescript
// Funciona, mas inline demais
const user = await prisma.user.findUnique({
  where: { id: request.params.id },
})

// Preferido pelo instrutor — mais clean
const { id } = request.params
const user = await prisma.user.findUnique({
  where: { id },
})
```

A segunda forma separa a **extracao de dados** da **query ao banco**. Cada linha tem uma responsabilidade. O instrutor diz: "eu prefiro deixar assim, acho que fica mais clean, mais organizado."

## Padrao de nomenclatura: singular vs plural

O instrutor faz questao de nomear `user` (singular) quando e findUnique, contrastando com o `findMany` da aula anterior que retornaria multiplos. Isso cria consistencia:

- `findMany` → variavel plural (`users`) → retorna array
- `findUnique` → variavel singular (`user`) → retorna objeto

## Contexto REST: index vs show

- **index** (`GET /users`) → `findMany` → retorna array de usuarios
- **show** (`GET /users/:id`) → `findUnique` → retorna um unico usuario

O instrutor demonstra isso lado a lado no Insomnia, mostrando que index retorna array e show retorna objeto direto.

## Estrutura de rotas

As rotas ja estao configuradas com o parametro `:id` na URL. O findUnique complementa essa estrutura — a rota entrega o ID, o controller extrai, e o Prisma busca o registro unico.