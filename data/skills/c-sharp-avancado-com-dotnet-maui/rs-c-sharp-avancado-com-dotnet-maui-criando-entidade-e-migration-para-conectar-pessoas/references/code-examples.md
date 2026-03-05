# Code Examples: Entidades e Migrations para Conexao de Usuarios

## 1. Entidade original (template — antes)

```csharp
public class PersonAssociation : EntityBase
{
    public Guid PersonId { get; set; }
    public Guid AssociatedPersonId { get; set; }
    public User Person { get; set; }
    public User AssociatedPerson { get; set; }
}
```

## 2. Entidade renomeada e documentada (depois)

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

## 3. DbContext — antes e depois

**Antes:**
```csharp
public DbSet<PersonAssociation> PersonAssociations { get; set; }
```

**Depois:**
```csharp
public DbSet<UserConnection> UsersConnections { get; set; }
```

## 4. Migration completa (Version0004)

```csharp
public class Version0004 : VersionBase
{
    private const string VERSION = "Version0004_UserConnectionTable";

    // Criar a tabela para conexao de pessoas

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

**Nota:** `CreateTable` ja cria automaticamente `Id` (PK), `CreatedAt` e `Ativo` via `EntityBase`.

## 5. Migration de referencia (Version0002 — usada como base)

```csharp
public class Version0002 : VersionBase
{
    public override void Up()
    {
        CreateTable("RefreshTokens")
            .AddColumn("Token", ColumnType.String, nullable: false)
            .AddColumn("AccessTokenId", ColumnType.Guid, nullable: false)
            .AddColumn("UserId", ColumnType.Guid, nullable: false)
            .AddForeignKey("FK_Users_user_id", "Users", "Id");
    }
}
```

## 6. Demonstracao de IntelliSense com XML comments

```csharp
// Sem documentacao — IntelliSense mostra apenas o tipo:
// associacao.ConnectedUserId → Guid ConnectedUserId { get; set; }

// Com documentacao — IntelliSense mostra significado:
// associacao.UserId → Guid UserId { get; set; }
//                     "The user who sent the invitation."
```

## 7. Processo de rename no Visual Studio

```
1. Solution Explorer → PlanShare.Domain → Entidades → PersonAssociation.cs
2. Botao direito → Renomear → "UserConnection"
3. Visual Studio pergunta: "Quer trocar o nome da classe tambem?" → Sim
4. Verificar todas as referencias atualizadas automaticamente
5. Corrigir manualmente o nome do DbSet (nao e atualizado automaticamente)
```

## 8. Workaround temporario para erro de compilacao

```csharp
// Repositorio referenciava nome antigo — solucao temporaria:
public UserConnection? GetConnection()
{
    // TODO: implementar apos ajuste do repositorio
    return null;
}
```

## 9. Resultado no banco de dados (MySQL)

```sql
-- Tabela criada pela migration:
-- UsersConnections
--   id              CHAR(36) PK
--   ativo           TINYINT(1)
--   created_at      DATETIME
--   user_id         CHAR(36) FK → Users.id
--   connected_user_id CHAR(36) FK → Users.id
```