# Deep Explanation: Endpoint para Refresh Token

## Por que um AuthenticationController separado?

O instrutor explica que projetos evoluem naturalmente. Quando o LoginController foi criado, nao existia o requisito de refresh token. Agora, com a evolucao, faz sentido agrupar todos os endpoints de autenticacao em um unico controller.

A evolucao natural seria:
1. **Login** — autenticar com email/senha, devolver access + refresh token
2. **Refresh** — renovar tokens expirados
3. **Logout** — deletar refresh token do banco (impedir reutilizacao se vazar)
4. **2FA** — autenticacao em dois fatores

Todos pertencem ao contexto de autenticacao. O instrutor manteve o LoginController separado de proposito para mostrar que "nem sempre a gente vai tomar a melhor decisao" — porque nem sempre temos a visao completa do projeto no inicio.

## Por que POST e nao PUT?

Dois motivos:
1. **Tecnico:** o endpoint precisa receber um objeto JSON no body (refresh token + access token). GET e DELETE nao aceitam body.
2. **Semantico:** o endpoint *cria* um novo refresh token, e criacao = POST.

## Por que o Access Token tambem e enviado?

O instrutor menciona que o access token sera usado para "uma validacao extra" — implementada na aula seguinte com o `IAccessTokenValidator`. Mesmo expirado, o access token contem claims do usuario que podem ser validadas.

## Cuidado ao criar controller no Visual Studio

O Visual Studio oferece controllers MVC e API. Se voce selecionar MVC por engano, o controller tera dependencias desnecessarias. Sempre selecione: Common > API > API Controller - Empty.

## Sobre a rota simplificada

O instrutor remove `api/` da rota, deixando apenas `[Route("[controller]")]`. Isso resulta em: `{base_url}/authentication/refresh`. E uma preferencia pessoal dele — manter rotas limpas.

## As 5 dependencias do Use Case

1. **ITokenService** — gera novo access token e refresh token (ja implementado em aulas anteriores)
2. **IRefreshTokenReadOnlyRepository** — busca a entidade refresh token no banco baseado no token recebido
3. **IRefreshTokenWriteOnlyRepository** — persiste o novo refresh token
4. **IAccessTokenValidator** — validacao extra do access token (explicado na proxima aula)
5. **IUnitOfWork** — persiste as mudancas no banco de dados

## Sobre migrar o LoginController

O instrutor diz que voce *pode* juntar tudo no AuthenticationController, mas lembra que isso exige:
- Alterar a integracao no aplicativo (as URLs mudam)
- Alterar os testes de integracao
- Nao e dificil, mas e um trabalho consideravel

Para projetos pequenos, nao afeta nada. Para projetos grandes, planeje a migracao.

## Padrao de injecao via [FromServices]

O use case e injetado diretamente no metodo do controller via `[FromServices]`, nao no construtor. Isso mantem o controller leve — ele nao precisa armazenar dependencias, apenas delega para o use case.