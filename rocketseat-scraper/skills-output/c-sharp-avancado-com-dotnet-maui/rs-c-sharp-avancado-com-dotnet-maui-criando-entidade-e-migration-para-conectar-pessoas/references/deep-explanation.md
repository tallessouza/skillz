# Deep Explanation: Entidades e Migrations para Conexao de Usuarios

## Por que renomear de PersonAssociation para UserConnection?

O instrutor explica que o template original veio com nomes genericos (`PersonAssociation`, `PersonId`, `AssociatedPersonId`). O problema nao e funcional — e de clareza. Quando voce tem duas propriedades do tipo `User` na mesma entidade, sem documentacao e com nomes vagos, fica impossivel entender rapidamente quem e quem na relacao.

A decisao de renomear para `UserConnection` com `UserId` e `ConnectedUserId` segue o principio: **o nome deve descrever o papel na relacao, nao apenas o tipo**.

## Convencao singular/plural

O instrutor enfatiza repetidamente:
- **Entidade = singular** (`UserConnection`) — representa uma instancia
- **Tabela = plural** (`UsersConnections`) — representa a colecao
- **DbSet = nome exato da tabela** — o EF usa o nome do DbSet como nome da tabela

Isso e critico porque se o nome do DbSet divergir do nome real da tabela, queries manuais e migrations podem quebrar silenciosamente.

## XML Documentation Comments (///)

O Visual Studio oferece autocompletar ao digitar `///` acima de uma propriedade. Isso gera o bloco `<summary>` automaticamente.

O beneficio pratico demonstrado: ao passar o mouse sobre `UserId` em qualquer parte do codigo, o IntelliSense mostra "The user who sent the invitation". Sem isso, voce ve apenas o tipo (`Guid`) — inutil para entender o dominio.

O instrutor tambem documenta a classe inteira: "If a record exists between two users, they are connected." Isso transforma a entidade em documentacao viva.

## Estrategia de criacao de Migrations

O "truque" do instrutor: nunca criar migration do zero. O processo e:

1. Encontrar migration existente com estrutura similar (ex: versao 2 que cria tabela)
2. Copiar o arquivo (Ctrl+C, Ctrl+V)
3. Renomear para nova versao (ex: `Version0004`)
4. Alterar nome da classe, constante de versao, e descricao
5. Ir linha a linha substituindo nomes de tabela e colunas

Isso reduz erros porque a estrutura base (CreateTable, AddColumn, AddForeignKey) ja esta validada.

## Foreign Key naming convention

O padrao usado: `FK_{TabelaReferenciada}_{nome_coluna_snake_case}`

Exemplos:
- `FK_Users_user_id` — para a coluna `UserId`
- `FK_Users_connected_user_id` — para a coluna `ConnectedUserId`

Ambas apontam para a coluna `Id` da tabela `Users`.

## Propriedades herdadas de EntityBase

A funcao `CreateTable` ja cria automaticamente tres propriedades:
- `Id` (primary key)
- `CreatedAt`
- `Ativo` (active flag)

Por isso a migration so precisa declarar as colunas especificas: `UserId` e `ConnectedUserId`.

## Teste da Migration

O fluxo de validacao:
1. Set a API como startup project (nao o app mobile)
2. F5 para executar
3. Se o Swagger aparecer, a migration rodou com sucesso
4. Verificar no MySQL Workbench (Refresh All) que a tabela foi criada
5. Confirmar colunas: `id`, `ativo`, `created_at`, `user_id`, `connected_user_id`

## Tratamento de erros durante o processo

O instrutor encontrou um erro de compilacao causado por um repositorio que referenciava o nome antigo. A solucao temporaria: comentar o codigo e retornar nulo, para nao bloquear o teste da migration. Isso sera corrigido depois — prioridade era validar a migration.