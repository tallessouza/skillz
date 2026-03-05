---
name: rs-csharp-maui-intro-testes-unidade-backend
description: "Applies .NET unit testing setup patterns with xUnit, Bogus, Moq, and Shouldly when creating test projects in C#/.NET solutions. Use when user asks to 'create unit tests', 'setup test project', 'generate fake data', 'mock dependencies', or 'replace Fluent Assertions'. Enforces proper solution folder structure, CommonTestUtilities pattern, and Bogus builder classes. Make sure to use this skill whenever setting up .NET test infrastructure or generating test data builders. Not for writing actual test methods, integration tests, or frontend/mobile testing."
---

# Testes de Unidade no Backend .NET

> Organize testes em solution folders separadas, centralize utilidades compartilhadas em CommonTestUtilities, e use builders com Bogus para gerar dados fake.

## Rules

1. **Separe testes do codigo fonte** — crie uma pasta `tests/` na solution E no filesystem, porque solution folders nao refletem automaticamente no disco
2. **Espelhe a estrutura src no tests** — `tests/Backend/`, `tests/Mobile/` espelhando `src/Backend/`, `src/Mobile/`, porque facilita navegacao e manutencao
3. **Centralize utilidades em CommonTestUtilities** — crie um projeto Class Library compartilhado entre projetos de teste, porque evita duplicacao de builders, mocks e helpers
4. **Use Shouldly no lugar de Fluent Assertions** — Fluent Assertions ficou pago, Shouldly e gratuito e tem sintaxe similar
5. **Use Bogus para dados fake, nunca dados fixos** — `new Faker<T>()` com `.RuleFor()` gera dados aleatorios, porque dados fixos escondem bugs de edge case
6. **Use Moq para mocks de interfaces** — injecao de dependencia facilita mock, porque nao precisa instanciar implementacoes reais
7. **Nomeie builders como Request{Nome}Builder** — retire o sufixo Json/Dto e adicione Builder, porque descreve o proposito da classe

## How to write

### Estrutura da Solution

```
Solution/
├── src/
│   ├── Backend/
│   │   ├── Api/
│   │   ├── Application/
│   │   └── Communication/
│   └── Shared/
└── tests/
    └── Backend/
        ├── CommonTestUtilities/    # Class Library
        │   └── Requests/
        │       └── RequestRegisterUserBuilder.cs
        └── Validators.Tests/       # xUnit Test Project
```

### Builder com Bogus

```csharp
using Bogus;
using PlanShare.Communication.Requests;

public class RequestRegisterUserBuilder
{
    public static RequestRegisterUserJson Build()
    {
        return new Faker<RequestRegisterUserJson>()
            .RuleFor(user => user.Name, f => f.Person.FirstName)
            .RuleFor(user => user.Email, (f, user) => f.Internet.Email(user.Name))
            .RuleFor(user => user.Password, f => f.Internet.Password());
    }
}
```

### Referencia entre projetos de teste

```
Validators.Tests → CommonTestUtilities (project reference)
CommonTestUtilities → Communication (project reference, para acessar os tipos de request)
```

## Example

**Before (dados fixos no teste):**
```csharp
var request = new RequestRegisterUserJson
{
    Name = "João",
    Email = "joao@email.com",
    Password = "123456"
};
```

**After (builder com Bogus):**
```csharp
var request = RequestRegisterUserBuilder.Build();
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo tipo de request precisa de teste | Crie um Builder na pasta `CommonTestUtilities/Requests/` |
| Propriedade tem relacao com outra (ex: email com nome) | Use o segundo parametro do RuleFor: `(f, user) => f.Internet.Email(user.Name)` |
| Funcao Build nao precisa de instancia | Declare como `public static` |
| Password precisa de requisitos minimos | Passe parametros: `f.Internet.Password(length: 10)` |
| Solution folder criada mas pasta nao existe no disco | Crie manualmente no filesystem |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Dados fixos hardcoded nos testes | `RequestRegisterUserBuilder.Build()` com Bogus |
| Testes dentro do projeto src | Projeto xUnit separado em `tests/` |
| Copiar builders entre projetos de teste | Centralizar em CommonTestUtilities |
| Usar Fluent Assertions em projetos novos | Usar Shouldly (gratuito) |
| Classe builder com `internal` | Declarar como `public` |
| Instanciar builder para chamar Build | Declarar Build como `static` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
