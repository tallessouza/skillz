# Deep Explanation: Refresh Token Use Case

## Por que o nome "UseRefreshTokenUseCase"?

O instrutor escolheu esse nome intencionalmente: a pessoa esta **usando** um refresh token para obter novas credenciais. O verbo "Use" deixa claro o objetivo do use case — utilizar um refresh token existente para gerar novos tokens de acesso.

## O fluxo completo explicado

### 1. Busca no banco de dados

O refresh token recebido na request e usado para buscar a entidade correspondente no banco. O repositorio read-only faz essa consulta. A entidade retornada contem:
- `Token` (o valor do refresh token)
- `UserId` (FK para o usuario)
- `User` (navigation property — preenchida via Join)
- `AccessTokenId` (ID do ultimo access token associado)
- `CreatedAt` (data de criacao)

### 2. Navigation Property para User

A entidade RefreshToken tem uma propriedade de navegacao `User`. Como o RefreshToken esta associado a um usuario via `UserId`, o Entity Framework faz o Join automaticamente e preenche essa propriedade. Isso permite chamar `refreshToken.User` para obter a entidade completa do usuario — necessaria para gerar novos tokens.

Porem, ao **criar** uma nova entidade RefreshToken, usa-se `UserId` (a FK direta), nao a navigation property.

### 3. Cross-validacao com Access Token ID (camada extra de seguranca)

Este e o insight mais importante da aula. O JWT (Access Token) contem no seu payload:
- `NameId` — ID do usuario
- `JTI` — ID unico do proprio Access Token

Quando um RefreshToken e salvo no banco, o `AccessTokenId` salvo e o mesmo `JTI` que esta no payload do JWT. Na hora de validar:

1. Extraia o `JTI` do Access Token recebido na request (via `GetAccessTokenIdentifier`)
2. Compare com o `AccessTokenId` salvo na entidade RefreshToken do banco
3. Se nao baterem, alguem esta tentando usar um refresh token com um access token que nao corresponde

Isso cria uma camada adicional de seguranca: nao basta ter um refresh token valido, e preciso tambem apresentar o access token correto que foi emitido junto.

### 4. Por que a mesma excecao para cenarios diferentes?

O instrutor usa `RefreshTokenNotFoundException` tanto para "nao encontrado" quanto para "Access Token ID nao bate". Isso e intencional — em seguranca, quanto menos informacao voce der sobre o motivo da falha, melhor. Um atacante nao deve saber se o problema e o refresh token ou o access token.

### 5. Expiracao do Refresh Token — o conceito chave

A analogia do instrutor:
- **Access Token** expira rapido (ex: 10 minutos) — e renovado silenciosamente pelo app usando o refresh token
- **Refresh Token** expira devagar (ex: 7 dias) — so expira se a pessoa parar de usar o app

Um usuario regular **nunca percebe** a expiracao porque:
- A cada 10 min, o app renova automaticamente ambos os tokens
- O refresh token de 7 dias e constantemente substituido por um novo

O refresh token so expira quando a pessoa **para de usar o app por 7+ dias**. Nesse caso, o comportamento correto e redirecionar para a tela de login.

### 6. Repositorio Write com delete embutido

O `RefreshTokenWriteOnlyRepository.Add()` ja contem logica interna para deletar o refresh token anterior antes de adicionar o novo. Isso implementa **token rotation** — cada refresh token so pode ser usado uma vez.

### 7. Unit of Work

Sem `unitOfWork.Commit()`, as alteracoes no repositorio nao sao persistidas no banco. E o padrao Unit of Work do Entity Framework — acumula mudancas e persiste tudo de uma vez.