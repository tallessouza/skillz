---
name: rs-csharp-dotnet-maui-migration-refresh-token
description: "Enforces Fluent Migrator best practices for creating tables, foreign keys, renaming columns, and sharing migration code in C#/.NET projects. Use when user asks to 'create a migration', 'add a table', 'rename a column', 'add foreign key', 'fix migration', or 'share code between migrations'. Applies rules: never edit past migrations, use VersionBase for shared columns, plural table names, proper FK naming convention. Make sure to use this skill whenever generating Fluent Migrator code or planning database schema changes. Not for Entity Framework Core migrations, raw SQL scripts, or ORM query building."
---

# Fluent Migrator — Migrations, Foreign Keys e Código Compartilhado

> Migrations sao imutaveis apos execucao em producao; corrija erros criando novas versoes, nunca alterando as anteriores.

## Rules

1. **Nunca altere migrations ja executadas** — crie uma nova versao para corrigir, porque alterar uma migration anterior causa excecoes quando a versao corretiva tenta operar sobre algo que ja foi "consertado"
2. **Nomes de tabela sempre no plural** — `Users`, `RefreshTokens`, porque e convencao de banco de dados relacional
3. **Use `created_at` nao `created_on`** — preposicao `at` indica ponto no tempo (data+hora), `on` indica apenas dia
4. **Extraia colunas padrao para VersionBase** — `Id`, `Active`, `CreatedAt` se repetem em toda tabela; herde de uma classe base abstrata para evitar duplicacao
5. **Foreign keys seguem convencao FK_Tabela_Coluna** — `FK_RefreshTokens_User_Id`, porque o nome precisa ser unico no banco
6. **Versoes usam constantes `long`** — o atributo `[Migration]` exige `long`, nao enum; use uma classe `DatabaseVersions` com constantes

## How to write

### Classe VersionBase (codigo compartilhado)

```csharp
public abstract class VersionBase : ForwardOnlyMigration
{
    protected ICreateTableColumnAsTypeSyntax CreateTable(string tableName)
    {
        return Create.Table(tableName)
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Active").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("CreatedAt").AsDateTime().NotNullable().WithDefaultValue(SystemMethods.CurrentDateTime);
    }
}
```

### Migration com foreign key

```csharp
[Migration(DatabaseVersions.RefreshTokenTable, "Criar tabela RefreshTokens")]
public class Version0002 : VersionBase
{
    public override void Up()
    {
        CreateTable("RefreshTokens")
            .WithColumn("Token").AsString(1000).NotNullable()
            .WithColumn("AccessTokenId").AsGuid().NotNullable()
            .WithColumn("UserId").AsGuid().NotNullable()
                .ForeignKey("FK_RefreshTokens_User_Id", "Users", "Id");
    }
}
```

### Migration para renomear coluna (correcao)

```csharp
[Migration(DatabaseVersions.FixCreatedOnUserTable, "Corrigir nome da coluna CreatedOn para CreatedAt na tabela Users")]
public class Version0003 : ForwardOnlyMigration
{
    public override void Up()
    {
        Rename.Column("CreatedOn").OnTable("Users").To("CreatedAt");
    }
}
```

## Example

**Before (migration monolitica sem reuso):**
```csharp
public override void Up()
{
    Create.Table("RefreshTokens")
        .WithColumn("Id").AsInt64().PrimaryKey().Identity()
        .WithColumn("Active").AsBoolean().NotNullable()
        .WithColumn("CreatedOn").AsDateTime().NotNullable()  // nome errado
        .WithColumn("Token").AsString(255).NotNullable()     // tamanho insuficiente
        .WithColumn("UserId").AsGuid().NotNullable();        // sem FK
}
```

**After (com VersionBase, FK e nome correto):**
```csharp
public override void Up()
{
    CreateTable("RefreshTokens")
        .WithColumn("Token").AsString(1000).NotNullable()
        .WithColumn("AccessTokenId").AsGuid().NotNullable()
        .WithColumn("UserId").AsGuid().NotNullable()
            .ForeignKey("FK_RefreshTokens_User_Id", "Users", "Id");
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Coluna com nome errado em producao | Crie nova migration com `Rename.Column` |
| Toda tabela precisa de Id, Active, CreatedAt | Herde de `VersionBase` e use `CreateTable()` |
| Coluna referencia outra tabela | Adicione `.ForeignKey("FK_Tabela_Coluna", "TabelaRef", "ColunaRef")` |
| Token ou texto longo | Use `.AsString(1000)`, nao 255 |
| Precisa deletar coluna | `Delete.Column("Nome").FromTable("Tabela")` |
| Precisa alterar tipo de coluna | `Alter.Column("Nome").OnTable("Tabela").AsNewType()` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Editar migration anterior para corrigir nome | Criar nova migration com `Rename.Column` |
| `CreatedOn` para data+hora | `CreatedAt` (preposicao correta) |
| `.AsString(255)` para tokens | `.AsString(1000)` para garantir espaco |
| Coluna UserId sem foreign key | `.ForeignKey("FK_Tabela_User_Id", "Users", "Id")` |
| Repetir Id/Active/CreatedAt em cada migration | Herdar de `VersionBase` |
| Usar enum para numero de versao | Usar constantes `long` em `DatabaseVersions` |
| Corrigir VersionBase e aplicar retroativamente | Aplicar melhorias apenas em versoes futuras |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
