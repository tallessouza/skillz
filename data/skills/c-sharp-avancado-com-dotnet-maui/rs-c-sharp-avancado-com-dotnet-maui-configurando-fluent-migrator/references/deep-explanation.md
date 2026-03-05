# Deep Explanation: Configurando FluentMigrator

## Por que isolar em funcao separada?

O instrutor enfatiza organizacao: a funcao `AddFluentMigrator` fica separada das outras configuracoes de DI (repositorios, DbContext, etc.). Isso segue o mesmo padrao usado no resto do `DependencyInjectionExtension` — cada responsabilidade tem sua propria funcao privada.

## O padrao Action/Lambda no ConfigureRunner

O `ConfigureRunner` recebe uma `Action<IMigrationRunnerBuilder>`. O instrutor explica isso detalhadamente:

> "Esse action aqui é como se fosse uma funcao. Como se ela recebesse uma funcao que internamente ela vai chamar."

Ele compara com criar um metodo privado:
```csharp
// Equivalente conceitual:
private void Teste(IMigrationRunnerBuilder config)
{
    config.AddMySql5();
}

// Mas fazemos inline com lambda:
.ConfigureRunner(config => { config.AddMySql5(); })
```

A lambda é uma funcao anonima — sem nome, sem corpo separado. O parametro `config` é do tipo `IMigrationRunnerBuilder`.

## If ternario para selecao de banco

O instrutor usa if ternario em vez de if/else completo porque o codigo fica menor e ambos os caminhos retornam o mesmo tipo (`IMigrationRunnerBuilder`):

```csharp
var migrationRunnerBuilder = databaseType == DatabaseType.MySQL
    ? config.AddMySql5()
    : config.AddSqlServer();
```

Ele ressalta: "Se o codigo for grande, ai para evitar confusoes a gente faz um if normal." O ternario so funciona bem aqui porque a expressao e simples.

## Assembly.Load e ScanIn

O `ScanIn` precisa saber ONDE estao as classes de migration. O FluentMigrator nao procura por nome de classe — ele procura pelo atributo `[Migration(numero)]`.

O truque do instrutor para pegar o nome exato do projeto:
1. Botao direito no projeto → Rename (ou F2)
2. Ctrl+C para copiar o nome
3. Esc para cancelar o rename
4. Ctrl+V onde precisar

Isso evita erros de digitacao no nome do assembly.

## Tabela VersionInfo

O FluentMigrator cria automaticamente uma tabela `VersionInfo` que registra:
- Numero da versao (o valor da constante `[Migration(1)]`)
- Data de aplicacao
- Descricao (a string passada no atributo)

Isso permite que o runner saiba quais migrations ja foram aplicadas e quais precisam rodar.

## Teste em ambos os bancos

O instrutor demonstra o fluxo completo:

1. **MySQL (Workbench):** Antes do teste, database `planshare` existe mas sem tabelas. Apos `MigrateUp()`, aparecem `user` e `version_info`.

2. **SQL Server (SSMS):** Mesmo processo. O database ja existia (criado anteriormente), entao o `CREATE DATABASE IF NOT EXISTS` nao executa. As tabelas `dbo.Users` e `dbo.VersionInfo` sao criadas.

## Estrategia incremental de migrations

O instrutor fecha a aula explicando a abordagem incremental:
- Por enquanto, so a tabela `user` existe (versao 1)
- Conforme o aplicativo MAUI evolui, novas migrations serao adicionadas (versao 2, 3, 4...)
- Cada migration adiciona apenas o que e necessario naquele momento