# Code Examples: Introdução a Banco de Dados

## Exemplo 1: Dado vs Informacao (do instrutor)

### Dados isolados (sem significado)

```
2006    → O que e? Ano? Codigo? Numero?
"Joao"  → Quem? Nome? Cidade? Produto?
```

### Dados organizados (com significado)

```
| name  | birth_year |
|-------|------------|
| Joao  | 2006       |
```

**Informacao extraida:** Joao nasceu em 2006.
**Informacao processada:** Joao tem 18 anos (2024 - 2006).

## Exemplo 2: Definicao de tipos garante consistencia

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year INTEGER NOT NULL
);

-- Funciona: tipo correto
INSERT INTO users (name, birth_year) VALUES ('Joao', 2006);

-- FALHA: banco rejeita texto numa coluna INTEGER
INSERT INTO users (name, birth_year) VALUES ('Maria', 'dois mil');
-- ERROR: invalid input syntax for type integer
```

O banco de dados garante a regra sem a aplicacao precisar validar.

## Exemplo 3: De dados brutos a informacao na aplicacao

```typescript
// Dados brutos do banco
const user = await db.query('SELECT name, birth_year FROM users WHERE id = 1')
// { name: 'Joao', birth_year: 2006 }

// Processamento: extrair informacao
const currentYear = new Date().getFullYear()
const age = currentYear - user.birth_year

console.log(`${user.name} tem ${age} anos`)
// "Joao tem 18 anos"
```

## Exemplo 4: Sem banco vs com banco

### Sem banco (arquivo JSON solto)

```json
[
  {"a": "Joao", "b": 2006},
  {"a": "Maria", "b": "mil novecentos"},
  {"a": 123, "b": null}
]
```

Problemas: sem tipos, sem validacao, sem consistencia, sem mecanismo de busca otimizado.

### Com banco (estrutura definida)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year INTEGER NOT NULL CHECK (birth_year > 1900 AND birth_year <= EXTRACT(YEAR FROM NOW()))
);
```

Garantias: tipo enforced, NOT NULL previne vazios, CHECK previne valores absurdos, indice no id para busca rapida.

## Exemplo 5: Os 4 pilares na pratica

```sql
-- 1. ORGANIZACAO: estrutura clara
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price_in_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. EFICIENCIA: indice para busca rapida
CREATE INDEX idx_products_name ON products(name);

-- 3. ESCALABILIDADE: mesma estrutura funciona com 10 ou 10M registros
-- O query planner do banco otimiza automaticamente

-- 4. INTEGRIDADE: tipos + constraints
-- price_in_cents so aceita INTEGER, name so aceita TEXT
-- NOT NULL garante que nenhum campo fica vazio
```