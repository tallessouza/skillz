# Deep Explanation: Seed de Produtos com Knex.js

## Por que seeds existem

Seeds resolvem um problema comum: após deletar dados de teste ou ao configurar um ambiente novo, você precisa popular tabelas com dados de exemplo rapidamente. Em vez de inserir registros um a um via API ou manualmente, seeds permitem inserção em massa com um único comando.

## Configuração no Knexfile

O Knex precisa saber onde ficam os seeds, assim como sabe onde ficam as migrations. Na configuração:

```typescript
// knexfile.ts ou knex config inline
{
  seeds: {
    directory: "./src/database/seeds"
  },
  migrations: {
    directory: "./src/database/migrations"
  }
}
```

Ambos ficam no mesmo nível dentro de `database/`. Quando você roda `seed:make` pela primeira vez, a pasta é criada automaticamente.

## O padrão del() + insert()

A estratégia fundamental é: **sempre limpar antes de inserir**. Isso garante idempotência — rodar o seed 1x ou 10x produz o mesmo resultado.

```typescript
await knex("products").del()    // Remove tudo
await knex("products").insert([...])  // Insere do zero
```

Sem o `del()`, cada execução adiciona mais registros, criando duplicatas.

## Diferença entre Seeds e Migrations

- **Migrations** alteram a estrutura (schema) do banco — criar tabelas, adicionar colunas
- **Seeds** alteram os dados — inserir, atualizar registros

Migrations são sequenciais e rastreadas (knex_migrations table). Seeds são idempotentes e podem ser re-executados a qualquer momento.

## Ordenação dos resultados

O instrutor destaca que ao listar os produtos após o seed, eles não aparecem na ordem de inserção, mas na ordem definida pelo `ORDER BY` da query de listagem (alfabética no caso). Isso reforça que a ordem de inserção no banco não garante ordem de retorno — sempre use `ORDER BY` explícito.

## Comandos do Knex para seeds

| Comando | Função |
|---------|--------|
| `npx knex seed:make nome_do_seed` | Cria arquivo de seed |
| `npx knex seed:run` | Executa todos os seeds |

Se usando scripts npm:
```bash
npm run knex -- seed:make insert_products
npm run knex -- seed:run
```