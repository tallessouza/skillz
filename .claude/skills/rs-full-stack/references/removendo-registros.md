---
name: rs-full-stack-removendo-registros
description: "Enforces safe DELETE statement patterns when writing SQL queries. Use when user asks to 'delete a record', 'remove from database', 'write DELETE query', 'drop a row', or any SQL deletion task. Applies rules: always use WHERE clause, identify by unique ID, never run bare DELETE FROM. Make sure to use this skill whenever generating DELETE statements, even in migrations or seed scripts. Not for DROP TABLE, TRUNCATE, or application-level soft-delete logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql
  tags: [sql, delete, database, safety]
---

# DELETE Seguro em SQL

> Todo DELETE deve especificar exatamente quais registros deletar via WHERE com identificador unico.

## Rules

1. **Nunca execute DELETE sem WHERE** — `DELETE FROM products` deleta TODOS os registros da tabela, porque o banco executa exatamente o que voce pede, sem confirmacao
2. **Identifique pelo ID (chave primaria)** — `WHERE id = 3` e nao `WHERE name = 'Microfone'`, porque o ID e o identificador unico e imutavel de cada registro
3. **Ponto e virgula em multiplas instrucoes** — quando executar mais de um statement SQL, termine cada um com `;`, porque sem ele o parser nao sabe onde uma instrucao termina e outra comeca
4. **Auto-incremento nunca reutiliza IDs** — ao deletar o registro 3 e inserir novo, o novo recebe 6 (proximo disponivel), porque o contador so avanca, nunca volta

## How to write

### DELETE seguro por ID

```sql
DELETE FROM products WHERE id = 3;
```

### Multiplos INSERTs (ponto e virgula obrigatorio)

```sql
INSERT INTO products (name, price, category) VALUES ('Microfone', 550, 'Áudio');
INSERT INTO products (name, price, category) VALUES ('Webcam', 1200, 'Imagem');
INSERT INTO products (name, price, category) VALUES ('Headset', 800, 'Áudio');
```

## Example

**Before (perigoso):**
```sql
DELETE FROM products
```

**After (seguro):**
```sql
DELETE FROM products WHERE id = 3;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Deletar um registro especifico | `DELETE FROM tabela WHERE id = X;` |
| Deletar varios registros por criterio | `DELETE FROM tabela WHERE categoria = 'X';` — confirme o SELECT antes |
| Verificar antes de deletar | Execute `SELECT * FROM tabela WHERE id = X;` primeiro |
| Multiplos statements no mesmo script | Termine cada um com `;` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `DELETE FROM products` | `DELETE FROM products WHERE id = 3;` |
| `DELETE FROM products WHERE name = 'Mouse'` | `DELETE FROM products WHERE id = 1;` |
| Dois INSERTs sem `;` entre eles | Cada INSERT terminado com `;` |
| Assumir que ID deletado sera reutilizado | Aceitar que auto-incremento so avanca |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre seguranca do DELETE e comportamento do auto-incremento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-removendo-registros/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-removendo-registros/references/code-examples.md)

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Todos os registros sumiram da tabela | DELETE executado sem WHERE | Restaure backup; sempre use `WHERE id = X` |
| ID deletado aparece novamente apos INSERT | Esperava reutilizacao de ID | Auto-incremento so avanca; aceite o proximo ID disponivel |
| Erro de sintaxe ao executar multiplos statements | Falta ponto e virgula entre instrucoes | Termine cada statement SQL com `;` |
| DELETE nao remove nenhum registro | WHERE aponta para ID inexistente | Verifique com `SELECT * FROM tabela WHERE id = X` antes |
