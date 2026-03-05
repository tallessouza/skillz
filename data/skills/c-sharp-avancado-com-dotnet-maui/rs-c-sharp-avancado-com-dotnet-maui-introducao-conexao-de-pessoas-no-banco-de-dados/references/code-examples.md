# Code Examples: Conexao de Pessoas no Banco de Dados

## Estrutura da entidade base

Toda entidade no projeto herda de uma entidade base com campos padrao:

```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; }        // GUID unico
    public bool Active { get; set; }     // soft delete
    public DateTime CreatedAt { get; set; } // data de criacao
}
```

## Tabela Users (existente)

```
| Campo     | Tipo     |
|-----------|----------|
| Id        | GUID     |
| Active    | Boolean  |
| CreatedAt | DateTime |
| Name      | String   |
| Email     | String   |
| Password  | String   |
```

## Tabela UserConnections (nova — junction table)

```
| Campo            | Tipo | Observacao                    |
|------------------|------|-------------------------------|
| Id               | GUID | Entidade base                 |
| Active           | Bool | Entidade base                 |
| CreatedAt        | DateTime | Entidade base              |
| UserId           | GUID | FK -> Users (quem convidou)   |
| ConnectedUserId  | GUID | FK -> Users (quem aceitou)    |
```

## Exemplo de consulta: buscar conexoes de um usuario

```sql
-- Buscar todas as conexoes do usuario com ID @userId
-- Precisa buscar nos DOIS lados porque a conexao e bidirecional
SELECT u.*
FROM Users u
INNER JOIN UserConnections uc 
    ON (uc.UserId = @userId AND uc.ConnectedUserId = u.Id)
    OR (uc.ConnectedUserId = @userId AND uc.UserId = u.Id)
WHERE uc.Active = 1;
```

## Comparacao dos tres tipos de relacao

### 1:1 — Pessoa e CPF
```sql
-- FK na tabela Pessoa (quem "tem")
CREATE TABLE Persons (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(200),
    CpfId UNIQUEIDENTIFIER UNIQUE REFERENCES Cpfs(Id)  -- FK aqui
);

CREATE TABLE Cpfs (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Number VARCHAR(11),
    RegisteredAt DATETIME
    -- SEM FK para Person
);
```

### 1:N — Pessoa e Passaporte
```sql
-- FK na tabela Passaporte (lado N)
CREATE TABLE Persons (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(200)
    -- SEM FK para Passport
);

CREATE TABLE Passports (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Number VARCHAR(20),
    ExpiresAt DATETIME,
    Country VARCHAR(50),
    PersonId UNIQUEIDENTIFIER REFERENCES Persons(Id)  -- FK no lado N
);
```

### N:N — Pessoa e Curso (ou Pessoa e Pessoa)
```sql
-- Junction table obrigatoria
CREATE TABLE Persons (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(200)
);

CREATE TABLE Courses (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(200)
);

CREATE TABLE PersonCourses (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    PersonId UNIQUEIDENTIFIER REFERENCES Persons(Id),
    CourseId UNIQUEIDENTIFIER REFERENCES Courses(Id)
);
```

## Cenario real do projeto: atribuicao de tarefas

```csharp
// Ao criar tarefa, so pode atribuir a usuarios conectados
public async Task<bool> CanAssignTask(Guid taskOwnerId, Guid assigneeId)
{
    return await _dbContext.UserConnections
        .AnyAsync(uc => uc.Active &&
            ((uc.UserId == taskOwnerId && uc.ConnectedUserId == assigneeId) ||
             (uc.ConnectedUserId == taskOwnerId && uc.UserId == assigneeId)));
}
```