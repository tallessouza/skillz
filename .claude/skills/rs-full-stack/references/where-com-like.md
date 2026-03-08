---
name: rs-full-stack-where-com-like
description: "Applies SQL LIKE operator patterns when writing database queries with text search. Use when user asks to 'search by name', 'filter by text', 'find records containing', 'implement search functionality', or 'query with partial match'. Enforces correct % wildcard placement for starts-with, ends-with, and contains patterns. Make sure to use this skill whenever generating SQL queries that involve text matching or building search features. Not for exact equality filters, numeric comparisons, or full-text search engines like Elasticsearch."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-database
  tags: [sql, like, wildcard, text-search, partial-match, filtering]
---

# WHERE com LIKE

> Use o operador LIKE com % para buscas por partes de texto em SQL, nunca o operador = para correspondencias parciais.

## Rules

1. **Use LIKE para buscas parciais, = para buscas exatas** — `WHERE name LIKE '%web%'` nao `WHERE name = 'web'`, porque = so encontra correspondencias exatas
2. **Posicione o % conforme a intencao da busca** — `%texto` busca terminando com, `texto%` busca comecando com, `%texto%` busca contendo em qualquer posicao, porque a posicao do % define o tipo de correspondencia
3. **Prefira `%texto%` para buscas de usuario** — campos de busca em aplicacoes devem usar % em ambos os lados, porque usuarios raramente sabem a posicao exata do texto no registro
4. **LIKE e case-insensitive em muitos bancos** — no SQLite e MySQL o LIKE ignora case por padrao, mas no PostgreSQL use `ILIKE` para buscas case-insensitive

## How to write

### Busca por texto que COMECA com

```sql
-- Encontra produtos cujo nome comeca com "Web"
SELECT * FROM products WHERE name LIKE 'Web%';
-- Resultado: Webcam, WebService, etc.
```

### Busca por texto que TERMINA com

```sql
-- Encontra produtos cujo nome termina com "cam"
SELECT * FROM products WHERE name LIKE '%cam';
-- Resultado: Webcam, etc.
```

### Busca por texto que CONTEM (mais comum em apps)

```sql
-- Encontra produtos que contenham "eb" em qualquer parte do nome
SELECT * FROM products WHERE name LIKE '%eb%';
-- Resultado: Webcam (contém "eb" no meio)
```

## Example

**Before (busca com =, nao encontra resultado):**
```sql
-- Usuario digitou "cam" no campo de busca
SELECT * FROM products WHERE name = 'cam';
-- Resultado: vazio (nenhum produto se chama exatamente "cam")
```

**After (busca com LIKE, encontra registros relevantes):**
```sql
-- Usuario digitou "cam" no campo de busca
SELECT * FROM products WHERE name LIKE '%cam%';
-- Resultado: Webcam (contem "cam" no nome)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo de busca em aplicacao (search bar) | `LIKE '%termo%'` — busca em qualquer posicao |
| Autocomplete conforme usuario digita | `LIKE 'termo%'` — busca por inicio (mais performatico) |
| Filtro por extensao ou sufixo | `LIKE '%sufixo'` — busca por final |
| Busca exata por valor conhecido | Use `=` em vez de LIKE |
| PostgreSQL com case-insensitive | Use `ILIKE` em vez de `LIKE` |
| Tabela com milhoes de registros | Considere indices ou full-text search em vez de `LIKE '%termo%'` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `WHERE name = userInput` (para busca parcial) | `WHERE name LIKE '%' \|\| userInput \|\| '%'` |
| `LIKE 'texto'` (sem %) | `= 'texto'` (se quer exato) ou `LIKE '%texto%'` (se quer parcial) |
| `LIKE '%a%'` em tabelas enormes sem indice | Full-text search ou indice trigram para performance |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| LIKE nao encontra resultado esperado | Case sensitivity no PostgreSQL | Use `ILIKE` em vez de `LIKE` no PostgreSQL |
| `LIKE 'texto'` se comporta como `=` | Faltou `%` no padrao | Adicione `%` conforme a intencao: `'%texto%'`, `'texto%'` ou `'%texto'` |
| Query com LIKE muito lenta | `%texto%` nao usa indices B-tree | Considere indice trigram (`pg_trgm`) ou full-text search |
| SQL injection via input do usuario | Concatenacao direta de input no LIKE | Use prepared statements com parametros: `WHERE name LIKE ?` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-where-com-like/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-where-com-like/references/code-examples.md)
