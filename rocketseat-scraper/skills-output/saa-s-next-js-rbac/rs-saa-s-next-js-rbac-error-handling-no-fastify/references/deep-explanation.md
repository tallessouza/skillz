# Deep Explanation: Error Handling no Fastify

## Por que padronizar erros?

O instrutor destaca um problema pratico: quando cada rota retorna erros de forma diferente (um usa `message`, outro usa `error`, outro usa `msg`), o front-end nao consegue prever a estrutura da resposta. Isso causa bugs silenciosos — o front-end tenta ler `response.data.message` mas o backend enviou `response.data.error`.

A padronizacao resolve isso criando um **contrato**: toda resposta de erro SEMPRE tem o campo `message`. Erros de validacao adicionalmente tem o campo `errors` com os detalhes por campo.

## Decisao: classes vs plugins

O instrutor menciona que existem plugins do Fastify que ja trazem classes de erro HTTP prontas (como `fastify-sensible`), mas opta por criar manualmente. O raciocinio e: instale conforme precisar, nao instale tudo de uma vez. As classes sao triviais (estendem `Error` com 3 linhas), entao a dependencia externa nao se justifica.

## Anatomia do ErrorHandler

O ErrorHandler usa uma cadeia de `instanceof` para classificar o erro:

1. **ZodError** — erros de validacao de schema. O Zod tem um metodo `flatten()` que transforma a arvore de erros em um objeto plano `{ fieldErrors: { campo: ['mensagem'] } }`. Isso e muito mais util para o front-end do que o formato raw do Zod.

2. **BadRequestError** — erros de negocio que o dev lancou intencionalmente. A mensagem ja e segura para mostrar ao usuario.

3. **UnauthorizedError** — acesso negado. Tem mensagem default "Unauthorized" para nao precisar repetir em cada uso.

4. **Fallthrough (500)** — qualquer erro que NAO e uma das classes acima e um erro inesperado. Esse e o unico caso onde fazemos `console.error` e onde futuramente enviaremos para Sentry/Datadog. A mensagem para o cliente e generica ("Internal server error") para nao vazar detalhes internos.

## Tipagem do ErrorHandler

O instrutor usa um pattern interessante para tipar o handler:

```typescript
type FastifyErrorHandler = FastifyInstance['errorHandler']
```

Isso extrai o tipo diretamente da interface do Fastify, garantindo que a assinatura `(error, request, reply)` esta correta sem precisar importar tipos especificos.

## Organizacao com underscore prefix

A pasta `_errors/` usa underscore na frente para ficar sempre no topo quando ordenada alfabeticamente no explorador de arquivos. E uma convencao simples que facilita a navegacao — erros sao cross-cutting concerns usados por todas as rotas.

## UnauthorizedError com mensagem opcional

O constructor do `UnauthorizedError` aceita `message?: string` e usa `message ?? 'Unauthorized'` como default. Isso permite dois usos:

- `throw new UnauthorizedError()` — usa a mensagem padrao
- `throw new UnauthorizedError('Token expired')` — mensagem customizada

O `BadRequestError` NAO tem default porque erros de negocio sempre devem ter mensagens especificas que descrevam o problema.

## Observabilidade futura

O instrutor deixa um comentario `// send error to observability platform` como placeholder. Esse e um padrao importante: erros esperados (400, 401) NAO vao para observabilidade (sao fluxo normal). Apenas erros 500 (inesperados) devem ser reportados, porque indicam bugs reais no codigo.