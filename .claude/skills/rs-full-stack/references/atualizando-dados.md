---
name: rs-full-stack-atualizando-dados
description: "Enforces safe SQL UPDATE patterns when writing database queries. Use when user asks to 'update a record', 'change a value in the database', 'modify a row', 'write an UPDATE query', or any SQL data modification task. Applies rules: always use WHERE clause, use primary key ID for targeting, never update without specifying which record. Make sure to use this skill whenever generating UPDATE statements, even in migrations or seed scripts. Not for SELECT queries, INSERT operations, or DELETE statements."
---

# Atualizando Dados com UPDATE

> Sempre especifique QUAL registro atualizar com WHERE + chave primaria — UPDATE sem WHERE atualiza TODOS os registros.

## Rules

1. **Sempre use WHERE no UPDATE** — `UPDATE products SET price = 45.90 WHERE id = 1` nao `UPDATE products SET price = 45.90`, porque sem WHERE todos os registros sao atualizados e numa tabela com milhares de registros isso e catastrofico
2. **Use o ID (chave primaria) no WHERE** — `WHERE id = 1` nao `WHERE name = 'Mouse'`, porque a chave primaria garante identificador unico e elimina risco de afetar multiplos registros por coincidencia de valor
3. **Separe colunas por virgula no SET** — `SET price = 45.90, category = 'acessory'` quando atualizar multiplas colunas, sem virgula final pendente
4. **Verifique o resultado apos UPDATE** — execute um `SELECT * FROM tabela` depois para confirmar que apenas o registro desejado foi alterado
5. **Confira quantas linhas foram afetadas** — se o resultado mostra mais de 1 row affected quando voce queria atualizar apenas 1, algo deu errado

## How to write

### UPDATE basico com WHERE

```sql
-- Atualizar uma coluna de um registro especifico
UPDATE products
SET price = 45.90
WHERE id = 1;
```

### UPDATE multiplas colunas

```sql
-- Separar colunas por virgula
UPDATE products
SET price = 45.90, category = 'acessory'
WHERE id = 1;
```

### Verificacao pos-UPDATE

```sql
-- Sempre confirme o resultado
UPDATE products SET price = 550 WHERE id = 2;
SELECT * FROM products;
```

## Example

**Before (perigoso — sem WHERE):**
```sql
UPDATE products
SET price = 45.90, category = 'acessory';
-- RESULTADO: 2 rows affected — TODOS os produtos agora tem o mesmo preco e categoria!
```

**After (seguro — com WHERE + ID):**
```sql
UPDATE products
SET price = 45.90, category = 'acessory'
WHERE id = 1;
-- RESULTADO: 1 row affected — apenas o registro desejado foi alterado
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualizar 1 registro | `WHERE id = {valor}` obrigatorio |
| Atualizar multiplas colunas | Separe com virgula: `SET col1 = val1, col2 = val2` |
| Atualizar apenas 1 coluna | Sem virgula apos o valor: `SET price = 45.90` |
| Apos qualquer UPDATE | Execute `SELECT * FROM tabela` para verificar |
| Tabela com milhares de registros | Redobrar atencao com WHERE — erro afeta tudo |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `UPDATE products SET price = 10` | `UPDATE products SET price = 10 WHERE id = 1` |
| `UPDATE products SET price = 10 WHERE name = 'Mouse'` | `UPDATE products SET price = 10 WHERE id = 1` |
| `UPDATE ... SET col1 = val1, col2 = val2,` (virgula pendente) | `UPDATE ... SET col1 = val1, col2 = val2` |
| UPDATE sem verificar resultado depois | UPDATE seguido de SELECT para confirmar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-atualizando-dados/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-atualizando-dados/references/code-examples.md)
