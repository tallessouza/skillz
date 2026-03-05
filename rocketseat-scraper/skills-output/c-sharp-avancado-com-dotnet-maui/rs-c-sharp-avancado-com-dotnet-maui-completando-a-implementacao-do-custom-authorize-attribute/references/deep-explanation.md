# Deep Explanation: Custom Authorize Attribute

## Por que o Exception Filter nao funciona aqui

O instrutor enfatiza um ponto critico: o filtro de excecao (exception filter) do ASP.NET so captura excecoes **depois que a request chega no controller**. O filtro de autorizacao executa **antes** do controller. Portanto, qualquer excecao lancada durante a autorizacao precisa ser tratada com try-catch dentro do proprio filtro.

## Fluxo completo do filtro

1. **Pega o token** da request HTTP (header Authorization)
2. **Se nao veio token** → lanca `UnauthorizedException`
3. **Valida o token** — verifica se foi gerado pela API (mesma signing key), se esta dentro da data de expiracao
4. **Se token invalido** (ex: alguem mandou "bitterWellison") → `ValidateToken` lanca excecao generica (nao conhece `UnauthorizedException`)
5. **Se token expirado** → `ValidateToken` lanca `SecurityTokenExpiredException` (de `Microsoft.IdentityModel.Tokens`)
6. **Extrai o user ID** dos claims do token
7. **Busca no banco** o usuario com aquele ID (e que esteja ativo)
8. **Se nao encontrou** → lanca `UnauthorizedException`
9. **Se encontrou** → funcao termina sem setar `context.Result`, e a request prossegue para o controller

### O mecanismo de bloqueio

Quando voce faz `context.Result = new UnauthorizedObjectResult(...)`, o .NET identifica que ja existe um resultado e **nao permite** a request prosseguir para o controller. Se a funcao termina sem setar `context.Result`, a request continua normalmente.

## Por que diferenciar token expirado de token invalido

O instrutor explica que quando o token e valido mas expirado, o aplicativo precisa **redirecionar o usuario para a tela de login** para obter um novo token. Um 401 generico nao da essa informacao ao app. A flag `TokenIsExpired = true` no JSON de resposta permite que o frontend tome a acao correta.

Quando houver refresh token implementado, esse redirecionamento nao sera necessario — o app pode renovar o token automaticamente. Mas ate la, a flag e essencial.

## TypeFilterAttribute e registro automatico

O instrutor destaca que ao herdar de `TypeFilterAttribute<T>`, **nao e necessario** configurar nada no `Program.cs`. O .NET descobre automaticamente o atributo. Isso e diferente de outros middlewares que precisam ser registrados manualmente.

## AttributeUsage com pipe simples vs duplo

- `|` (um pipe) = operacao bitwise OR — combina flags de enum
- `||` (dois pipes) = operacao logica OR — para condicionais if

Como `AttributeTargets` e um enum com flags, usa-se pipe simples para combinar `Class | Method`. Dois pipes causaria erro de compilacao.

## Sealed class

O modificador `sealed` impede que outras classes herdem de `AuthenticatedUserAttribute`. Isso faz sentido porque o atributo e uma unidade completa — nao ha razao para extende-lo.

## Convencao de nome do atributo

O .NET permite omitir o sufixo "Attribute" ao usar o atributo como decorator. `AuthenticatedUserAttribute` pode ser usado como `[AuthenticatedUser]`. O framework resolve automaticamente.