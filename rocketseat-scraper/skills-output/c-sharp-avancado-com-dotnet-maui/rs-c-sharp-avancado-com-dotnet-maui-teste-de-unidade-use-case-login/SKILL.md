---
name: rs-csharp-teste-unidade-usecase-login
description: "Enforces unit testing patterns for UseCase classes in C#/.NET projects using mocks and builders. Use when user asks to 'write unit tests', 'test a use case', 'mock repository', 'test login', or 'add test coverage' in C#/.NET. Applies patterns: mock configuration via builders, three-scenario coverage (success/not-found/invalid-input), assert on response properties, generic error messages for auth. Make sure to use this skill whenever creating unit tests for UseCase classes in .NET. Not for integration tests, API tests, or frontend testing."
---

# Teste de Unidade para UseCase em C#/.NET

> Ao testar um UseCase, mapeie todos os cenarios possiveis a partir dos caminhos do codigo (ifs, excecoes) e cubra cada um com um teste isolado usando mocks configurados via builders.

## Rules

1. **Mapeie cenarios a partir do codigo** — leia o UseCase, identifique cada `if`/excecao e crie um teste para cada caminho, porque cenarios esquecidos sao bugs futuros
2. **Configure mocks via builders** — nunca instancie mocks diretamente no teste, use builders com metodos nomeados igual a funcao mockada, porque isso padroniza e reutiliza configuracoes
3. **Passe a entidade ao builder do mock** — quando o mock precisa devolver uma entidade, o builder recebe a entidade e configura o retorno pelo campo correto (ex: email), porque isso garante consistencia entre request e mock
4. **Use valor default do mock como cenario de erro** — se nao configurar o mock, ele devolve null para objetos, e isso simula o cenario "nao encontrado" sem codigo extra
5. **Assert em propriedades especificas** — verifique id, nome, tokens individualmente, nao apenas "nao e nulo", porque garante que o UseCase mapeia os dados corretamente
6. **Mensagens de erro de autenticacao devem ser genericas** — use "E-mail e/ou senha invalidos" para ambos os casos (usuario nao encontrado e senha errada), porque revelar o motivo exato e uma vulnerabilidade de seguranca

## How to write

### Estrutura do teste com builder de UseCase

```csharp
private DoLoginUseCase CreateUseCase(User? user = null)
{
    var passwordEncrypter = PasswordEncrypterBuilder.Build(); // implementacao real
    var userRepository = new UserReadOnlyRepositoryBuilder();
    var tokenService = TokenServiceBuilder.Build(); // mock

    if (user is not null)
    {
        userRepository.GetUserByEmail(user); // configura mock
    }

    return new DoLoginUseCase(userRepository.Build(), passwordEncrypter, tokenService);
}
```

### Builder do mock com metodo nomeado

```csharp
public UserReadOnlyRepositoryBuilder GetUserByEmail(User user)
{
    _mock.Setup(r => r.GetUserByEmail(user.Email)).ReturnsAsync(user);
    return this;
}
```

### Tres cenarios padrao para login

```csharp
// Sucesso: entidade encontrada, senha correta
[Fact]
public async Task Success()
{
    var (user, password) = UserBuilder.Build();
    var useCase = CreateUseCase(user);
    var result = await useCase.Execute(new RequestLoginJson
    {
        Email = user.Email,
        Password = password
    });

    result.Should().NotBeNull();
    result.Tokens.Should().NotBeNull();
    result.Id.Should().Be(user.Id);
    result.Name.Should().Be(user.Name);
}

// Erro: usuario nao encontrado (mock nao configurado = retorna null)
[Fact]
public async Task Error_Invalid_User()
{
    var request = RequestLoginJsonBuilder.Build();
    var useCase = CreateUseCase(); // sem entidade = mock devolve null

    Func<Task> act = async () => await useCase.Execute(request);

    var exception = await act.Should().ThrowAsync<InvalidLoginException>();
    exception.Where(e => e.StatusCode == HttpStatusCode.Unauthorized);
}

// Erro: senha invalida (entidade encontrada, senha errada)
[Fact]
public async Task Error_Invalid_Password()
{
    var (user, _) = UserBuilder.Build();
    var request = RequestLoginJsonBuilder.Build();
    request.Email = user.Email; // email correto, senha gerada pelo builder (errada)

    var useCase = CreateUseCase(user);
    Func<Task> act = async () => await useCase.Execute(request);

    var exception = await act.Should().ThrowAsync<InvalidLoginException>();
}
```

## Example

**Before (teste fragil e incompleto):**
```csharp
[Fact]
public async Task TestLogin()
{
    var mock = new Mock<IUserReadOnlyRepository>();
    mock.Setup(r => r.GetUserByEmail("test@test.com")).ReturnsAsync(new User { Email = "test@test.com" });
    var useCase = new DoLoginUseCase(mock.Object, new PasswordEncrypter(), new Mock<ITokenService>().Object);
    var result = await useCase.Execute(new RequestLoginJson { Email = "test@test.com", Password = "123" });
    Assert.NotNull(result);
}
```

**After (com builders, cenarios completos, asserts especificos):**
```csharp
[Fact]
public async Task Success()
{
    var (user, password) = UserBuilder.Build();
    var useCase = CreateUseCase(user);
    var result = await useCase.Execute(new RequestLoginJson { Email = user.Email, Password = password });

    result.Should().NotBeNull();
    result.Tokens.Should().NotBeNull();
    result.Id.Should().Be(user.Id);
    result.Name.Should().Be(user.Name);
}

[Fact]
public async Task Error_Invalid_User()
{
    var request = RequestLoginJsonBuilder.Build();
    var useCase = CreateUseCase();
    Func<Task> act = async () => await useCase.Execute(request);
    await act.Should().ThrowAsync<InvalidLoginException>();
}

[Fact]
public async Task Error_Invalid_Password()
{
    var (user, _) = UserBuilder.Build();
    var request = RequestLoginJsonBuilder.Build();
    request.Email = user.Email;
    var useCase = CreateUseCase(user);
    Func<Task> act = async () => await useCase.Execute(request);
    await act.Should().ThrowAsync<InvalidLoginException>();
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| UseCase recebe dependencias no construtor | Crie `CreateUseCase` com parametros opcionais para cada mock |
| Mock precisa devolver entidade por campo | Builder recebe entidade e configura Setup pelo campo (ex: email) |
| Cenario de "nao encontrado" | Nao configure o mock — valor default (null) simula ausencia |
| Cenario de "dado invalido" | Configure mock para encontrar entidade, mas use dados errados na request |
| Excecao de autenticacao | Sempre verifique StatusCode (Unauthorized) e mensagem generica |
| Dados de teste | Use Bogus/Faker via builders para dados realistas |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `mock.Setup(...)` direto no teste | `builder.GetUserByEmail(user)` via builder |
| `new User { Email = "test@test.com" }` hardcoded | `UserBuilder.Build()` com Bogus |
| `Assert.NotNull(result)` apenas | `result.Id.Should().Be(user.Id)` — asserts especificos |
| `"Email invalido"` como mensagem de erro | `"E-mail e/ou senha invalidos"` — mensagem generica |
| Um unico teste para sucesso e erro | Um teste por cenario, nomeado explicitamente |
| Configurar mock quando quer testar "nao encontrado" | Nao passar entidade ao `CreateUseCase()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
