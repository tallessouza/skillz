# Deep Explanation: Criando Database no SQL Server com Dapper

## Por que o Fluent Migrator nao cria databases?

O Fluent Migrator e um pacote focado em operacoes de schema dentro de um database existente: criar tabelas, deletar tabelas, adicionar colunas, renomear, deletar, e ate inserir dados pre-cadastrados. Ele opera no nivel de tabelas e colunas, nao no nivel de databases. O Entity Framework, por outro lado, cria o database automaticamente porque le a connection string (que inclui o nome do database) e garante que ele existe.

## O conceito de Database (Initial Catalog)

Toda tabela em um banco SQL Server esta associada a um database. O database e uma "caixinha" organizacional onde voce coloca tabelas que fazem sentido dentro daquele contexto. Voce pode usar o mesmo servidor SQL Server para varios projetos, cada um com seu database separado.

Na connection string do SQL Server, o database aparece como `Initial Catalog`:
```
Server=localhost;Database=PlanShare;...  (formato generico)
Server=localhost;Initial Catalog=PlanShare;...  (formato SQL Server)
```

## Por que remover o Initial Catalog?

Se voce tenta abrir uma conexao com uma connection string que aponta para um database que nao existe, a conexao falha imediatamente. Entao, para verificar se o database existe, voce precisa conectar ao servidor sem especificar um database. O `SqlConnectionStringBuilder` permite fazer isso de forma segura, extraindo o nome do database e removendo o `Initial Catalog` da string.

## Dapper vs Entity Framework — Quando usar cada um

O instrutor destaca que Dapper e um "micro ORM": voce precisa escrever a query SQL manualmente, enquanto o Entity Framework gera as queries automaticamente. A principal diferenca pratica e performance:

- **Banco bem modelado, poucas joins**: Entity Framework e Dapper tem performance equivalente
- **Banco mal modelado, muitas joins (inner join, left join, right join)**: Dapper executa consideravelmente mais rapido que o Entity Framework

Alguns projetos fazem um mix: Entity Framework para escrita/delecao (onde a conveniencia importa mais) e Dapper para leitura/consultas complexas (onde a performance importa mais).

No contexto desta aula, o Dapper e usado apenas para a verificacao e criacao do database — todo o restante do projeto usa Entity Framework.

## SQL Injection e DynamicParameters

O instrutor alerta sobre o risco de SQL Injection ao usar string interpolation em queries. Quando voce faz:
```csharp
$"SELECT * FROM sys.databases WHERE name = {databaseName}"
```
O Visual Studio gera um warning porque um atacante poderia manipular o valor para injetar SQL malicioso.

A solucao e usar `DynamicParameters` do Dapper, que trata os valores de forma segura. Porem, para o `CREATE DATABASE`, os parametros adicionam aspas simples ao redor do nome (ex: `CREATE DATABASE 'PlanShare'`), e o SQL Server nao aceita aspas simples no nome do database. Por isso, especificamente nesse caso, a string interpolation e necessaria.

## O padrao using na SqlConnection

Envolver a `SqlConnection` em um `using` garante que, assim que o bloco terminar, a conexao sera fechada e o espaco em memoria sera liberado. Isso e importante porque conexoes abertas consomem recursos do servidor de banco de dados.

## Diferenca entre SQL Server e MySQL

No SQL Server, nao existe `CREATE DATABASE IF NOT EXISTS`. Voce precisa consultar `sys.databases` para verificar manualmente. No MySQL, esse comando existe nativamente, tornando o processo mais simples.