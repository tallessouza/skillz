# Deep Explanation: Testes de Sucesso para UseCase

## Por que builder pattern para mocks?

O instrutor enfatiza que os mocks ficam em `CommonTestUtilities` para serem compartilhados entre diferentes projetos de teste. Isso evita duplicacao — se amanha outro UseCase precisar de um mock do `IPasswordEncrypter`, ele ja esta pronto.

## It.IsAny vs valor exato — quando usar cada um

O instrutor faz uma distincao clara:

- **`It.IsAny<T>()`**: Quando o valor do parametro nao e relevante para o cenario sendo testado. Exemplo: no `PasswordEncrypter.Encrypt()`, nao importa qual senha chega — o mock sempre retorna `"PasswordEncrypted"`. O teste nao e sobre criptografia, e sobre o fluxo do UseCase.

- **Valor exato**: Quando o comportamento do mock depende do valor. Exemplo: `UserReadOnlyRepository.ExistsByEmail(email)` — so retorna `true` se o email for exatamente o configurado. Isso permite testar cenarios onde o email ja existe vs nao existe.

Analogia do instrutor: "Faz uma vista grossa pra isso ai. Ignora esse parametro." — `It.IsAny` e literalmente dizer ao mock para ignorar o valor.

## Returns vs ReturnsAsync

A diferenca e simples mas gera erros de compilacao se errada:
- `Encrypt(string password)` retorna `string` → use `.Returns("value")`
- `GenerateTokens(User user)` retorna `Task<TokensDTO>` → use `.ReturnsAsync(new TokensDTO{...})`

O instrutor destaca: "Veja que nem tem o ReturnsAsync aqui, porque esse Encrypt nao e uma funcao assincrona, ta devolvendo uma String direto e nao uma Task."

## Metodo estatico vs instancia no builder

- **Estatico (`Build()`)**: Quando o mock tem comportamento fixo, sem configuracao variavel. Exemplo: `UnitOfWorkBuilder.Build()` — nao precisa instanciar.
- **Instancia (`new Builder()`)**: Quando o mock pode ter configuracao variavel entre testes. Exemplo: `UserReadOnlyRepositoryBuilder` — ora configura `ExistsByEmail` para retornar `true`, ora nao configura (retorna `false` por default).

O instrutor explica: "Esse build aqui e uma funcao estatica. Entao, a gente nao precisa de estar instanciando o builder."

## O fluxo do teste de sucesso

O instrutor faz debug passo a passo mostrando:
1. Request criada com Bogus (dados aleatorios)
2. UseCase instanciado com todos os mocks
3. `Validate` — request valida, `IsValid = true`
4. `ExistsByEmail` — mock nao configurado, retorna `false` (default de bool), email nao existe
5. Mapeamento do user sem problemas
6. `Encrypt` — mock retorna `"PasswordEncrypted"`
7. `Add` no repositorio — mock aceita sem problemas
8. `Commit` no UnitOfWork — mock aceita
9. `GenerateTokens` — mock retorna tokens fake
10. Retorno com `ResponseRegisterUserJson`
11. Assertions: nao nulo + nome igual ao enviado

## Valor default do bool em C#

Ponto sutil: quando o mock do `ReadOnlyRepository` nao tem setup para `ExistsByEmail`, ele retorna `false` (default de `bool` em C#). Isso e o comportamento desejado para o cenario de sucesso — o email nao existe, entao o cadastro prossegue.

## Organizacao de pastas para mocks

O instrutor mantem a mesma estrutura de pastas do projeto principal:
```
CommonTestUtilities/
├── Repositories/
│   ├── UnitOfWorkBuilder.cs
│   ├── UserWriteOnlyRepositoryBuilder.cs
│   └── UserReadOnlyRepositoryBuilder.cs
├── Security/
│   └── Cryptography/
│       └── PasswordEncrypterBuilder.cs
└── Authentication/
    └── TokenServiceBuilder.cs
```