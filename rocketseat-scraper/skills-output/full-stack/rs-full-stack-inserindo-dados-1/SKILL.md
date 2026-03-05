---
name: rs-full-stack-inserindo-dados-1
description: "Applies SQL INSERT INTO patterns when writing database insertion queries. Use when user asks to 'insert data', 'add records', 'create SQL insert', 'populate table', or 'write INSERT query'. Enforces correct column-value mapping, DEFAULT handling, auto-increment omission, and proper quoting. Make sure to use this skill whenever generating SQL INSERT statements or teaching SQL basics. Not for SELECT queries, table creation, migrations, or ORM-based inserts."
---

# Inserindo Dados com SQL

> Ao escrever INSERT INTO, especifique explicitamente as colunas e mapeie valores na mesma ordem, omitindo colunas auto-incremento e colunas com DEFAULT quando o padrão é desejado.

## Rules

1. **Omita colunas AUTO_INCREMENT** — nunca liste o ID no INSERT quando ele é autoincremento, porque o banco gera automaticamente
2. **Liste colunas explicitamente** — sempre use `INSERT INTO table (col1, col2)` em vez de `INSERT INTO table VALUES (...)`, porque evita bugs silenciosos quando a tabela muda
3. **Valores na mesma ordem das colunas** — a ordem em `VALUES (...)` deve corresponder exatamente à ordem das colunas listadas, porque mismatch causa erro ou dados trocados
4. **Strings entre aspas, números sem** — `'mouse'` com aspas, `50` sem aspas, porque o SQL diferencia tipos literais
5. **Omita colunas com DEFAULT quando quiser o padrão** — se uma coluna tem `DEFAULT 'General'` e você quer esse valor, simplesmente não liste a coluna no INSERT
6. **Passe o valor explicitamente para sobrescrever DEFAULT** — quando quiser um valor diferente do padrão, adicione a coluna E o valor correspondente

## How to write

### INSERT básico (omitindo auto-increment e DEFAULT)

```sql
INSERT INTO products (name, price)
VALUES ('Mouse', 50);
```

### INSERT com valor explícito para coluna DEFAULT

```sql
INSERT INTO products (name, price, category)
VALUES ('Teclado', 550, 'Acessório');
```

### Verificar dados inseridos

```sql
SELECT * FROM products;
```

### Comentários SQL

```sql
-- Comentário de uma linha

/* Comentário
   de múltiplas linhas */
```

## Example

**Before (erro comum — contagem de colunas errada):**

```sql
-- Esqueceu de listar 'category' mas passou 3 valores
INSERT INTO products (name, price)
VALUES ('Teclado', 550, 'Acessório');
-- ERRO: 3 valores para 2 colunas
```

**After (colunas e valores alinhados):**

```sql
INSERT INTO products (name, price, category)
VALUES ('Teclado', 550, 'Acessório');
-- Sucesso: 3 valores para 3 colunas
```

## Heuristics

| Situação | Faça |
|----------|------|
| Coluna é AUTO_INCREMENT / SERIAL | Omita do INSERT |
| Coluna tem DEFAULT e você quer o padrão | Omita do INSERT |
| Coluna tem DEFAULT mas você quer outro valor | Liste a coluna e passe o valor |
| Valor é texto | Envolva com aspas simples `'texto'` |
| Valor é número | Sem aspas: `50` |
| Quer executar apenas parte do SQL | Selecione a linha específica antes de executar |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `INSERT INTO products VALUES (1, 'Mouse', 50, 'General')` | `INSERT INTO products (name, price) VALUES ('Mouse', 50)` |
| Passar ID manualmente quando é auto-increment | Omitir a coluna ID |
| 3 valores para 2 colunas | Alinhar quantidade de colunas e valores |
| `INSERT INTO products VALUES ('Mouse', 50)` (sem listar colunas) | `INSERT INTO products (name, price) VALUES ('Mouse', 50)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre auto-increment, DEFAULT values, e erros de mismatch
- [code-examples.md](references/code-examples.md) — Todos os exemplos SQL da aula expandidos com variações