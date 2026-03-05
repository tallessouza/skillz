---
name: rs-csharp-dotnet-maui-entidade-migration
description: "Applies Entity Framework entity and migration patterns when writing C#/.NET code. Use when user asks to 'create entity', 'create migration', 'add table', 'rename entity', 'connect users', or 'create relationship' in EF Core/.NET projects. Enforces naming conventions (singular entity, plural table), foreign key naming (FK_Table_column), XML documentation comments, and manual migration structure. Make sure to use this skill whenever generating EF Core entities or migrations. Not for frontend code, API controllers, or business logic implementation."
---

# Entidades e Migrations no Entity Framework

> Ao criar entidades e migrations, siga convencoes de nomenclatura rigorosas e documente propriedades com XML comments.

## Rules

1. **Nome de entidade no singular, nome de tabela no plural** — `UserConnection` (classe) mapeia para `UsersConnections` (tabela), porque entidade representa uma instancia, tabela representa a colecao
2. **Propriedades de navegacao nomeiam a relacao** — `User` e `ConnectedUser`, nunca `Person` ou `AssociatedPerson`, porque o nome deve refletir o papel na relacao
3. **Documente com XML comments (///)** — toda propriedade publica recebe `<summary>` explicando seu significado no dominio, porque facilita IntelliSense e compreensao futura
4. **Foreign keys seguem padrao FK_Tabela_coluna** — `FK_Users_user_id`, `FK_Users_connected_user_id`, porque identifica origem e destino da relacao
5. **DbSet usa nome identico a tabela** — `DbSet<UserConnection> UsersConnections`, porque o nome do DbSet define o nome da tabela no banco
6. **Migrations copiam estrutura existente similar** — duplique uma migration parecida e altere linha a linha, porque reduz erros e mantem consistencia

## How to write

### Entidade com XML documentation

```csharp
/// <summary>
/// If a record exists between two users, they are connected.
/// </summary>
public class UserConnection : EntityBase
{
    /// <summary>The user who sent the invitation.</summary>
    public Guid UserId { get; set; }

    /// <summary>The user who received the invitation.</summary>
    public Guid ConnectedUserId { get; set; }

    /// <summary>The user who sent the invitation.</summary>
    public User User { get; set; }

    /// <summary>The user who received the invitation.</summary>
    public User ConnectedUser { get; set; }
}
```

### DbContext registration

```csharp
public DbSet<UserConnection> UsersConnections { get; set; }
```

### Migration com foreign keys

```csharp
public class VersionO004 : VersionBase
{
    public override void Up()
    {
        CreateTable("UsersConnections")
            .AddColumn("UserId", ColumnType.Guid, nullable: false)
            .AddForeignKey("FK_Users_user_id", "Users", "Id")
            .AddColumn("ConnectedUserId", ColumnType.Guid, nullable: false)
            .AddForeignKey("FK_Users_connected_user_id", "Users", "Id");
    }
}
```

## Example

**Before (nomes genericos):**
```csharp
public class PersonAssociation : EntityBase
{
    public Guid PersonId { get; set; }
    public Guid AssociatedPersonId { get; set; }
    public User Person { get; set; }
    public User AssociatedPerson { get; set; }
}
```

**After (nomes claros + documentacao):**
```csharp
/// <summary>
/// If a record exists between two users, they are connected.
/// </summary>
public class UserConnection : EntityBase
{
    /// <summary>The user who sent the invitation.</summary>
    public Guid UserId { get; set; }

    /// <summary>The user who received the invitation.</summary>
    public Guid ConnectedUserId { get; set; }

    /// <summary>The user who sent the invitation.</summary>
    public User User { get; set; }

    /// <summary>The user who received the invitation.</summary>
    public User ConnectedUser { get; set; }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Renomeando arquivo de entidade no Visual Studio | Aceite o rename automatico da classe e verifique todas as referencias |
| Criando nova migration | Copie migration existente similar, altere linha a linha |
| Propriedade ambigua (dois Users na mesma entidade) | Documente com XML comment explicando o papel de cada um |
| Nome do DbSet | Use exatamente o nome desejado da tabela no banco |
| Foreign key | Padrao FK_TabelaOrigem_nome_coluna |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `PersonAssociation` | `UserConnection` (nome reflete o dominio) |
| `AssociatedPerson` | `ConnectedUser` (papel claro na relacao) |
| `PersonId` generico | `UserId` / `ConnectedUserId` (especifico) |
| Propriedade sem XML comment em entidade relacional | `/// <summary>The user who sent the invitation.</summary>` |
| Migration criada do zero | Copia de migration similar, ajustada linha a linha |
| DbSet com nome diferente da tabela | `DbSet<UserConnection> UsersConnections` (identico) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
