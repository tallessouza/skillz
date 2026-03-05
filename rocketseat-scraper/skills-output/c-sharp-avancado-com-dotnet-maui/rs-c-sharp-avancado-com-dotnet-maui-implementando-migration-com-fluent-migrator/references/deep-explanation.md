# Deep Explanation: Migrations com FluentMigrator

## O que e uma migration

Uma migration e um script associado a uma versao. Cada script pode criar tabela, deletar tabela, alterar nome de coluna, alterar tipo, adicionar ou remover coluna. O sistema controla o que ja foi executado e o que precisa ser migrado no banco.

No C# com FluentMigrator, cada migration e simplesmente uma classe.

## Up vs Down — e porque Down e irrelevante

- **Up**: aumenta a versao do banco. Executa migrations em ordem (1, 2, 3, 4...) para atualizar o banco.
- **Down**: desfaz o que o Up fez. Se Up cria tabela, Down deleta.

Na pratica, o instrutor (Elison) nunca usou Down em sua carreira. Ele observa que a comunidade tambem raramente usa — alguns projetos deixam Down vazio, outros lancam `NotImplementedException`.

O time do FluentMigrator percebeu esse comportamento e criou `ForwardOnly` (ou `ForwardOnlyMigration`), que exige apenas `Up()`. Essa e a abordagem recomendada.

## Porque `internal sealed` em DatabaseVersions

O instrutor aplica encapsulamento (pilar de POO):

- **`internal`**: somente o projeto de infraestrutura acessa. Mesmo que outros projetos referenciem infraestrutura (como a API, por causa de injecao de dependencia), eles nao conseguem usar esta classe.
- **`sealed`**: ninguem pode herdar desta classe. Nao faz sentido estender uma classe de constantes de versao.

## Porque nao usar enum

O atributo `[Migration]` espera um `long`. Enums precisariam de cast e nao sao aceitos diretamente. Constantes `long` funcionam sem conversao.

## O atributo [Migration] e obrigatorio

Sem o atributo `[Migration(version, description)]`, o runner do FluentMigrator simplesmente ignora a classe. O instrutor destaca que esse e o erro mais comum reportado por alunos — "nao ta funcionando" porque esqueceram o atributo.

O runner lista as migrations (via reflection buscando o atributo), ordena por versao, e executa `Up()` para cada uma que ainda nao foi aplicada.

## Limite de caracteres para senha

Senhas sao armazenadas como hash criptografico, que e significativamente maior que a senha original. Usar 255 caracteres pode causar estouro silencioso ou excecao. O instrutor usa 2000 como margem segura.

## Nomes de tabela no plural

Convencao seguida: `users`, `expenses`, `products` — sempre plural.

## Entidade base e espelhamento

Toda entidade herda de uma `EntityBase` que contem:
- `Id` (Guid)
- `Active` (bool, default true)
- `CreatedOn` (DateTime)

A migration DEVE espelhar essas propriedades. O instrutor enfatiza: confira os nomes nos dois lugares (entidade e migration) para evitar erros.

## Dica de ingles do instrutor

"Information" nao tem plural em ingles. Nao escreva "informations" — e sempre "information" (singular).