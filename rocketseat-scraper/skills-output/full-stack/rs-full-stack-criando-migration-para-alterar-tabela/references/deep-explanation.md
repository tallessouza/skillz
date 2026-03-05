# Deep Explanation: Criando Migration para Alterar Tabela

## Por que migrations separadas para alteracao?

O instrutor demonstra um cenario real: ao criar a tabela `courses`, apenas `created_at` foi adicionado. O `updated_at` foi "esquecido" propositalmente. Isso ilustra um principio fundamental — **nunca volte e edite uma migration que ja foi executada**.

Migrations sao como um historico de versoes do banco de dados. Cada uma representa uma mudanca atomica. Se voce editar uma migration antiga que ja rodou em producao, o Knex nao vai re-executar ela (ja esta no registro de migrations executadas). A mudanca simplesmente nao acontece.

## O padrao `alterTable`

Enquanto `createTable` cria uma tabela do zero, `alterTable` modifica uma existente. A API interna e quase identica — voce recebe o mesmo objeto `table` com os mesmos metodos (`timestamp`, `string`, `integer`, etc.). A diferenca e que:

- `createTable` falha se a tabela ja existe
- `alterTable` falha se a tabela NAO existe

## Simetria up/down

O instrutor enfatiza: "no down a gente sempre desfaz o que a migration faz". Isso e critico para:

1. **Rollback em producao** — se um deploy da errado, `migrate:rollback` reverte
2. **Desenvolvimento local** — devs podem ir e voltar entre branches com schemas diferentes
3. **Testes** — setup e teardown limpos do banco

Se o `up` adiciona coluna → `down` remove com `dropColumn`
Se o `up` remove coluna → `down` re-cria com o tipo correto

## Posicionamento com `.after()`

O `.after('created_at')` e um detalhe que o instrutor destaca como "legal" — permite controlar a ordem fisica das colunas na tabela. Isso nao afeta funcionalidade, mas:

- Facilita leitura ao inspecionar a tabela no Beekeeper/pgAdmin
- Mantem convencao logica (timestamps agrupados)
- Alguns ORMs e ferramentas de visualizacao respeitam a ordem

**Nota:** `.after()` funciona no MySQL. No PostgreSQL, a ordem fisica nao e garantida da mesma forma — colunas sao sempre adicionadas ao final. O Knex aceita o metodo mas pode ser ignorado dependendo do driver.

## Fluxo CLI completo

1. `npm run knex -- migrate:make add-updated-at-courses` → cria arquivo de migration
2. Editar o arquivo com `up` e `down`
3. `npm run knex -- migrate:latest` → executa todas as migrations pendentes

O `--` apos `npm run knex` e necessario para passar parametros ao script, nao ao npm.

## Edge cases

### E se eu precisar alterar o tipo de uma coluna?
Use `table.specificType('column').alter()` ou `knex.raw('ALTER COLUMN...')`. O metodo `.alter()` no Knex modifica uma coluna existente.

### E se eu precisar renomear uma coluna?
Use `table.renameColumn('old_name', 'new_name')` no `up` e o inverso no `down`.

### E se a migration falhar no meio?
Knex executa cada migration em uma transacao (no PostgreSQL). Se falhar, a migration inteira e revertida. No MySQL, DDL nao e transacional — cuidado extra necessario.