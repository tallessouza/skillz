# Deep Explanation: Custom Authorize Filter em ASP.NET

## Por que exception filters nao capturam excecoes em authorization filters

O instrutor explica um ponto critico: o exception filter que voce configura na API (aquele que trata excecoes globalmente) so funciona para excecoes que acontecem **apos a requisicao chegar no controller**. O authorization filter executa **antes** do controller — ele existe justamente para impedir que a requisicao chegue la. Por isso, qualquer excecao lancada dentro do authorization filter precisa de seu proprio try-catch.

Isso significa que a `UnauthorizedException` customizada que voce usa em outros lugares da aplicacao (e que seria capturada pelo exception filter global) **nao sera capturada** se lancada dentro do authorization filter. Voce precisa tratar manualmente.

## AsNoTracking: por que importa

O Entity Framework, por padrao, "rastreia" toda entidade que voce busca do banco. Isso significa que ele prepara a entidade para ser atualizada — consome memoria e processamento. Quando voce so quer verificar se um usuario existe (como no filtro de autorizacao), voce nao vai atualizar nada. O `AsNoTracking()` diz ao EF: "nao prepare essa entidade para update".

O instrutor enfatiza: na interface `IUserUpdateOnlyRepository`, voce **nao pode** usar AsNoTracking porque precisa atualizar a entidade. Na `IUserReadOnlyRepository`, voce **deve** usar.

## SingleAsync vs SingleOrDefaultAsync

- `SingleAsync`: espera exatamente 1 resultado. Se nao encontrar, **lanca excecao**. Se encontrar mais de 1, tambem lanca excecao.
- `SingleOrDefaultAsync`: espera 0 ou 1 resultado. Se nao encontrar, retorna `null` (ou default). Se encontrar mais de 1, lanca excecao.

No filtro de autorizacao, voce **nao sabe** se o usuario existe. O token pode pertencer a alguem que deletou a conta. Entao `SingleOrDefaultAsync` e obrigatorio.

O `SingleOrDefaultAsync` lanca erro se houver mais de 1 resultado, mas como o ID e unico no banco, isso nunca acontece.

## Implementacao explicita de interface — o mecanismo do C#

Quando duas interfaces exigem o mesmo metodo (`GetById`), voce nao pode ter dois metodos `public GetById` com a mesma assinatura na classe. O C# resolve isso com **implementacao explicita**:

1. Remova o `public`
2. Prefixe o nome do metodo com `INomeInterface.`

```csharp
// Ao inves de:
public async Task<User> GetById(Guid id) { ... }  // conflito!
public async Task<User?> GetById(Guid id) { ... } // conflito!

// Faca:
async Task<User> IUserUpdateOnlyRepository.GetById(Guid id) { ... }
async Task<User?> IUserReadOnlyRepository.GetById(Guid id) { ... }
```

O compilador sabe qual executar com base na interface pela qual o metodo foi chamado.

## Por que devolver User e nao apenas bool

O instrutor explica que retornar a entidade `User` (ao inves de apenas verificar existencia com bool) permite fazer validacoes adicionais no filtro: verificar subscricao, permissoes especificas, roles, etc. E uma decisao de design que oferece flexibilidade.

## Funcoes static no filtro

O Visual Studio sugere marcar `TokenOnRequest` como `static` porque ela nao usa nenhuma propriedade da instancia (`_repository`, `_validator`). O instrutor aceita: e uma otimizacao de performance — metodos estaticos nao carregam referencia ao `this`.

## Dois catches separados: design intencional

- **catch (UnauthorizedException)**: excecao customizada que voce controla. Retorna as mensagens especificas (token invalido, token expirado, etc.)
- **catch generico**: qualquer outra excecao inesperada. Retorna mensagem generica "sem permissao" — nunca exponha detalhes internos de excecoes inesperadas por seguranca.

## Fluxo completo do filtro

1. Extrair token do header Authorization
2. Se nao existe token → lanca `UnauthorizedException`
3. Validar token (assinatura, expiracao, emissor)
4. Se invalido → `JwtSecurityTokenHandler.ValidateToken` lanca excecao
5. Extrair ID do usuario do payload do token (claim `NameId`)
6. Buscar usuario no banco com `AsNoTracking` + `SingleOrDefaultAsync`
7. Se nao encontrou → lanca `UnauthorizedException`
8. Se encontrou → requisicao segue para o controller

## Claim NameId: de onde vem

O instrutor destaca a importancia de entender o codigo de geracao do token. Na classe que gera o JWT, o ID do usuario e registrado com a chave `JwtRegisteredClaimNames.NameId`. Por isso, na hora de extrair, voce usa a mesma constante. Nao e magica — e consistencia entre geracao e leitura do token.