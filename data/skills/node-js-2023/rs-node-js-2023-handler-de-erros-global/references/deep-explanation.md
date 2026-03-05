# Deep Explanation: Handler de Erros Global

## Por que erros "escapam" do controller?

O instrutor demonstra um cenario real: dentro de um caso de uso (use case), voce trata erros conhecidos com `if (error instanceof SomeKnownError)`. Porem, erros inesperados — como chamar uma funcao que nao existe, falha numa biblioteca de hash, ou qualquer bug nao previsto — simplesmente caem no catch generico.

Se o controller apenas retorna 500 sem log, voce perde completamente a visibilidade do que aconteceu. O terminal nao mostra nada. O cliente recebe um JSON generico. Ninguem sabe o que quebrou.

## A estrategia de "re-lancar" (throw)

A sacada central da aula e: **se o erro nao e conhecido, nao tente trata-lo no controller**. Faca `throw error` para que uma camada acima (o Fastify, via `setErrorHandler`) capture e trate de forma centralizada.

O instrutor explica: "e como se eu estivesse falando: aqui eu to tratando o erro, mas se o erro nao for conhecido, eu nao quero tratar ele. Deixa uma camada acima do meu controller tente tratar este erro."

Isso segue o principio de separacao de responsabilidades: o controller sabe dos erros de dominio, o error handler global sabe como logar e responder genericamente.

## Fastify ja tem tratativa interna

O Fastify por padrao ja captura erros nao tratados e retorna 500 com a mensagem do erro. Porem, essa tratativa padrao:
- Mostra informacoes potencialmente sensiveis na resposta
- Nao formata erros de validacao (Zod) de forma amigavel
- Nao faz log condicional por ambiente

Por isso criamos nosso proprio `setErrorHandler` para sobrescrever o comportamento padrao.

## Erros de validacao Zod

O instrutor mostra que, sem o handler global, quando o Zod rejeita um campo (ex: senha com 3 caracteres), o Fastify retorna a mensagem de erro como JSON dentro de uma string — "ta vindo tudo errado, ta vindo um JSON dentro da mensagem, ta muito estranho".

Com o handler global, verificamos `error instanceof ZodError` e usamos `error.format()` para retornar uma estrutura limpa:
```json
{
  "message": "Validation error.",
  "issues": {
    "password": {
      "_errors": ["String must contain at least 6 characters"]
    }
  }
}
```

## Log condicional: dev vs producao

O instrutor e enfatico: "nao faz sentido, em producao, a gente deixar o console.error, porque em producao a gente nao vai ficar de olho no console da nossa aplicacao."

Em desenvolvimento, `console.error(error)` mostra a stack trace completa no terminal, permitindo clicar no arquivo e ir direto na linha do erro.

Em producao, o correto e enviar para ferramentas de observabilidade (Datadog, New Relic, Sentry) que:
- Enviam alertas por email/Slack
- Agregam erros por frequencia e usuarios afetados
- Mantem historico para debugging

## Dica do underline para parametros nao usados

Quando o `setErrorHandler` recebe `(error, request, reply)` mas voce nao usa `request`, o TypeScript reclama "declared but its value is never read". A convencao e prefixar com `_` (underscore): `_request`. O TypeScript entende que e um parametro intencionalmente ignorado.