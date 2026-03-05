---
name: rs-full-stack-tipos-de-dados-2
description: "Enforces correct SQLite data type selection when designing database schemas or writing CREATE TABLE statements. Use when user asks to 'create a table', 'define a schema', 'choose column types', or 'design a database' with SQLite. Applies rules: INTEGER for whole numbers and timestamps, REAL for decimals and money, TEXT for strings, BLOB for binary files, NULL for absent values. Make sure to use this skill whenever generating SQLite DDL or reviewing schema designs. Not for PostgreSQL, MySQL, or other database-specific type systems."
---

# Tipos de Dados no SQLite

> Escolha o tipo de dado correto para cada coluna baseado no conteudo que ela armazena, nunca no nome da coluna.

## Tipos disponíveis

| Tipo | Armazena | Quando usar |
|------|----------|-------------|
| **NULL** | Valor nulo/inexistente | Campo sem dado informado |
| **INTEGER** | Número inteiro (positivo ou negativo) | IDs, contadores, timestamps, quantidades |
| **REAL** | Número com ponto flutuante | Medições, cálculos financeiros, valores monetários, notas |
| **TEXT** | Sequência de caracteres | Nomes, descrições, emails, qualquer texto |
| **BLOB** | Dados binários brutos | Arquivos, imagens, dados não convertíveis automaticamente |

## Rules

1. **Cada coluna tem exatamente um tipo** — defina o tipo pelo conteudo que a coluna armazena, porque isso garante integridade e queries eficientes
2. **Use INTEGER para timestamps** — armazene datas como Unix timestamp (numero inteiro representando data/hora), porque SQLite nao tem tipo DATE nativo
3. **Use REAL para valores monetarios** — `preco REAL`, porque valores em reais/dolares exigem casas decimais
4. **Use TEXT para qualquer string** — nomes, descricoes, emails, porque SQLite nao diferencia VARCHAR/CHAR/TEXT
5. **Use BLOB apenas para binarios reais** — imagens, arquivos, porque dados textuais devem ser TEXT mesmo que pareçam "grandes"
6. **NULL nao e um tipo de coluna** — NULL e um valor possivel, nao um tipo para declarar na criacao da tabela

## How to write

### Tabela com tipos variados

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  quantity INTEGER DEFAULT 0,
  image BLOB,
  created_at INTEGER NOT NULL  -- Unix timestamp
);
```

## Example

**Before (tipos incorretos):**
```sql
CREATE TABLE students (
  id TEXT,              -- ID como texto sem necessidade
  name TEXT,
  grade TEXT,           -- nota numericacomo texto
  enrolled_at TEXT      -- data como string
);
```

**After (com esta skill aplicada):**
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  grade REAL,              -- nota com decimal (ex: 9.8)
  enrolled_at INTEGER      -- Unix timestamp
);
```

## Heuristics

| Situação | Tipo correto |
|----------|-------------|
| ID ou chave primaria | INTEGER PRIMARY KEY |
| Nome, email, descricao | TEXT |
| Preco, nota, medicao | REAL |
| Data/hora | INTEGER (timestamp) |
| Contagem, quantidade | INTEGER |
| Arquivo, imagem | BLOB |
| Campo opcional sem valor | Permite NULL (nao e tipo, e constraint) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `price TEXT` para valores monetarios | `price REAL` |
| `id TEXT` para chave primaria numerica | `id INTEGER PRIMARY KEY` |
| `created_at TEXT` para datas | `created_at INTEGER` (timestamp) |
| `grade INTEGER` para notas com decimal | `grade REAL` |
| `description BLOB` para textos longos | `description TEXT` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada tipo e quando usar
- [code-examples.md](references/code-examples.md) — Exemplos de CREATE TABLE com todos os tipos

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tipos-de-dados-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tipos-de-dados-2/references/code-examples.md)
