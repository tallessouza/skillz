# Deep Explanation: Migrations com Knex

## Por que migrations existem

O instrutor usa uma analogia direta: **migrations sao para o banco de dados o que o Git e para o codigo**. Quando duas pessoas trabalham no mesmo projeto — uma criando tabela de usuarios, outra criando tabela de produtos — sem migrations elas precisariam trocar SQLs manualmente entre si. Migrations resolvem isso criando um historico ordenado cronologicamente de todas as alteracoes no banco.

### Como o rastreamento funciona

O Knex cria automaticamente uma tabela chamada `migrations` no banco. Essa tabela registra quais migrations ja foram executadas. Quando alguem puxa codigo novo com migrations que o banco local ainda nao conhece, basta rodar `migrate:latest` para aplicar apenas as pendentes.

## O problema do TypeScript com Knex CLI

O Knex foi desenvolvido nativamente para JavaScript. Quando voce cria um `knexfile.ts`, o Knex tenta usar bibliotecas como `ts-node`, `typescript-register`, `babel-register` ou `sucrase-register` para interpretar TypeScript. Porem, se o projeto usa TSX (que o instrutor considera "fantastico"), o Knex nao suporta nativamente.

### A solucao com --loader

O Node.js tem uma opcao `--loader` que permite especificar uma biblioteca externa para carregar/interpretar arquivos. Ao usar `--loader tsx`, o Node passa a interpretar TypeScript via TSX antes de executar o binario do Knex. Isso permite manter TSX no projeto sem instalar ts-node.

## useNullAsDefault: true

O SQLite nao suporta a instrucao `INSERT DEFAULT VALUES`. O Knex, ao criar colunas, pode tentar usar default values que o SQLite nao entende. Configurar `useNullAsDefault: true` faz com que todos os campos tenham `null` como valor padrao, resolvendo o erro silenciosamente.

## Separacao config vs conexao

O instrutor enfatiza que o knexfile precisa apenas das **configuracoes** (client, connection, migrations), nao da **instancia conectada** do Knex. Se voce importar a instancia, o knexfile vai tentar criar uma conexao ao ser carregado pela CLI, o que pode causar efeitos colaterais. Por isso, exportar `config` separadamente e essencial.

## Tipagem com Knex.Config

O Knex exporta um tipo `Knex` (com K maiusculo) que e uma interface TypeScript. Usar `Knex.Config` como tipo da variavel `config` habilita autocomplete completo no editor — o instrutor demonstra que sem a tipagem, `migrations` nao aparece no autocomplete, mas com `Knex.Config` todas as opcoes ficam disponiveis.

## Convencao de nomes de migrations

O nome da migration deve simbolizar a alteracao no banco: `create-documents`, `add-session-id-to-transactions`. Sem espacos, sem acentos — o nome vira um arquivo fisico no sistema. O Knex prefixa automaticamente com timestamp para garantir ordenacao cronologica.