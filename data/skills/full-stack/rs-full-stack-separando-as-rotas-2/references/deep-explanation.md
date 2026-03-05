# Deep Explanation: Separando Rotas no Express

## Por que separar rotas?

O instrutor parte de um cenario real: todas as rotas estao no mesmo arquivo `server.ts`. Isso funciona no inicio, mas conforme a aplicacao cresce (5, 10 dominios), o arquivo fica ingerenciavel. A separacao resolve:

1. **Organizacao** — cada dominio isolado em seu arquivo
2. **Manutencao** — alterar rotas de produto nao toca em rotas de usuario
3. **Escalabilidade** — adicionar novo dominio = criar arquivo + registrar no index

## A armadilha do prefixo duplicado

O ponto mais importante da aula. O instrutor demonstra ao vivo o bug:

1. No `products-routes.ts`, as rotas usam `/products`
2. No `index.ts`, registra com `routes.use("/products", productRoutes)`
3. Resultado: a URL real vira `/products/products` — duplicado

**Resolucao:** o prefixo pertence ao aggregator (index.ts). O arquivo de rota usa apenas `/` (raiz relativa). Assim:
- Index define: "tudo que comeca com `/products` vai para `productRoutes`"
- Dentro de `productRoutes`, `/` = a raiz daquele dominio
- `/:id` = `/products/:id` na URL final

O instrutor mostra esse erro acontecendo e corrigindo, o que reforça o entendimento.

## Resolucao automatica de index.ts

Quando se importa `./routes` sem especificar arquivo, Node.js/TypeScript resolve automaticamente para `./routes/index.ts`. Isso e um padrao do Node — se nao menciona o arquivo, busca o `index`.

O instrutor destaca isso como conveniencia: `import { routes } from "./routes"` e suficiente.

## Padrao de nomenclatura

O instrutor menciona duas convencoes comuns:
- `products-routes.ts` (com hifen) — escolha dele
- `products.routes.ts` (com ponto) — tambem comum

Ambas funcionam. O importante e consistencia no projeto.

## Router do Express

`Router()` do Express cria uma instancia isolada de rotas. Funciona como um "mini-app" que pode ser montado em qualquer prefixo. E isso que permite a separacao: cada arquivo cria seu Router, define rotas relativas, e o index monta com o prefixo correto.

## Parametros e query strings continuam funcionando

O instrutor demonstra que apos a separacao, tudo continua funcionando normalmente:
- Route params: `/:id` → `request.params.id`
- Query strings: `?page=1&limit=10` → `request.query.page`

A separacao e puramente organizacional — nao altera o comportamento das rotas.

## Fluxo de uma requisicao

```
Client GET /products/7
  → server.ts: app.use(routes)
    → index.ts: routes.use("/products", productRoutes)  // match /products
      → products-routes.ts: productRoutes.get("/:id")   // match /7
        → request.params.id = "7"
```