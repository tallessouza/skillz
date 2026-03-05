# Deep Explanation: AppError

## Por que separar erros de cliente e servidor?

O instrutor explica que exceções numa API podem ser divididas em dois grupos fundamentais:

### 1. Erro do Cliente (4xx)
Gerado quando o cliente envia uma requisição inválida — parâmetro com valor errado, campo obrigatório faltando, recurso inexistente. O código HTTP clássico é **400 Bad Request**, mas inclui toda a família 4xx (401, 403, 404, 409, 422...).

O ponto chave: **o servidor está funcionando corretamente**, o problema está na requisição.

### 2. Erro do Servidor (5xx)
Gerado internamente — um bug no código, um cenário não previsto, banco de dados indisponível. O código HTTP é **500 Internal Server Error**.

O ponto chave: **não foi provocado pela requisição do usuário**, algo deu errado no servidor.

## O problema sem AppError

Sem uma classe dedicada, o error handler global não tem como distinguir os dois tipos. A classe `Error` nativa do JavaScript só tem `message` — não carrega `statusCode`. Resultado: **tudo vira 500**, mesmo quando é culpa do cliente.

O instrutor demonstra isso ao vivo: antes do AppError, um `throw new Error("mensagem")` sempre resultava em status 500 na resposta.

## A solução: classe AppError

A classe é propositalmente simples — apenas `message` e `statusCode`. O valor padrão de `statusCode = 400` é uma decisão de design: a maioria dos erros lançados manualmente em controllers são validações de input (bad request).

## instanceof como mecanismo de distinção

No handler global, `error instanceof AppError` é o discriminador:
- **true** → erro conhecido, use o statusCode e message do AppError
- **false** → erro desconhecido/inesperado, responda com 500 genérico

Isso é mais robusto que verificar propriedades (`error.statusCode !== undefined`) porque:
1. Garante que o erro foi criado intencionalmente com AppError
2. Não confunde com erros de bibliotecas externas que podem ter propriedades similares

## Onde colocar o AppError

O instrutor cria em `src/utils/AppError.ts` — pasta utilitários, porque é uma classe auxiliar usada em toda a aplicação (controllers, middlewares, services).

## Fluxo completo

1. Controller detecta problema → `throw new AppError("mensagem", statusCode)`
2. Express captura no error handler global
3. Handler verifica `instanceof AppError`
4. Se sim: responde com `error.statusCode` e `error.message`
5. Se não: responde com 500 e mensagem genérica (nunca expõe detalhes internos)

## Por que o statusCode padrão é 400 e não 500?

Decisão pragmática do instrutor: quando o desenvolvedor lança um AppError manualmente, ele está conscientemente sinalizando um problema. A maioria desses casos são validações — portanto 400 é o padrão sensato. Erros 500 são os que "escapam" sem serem previstos.