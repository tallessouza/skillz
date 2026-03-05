# Deep Explanation: Validacao de Dados com Zod em Controllers Express

## Por que Zod dentro do controller?

O instrutor coloca o schema Zod diretamente dentro do metodo do controller, nao em um middleware separado. Isso tem uma razao pratica: o schema fica co-localizado com a logica que vai usar os dados. Quando voce abre o controller, ve imediatamente quais campos sao esperados, quais tipos, e pode desestruturar com tipagem automatica.

O `parse()` do Zod lanca um `ZodError` quando a validacao falha. Esse erro cai no `catch`, que repassa via `next(error)` para o middleware global de tratamento de erros do Express. Isso significa que voce nao precisa escrever nenhum `if` manual — o Zod faz tudo.

## Estrutura de dominios

O padrao seguido e: um controller por dominio (orders, products, tables) e um arquivo de rotas correspondente. Isso escala bem porque cada dominio fica isolado.

A conexao acontece no `index.ts` de rotas, que funciona como um hub:

```
routes/
├── index.ts          # Hub — conecta todas as rotas com prefixo
├── orders-routes.ts  # Rotas de pedidos
├── products-routes.ts
└── tables-routes.ts
```

## Consistencia de nomenclatura

O instrutor corrige durante a aula o nome de `orderRoutes` para `ordersRoutes` (com s). Isso reforca a importancia de manter consistencia: se o recurso REST e `/orders` (plural), o arquivo e `orders-routes.ts`, a variavel e `ordersRoutes`, o controller e `OrdersController`.

## Fluxo de teste

O instrutor testa no Insomnia:
1. Primeiro envia POST sem body → Zod retorna erro dizendo quais campos faltam
2. Depois envia com JSON correto → retorna 201

Esse fluxo demonstra que a validacao funciona como documentacao viva: o erro do Zod diz exatamente o que o endpoint espera.

## try/catch + next(error)

Todo metodo de controller segue o padrao:

```typescript
try {
  // validacao + logica
} catch (error) {
  next(error)
}
```

O `next(error)` e fundamental no Express para que o error handler middleware central capture e formate a resposta de erro. Sem ele, erros do Zod causariam um crash ou resposta generica 500.

## Status 201

O instrutor usa `response.status(201)` para criacao de recursos, seguindo a convencao HTTP onde 201 Created indica que um novo recurso foi criado com sucesso.