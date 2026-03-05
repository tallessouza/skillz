---
name: rs-csharp-maui-refactor-after-feature
description: "Enforces post-implementation code review and simplification in C#/.NET projects. Use when user asks to 'refactor', 'clean up code', 'simplify DTOs', 'review after implementing', 'remove unnecessary classes', or 'improve code quality'. Applies rules: eliminate redundant DTOs, use required/init properties, return tuples instead of wrapper classes, nullable for deferred values. Make sure to use this skill whenever finishing a feature implementation in C#. Not for initial implementation, architecture design, or test writing."
---

# Refatoracao Pos-Implementacao em C#

> Ao terminar uma funcionalidade, pare, revise e simplifique — voce agora tem mais contexto para tomar decisoes melhores.

## Rules

1. **Revise apos cada funcionalidade completa** — porque apos implementar voce tem visao completa do contexto e consegue tomar decisoes melhores sobre a estrutura
2. **Elimine DTOs wrapper desnecessarios** — se um DTO so repassa campos que ja existem em outro tipo, delete-o e use o tipo original ou tuples, porque cada classe extra e complexidade sem valor
3. **Use `required init` para propriedades obrigatorias na inicializacao** — `required` garante preenchimento, `init` garante imutabilidade apos criacao
4. **Use nullable (`?`) para propriedades preenchidas depois** — propriedades que comecam nulas e sao preenchidas durante o fluxo devem ser `tipo?` com `get; set;`, porque o compilador te protege de null reference
5. **Retorne tuples ao inves de criar DTOs de retorno** — `Task<(string Code, UserDto Generator)>` e mais simples que criar um record so para devolver dois valores
6. **Mantenha consistencia de nomenclatura ao renomear** — ao trocar um nome, atualize interface, hub, use cases e filtros, porque inconsistencia causa erros silenciosos
7. **Faca build da solution ao final** — garanta que nada quebrou antes de commitar

## How to write

### Propriedades required init (valores obrigatorios na criacao)

```csharp
public class ConnectionByCode
{
    public required string Code { get; init; }
    public required UserDto Generator { get; init; }
    public required string GeneratorConnectionId { get; init; }
}
```

### Propriedades nullable (valores preenchidos depois)

```csharp
public class ConnectionByCode
{
    // Preenchidos depois, durante o fluxo
    /// <summary>Informacoes da pessoa utilizando o codigo</summary>
    public UserDto? Joiner { get; set; }
    /// <summary>Connection ID da pessoa utilizando o codigo</summary>
    public string? JoinerConnectionId { get; set; }
}
```

### Retorno com tuple ao inves de DTO

```csharp
// Interface
Task<(string Code, UserDto Generator)> Execute(Guid userId);

// Implementacao
return (code, new UserDto(loggedUser.Id, loggedUser.Name, string.Empty));

// Consumo com deconstruction
var (code, generator) = await _generateCodeUseCase.Execute(userId);
```

## Example

**Before (DTOs desnecessarios e nomes genericos):**

```csharp
// DTO wrapper so para devolver dois campos
public record CodeUserConnectionDto(Guid Id, string Code);

// DTO wrapper so para agrupar dois UserDtos
public record ConnectionUsers(UserDto Generator, UserDto Connector);

// Classe com nomes confusos
public class UserConnectionsDto
{
    public Guid UserId { get; set; }  // "que enviou o convite" — que convite?
    public Guid UserConnectionId { get; set; }
}
```

**After (simplificado, com required/init):**

```csharp
// DTOs wrapper deletados — usar tuples ou tipos existentes

// Classe com nomes claros e constraints corretos
public class ConnectionByCode
{
    public required string Code { get; init; }
    public required UserDto Generator { get; init; }
    public required string GeneratorConnectionId { get; init; }

    /// <summary>Informacoes da pessoa utilizando o codigo</summary>
    public UserDto? Joiner { get; set; }
    /// <summary>Connection ID da pessoa utilizando o codigo</summary>
    public string? JoinerConnectionId { get; set; }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| DTO so devolve 2-3 campos primitivos | Use tuple no retorno |
| DTO so repassa campos de outro DTO | Delete e use o tipo original |
| Propriedade deve existir desde a criacao | `required` + `init` |
| Propriedade sera preenchida durante o fluxo | `tipo?` + `get; set;` |
| Renomeou classe/propriedade | Atualize interface, hub, use cases e filtros |
| Terminou refatoracao | Build da solution inteira |
| If com uma unica linha | Remova as chaves (a criterio pessoal) |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar record/DTO so para devolver 2 valores | Retorne tuple: `Task<(string, UserDto)>` |
| `public Guid UserId { get; set; }` para valor obrigatorio imutavel | `public required Guid UserId { get; init; }` |
| Propriedade nullable sem `?` | Sempre marque `tipo?` se pode ser nula |
| Manter DTO que ninguem usa apos refatoracao | Delete o arquivo |
| Nomes genericos como `Connector` misturados com `Joiner` | Escolha um termo e use consistentemente |
| Refatorar sem build no final | Sempre `dotnet build` a solution |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
