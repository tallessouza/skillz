# Deep Explanation: Insert com Knex Raw

## Por que o metodo raw existe?

O Knex e um query builder — sua funcao principal e abstrair SQL em metodos JavaScript. Porem, existem cenarios onde o query builder nao consegue expressar o que voce precisa:

- SQL especifico de um banco (ex: `ON CONFLICT DO UPDATE` no PostgreSQL)
- Queries complexas com subqueries aninhadas
- Funcoes especificas do banco (ex: `NOW()`, `UUID_GENERATE_V4()`)
- Otimizacoes que o builder nao gera

O instrutor enfatiza: **"Alem de utilizar os metodos do query builder, a gente tambem consegue utilizar um metodo de RAW para escrever SQL mesmo utilizando o proprio query builder."** Isso mostra que raw nao e um escape hatch — e uma feature de primeira classe.

## A flexibilidade como valor

O ponto central da aula e: voce nao esta preso ao query builder. Se sabe SQL, pode usa-lo diretamente. O instrutor destaca: **"Essa flexibilidade e bem interessante."**

Isso e relevante porque:
1. Desenvolvedores que ja sabem SQL podem ser produtivos imediatamente
2. Nao ha perda de performance por traduzir mentalmente SQL → builder → SQL
3. Em emergencias (bugs em producao), voce pode escrever a query exata que precisa

## Placeholders `?` — O mecanismo de seguranca

Quando o instrutor mostra `VALUES(?)` com o array de valores separado, ele esta demonstrando **parameterized queries**. O Knex:

1. Recebe o SQL template com `?`
2. Recebe os valores no array separado
3. Faz o binding seguro (escaping de caracteres especiais)
4. Envia para o banco como prepared statement

Isso previne SQL injection porque os valores nunca sao interpolados diretamente no SQL — o banco de dados os trata como dados, nao como codigo.

## Quando usar raw vs query builder

O instrutor deixou o codigo raw comentado e manteve o query builder ativo. Isso indica a preferencia: **query builder como padrao, raw quando necessario.**

Razoes para preferir query builder:
- Portabilidade entre bancos (SQLite, PostgreSQL, MySQL)
- Autocompletion e type safety (com TypeScript)
- Menos propenso a erros de sintaxe SQL
- Mais facil de compor queries dinamicamente

Razoes para usar raw:
- SQL complexo que o builder nao suporta
- Performance critica onde voce precisa da query exata
- Features especificas do banco
- Migracao gradual de SQL puro para query builder

## Aplicabilidade para outros comandos

O instrutor menciona no final: **"E isso para os demais comandos tambem."** Ou seja, `knex.raw()` funciona para:
- `SELECT` — `knex.raw("SELECT * FROM users WHERE age > ?", [18])`
- `UPDATE` — `knex.raw("UPDATE users SET name = ? WHERE id = ?", ["João", 1])`
- `DELETE` — `knex.raw("DELETE FROM users WHERE id = ?", [1])`
- Qualquer SQL valido — DDL, transacoes, CTEs, etc.