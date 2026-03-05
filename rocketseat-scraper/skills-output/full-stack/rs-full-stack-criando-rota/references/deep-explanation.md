# Deep Explanation: Separacao App/Server para Testes E2E

## Por que separar app.ts de server.ts?

O problema central e o **conflito de portas**. Quando voce tem um servidor Node.js rodando na porta 3333 (ambiente de desenvolvimento), e o teste E2E tenta importar o mesmo arquivo para testar as rotas, ele vai tentar subir o servidor na mesma porta 3333. O sistema operacional nao permite dois processos escutando na mesma porta — resultado: erro.

A solucao e separar em dois arquivos:
- **app.ts**: cria o servidor HTTP, define as rotas, exporta o objeto servidor. **Nunca chama `listen()`**.
- **server.ts**: importa o app, chama `listen()` com a porta desejada. E o entrypoint da aplicacao.

Quando o teste E2E precisa testar as rotas, ele importa apenas o `app.ts` e chama `listen()` com uma porta diferente (ou porta 0 para o OS escolher uma disponivel).

## Analogia do instrutor

Pense no `app.ts` como a planta da casa — ele define o que a casa tem (rotas, handlers). O `server.ts` e quem escolhe o terreno (porta) e constroi. O teste E2E pode pegar a mesma planta e construir em outro terreno.

## Separacao de funcoes utilitarias

O instrutor tambem demonstrou que funcoes como `sum()` que estavam no `server.ts` devem ser extraidas para arquivos proprios (`sum.ts`). Isso segue o mesmo principio: o servidor nao deve conter logica que nao e sobre servir requisicoes. Testes unitarios importam o arquivo da funcao diretamente, sem precisar do servidor.

## Fluxo de arquivos apos reorganizacao

```
src/
├── app.ts          # Cria servidor, define rotas, exporta app
├── server.ts       # Importa app, chama listen(3333)
└── sum.ts          # Funcao utilitaria separada

test/
├── sum.test.ts     # Testa sum.ts diretamente (unitario)
└── products.e2e.ts # Importa app.ts, sobe em porta separada (E2E)
```

## O script de dev continua apontando para server.ts

No `package.json`, o script `dev` executa `server.ts` — que e o unico arquivo que faz `listen()`. Nada muda para o desenvolvimento. A separacao so beneficia os testes.

## Edge case: e se eu usar Express/Fastify?

O mesmo principio se aplica. Com Express:

```typescript
// app.ts
import express from "express"
export const app = express()
app.get("/products", (req, res) => res.json(products))

// server.ts
import { app } from "./app"
app.listen(3333)
```

Frameworks como Fastify, Hapi, Koa — todos seguem o mesmo padrao. A separacao app/server e universal em Node.js.