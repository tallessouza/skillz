# Code Examples: Tipos de Dados no SQLite

## Exemplo 1: Tabela da aula (reconstruída)

O instrutor mostra uma tabela visual com 4 colunas, cada uma com um tipo diferente:

```sql
-- Tabela conceitual mostrada na aula
CREATE TABLE registros (
  id INTEGER,            -- Primeira coluna: números inteiros
  nome TEXT,             -- Segunda coluna: textos
  nota REAL,             -- Terceira coluna: decimais (ex: 9.8)
  created_at INTEGER     -- Quarta coluna: timestamp (número inteiro)
);
```

## Exemplo 2: Todos os tipos em uma tabela

```sql
CREATE TABLE example_all_types (
  -- INTEGER: números inteiros, IDs, timestamps
  id INTEGER PRIMARY KEY,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,

  -- REAL: números com casa decimal
  price REAL NOT NULL,
  rating REAL,

  -- TEXT: strings de qualquer tamanho
  name TEXT NOT NULL,
  description TEXT,
  email TEXT,

  -- BLOB: dados binários
  avatar BLOB,
  document BLOB
);

-- NULL não é declarado como tipo, mas como ausência de valor:
-- rating, description, email, avatar, document podem ser NULL
-- (colunas sem NOT NULL aceitam NULL por padrão)
```

## Exemplo 3: Tabela de usuários (caso real)

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  balance REAL DEFAULT 0.0,        -- valor monetário em reais
  avatar BLOB,                      -- foto do perfil (binário)
  is_active INTEGER DEFAULT 1,     -- booleano como integer (0/1)
  created_at INTEGER NOT NULL,     -- Unix timestamp
  updated_at INTEGER               -- pode ser NULL se nunca atualizado
);
```

## Exemplo 4: Tabela de produtos com preços

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_in_cents INTEGER NOT NULL,  -- alternativa: guardar centavos como inteiro
  weight_kg REAL,                    -- medição com decimal
  image BLOB,
  created_at INTEGER NOT NULL
);

-- Nota: para valores monetários, há duas abordagens válidas:
-- 1. REAL para guardar 19.90 diretamente
-- 2. INTEGER para guardar 1990 (centavos) e converter na aplicação
-- O instrutor menciona REAL, mas INTEGER em centavos evita problemas de ponto flutuante
```

## Exemplo 5: Timestamps no SQLite

```sql
-- Inserindo com timestamp Unix
INSERT INTO users (name, email, password_hash, created_at)
VALUES ('João', 'joao@email.com', 'hash123', strftime('%s', 'now'));

-- Consultando e convertendo timestamp para data legível
SELECT
  name,
  datetime(created_at, 'unixepoch') as created_date
FROM users;
```

## Exemplo 6: Trabalhando com NULL

```sql
-- Inserindo registro com campos NULL
INSERT INTO users (name, email, password_hash, created_at)
VALUES ('Maria', 'maria@email.com', 'hash456', strftime('%s', 'now'));
-- avatar e updated_at serão NULL automaticamente

-- Consultando campos NULL
SELECT name FROM users WHERE avatar IS NULL;     -- usuários sem foto
SELECT name FROM users WHERE avatar IS NOT NULL;  -- usuários com foto
```