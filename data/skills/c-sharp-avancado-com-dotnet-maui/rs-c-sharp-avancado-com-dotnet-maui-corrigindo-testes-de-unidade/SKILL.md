---
name: rs-csharp-dotnet-maui-corrigindo-testes
description: "Enforces best practices for fixing and maintaining unit/integration tests in .NET C# projects. Use when user asks to 'fix failing tests', 'mock a service', 'write unit tests', 'handle in-memory database limitations', or 'configure test dependencies'. Applies rules: mock external dependencies instead of using real implementations, register test-specific mocks via DI, isolate unit test scope, always build before running tests. Make sure to use this skill whenever fixing broken tests after refactoring or adding new dependencies to constructors. Not for writing production code, API design, or database migrations."
---

# Corrigindo e Melhorando Testes de Unidade (.NET)

> Apos qualquer alteracao no codigo, faca build da solution e execute os testes antes de prosseguir.

## Rules

1. **Build antes de testar** — sempre faca Build Solution antes de executar testes, porque erros de compilacao geram falhas em cascata em todos os projetos dependentes
2. **Resolva o erro raiz primeiro** — quando multiplos erros aparecem, o primeiro erro e o real; os demais sao cascata de projetos que referenciam o projeto quebrado
3. **Use mocks para dependencias externas** — mock de interfaces como `ITokenService` ao inves de instancias reais, porque criptografia e operacoes pesadas tornam testes lentos
4. **Atualize construtores nos testes** — ao adicionar parametros em use cases, atualize TODOS os testes que instanciam aquele use case, porque o compilador nao perdoa
5. **Isole o escopo do teste** — teste de use case testa regras do use case, nao criptografia do token; se quiser testar token, crie teste separado para essa classe
6. **Trate limitacoes do banco em memoria** — operacoes como `ExecuteDelete` nao funcionam em InMemory database; use mocks via DI para contornar

## How to write

### Mock builder para repositorio write-only

```csharp
// Builder retorna mock simples — metodos void nao precisam de setup
public class RefreshTokenWriteOnlyRepositoryBuilder
{
    public static IRefreshTokenWriteOnlyRepository Build()
    {
        var mock = new Mock<IRefreshTokenWriteOnlyRepository>();
        return mock.Object;
    }
}
```

### Registrar mock no container de DI para testes de integracao

```csharp
// No CustomWebApplicationFactory, substitua implementacoes incompativeis
var mockRefreshTokenRepository = new RefreshTokenWriteOnlyRepositoryBuilder();

services.AddScoped<IRefreshTokenWriteOnlyRepository>(config =>
    mockRefreshTokenRepository.Build());
```

### Condicionar registro de dependencia por ambiente

```csharp
// Na camada de infraestrutura, evite registrar servicos incompativeis com teste
private static void AddRepositories(IServiceCollection services, IWebHostEnvironment environment)
{
    // Registra apenas se NAO for ambiente de testes
    if (environment.IsEnvironment("Test") == false)
    {
        services.AddScoped<IRefreshTokenWriteOnlyRepository, RefreshTokenWriteOnlyRepository>();
    }
}
```

### Corrigir mock apos assinatura mudar de async para sync

```csharp
// ANTES (metodo era async — Task<TokensDTO>)
mock.Setup(x => x.GenerateTokens(It.IsAny<User>()))
    .ReturnsAsync(new TokensDTO { ... });

// DEPOIS (metodo agora retorna direto — TokensDTO)
mock.Setup(x => x.GenerateTokens(It.IsAny<User>()))
    .Returns(new TokensDTO { ... });
```

## Example

**Before (teste quebrado apos adicionar dependencia):**
```csharp
var useCase = new RegisterUserUseCase(
    userRepository,
    passwordEncrypter,
    tokenService,
    unitOfWork
);
// Erro: falta refreshTokenWriteOnlyRepository no construtor
```

**After (teste corrigido):**
```csharp
var refreshTokenRepository = new RefreshTokenWriteOnlyRepositoryBuilder().Build();

var useCase = new RegisterUserUseCase(
    userRepository,
    passwordEncrypter,
    tokenService,
    refreshTokenRepository,
    unitOfWork
);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Build falhou com N erros | Resolva apenas o primeiro; os demais sao cascata |
| Metodo mudou de async para sync | Troque `ReturnsAsync` por `Returns` no mock |
| Novo parametro no construtor de use case | Crie builder de mock e passe em TODOS os testes |
| Operacao SQL nao suportada em InMemory DB | Registre mock via DI no `CustomWebApplicationFactory` |
| Quer testar implementacao real de um servico | Crie teste de unidade separado para aquela classe |
| Teste de integracao retorna 500 | Debug com breakpoint no controller para encontrar a linha exata |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Instanciar `new TokenService()` no teste de use case | `Mock<ITokenService>` — foco no use case, nao na criptografia |
| Fazer mock do mock (mock de `IAccessTokenGenerator` dentro de `TokenService` real) | Mock direto da interface `ITokenService` |
| Ignorar erro de build e rodar testes | Build Solution primeiro, corrija erros, depois execute testes |
| Remover `ExecuteDelete` performatico por causa do teste | Manter codigo performatico e usar mock no teste de integracao |
| Testar se refresh token e base64 dentro do teste de use case | Criar teste de unidade separado para a classe `TokenService` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
