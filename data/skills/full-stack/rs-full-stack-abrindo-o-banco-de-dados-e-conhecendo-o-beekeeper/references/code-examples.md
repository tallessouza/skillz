# Code Examples: Conectando SQLite ao Beekeeper Studio

## Passo a passo visual da conexao

### 1. Tela inicial (sem conexoes)

```
+------------------------------------------+
| Beekeeper Studio                         |
+------------------------------------------+
| [+ New Connection]                       |
|                                          |
| Saved Connections: (none)                |
| Recent Connections: (none)               |
|                                          |
| Connection Type: [SQLite ▼]              |
| Database File:   [Choose File...]        |
|                                          |
| [Test]  [Connect]                        |
|                                          |
| Save Connection                          |
| Name: [________________________]         |
| Color: [● ● ● ● ● ●]                   |
| [Save]                                   |
+------------------------------------------+
```

### 2. Apos conectar

```
+------------------+---------------------------+
| PAINEL LATERAL   | EDITOR SQL                |
|                  |                           |
| 🔍 Search...     | SELECT * FROM products;   |
|                  |                           |
| Entities:        | [Run] [Save]              |
|  (nenhuma ainda) |                           |
|                  +---------------------------+
|                  | RESULTADOS                |
| db: database.db  |                           |
| type: SQLite     | (resultados aparecem aqui)|
+------------------+---------------------------+
```

### 3. Configuracao tipica para projetos Skillz

```
Connection Type: SQLite
Database File:   /caminho/do/projeto/database.db
Connection Name: "Nome do Projeto - Dev"
Color:           Cor padrao (ou azul para dev)
```

### 4. Exemplo de query no editor

Apos criar tabelas, voce pode verificar no editor SQL:

```sql
-- Listar todos os produtos cadastrados
SELECT * FROM products;

-- Verificar estrutura de uma tabela
PRAGMA table_info(products);
```

### 5. Fluxo de reconexao

```
1. File → Disconnect
2. Tela de conexoes aparece
3. Clicar na conexao salva "Aulas Banco de Dados"
4. Configuracoes carregam automaticamente
5. Clicar em "Connect"
6. Pronto — banco reconectado
```

### 6. Tipos de banco suportados pelo Beekeeper

```
SQLite     ← usado neste curso
MySQL
MariaDB
PostgreSQL
SQL Server
Amazon Redshift
CockroachDB
```

Para este curso, usar sempre **SQLite** como tipo de conexao.