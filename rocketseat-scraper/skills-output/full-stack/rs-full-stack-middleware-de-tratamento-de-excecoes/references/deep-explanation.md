# Deep Explanation: Middleware de Tratamento de Exceções

## Por que centralizar o tratamento de erros?

Sem um middleware centralizado, cada rota precisa do seu próprio `try/catch`, gerando duplicação massiva. O Express permite registrar um middleware com 4 parâmetros `(error, request, response, next)` que captura qualquer erro lançado nas rotas — desde que registrado **depois** das rotas.

## A distinção entre erros conhecidos e desconhecidos

O instrutor enfatiza a importância de criar uma classe `AppError` separada para **identificar erros que nós mesmos lançamos**. A lógica é:

1. **Erro conhecido (AppError):** "Eu sei o que aconteceu, eu lancei esse erro intencionalmente." Exemplo: usuário não passou email, recurso não existe. Esses têm mensagem clara e statusCode controlado (400, 404, 401).

2. **Erro desconhecido (qualquer outro):** "Algo inesperado aconteceu no sistema." Exemplo: banco caiu, dependência falhou. Esses retornam 500 porque não sabemos exatamente o que houve.

O `instanceof AppError` é o mecanismo que separa os dois casos. Se o erro é instância de AppError, sabemos que foi lançado intencionalmente e confiamos no statusCode e mensagem. Se não, tratamos como erro interno.

## Por que `express-async-errors`?

O Express, por padrão, **não captura erros em funções async**. Se uma rota async lança um erro (ou uma Promise é rejeitada), o Express simplesmente não chama o error handler — a requisição fica pendente e eventualmente timeout.

O pacote `express-async-errors` faz monkey-patch no Express para capturar rejeições de promises automaticamente. O instrutor especifica a versão `3.1.1` para garantir compatibilidade.

**Importante:** O import de `express-async-errors` deve vir **antes** da definição das rotas para que o patch seja aplicado.

## StatusCode padrão 400

O instrutor define `400` como valor padrão no construtor do AppError. A justificativa é que a maioria dos erros de negócio são do tipo "bad request" — dados inválidos, campos faltando, formato incorreto. Isso evita ter que passar `400` explicitamente em cada `throw new AppError(...)`.

Para outros casos (404 not found, 401 unauthorized, 409 conflict), passa-se o statusCode explicitamente.

## Estrutura de pastas

O instrutor organiza assim:
- `src/middlewares/` — pasta para todos os middlewares (error-handling, autenticação, etc.)
- `src/utils/` — pasta para utilitários como AppError

Essa separação mantém responsabilidades claras: middlewares processam requests/responses, utils são classes/funções auxiliares.

## Parâmetros não utilizados

No middleware de error handling, `request` e `next` não são usados diretamente — o propósito é processar o `error` e devolver via `response`. Porém, o Express **exige** que o middleware tenha exatamente 4 parâmetros para ser reconhecido como error handler. Remover qualquer um deles faz o Express tratá-lo como middleware comum.

## Ordem de registro no app

O middleware de erro deve ser o **último** `app.use()`:
1. Middlewares de parsing (json, urlencoded)
2. Rotas
3. Middleware de tratamento de erros

Se registrado antes das rotas, erros lançados nas rotas não serão capturados por ele.