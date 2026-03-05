# Code Examples: Hooks Globais no Fastify

## Exemplo 1: Hook preHandler global dentro de um plugin

Contexto: O instrutor registra um hook dentro de `transactionsRoutes` para demonstrar o escopo.

```typescript
// src/routes/transactions.ts
import { FastifyInstance } from 'fastify'

export async function transactionsRoutes(app: FastifyInstance) {
  // Hook global DESTE PLUGIN — nao afeta rotas fora dele
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  // Todas estas rotas disparam o hook acima
  app.get('/', async (request, reply) => {
    // listar transactions
  })

  app.get('/:id', async (request, reply) => {
    // buscar transaction por id
  })

  app.post('/', async (request, reply) => {
    // criar transaction
  })
}
```

### Teste do instrutor

Ao listar transactions: log mostra `[GET] /transactions`
Ao buscar uma: log mostra `[GET] /transactions/:id`
Ao criar: log mostra `[POST] /transactions`

## Exemplo 2: Prova de que o hook NAO afeta rotas fora do plugin

```typescript
// src/server.ts
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes, { prefix: '/transactions' })

// Esta rota NAO dispara o hook registrado dentro de transactionsRoutes
app.get('/hello', async () => {
  return 'Hello World'
})
```

Ao chamar `GET /hello` — nenhum log aparece no console.

## Exemplo 3: Hook verdadeiramente global no server

```typescript
// src/server.ts
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

// Hook registrado no contexto RAIZ — afeta TODAS as rotas
app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(transactionsRoutes, { prefix: '/transactions' })

app.get('/hello', async () => {
  return 'Hello World'
})
```

### Teste do instrutor

Ao chamar `GET /hello` — log mostra `[GET] /hello` (agora funciona!)
Ao chamar `GET /transactions` — log mostra `[GET] /transactions` (continua funcionando)

## Exemplo 4: Extraindo hook para arquivo separado (pattern recomendado)

```typescript
// src/middlewares/log-request.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function logRequest(request: FastifyRequest, reply: FastifyReply) {
  console.log(`[${request.method}] ${request.url}`)
}
```

```typescript
// src/server.ts — uso global
import { logRequest } from './middlewares/log-request'

app.addHook('preHandler', logRequest)
```

```typescript
// src/routes/transactions.ts — uso local (apenas neste plugin)
import { logRequest } from '../middlewares/log-request'

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', logRequest)
  // ...rotas
}
```

## Exemplo 5: Comparacao com preHandler por rota (aula anterior)

```typescript
// Hook por rota — mais granular, mais repetitivo
app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
  // ...
})

// Hook global no plugin — menos repeticao, mesmo escopo
app.addHook('preHandler', checkSessionIdExists)
// Agora TODAS as rotas deste plugin passam pelo check
```

## Variacoes: Outros hooks disponíveis

```typescript
// Primeiro hook do lifecycle — antes de qualquer coisa
app.addHook('onRequest', async (request, reply) => {
  console.log('Request recebida')
})

// Depois de enviar a resposta — ideal para metricas
app.addHook('onResponse', async (request, reply) => {
  console.log(`Respondido em ${reply.elapsedTime}ms`)
})

// Antes de parsear o body
app.addHook('preParsing', async (request, reply, payload) => {
  // manipular payload raw
})

// Antes de serializar a resposta
app.addHook('preSerialization', async (request, reply, payload) => {
  // modificar payload antes de serializar
})
```