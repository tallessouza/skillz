# Deep Explanation: Migrations, Foreign Keys e Código Compartilhado

## Por que nunca alterar migrations anteriores

O instrutor (Ellison) enfatiza um cenario real: imagine que a versao 1 criou `CreatedOn` (errado) e a versao 3 renomeia para `CreatedAt`. Se voce "conserta" a versao 1 para ja criar como `CreatedAt`, quando a versao 3 executar, ela vai tentar renomear uma coluna `CreatedOn` que nao existe mais — gerando excecao.

Isso e especialmente critico em producao: voce nao pode apagar o banco, ja tem clientes usando. A migration 3 existe justamente para corrigir sem perda de dados. `Rename.Column` preserva todos os dados existentes.

## O sistema de controle de versoes do Fluent Migrator

O Fluent Migrator usa uma tabela `VersionInfo` no banco de dados para rastrear quais migrations ja foram executadas. A funcao `MigrateDatabase` (implementada no projeto) lista todas as migrations no codigo, compara com o registro em `VersionInfo`, e executa apenas as pendentes.

Isso significa que uma vez que voce adiciona um novo arquivo de versao na pasta `Migrations/Versions/`, ao iniciar a API, ele sera automaticamente executado.

## Por que constantes `long` e nao enum

O atributo `[Migration]` do Fluent Migrator exige um parametro do tipo `long`. Enums poderiam ser usados com cast, mas para evitar a verbosidade, o instrutor prefere constantes `long` numa classe `DatabaseVersions`:

```csharp
public static class DatabaseVersions
{
    public const long UserTable = 1;
    public const long RefreshTokenTable = 2;
    public const long FixCreatedOnUserTable = 3;
}
```

## A analogia da VersionBase

O instrutor apresenta o conceito de "compartilhar codigo entre migrations" como forma de DRY. Toda tabela no sistema tem `Id`, `Active` e `CreatedAt`. Ao inves de repetir essas 3 colunas em cada migration, cria-se uma classe abstrata `VersionBase` que herda de `ForwardOnlyMigration` e expoe um metodo `CreateTable(tableName)` que ja cria essas colunas.

O truque e retornar o builder (`ICreateTableColumnAsTypeSyntax`) para permitir chamadas encadeadas — assim a migration que herda de `VersionBase` pode continuar adicionando colunas especificas.

## Foreign Key — camada extra de validacao

O instrutor explica que a FK nao e apenas para facilitar JOINs e queries. Ela cria uma **camada de validacao no banco**: ao inserir um `RefreshToken` com um `UserId`, o banco verifica se esse ID realmente existe na tabela `Users`. Se nao existir, a insercao e rejeitada. Isso impede dados orfaos.

## Convencao de nomeacao de FK

O padrao usado: `FK_{TabelaOrigem}_{Entidade}_{Coluna}`. Exemplo: `FK_RefreshTokens_User_Id`. Precisa ser unico no banco de dados inteiro.

## Truque pratico: duplicar arquivo de migration

O fluxo do instrutor para criar nova migration:
1. Seleciona a versao mais parecida
2. Ctrl+C, Ctrl+V (duplica o arquivo)
3. Renomeia o arquivo (remove "Copy", troca numero)
4. Renomeia a classe manualmente (o VS nao faz isso automaticamente)
5. Troca o atributo `[Migration]` para a nova constante
6. Adapta o conteudo do `Up()`

## Outras operacoes disponiveis no Fluent Migrator

- `Delete.Table("Nome")` — deletar tabela
- `Delete.Column("Nome").FromTable("Tabela")` — deletar coluna
- `Alter.Column("Nome").OnTable("Tabela").AsGuid()` — alterar tipo
- `Rename.Column("Antigo").OnTable("Tabela").To("Novo")` — renomear