# Code Examples: Adicionando e Removendo Colunas

## Exemplo 1: Adicionar coluna (da aula)

```sql
-- Adiciona coluna quantity do tipo INTEGER, obrigatoria
ALTER TABLE products
ADD quantity INTEGER NOT NULL;
```

**Resultado:** A tabela `products` agora tem uma coluna `quantity` que aceita apenas numeros inteiros e nao permite valores nulos.

## Exemplo 2: Remover coluna (da aula)

```sql
-- Remove a coluna quantity da tabela products
ALTER TABLE products
DROP COLUMN quantity;
```

**Resultado:** A coluna `quantity` e permanentemente removida, incluindo todos os dados que estavam nela.

## Variacoes

### Adicionar coluna opcional (permite NULL)

```sql
ALTER TABLE products
ADD description TEXT;
```

### Adicionar coluna com valor padrao

```sql
ALTER TABLE products
ADD quantity INTEGER NOT NULL DEFAULT 0;
```

Util quando a tabela ja tem registros — o valor `0` sera atribuido a todas as linhas existentes.

### Adicionar coluna com restricao UNIQUE

```sql
ALTER TABLE products
ADD sku VARCHAR(50) UNIQUE;
```

### Adicionar multiplas colunas (uma por vez, executando separadamente)

```sql
-- Selecione e execute esta primeiro:
ALTER TABLE products
ADD quantity INTEGER NOT NULL DEFAULT 0;

-- Depois selecione e execute esta:
ALTER TABLE products
ADD weight DECIMAL(10, 2);
```

### Remover coluna com dependencias (verificar antes)

```sql
-- 1. Verifique dependencias primeiro:
-- (consulte views, functions, indexes que usam a coluna)

-- 2. Remova indexes se existirem:
-- DROP INDEX IF EXISTS idx_products_quantity;

-- 3. Entao remova a coluna:
ALTER TABLE products
DROP COLUMN quantity;
```

## Pratica segura de execucao

```sql
-- ARQUIVO: alteracoes-sprint-42.sql
-- ==========================================
-- Executar CADA BLOCO SEPARADAMENTE (selecionar antes de rodar)
-- ==========================================

-- Bloco 1: Adicionar coluna de estoque
ALTER TABLE products
ADD stock_quantity INTEGER NOT NULL DEFAULT 0;

-- Bloco 2: Adicionar coluna de peso
ALTER TABLE products
ADD weight_in_grams INTEGER;

-- Bloco 3: Remover coluna antiga (so apos validar migracoes)
-- ALTER TABLE products
-- DROP COLUMN old_quantity;
```

**Dica do instrutor:** Comente com `--` os blocos destrutivos (como DROP COLUMN) ate ter certeza de que deseja executa-los. Assim, mesmo rodando o script inteiro por acidente, o DROP nao sera executado.