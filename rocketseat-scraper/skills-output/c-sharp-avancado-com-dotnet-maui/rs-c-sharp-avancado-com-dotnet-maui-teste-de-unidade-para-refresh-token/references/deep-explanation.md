# Deep Explanation: Testes de Integracao para Refresh Token

## Por que os testes quebraram

Quando o fluxo de Refresh Token foi adicionado ao projeto, um filtro de autorizacao (`AuthenticatedUserFilter`) ganhou uma validacao extra: alem de verificar se o token JWT e valido e se o usuario existe no banco, ele agora verifica se existe um RefreshToken associado aquele AccessTokenId no banco de dados.

Os testes de integracao existentes so persistiam a entidade `User` no banco em memoria. Nao havia nenhum `RefreshToken` associado. Resultado: o filtro encontrava o usuario, mas ao buscar o RefreshToken retornava `false`, lancava excecao e devolvia 401 Unauthorized.

O ponto chave do instrutor: **o erro acontece ANTES do controller executar**. O filtro de autorizacao roda como middleware/filter, entao colocar breakpoint no controller nao ajuda — o request nunca chega la.

## A cadeia de debug do instrutor

1. Colocou breakpoint no teste → viu que o status code era Unauthorized
2. Colocou breakpoint no controller → **nao bateu** (o request nao chegou)
3. Percebeu que o filtro `AuthenticatedUserFilter.OnAuthorizationAsync` intercepta antes
4. Colocou breakpoint no filtro → viu que `User` era encontrado mas `RefreshToken` retornava `false`
5. Identificou que o setup do teste nao persistia RefreshToken

Essa cadeia de raciocinio e valiosa: quando um endpoint autenticado retorna 401 sem motivo aparente, o problema quase sempre esta na camada de autorizacao (filtros, middleware), nao no controller.

## Por que usar ITokenService em vez de IAccessTokenGenerator

Anteriormente, o setup usava `IAccessTokenGenerator` diretamente porque `GenerateTokens` era assincrono e o metodo de setup nao suportava async. Apos refatoracao, `GenerateTokens` se tornou sincrono, permitindo usar `ITokenService` diretamente — que gera AccessToken, RefreshToken e AccessTokenId de forma consistente e integrada.

## A armadilha do appsettings.test.json

O instrutor descobriu um segundo bug durante o debug: o `RefreshTokenExpirationDays` nao estava configurado no `appsettings.test.json`. Em C#, o valor default de `int` e `0`. Isso significa que o token expira em `DateTime.Now + 0 dias` — ou seja, ja expirado no momento da criacao.

Durante debug passo-a-passo, isso e ainda pior: o tempo gasto no debug faz com que ate tokens com poucos segundos de validade expirem.

A licao: **sempre verifique se configuracoes numericas tem valores explicitos no ambiente de teste**. Confiar em defaults de tipos primitivos causa bugs silenciosos.

## Estrutura dos testes de RefreshToken

O instrutor organizou os testes em `authentication/refresh/RefreshTokenTest.cs`, espelhando a estrutura de pastas do controller (`AuthenticationController` com rota `/authentication/refresh`).

Dois cenarios testados:
- **Sucesso**: RefreshToken e AccessToken validos → retorna 200 com novos tokens
- **Erro**: RefreshToken invalido com AccessToken valido → retorna 401 com mensagem de erro

O teste de erro usa `InlineData` para testar em multiplos idiomas (ingles e portugues), validando a mensagem de erro `ExpiredSession` em cada cultura suportada pela API.