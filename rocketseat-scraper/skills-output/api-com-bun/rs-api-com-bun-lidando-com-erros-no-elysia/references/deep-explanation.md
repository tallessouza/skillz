# Deep Explanation: Tratamento de Erros no Elysia

## Por que de dentro para fora?

O instrutor enfatiza que tratar erros globalmente forca generalizacao. Quando todos os erros batem no mesmo lugar, voce acaba usando mensagens vagas e codigos HTTP genericos. A estrategia correta e:

1. **Modulo define seus erros** — cada modulo sabe quais erros pode disparar
2. **Modulo trata seus erros** — com .onError() local, so trata os codigos que registrou
3. **Servidor trata o resto** — validacao (que e transversal) e erros inesperados (fallback)

## Como o Elysia resolve erros internamente

Quando voce dispara um `throw` dentro de uma rota:
- O Elysia verifica se o erro foi registrado com `.error()`
- Se foi, ele associa o `code` que voce definiu (ex: 'UNAUTHORIZED')
- O `.onError()` recebe esse `code` e voce pode fazer switch nele
- Se o erro NAO foi registrado, o Elysia nao sabe o que e e trata como erro de servidor (500)

## Codigos built-in do Elysia

O Elysia ja tem codigos de erro internos:
- `VALIDATION` — erro de validacao de body, query, params
- `NOT_FOUND` — rota nao existe
- `PARSE` — nao conseguiu converter a resposta em JSON
- `INTERNAL_SERVER_ERROR` — erro generico de servidor
- `INVALID_COOKIE_SIGNATURE` — assinatura de cookie invalida

Voce adiciona seus proprios codigos com `.error()`, e eles aparecem no union type do `code` no `.onError()`.

## Heranca de erros entre modulos

Quando um modulo B faz `.use(moduloA)`, os erros registrados em A ficam disponiveis em B. Isso significa que se o modulo de autenticacao registra `UnauthorizedError`, qualquer rota que use autenticacao pode disparar esse erro e ele sera tratado corretamente.

## Validacao e Typebox

O instrutor mostra que o `error.toResponse()` no caso de VALIDATION retorna os erros de validacao, mas o formato nao e muito legivel por padrao. Para melhorar, seria necessario definir mensagens customizadas dentro dos schemas do Typebox (com `.error()`). Sem mensagens customizadas, o Typebox retorna informacoes tecnicas como "schema format email type string".

## Por que classes e nao objetos literais?

Usar `class XError extends Error` e importante porque:
1. O Elysia usa `instanceof` para identificar o tipo de erro
2. Permite encapsular a mensagem padrao no constructor
3. Segue o padrao do JavaScript/TypeScript para erros tipados
4. O `.error()` do Elysia espera uma classe, nao uma instancia