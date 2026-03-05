# Deep Explanation: Auto-Criacao de Database MySQL em C#/.NET

## Por que remover o database da connection string?

O instrutor explica que quando voce passa uma connection string com `Database=planshare`, o provider tenta conectar diretamente naquele database. Se ele nao existe, voce recebe uma excecao. A solucao e remover o database name do builder (nao da string original), conectar ao servidor sem especificar database, criar o database, e depois nas proximas operacoes (migrations) usar a connection string completa.

Ponto importante: a remocao acontece apenas no builder, nao na connection string original recebida por parametro. A string original permanece intacta para uso posterior.

## Diferencas entre MySQL e SQL Server nesse contexto

### Connection String Builder
- **SQL Server:** `SqlConnectionStringBuilder` — propriedade `InitialCatalog`
- **MySQL:** `MySqlConnectionStringBuilder` — propriedade `Database`

### Remocao da propriedade
- **SQL Server:** `builder.Remove("Initial Catalog")`
- **MySQL:** `builder.Remove("Database")`

### Conexao
- **SQL Server:** `new SqlConnection(...)`
- **MySQL:** `new MySqlConnection(...)`

### Query de criacao
- **SQL Server:** Precisa primeiro fazer SELECT nas tabelas de sistema para verificar se o schema existe, e so depois executar CREATE DATABASE. Nao suporta IF NOT EXISTS.
- **MySQL:** Suporta `CREATE DATABASE IF NOT EXISTS` diretamente. Uma unica query resolve tudo. O MySQL trata internamente a verificacao.

## O padrao using e liberacao de recursos

O instrutor enfatiza o uso de `using` na conexao: "assim que terminar essa funcao, ele ja desconecta do banco de dados e ja faz a liberacao de memoria para voce de forma automatica." Isso e critical em codigo de inicializacao porque essas conexoes sao temporarias — existem apenas para garantir que o database foi criado.

## Contexto didatico

O instrutor deixa claro que o pattern de ter funcoes separadas por provider (EnsureDatabaseCreatedForSqlServer, EnsureDatabaseCreatedForMySql) e o if de controle e para fins didaticos do curso, para mostrar que funciona em ambos os bancos. Em producao, voce escolheria um provider e usaria abstractions adequadas.

## Fluxo completo de inicializacao da API

1. API inicia
2. Le connection string e database type do appsettings
3. Conecta ao servidor SEM especificar database
4. Executa CREATE DATABASE IF NOT EXISTS
5. Proxximo passo: executa migrations (aulas seguintes)
6. API comeca a ouvir requests

## Configuracao no appsettings

O `DatabaseType` e controlado por um valor numerico no `appsettings.Development.json`:
- `0` = MySQL
- `1` = SQL Server

Uma funcao de extensao `GetDatabaseType()` na classe `ConfigurationExtension` faz a leitura desse valor.