# Deep Explanation: Refresh Token na API .NET

## Por que TokenService nao deve acessar repositorio

O instrutor enfatiza um principio fundamental de separacao de responsabilidades: a classe TokenService existe para **gerar tokens** — nada mais. Quando essa classe recebe um repositorio e faz commits, cria-se um problema grave de controle transacional.

### O cenario de erro

Imagine que o UseCase, apos chamar `GenerateTokens`, continua executando logica de negocio. Se o TokenService ja fez um `Commit()` internamente, e a logica subsequente falha, voce tem **metade dos dados persistidos e metade nao**. O banco fica inconsistente.

O instrutor usa a analogia do **orquestrador**: o UseCase e quem deve ter a visao completa do fluxo. Ele sabe quando tudo esta pronto para persistir. Delegar commits para classes auxiliares e como deixar cada musico decidir quando comecar a tocar — o resultado e cacofonia.

### Consequencia pratica

Se o TokenService e sincrono (nao precisa de async/await), a assinatura da funcao fica mais simples: retorna `TokensDTO` diretamente, sem `Task<>`. O instrutor faz questao de remover o `async Task` e os `await` correspondentes nos UseCase que chamavam essa funcao.

## O bug do parameter shadowing no LINQ

Este e um dos bugs mais sutis que o instrutor encontrou em projetos reais. Quando o metodo recebe um parametro chamado `refreshToken` e a expressao LINQ usa `.Where(refreshToken => ...)`, o C# resolve **ambas as referencias** para o parametro da lambda, nao para o parametro do metodo.

O resultado e equivalente a:
```sql
DELETE FROM refresh_tokens WHERE 1 = 1
```

Isso **deleta todos os refresh tokens** do banco em vez de deletar apenas o da pessoa especifica. O instrutor destaca que este tipo de erro e particularmente perigoso porque:
- Compila sem erro
- Nao gera exception em runtime
- Funciona "corretamente" no sentido de que executa sem falhar
- So e descoberto quando alguem percebe que dados sumiram

A correcao e simples: use nomes diferentes (`token`, `t`, `entry`) na lambda.

## Sintaxe `new()` vs `new Type()` no .NET moderno

O instrutor apresenta as duas formas e da sua opiniao pratica:

- `new()` (target-typed new): funciona quando o compilador infere o tipo pelo contexto. Bom para `return new()` quando o tipo de retorno e claro.
- `new ResponseTokensJson()` (explicito): preferivel quando o tipo nao e obvio, especialmente em propriedades aninhadas.

O criterio do instrutor: **"Se eu estiver fazendo code review so com o codigo (sem IDE), vou entender qual instancia esta sendo criada?"** Se a resposta for nao, use a forma explicita.

## Fluxo completo do AccessTokenId

1. `GenerateAccessToken` cria um `Guid.CreateVersion7()` como identificador unico do access token
2. Esse ID e adicionado como claim no payload do JWT
3. A funcao retorna tanto o token string quanto o ID
4. O TokenService repassa esse ID via `TokensDTO`
5. O UseCase usa esse ID para criar a entidade `RefreshToken` com a propriedade `AccessTokenId`

Isso permite que, no futuro, quando o refresh token for usado para gerar um novo access token, a API saiba qual access token anterior ele substitui.

## Por que testar Login e Register separadamente

Ambos os UseCase (Login e Register) retornam a mesma resposta (`ResponseHashAUserJson`) e ambos precisam gerar e persistir refresh tokens. O instrutor implementa a mesma logica nos dois, mas destaca:

- No Register, ja existia um `Commit()` para persistir o usuario. Com o refresh token, esse commit unico agora persiste **ambos** (usuario + refresh token) na mesma transacao.
- No Login, o `Commit()` e novo — antes nao havia necessidade de persistir nada.