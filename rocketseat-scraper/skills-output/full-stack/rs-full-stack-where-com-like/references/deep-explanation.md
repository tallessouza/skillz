# Deep Explanation: WHERE com LIKE

## Por que o operador = nao serve para buscas parciais

O operador `=` em SQL faz correspondencia exata. Se o registro tem o nome "Webcam" e voce busca por "cam", o `=` retorna vazio porque "cam" != "Webcam". Isso e um problema real em aplicacoes — quando o usuario digita no campo de busca, ele raramente sabe o nome completo do produto.

O instrutor demonstrou isso ao vivo: buscou "web" com `=` e nao encontrou nada, buscou "cam" com `=` e nao encontrou nada, mesmo tendo "Webcam" no banco.

## O operador LIKE e o caractere %

O `%` e um **wildcard** (coringa) que representa "qualquer sequencia de caracteres, incluindo vazio". Ele funciona em tres posicoes:

### 1. `%texto` — Termina com

```sql
WHERE name LIKE '%cam'
```

O `%` no inicio significa "qualquer coisa antes de cam". Entao:
- "Webcam" → match (termina com "cam")
- "Camera" → sem match (nao termina com "cam")

### 2. `texto%` — Comeca com

```sql
WHERE name LIKE 'Web%'
```

O `%` no final significa "qualquer coisa depois de Web". Entao:
- "Webcam" → match (comeca com "Web")
- "cam" → sem match (nao comeca com "Web")

O instrutor mostrou que `LIKE 'cam%'` nao encontra "Webcam" porque Webcam nao comeca com "cam".

### 3. `%texto%` — Contem em qualquer posicao

```sql
WHERE name LIKE '%eb%'
```

O `%` em ambos os lados significa "qualquer coisa antes E depois". Esta e a forma mais flexivel e mais usada em campos de busca de aplicacoes.

O instrutor demonstrou buscando por "eb" — encontrou Webcam porque "eb" esta no meio. Buscou por "a" — encontrou Teclado, Webcam e Headset (todos contem "a"). Buscou por "e" — encontrou todos os produtos. Buscou por "s" — encontrou Mouse e Headset.

## Analogia com aplicacoes reais

O instrutor fez uma analogia direta: quando voce busca algo no Facebook ou Instagram, conforme digita, aparecem sugestoes. Esse comportamento pode ser implementado com LIKE:

- Usuario digita "ma" → `LIKE 'ma%'` para autocomplete (comeca com)
- Usuario clica em "buscar" → `LIKE '%ma%'` para busca completa (contem)

## Case sensitivity

O instrutor mostrou que ao buscar "Web" com W maiusculo usando `LIKE 'Web%'`, o resultado ainda apareceu. Isso depende do banco de dados:

- **SQLite/MySQL**: LIKE e case-insensitive por padrao
- **PostgreSQL**: LIKE e case-sensitive. Use `ILIKE` para case-insensitive
- **SQL Server**: Depende do collation da coluna/banco

## Edge cases

1. **Busca vazia** (`LIKE '%%'`): Retorna todos os registros, porque qualquer texto contem "nada"
2. **Buscar pelo caractere % literal**: Use escape `LIKE '%\%%' ESCAPE '\'`
3. **Underscore `_`**: Tambem e wildcard no LIKE, representa exatamente 1 caractere. `LIKE '_am'` encontra "cam", "ram", mas nao "webcam"
4. **Performance**: `LIKE '%texto%'` nao usa indices B-tree tradicionais. Para tabelas grandes, considere:
   - Indices trigram (PostgreSQL: `pg_trgm`)
   - Full-text search (`tsvector`/`tsquery` no PostgreSQL)
   - Elasticsearch/Meilisearch para buscas complexas

## Quando NAO usar LIKE

- Buscas exatas por ID ou valores conhecidos → use `=`
- Buscas em campos numericos → use operadores numericos
- Buscas em texto muito longo (artigos, descricoes) → use full-text search
- Tabelas com milhoes de registros e busca por `%texto%` → considere solucoes de busca dedicadas