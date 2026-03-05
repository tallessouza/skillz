# Deep Explanation: Refresh Token Transparente no App

## Por que dividir em caminho feliz e tratamento de erros

O instrutor (Ellison) divide intencionalmente a implementacao em duas aulas. A logica e simples, mas requer atencao em pontos especificos. Tratar tudo junto pode fazer o aluno perder o entendimento do fluxo principal.

## O loop infinito — armadilha critica

O ponto mais importante da aula: a interface `IAuthenticationAPI` (Refit) para refresh **nao pode** usar o `PlanShareHandler` como DelegatingHandler. Se usar, quando o refresh for chamado, ele passara pelo handler, que detectara 401, tentara refresh de novo, criando um loop infinito.

A solucao e registrar `IAuthenticationAPI` com `AddRefitClient` separado, sem configurar o handler de autenticacao.

## Fluxo completo passo a passo

1. App faz request normal (ex: buscar perfil)
2. `PlanShareHandler.SendAsync` intercepta
3. Handler adiciona Bearer token e envia via `base.SendAsync`
4. API retorna 401 Unauthorized
5. Handler le o body e verifica se `TokenIsExpired == true`
6. Handler chama `UseRefreshTokenUseCase.Execute()`
7. UseCase pega tokens do storage local
8. UseCase monta `RequestNewTokenJson` com access + refresh tokens
9. UseCase chama `IAuthenticationAPI.Refresh()` via Refit (SEM passar pelo handler)
10. API valida refresh token, gera novos tokens, retorna
11. UseCase salva novos tokens no storage
12. UseCase retorna novos tokens pro handler
13. Handler substitui Authorization header com novo access token
14. Handler reenvia a request original com `base.SendAsync`
15. API aceita, retorna 200
16. Handler sobrescreve a variavel `response` com o resultado
17. Codigo continua e retorna `response` normalmente

## Por que sobrescrever a variavel response

O instrutor destaca: apos o retry, voce deve atribuir o resultado na mesma variavel `response` que sera retornada no final do metodo. O codigo apos o `if` faz `return response`, entao se voce nao sobrescrever, ele retornara o 401 original.

## Por que o UseCase retorna os tokens

Em vez de forcar o handler a ir ao storage de novo, o UseCase ja retorna os novos tokens no `Result`. Isso evita uma ida extra ao storage e mantem o handler simples.

## Transparencia para o usuario

O instrutor demonstra: o usuario clica em "perfil", o token esta expirado, mas o app faz refresh + retry silenciosamente. O usuario ve seus dados normalmente, sem perceber que houve renovacao. Essa transparencia e o objetivo central do pattern.

## Deserializacao com null-forgiving operator

Na linha onde deserializa `ResponseErrorJson`, o instrutor usa `!` (null-forgiving) porque: se o status code e 401 Unauthorized, a API sempre retorna `ResponseErrorJson`. Entao o null e impossivel nesse contexto. Nao e descuido — e garantia de contrato.

## Configuracao de teste

Para testar o fluxo, o instrutor reduz o tempo de expiracao do JWT para 1 minuto no `appsettings.Development.json`. Isso permite que o token expire durante o uso normal do app, ativando o fluxo de refresh.