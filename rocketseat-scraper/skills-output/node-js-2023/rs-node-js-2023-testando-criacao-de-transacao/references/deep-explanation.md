# Deep Explanation: Testes E2E com Supertest

## Por que separar app.ts de server.ts?

O instrutor (Diego) explica que quando voce importa o arquivo `server.ts` em qualquer lugar, o `app.listen()` executa automaticamente. Isso significa que ao importar nos testes, um servidor real sobe na porta configurada (ex: 3333). Problemas:

1. **Conflito de porta** — se voce ja esta com `npm run dev` rodando, a porta esta ocupada
2. **Tempo de boot/shutdown** — subir e derrubar um servidor real adiciona latencia
3. **Complexidade desnecessaria** — SuperTest consegue fazer requisicoes sem servidor real

A solucao e criar dois arquivos:
- `app.ts`: cria o Fastify, registra plugins e rotas, exporta `app` — mas NAO faz listen
- `server.ts`: importa `app`, carrega env vars, faz o listen

Quando `npm run dev` roda, ele chama `server.ts` que importa `app.ts` + faz listen. Tudo funciona igual. Mas nos testes, importamos apenas `app.ts` — sem listen.

## O que e app.server?

Todo framework HTTP do Node (Fastify, Express, Koa) por baixo dos panos usa `http.createServer()` do modulo nativo. O SuperTest precisa desse servidor HTTP nativo do Node, nao do wrapper do framework. No Fastify, esse servidor e acessivel via `app.server`.

## Por que app.ready() e obrigatorio?

Plugins do Fastify sao **obrigatoriamente assincronos**. Quando voce faz `app.register(plugin)`, o codigo dentro do plugin pode conter operacoes assincronas (conexoes com banco, etc). Isso significa que apos importar o `app`, as rotas podem ainda nao estar registradas.

O erro classico: teste retorna 404 (Not Found) mesmo com a rota correta. Nao e erro de digitacao — e que o plugin ainda nao terminou de registrar a rota.

`app.ready()` e uma Promise que resolve quando TODOS os plugins terminaram de carregar. O `await` no `beforeAll` garante que os testes so comecam quando a aplicacao esta 100% pronta.

## Lifecycle hooks do Vitest

| Hook | Executa | Vezes | Uso tipico |
|------|---------|-------|------------|
| `beforeAll` | Antes de todos os testes | 1x | `app.ready()` |
| `beforeEach` | Antes de cada teste | Nx | Reset de banco, variaveis |
| `afterAll` | Depois de todos os testes | 1x | `app.close()` |
| `afterEach` | Depois de cada teste | Nx | Limpeza de estado |

## Sobre @types e o icone DT no npm

Bibliotecas construidas em JavaScript puro (como SuperTest) nao trazem definicoes de tipos TypeScript. No npm, voce identifica isso pelo icone **DT** (DefinitelyTyped) ao lado do nome do pacote. A solucao e instalar `@types/nome-do-pacote` como devDependency.

Pacotes construidos com TypeScript nativo (como Fastify) tem um icone **azul** no npm e nao precisam de @types separado.

## O .expect() encadeado do SuperTest

Voce pode validar o status code de duas formas:

```typescript
// Forma separada
const response = await request(app.server).post('/route').send(data)
expect(response.statusCode).toBe(201)

// Forma encadeada (preferida)
await request(app.server).post('/route').send(data).expect(201)
```

A forma encadeada e mais concisa e idiomatica do SuperTest.