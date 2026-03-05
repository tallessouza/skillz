---
name: rs-csharp-maui-conexao-pessoas-db
description: "Applies database relationship modeling patterns (1:1, 1:N, N:N) when designing user connection systems. Use when user asks to 'model relationships', 'connect users', 'create junction table', 'design friend system', or 'map database relations'. Enforces correct foreign key placement, junction table design, and bidirectional connection semantics. Make sure to use this skill whenever modeling entity relationships in relational databases. Not for NoSQL, graph databases, or application-layer connection logic."
---

# Modelagem de Conexoes entre Pessoas no Banco de Dados

> Ao modelar conexoes entre entidades, identifique o tipo de relacao (1:1, 1:N, N:N) e aplique o padrao correto de foreign key e tabelas auxiliares.

## Rules

1. **Identifique o tipo de relacao antes de criar tabelas** — pergunte "A pode ter muitos B?" e "B pode ter muitos A?", porque a resposta determina toda a estrutura
2. **Relacao 1:1: FK vai no lado que 'tem'** — pergunte "A tem B ou B tem A?" e coloque a FK no lado que faz sentido semantico, porque simplifica queries
3. **Relacao 1:N: FK sempre vai pro lado N** — a tabela do lado "muitos" recebe o ID do lado "um", porque cada registro N aponta para seu unico pai
4. **Relacao N:N: crie tabela auxiliar obrigatoriamente** — nao existe como representar N:N sem junction table, porque ambos os lados tem multiplas conexoes
5. **Conexao usuario-usuario e N:N** — quando ambos os lados sao a mesma entidade (users), a junction table tem duas FKs para a mesma tabela
6. **Diferencie quem enviou de quem recebeu** — use `UserId` para quem convidou e `ConnectedUserId` para quem aceitou, porque preserva historico de quem iniciou a conexao

## How to write

### Junction table para conexao entre usuarios

```csharp
// Entidade base com campos padrao
public class UserConnection : BaseEntity
{
    // ID de quem ENVIOU o convite
    public Guid UserId { get; set; }
    
    // ID de quem RECEBEU/ACEITOU o convite
    public Guid ConnectedUserId { get; set; }
}
```

### Estrutura da tabela no banco

```sql
CREATE TABLE UserConnections (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Active BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL,
    UserId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id),    -- quem convidou
    ConnectedUserId UNIQUEIDENTIFIER NOT NULL REFERENCES Users(Id)  -- quem aceitou
);
```

## Example

**Antes (tentativa sem junction table — impossivel para N:N):**
```csharp
// ERRADO: tentar colocar lista de IDs na tabela User
public class User
{
    public List<Guid> ConnectionIds { get; set; } // nao funciona em relacional
}
```

**Depois (com junction table correta):**
```csharp
public class User : BaseEntity
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class UserConnection : BaseEntity
{
    public Guid UserId { get; set; }           // FK -> Users (quem convidou)
    public Guid ConnectedUserId { get; set; }  // FK -> Users (quem aceitou)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| A tem um B, B pertence a um A | Relacao 1:1 — FK no lado que "tem" |
| A tem muitos B, B pertence a um A | Relacao 1:N — FK na tabela B |
| A tem muitos B, B tem muitos A | Relacao N:N — crie junction table |
| Ambos os lados sao a mesma entidade | N:N com duas FKs para a mesma tabela |
| Precisa saber quem iniciou a conexao | Use campos semanticos (UserId vs ConnectedUserId) |
| Conexao e bidirecional | Uma linha na junction table representa a conexao nos dois sentidos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `List<Guid>` serializado na coluna | Junction table com FKs proprias |
| FK no lado "1" de uma relacao 1:N | FK no lado "N" da relacao |
| Duas linhas para uma conexao bidirecional | Uma linha com UserId e ConnectedUserId |
| Campos genericos `EntityAId`/`EntityBId` | Nomes semanticos que indicam papel (quem enviou/recebeu) |
| Conexao transitiva automatica (amigo do amigo) | Cada conexao e independente e explicita |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
