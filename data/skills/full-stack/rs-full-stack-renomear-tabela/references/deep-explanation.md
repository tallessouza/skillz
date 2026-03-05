# Deep Explanation: Renomear Tabela SQL

## Por que ALTER TABLE e não recriar?

O comando `ALTER TABLE ... RENAME TO` é uma operação de metadados — ele apenas muda o nome no catálogo do banco, sem tocar nos dados. Isso significa:

1. **Operação instantânea** — independente do tamanho da tabela (milhões de linhas? Mesma velocidade)
2. **Preserva tudo** — dados, índices, constraints, triggers, permissões
3. **Atômica** — ou renomeia completamente ou não faz nada (sem estado intermediário)

Recriar a tabela (CREATE + SELECT + DROP) é destrutivo: perde índices, triggers, foreign keys, permissões, e se falhar no meio, você pode perder dados.

## Comportamento por banco de dados

### PostgreSQL
- `ALTER TABLE products RENAME TO items;`
- Atualiza automaticamente foreign keys que referenciam a tabela
- Views que usam o nome antigo **quebram** — precisam ser recriadas

### MySQL
- `ALTER TABLE products RENAME TO items;` ou `RENAME TABLE products TO items;`
- MySQL tem sintaxe adicional `RENAME TABLE` que permite renomear múltiplas tabelas atomicamente:
  ```sql
  RENAME TABLE products TO items, orders TO purchases;
  ```

### SQLite
- `ALTER TABLE products RENAME TO items;`
- Suportado desde SQLite 3.25.0
- Foreign keys são atualizadas se `PRAGMA foreign_keys = ON`

## O que o instrutor demonstrou

O instrutor mostrou o ciclo completo:
1. Renomeou `PRODUCTS` para `ITEMS` — mostrou que as colunas permanecem intactas
2. Renomeou `ITEMS` de volta para `PRODUCTS` — demonstrou que a operação é perfeitamente reversível

O ponto principal: renomear uma tabela não afeta sua estrutura interna (colunas, dados), apenas o identificador pelo qual ela é referenciada.

## Cuidados após renomear

Após renomear uma tabela, verifique:
- **Queries hardcoded** no código da aplicação
- **Views** que referenciam o nome antigo
- **Stored procedures / functions** que usam o nome antigo
- **ORMs** — atualize os models/entities
- **Migrations** — registre a mudança para outros ambientes