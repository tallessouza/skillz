# Deep Explanation: Renomear Coluna com SQL

## Por que RENAME COLUMN existe

Renomear uma coluna e uma operacao de metadado — so muda o nome no catalogo do banco, nao toca nos dados armazenados. Por isso e instantanea mesmo em tabelas com milhoes de linhas.

## O comando completo

```sql
ALTER TABLE <tabela> RENAME COLUMN <nome_atual> TO <novo_nome>;
```

- `ALTER TABLE` — indica que vamos modificar a estrutura da tabela
- `RENAME COLUMN` — especifica que a operacao e renomear uma coluna
- `TO` — keyword obrigatoria que separa o nome antigo do novo

## Contexto da aula

O instrutor demonstrou o fluxo completo:
1. Renomeou `name` para `description` na tabela `product`
2. Verificou o resultado imediatamente (a coluna apareceu com o novo nome)
3. Reverteu invertendo os nomes: `description` de volta para `name`

A mensagem principal: **e uma operacao simples e reversivel**. Basta inverter os nomes para voltar ao estado anterior.

## Compatibilidade

- **PostgreSQL:** Suportado desde versao 7.4
- **MySQL:** Usa `ALTER TABLE t RENAME COLUMN old TO new` (8.0+) ou `CHANGE COLUMN old new TYPE` (versoes anteriores)
- **SQLite:** Suportado desde 3.25.0
- **SQL Server:** Usa `sp_rename 'table.old', 'new', 'COLUMN'` (sintaxe diferente)

## Edge cases

1. **Coluna referenciada por views** — a view pode quebrar apos renomear. Verifique dependencias antes.
2. **Coluna em indices** — o indice acompanha a renomeacao automaticamente na maioria dos bancos.
3. **Coluna em constraints** — constraints nomeadas explicitamente continuam funcionando.
4. **ORM/aplicacao** — o banco aceita a mudanca, mas o codigo da aplicacao precisa ser atualizado manualmente.

## Quando NAO usar RENAME COLUMN

- Se precisa mudar o tipo da coluna → use `ALTER COLUMN ... TYPE`
- Se precisa mudar o default → use `ALTER COLUMN ... SET DEFAULT`
- Se precisa remover a coluna → use `DROP COLUMN`