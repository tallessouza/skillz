# Deep Explanation: Middleware de Rotas

## Por que separar o route handler em middleware?

O instrutor constroi a aplicacao em camadas. O `server.js` so cria o servidor HTTP. O middleware `routeHandler` faz o matching de rotas. Os controllers contem a logica de negocio. Essa separacao permite:

1. **Adicionar rotas sem tocar no server** — basta adicionar ao array de rotas
2. **Testar o matching isoladamente** — o routeHandler e uma funcao pura que recebe req/res
3. **Compor middlewares** — futuramente, JSON body parser, logging, etc. podem ser adicionados na mesma cadeia

## O pattern: Array de rotas + find

A estrutura de rotas e um array de objetos:
```javascript
// routes/index.js
export const routes = [
  { method: 'POST', path: '/tickets', controller: createTicket }
]
```

O middleware percorre com `Array.find`, comparando `method` e `path`. Isso e declarativo — a rota e "registrada" no array, nao como um if/else.

## Por que 404 sem body?

O instrutor inicialmente retornou `res.end('Not found')`, mas depois removeu o body. O raciocinio: o status code 404 ja comunica "Not Found" semanticamente. O body e redundante para APIs — o cliente deve reagir ao status code, nao ao texto.

## Armadilha do auto-import

O instrutor mostrou ao vivo que o VS Code importou o arquivo do path errado (`./routes.js` dentro de middlewares/ ao inves de `../routes/index.js`). A licao: **sempre confira imports automaticos**, especialmente quando a estrutura de pastas tem midleware/ e routes/ como irmas.

A estrutura de pastas correta:
```
src/
├── middlewares/
│   └── routeHandler.js    # importa de ../routes/index.js
├── routes/
│   └── index.js           # exporta array de rotas
└── server.js              # importa de ./middlewares/routeHandler.js
```

## Evolucao natural deste pattern

Este middleware e a versao mais simples — matching exato de path. A evolucao natural:

1. **Parametros dinamicos** — `/tickets/:id` → regex ou split
2. **Query strings** — separar `req.url` em path e query
3. **Middleware chain** — processar JSON body antes do controller
4. **Grupos de rotas** — prefixos como `/api/v1`

O instrutor constroi cada peca incrementalmente nas aulas seguintes.