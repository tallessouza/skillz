---
name: rs-csharp-maui-gerar-codigo-conexao
description: "Enforces secure unique code generation patterns in C#/.NET when building real-time connection features. Use when user asks to 'generate a code', 'create invitation code', 'build pairing system', 'connect two users', or any unique code generation task in .NET. Applies RandomNumberGenerator, proper digit padding with ToString D6, and even-digit code sizing for memorability. Make sure to use this skill whenever generating numeric codes for user-facing features in C#. Not for JWT tokens, password hashing, or encryption key generation."
---

# Geracao de Codigos Unicos para Conexao

> Ao gerar codigos numericos para conectar usuarios, use RandomNumberGenerator com padding fixo e quantidade par de digitos.

## Rules

1. **Use RandomNumberGenerator, nunca Random** — `RandomNumberGenerator.GetInt32()` nao `Random.Next()`, porque Random e previsivel e tem alta taxa de colisao em acessos simultaneos
2. **Quantidade de digitos sempre par (4 ou 6)** — humanos memorizam numeros em pares (52-28, 125-231), digitos impares quebram essa memorizacao
3. **Pad com zeros a esquerda via ToString("D{n}")** — `ToString("D6")` nao concatenacao manual, porque garante tamanho fixo mesmo quando o numero gerado e pequeno (65 → 000065)
4. **Use fromInclusive=1, toExclusive=10^n** — nunca comece em 0 (codigo todo zero nao faz sentido), e lembre que toExclusive e exclusivo (1_000_000 gera ate 999_999)
5. **Separe centenas com underline em literais grandes** — `1_000_000` nao `1000000`, porque e impossivel contar zeros sem separador visual
6. **6 digitos = 1 milhao de combinacoes** — suficiente para codigos temporarios de conexao; 4 digitos (10 mil) para cenarios mais simples

## How to write

### Geracao de codigo com RandomNumberGenerator

```csharp
using System.Security.Cryptography;

// Gera codigo de 6 digitos com baixa colisao e imprevisibilidade
var code = RandomNumberGenerator
    .GetInt32(fromInclusive: 1, toExclusive: 1_000_000)
    .ToString("D6");
```

### Interface e UseCase

```csharp
public interface IGenerateCodeUserConnectionUseCase
{
    Task<CodeUserConnectionDTO> Execute();
}

public record CodeUserConnectionDTO(string Code, Guid UserId);
```

### Implementacao no UseCase

```csharp
public class GenerateCodeUserConnectionUseCase : IGenerateCodeUserConnectionUseCase
{
    private readonly ILoggedUser _loggedUser;

    public GenerateCodeUserConnectionUseCase(ILoggedUser loggedUser)
    {
        _loggedUser = loggedUser;
    }

    public async Task<CodeUserConnectionDTO> Execute()
    {
        var user = await _loggedUser.User();

        var code = RandomNumberGenerator
            .GetInt32(fromInclusive: 1, toExclusive: 1_000_000)
            .ToString("D6");

        return new CodeUserConnectionDTO(code, user.Id);
    }
}
```

## Example

**Before (inseguro e fragil):**
```csharp
var random = new Random();
var code = random.Next(0, 999999).ToString();
// Problemas: previsivel, pode gerar "0", tamanho variavel
```

**After (com esta skill aplicada):**
```csharp
var code = RandomNumberGenerator
    .GetInt32(fromInclusive: 1, toExclusive: 1_000_000)
    .ToString("D6");
// Criptograficamente seguro, nunca "000000", sempre 6 digitos
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Codigo temporario de pareamento | 6 digitos (1M combinacoes) |
| PIN simples de confirmacao | 4 digitos (10K combinacoes) |
| Codigo precisa ser falado por voz | Sempre par de digitos (memorizar em pares) |
| Literal numerico grande no codigo | Separar com underline: `1_000_000` |
| UseCase usado em Hub (WebSocket) | Funciona igual Controller — HTTP context preservado na conexao |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `new Random().Next(...)` | `RandomNumberGenerator.GetInt32(...)` |
| `.ToString()` sem formato | `.ToString("D6")` com padding |
| `GetInt32(0, 999999)` | `GetInt32(1, 1_000_000)` — evita zero, toExclusive |
| `1000000` sem separador | `1_000_000` com underline |
| Codigo com 5 ou 7 digitos | 4 ou 6 digitos (memorizacao em pares) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
