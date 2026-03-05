---
name: rs-csharp-fluent-migrator
description: "Applies FluentMigrator migration patterns when writing C# database migrations with .NET. Use when user asks to 'create a migration', 'add a table', 'create database schema', 'setup FluentMigrator', or 'write migration code'. Enforces ForwardOnly inheritance, version constants class, Migration attribute, and proper column definitions. Make sure to use this skill whenever generating FluentMigrator migration code. Not for Entity Framework migrations, raw SQL scripts, or general C# code."
---

# Migrations com FluentMigrator

> Toda migration herda de ForwardOnly, usa constantes de versao, e espelha exatamente as entidades do dominio.

## Rules

1. **Herde de `ForwardOnly` em vez de `Migration`** — porque `Down()` quase nunca e usado na pratica, e `ForwardOnly` exige apenas `Up()`, eliminando codigo morto
2. **Nunca use numeros magicos na versao** — crie uma classe `DatabaseVersions` com constantes `internal` do tipo `long`, porque numeros soltos perdem significado quando existem dezenas de migrations
3. **Sempre adicione o atributo `[Migration(version, description)]`** — sem ele a migration nao e detectada pelo runner e falha silenciosamente
4. **Classe da migration deve ser `public`** — o FluentMigrator precisa encontra-la via reflection; `internal` causa falha silenciosa
5. **Classe `DatabaseVersions` deve ser `internal sealed`** — encapsulamento: somente o projeto de infraestrutura usa, e ninguem deve herdar dela
6. **Espelhe exatamente as entidades do dominio** — cada coluna na migration deve corresponder a uma propriedade da entidade; verifique nomes antes de finalizar
7. **Senhas usam limite alto (2000 chars)** — porque hashes criptograficos sao muito maiores que a senha original; 255 causa estouro

## How to write

### Classe de versoes

```csharp
internal sealed class DatabaseVersions
{
    internal const long TABLE_REGISTER_USER = 1;
    internal const long TABLE_ADD_EXPENSE = 2;
}
```

### Migration completa

```csharp
[Migration(DatabaseVersions.TABLE_REGISTER_USER, "Create table to save the user's information")]
public class Version00001 : ForwardOnly
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("id").AsGuid().PrimaryKey().NotNullable()
            .WithColumn("name").AsString(255).NotNullable()
            .WithColumn("email").AsString(255).NotNullable()
            .WithColumn("password").AsString(2000).NotNullable()
            .WithColumn("active").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("created_on").AsDateTime().NotNullable();
    }
}
```

## Example

**Before (erros comuns):**
```csharp
// Heranca errada, numero magico, sem atributo
public class CreateUsers : Migration
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("password").AsString(255).NotNullable();
    }
    public override void Down()
    {
        Delete.Table("users");
    }
}
```

**After (com esta skill aplicada):**
```csharp
[Migration(DatabaseVersions.TABLE_REGISTER_USER, "Create table to save the user's information")]
public class Version00001 : ForwardOnly
{
    public override void Up()
    {
        Create.Table("users")
            .WithColumn("id").AsGuid().PrimaryKey().NotNullable()
            .WithColumn("password").AsString(2000).NotNullable()
            .WithColumn("active").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("created_on").AsDateTime().NotNullable();
    }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova tabela | Crie constante em `DatabaseVersions`, crie classe `VersionXXXXX : ForwardOnly` com `[Migration]` |
| Coluna de senha/hash | Use `.AsString(2000)` no minimo |
| Coluna booleana com default | Use `.WithDefaultValue(true/false)` |
| Coluna ID | `.AsGuid().PrimaryKey().NotNullable()` |
| Tabela tem entidade base | Inclua `id`, `active`, `created_on` obrigatoriamente |
| Nomes de tabela | Sempre no plural: `users`, `expenses`, `products` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `[Migration(1, ...)]` | `[Migration(DatabaseVersions.TABLE_REGISTER_USER, ...)]` |
| `: Migration` (com Down vazio) | `: ForwardOnly` |
| `.AsString(255)` para senha | `.AsString(2000)` para senha |
| `public class DatabaseVersions` | `internal sealed class DatabaseVersions` |
| Classe migration sem `[Migration]` | Sempre adicionar o atributo |
| `public const long` em DatabaseVersions | `internal const long` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
