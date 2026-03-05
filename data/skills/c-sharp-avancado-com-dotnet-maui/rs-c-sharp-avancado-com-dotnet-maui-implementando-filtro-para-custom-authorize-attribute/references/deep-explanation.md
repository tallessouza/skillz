# Deep Explanation: Custom Authorize Filter

## Por que nao usar o Authorize padrao?

O instrutor compartilha que "praticamente nao gosta de utilizar o Authorize do .NET" porque sente que "perde controle sobre o proprio codigo". Essa nao e uma preferencia arbitraria — em cenarios reais como planos de assinatura (Basico, Plus, Premium), o Authorize padrao nao oferece flexibilidade suficiente.

### Caso real: sistema de assinaturas

O instrutor trabalhou em um sistema onde usuarios escolhiam entre tres planos de assinatura (similar a apps que oferecem Basico/Plus/Premium). Cada plano tinha:
- Precos diferentes
- Funcionalidades exclusivas por plano

A solucao foi criar **atributos customizados por plano**, colocados diretamente nos controllers/endpoints. Assim, baseado no plano que a pessoa escolheu, ela poderia ou nao executar aquele endpoint.

## Arquitetura do filtro

### Duas classes necessarias
Para criar um atributo de autorizacao customizado no .NET, sao necessarias duas classes:
1. **O filtro** (AuthenticatedUserFilter) — implementa `IAsyncAuthorizationFilter`
2. **O atributo** (implementado na proxima aula) — marca os endpoints

Esse padrao e analogo ao ExceptionFilter que ja existe no projeto — uma classe implementa `IExceptionFilter` e toda excecao cai nela. Aqui, toda requisicao a um endpoint marcado cai no filtro de autorizacao.

### Por que async?

A funcao `OnAuthorizationAsync` e assincrona porque o filtro precisa consultar o repositorio para verificar se o usuario esta ativo. Isso envolve chamada ao banco de dados, que e I/O e deve ser assíncrona.

## Extracao do token — detalhes

O header Authorization vem no formato: `Bearer eyJhbGciOi...`

A tecnica usada:
```csharp
authentication["Bearer ".Length..].Trim()
```

Explicacao do instrutor: "Uma string nada mais e que um array de caracteres. 'Bearer ' tem 7 caracteres (B-e-a-r-e-r-espaco). Quando uso `["Bearer ".Length..]`, estou dizendo pro .NET comecar a partir da posicao 7 ate o final, desconsiderando o prefixo Bearer."

O `.Trim()` no final e uma garantia extra para remover espacos em branco no inicio e fim.

## Validacao do token — paradigma por excecao

O instrutor destaca um ponto importante: `ValidateToken` do JWT **nao retorna true/false**. A forma de saber se o token e valido e verificar se uma excecao foi lancada:

- Nao lancou excecao → token valido
- Lancou excecao → token invalido, tratar o erro

O parametro `out _` (discard) e usado porque `ValidateToken` retorna um `SecurityToken` via parametro de saida, mas essa informacao nao e necessaria.

## TokenValidationParameters — decisoes

- **ValidateAudience = false**: Audience e para quem o token foi gerado (app, site). O instrutor nao ve vantagem em validar isso.
- **ValidateIssuer = false**: Issuer e quem gerou o token (a propria API). Tambem considerado desnecessario.
- **IssuerSigningKey**: A mesma chave usada para gerar o token. Se bater, o token e valido. Vem da classe abstrata `JwtTokenHandler` compartilhada entre Generator e Validator.
- **ClockSkew = TimeSpan.Zero**: Evita problemas na validacao do tempo de expiracao.

## Reutilizacao via classe abstrata

O `JwtTokenHandler` e uma classe abstrata porque a funcao de obter a SecurityKey e necessaria tanto na geracao quanto na validacao do token. Isso evita duplicacao de codigo entre `JwtTokenGenerator` e `JwtTokenValidator`.

## AccessTokenIdentifier — preparacao para Refresh Token

Na geracao do token, um GUID e criado como ID unico do token (AccessTokenIdentifier). Isso sera essencial para o Refresh Token. Em .NET 9, pode-se usar `Guid.CreateVersion7()` em vez de `Guid.NewGuid()`.

A funcao de geracao retorna dois valores usando tuple syntax:
```csharp
return (token, accessTokenIdentifier);
```