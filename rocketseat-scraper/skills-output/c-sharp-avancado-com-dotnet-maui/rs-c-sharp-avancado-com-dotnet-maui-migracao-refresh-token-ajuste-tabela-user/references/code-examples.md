# Code Examples: Migrations, Foreign Keys e Código Compartilhado

## Estrutura de pastas

```
Infrastructure/
└── Migrations/
    ├── DatabaseVersions.cs
    └── Versions/
        ├── Version0001.cs       # Cria tabela Users
        ├── Version0002.cs       # Cria tabela RefreshTokens
        ├── Version0003.cs       # Corrige CreatedOn → CreatedAt
        └── VersionBase.cs       # Classe abstrata compartilhada
```

## DatabaseVersions.cs

```csharp
public static class DatabaseVersions
{
    public const long UserTable = 1;
    public const long RefreshTokenTable = 2;
    public const long FixCreatedOnUserTable = 3;
}
```

## VersionBase.cs — Classe abstrata para colunas compartilhadas

```csharp
public abstract class VersionBase : ForwardOnlyMigration
{
    protected ICreateTableColumnAsTypeSyntax CreateTable(string tableName)
    {
        return Create.Table(tableName)
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Active").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("CreatedAt").AsDateTime().NotNullable()
                .WithDefaultValue(SystemMethods.CurrentDateTime);
    }
}
```

**Pontos importantes:**
- `abstract` evita que o Fluent Migrator tente executar essa classe como migration
- Retorna o builder para permitir chamadas encadeadas
- Recebe `tableName` como parametro (nao hardcoded)
- Usar apenas a partir da versao 2+ (nao retroativo)

## Version0001.cs — Tabela Users (com erro proposital)

```csharp
[Migration(DatabaseVersions.UserTable, "Criar tabela Users")]
public class Version0001 : ForwardOnlyMigration
{
    public override void Up()
    {
        Create.Table("Users")
            .WithColumn("Id").AsInt64().PrimaryKey().Identity()
            .WithColumn("Active").AsBoolean().NotNullable().WithDefaultValue(true)
            .WithColumn("CreatedOn").AsDateTime().NotNullable()  // ERRADO mas nao alterar
            .WithColumn("Name").AsString(255).NotNullable()
            .WithColumn("Email").AsString(255).NotNullable()
            .WithColumn("Password").AsString(2000).NotNullable();
    }
}
```

**Nao altere esta migration!** A versao 3 corrige o nome da coluna.

## Version0002.cs — Tabela RefreshTokens com FK

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

**Detalhes:**
- Herda de `VersionBase` (nao de `ForwardOnlyMigration`)
- `CreateTable("RefreshTokens")` ja cria Id, Active, CreatedAt
- Token com 1000 caracteres (255 e insuficiente para tokens)
- FK com 3 parametros: nome unico, tabela referenciada, coluna referenciada

## Version0003.cs — Correcao de coluna

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

**Esta migration:**
- Nao herda de VersionBase (nao esta criando tabela)
- Preserva todos os dados existentes
- Apenas renomeia a coluna

## Funcao MigrateDatabase (referencia)

```csharp
// Em Program.cs ou startup
MigrateDatabase(connectionString);

// A implementacao lista todas as migrations,
// compara com a tabela VersionInfo no banco,
// e executa apenas as pendentes automaticamente.
```

## Outras operacoes do Fluent Migrator

```csharp
// Deletar tabela
Delete.Table("NomeTabela");

// Deletar coluna
Delete.Column("NomeColuna").FromTable("NomeTabela");

// Alterar tipo de coluna
Alter.Column("NomeColuna").OnTable("NomeTabela").AsGuid();

// Renomear coluna
Rename.Column("NomeAntigo").OnTable("NomeTabela").To("NomeNovo");
```

## Entidade RefreshToken (referencia)

```csharp
public class RefreshToken : EntityBase
{
    public string Token { get; set; }
    public Guid AccessTokenId { get; set; }
    public Guid UserId { get; set; }
}

public class EntityBase
{
    public long Id { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }  // Lembre de atualizar de CreatedOn
}
```