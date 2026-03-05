---
name: rs-csharp-avancado-entidade-refresh-token
description: "Applies Refresh Token entity design patterns when building authentication systems in C#/.NET. Use when user asks to 'create refresh token', 'implement token rotation', 'build auth entity', 'design token storage', or 'add refresh token to database'. Enforces base entity inheritance, navigation properties, AccessTokenId pairing, and soft delete patterns. Make sure to use this skill whenever creating token-related entities in Entity Framework projects. Not for JWT generation logic, token validation rules, or migration creation."
---

# Entidade Refresh Token em C#/.NET

> Toda entidade de Refresh Token herda de uma base padronizada e armazena token, AccessTokenId e UserId para garantir rastreabilidade e seguranca.

## Rules

1. **Herde de EntBase** — toda entidade precisa de Id (Guid v7), Active (bool para soft delete) e CreatedAt (DateTime), porque garante consistencia entre todas as entidades do projeto
2. **Armazene o AccessTokenId** — cada Refresh Token guarda o Id do Access Token associado, porque permite validacao cruzada e adiciona camada extra de seguranca
3. **Associe ao User via UserId** — todo Refresh Token pertence a um usuario, porque na hora de gerar novo Access Token precisa recuperar o usuario correto
4. **Adicione propriedade de navegacao** — `public User User { get; set; } = default!;` permite ao Entity Framework fazer join automatico via Include
5. **Use CreatedAt para expiracao** — a data de criacao serve para calcular se o Refresh Token ainda esta dentro do prazo de validade
6. **Inicialize strings com string.Empty** — evita warnings de nullable sem alterar a logica, porque o valor real vem do banco de dados

## How to write

### EntBase (classe base padrao)

```csharp
public class EntBase
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public bool Active { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### Entidade RefreshToken

```csharp
public class RefreshToken : EntBase
{
    public string Token { get; set; } = string.Empty;
    public Guid AccessTokenId { get; set; }
    public Guid UserId { get; set; }

    // Propriedade de navegacao — Entity Framework faz join via Include
    public User User { get; set; } = default!;
}
```

## Example

**Before (sem padrao, propriedades soltas):**

```csharp
public class RefreshToken
{
    public Guid Id { get; set; }
    public string Token { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedOn { get; set; } // preposicao errada
}
```

**After (com esta skill aplicada):**

```csharp
public class RefreshToken : EntBase
{
    public string Token { get; set; } = string.Empty;
    public Guid AccessTokenId { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova entidade no projeto | Herde de EntBase para manter Id, Active e CreatedAt |
| Precisa de soft delete | Use a propriedade Active herdada (true = ativo, false = deletado) |
| Relacionamento com outra entidade | Adicione propriedade de navegacao + propriedade de FK (UserId) |
| Propriedade string obrigatoria | Inicialize com `string.Empty` para suprimir warnings |
| Propriedade de referencia nao-nula | Use `= default!` para indicar que sera preenchida pelo EF |
| DateTime para rastrear criacao | Use `CreatedAt` (nao `CreatedOn`) — preposicao correta para ponto no tempo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `public DateTime CreatedOn` | `public DateTime CreatedAt` — "at" para ponto no tempo |
| Refresh Token sem AccessTokenId | Sempre inclua AccessTokenId para validacao cruzada |
| Entidade sem heranca de base | Herde de EntBase para consistencia |
| `public User User { get; set; }` sem inicializador | `public User User { get; set; } = default!;` |
| `public string Token { get; set; }` sem inicializador | `public string Token { get; set; } = string.Empty;` |
| Guid gerado manualmente no construtor | Use `Guid.CreateVersion7()` na EntBase |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
