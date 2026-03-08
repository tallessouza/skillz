---
name: rs-full-stack-visualizando-dados
description: "Applies SQL SELECT best practices when writing queries to retrieve data. Use when user asks to 'query a table', 'select data', 'fetch records', 'write a SELECT', or 'view database rows'. Enforces explicit column selection over asterisk, correct column ordering, and proper SQL commenting. Make sure to use this skill whenever generating SELECT statements or database queries. Not for INSERT, UPDATE, DELETE, or schema migration tasks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-database
  tags: [sql, select, query, columns, database]
---

# Visualizando Dados com SELECT

> Sempre selecione colunas explicitamente em queries de producao — o asterisco e apenas para exploracao rapida.

## Rules

1. **Use `SELECT *` apenas para exploracao** — em producao, liste colunas explicitamente, porque `*` quebra quando colunas sao adicionadas/removidas e impede otimizacao de indice
2. **Separe colunas por virgula** — `SELECT name, price FROM products`, porque e a sintaxe padrao SQL
3. **A ordem das colunas no SELECT define a exibicao** — `SELECT price, name` exibe preco primeiro, porque o SELECT controla visualizacao, nao armazenamento
4. **Comente com `--`** — comentarios de linha unica em SQL usam dois tracos, porque e o padrao ANSI SQL
5. **Nomeie colunas na ordem de importancia** — coloque identificadores e campos principais primeiro, porque facilita leitura do resultado

## How to write

### Selecao de todas as colunas (exploracao)

```sql
-- Seleciona todas as colunas (apenas para debug/exploracao)
SELECT * FROM products;
```

### Selecao de colunas especificas (producao)

```sql
-- Seleciona colunas especificas
SELECT name, price FROM products;
```

### Definindo ordem de exibicao

```sql
-- Inverte a ordem de exibicao (preco primeiro)
SELECT price, name FROM products;
```

## Example

**Before (query preguicosa):**
```sql
SELECT * FROM products;
```

**After (query explicita):**
```sql
SELECT name, price, category FROM products;
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Explorando tabela desconhecida | `SELECT * FROM table LIMIT 10` para descobrir colunas |
| Query em codigo de aplicacao | Sempre listar colunas explicitamente |
| Precisa de poucas colunas | Selecione apenas as necessarias |
| Ordem de exibicao importa | Defina a ordem das colunas no SELECT |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `SELECT * FROM users` (em producao) | `SELECT id, name, email FROM users` |
| `SELECT *` sem LIMIT em tabela grande | `SELECT * FROM products LIMIT 10` |
| Comentario com `//` ou `#` em SQL | Comentario com `--` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `no such column: nome` | Nome da coluna errado ou inexistente | Execute `PRAGMA table_info(tabela)` ou `\d tabela` para ver colunas reais |
| SELECT retorna zero linhas | Tabela vazia ou filtro WHERE muito restritivo | Execute `SELECT COUNT(*) FROM tabela` para verificar se ha dados |
| Resultado demora muito | `SELECT *` em tabela grande sem LIMIT | Adicione `LIMIT 10` para paginacao ou selecione colunas especificas |
| Colunas aparecem em ordem errada | Ordem no SELECT define exibicao | Reordene as colunas no SELECT conforme desejado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre SELECT e visualizacao de dados
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-visualizando-dados/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-visualizando-dados/references/code-examples.md)
