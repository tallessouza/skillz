---
name: rs-full-stack-revertendo-migration
description: "Applies Knex migration rollback commands when reverting database changes. Use when user asks to 'undo migration', 'rollback migration', 'revert database changes', 'undo knex migration', or 'desfazer migration'. Covers specific migration rollback, batch rollback, and full rollback. Make sure to use this skill whenever the user needs to undo database schema changes made by Knex migrations. Not for creating migrations, running migrations forward, or non-Knex database operations."
---

# Revertendo Migrations (Knex)

> Toda migration executada pode ser desfeita — use o metodo down para reverter alteracoes de schema de forma segura e controlada.

## Comandos

### 1. Listar migrations

```bash
npx knex migrate:list
```

Mostra todas as migrations e seus status (executadas ou pendentes).

### 2. Reverter uma migration especifica

```bash
npx knex migrate:down {nome_da_migration}.ts
```

Executa o metodo `down` apenas daquela migration. Util quando voce criou algo por engano e quer desfazer so aquela alteracao.

### 3. Rollback do ultimo batch

```bash
npx knex migrate:rollback
```

Desfaz todas as migrations do ultimo batch executado, porque o Knex agrupa migrations executadas juntas em batches.

### 4. Rollback de tudo

```bash
npx knex migrate:rollback --all
```

Desfaz todas as migrations, na ordem inversa. O banco volta ao estado inicial — tabelas somem, colunas removidas, tudo limpo.

## Exemplo

**Situacao:** Adicionou coluna `updated_at` na tabela `courses` por engano.

```bash
# Ver as migrations
npx knex migrate:list

# Desfazer apenas aquela migration
npx knex migrate:down 20240115_add_updated_at_to_courses.ts

# Verificar no banco — coluna updated_at removida
```

**Situacao:** Quer desfazer tudo e recomecar.

```bash
# Desfaz tudo
npx knex migrate:rollback --all

# Reexecuta tudo do zero
npx knex migrate:latest
```

## Heuristics

| Situacao | Comando |
|----------|---------|
| Errou uma migration especifica | `migrate:down {arquivo}` |
| Quer voltar um passo (ultimo batch) | `migrate:rollback` |
| Quer limpar tudo e recomecar | `migrate:rollback --all` seguido de `migrate:latest` |
| Quer apenas ver o estado atual | `migrate:list` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deletar arquivo de migration manualmente | Use `migrate:down` para reverter, porque deletar o arquivo nao desfaz as alteracoes no banco |
| Editar migration ja executada | Crie uma nova migration para alterar, porque o banco ja tem o estado da migration antiga |
| Rodar `rollback --all` em producao sem backup | Faca backup antes, porque rollback --all apaga TUDO |
| Ignorar a tabela `knex_migrations` | Consulte-a para entender o estado dos batches |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre batches, metodo down e ciclo de vida
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes