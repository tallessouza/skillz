---
name: rs-full-stack-refinando-abertura-da-mesa
description: "Enforces validation-before-mutation pattern when writing API endpoints that create or open resources. Use when user asks to 'create an endpoint', 'open a table', 'start a session', 'prevent duplicates', or any resource creation with uniqueness constraints. Applies rules: always check existing state before insert, use short syntax for Knex where clauses, order+first for latest record, throw AppError for business rule violations. Make sure to use this skill whenever building endpoints that must prevent duplicate active records. Not for read-only endpoints, authentication, or frontend validation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-validation
  tags:
    - api
    - validation
    - knex
    - business-rules
    - guard-clause
---

# Validacao Pre-Mutacao em Endpoints de Criacao

> Antes de criar ou abrir um recurso, sempre verifique o estado atual no banco para evitar duplicatas e violacoes de regras de negocio.

## Rules

1. **Sempre consulte antes de inserir** — verifique se o recurso ja existe no estado ativo antes de criar um novo, porque insercoes cegas geram dados inconsistentes
2. **Use short syntax no Knex where** — `where({ table_id: tableId })` em vez de `.where('table_id', tableId)` quando filtrar por igualdade, porque evita duplicidade do nome da coluna
3. **Ordene e pegue apenas o primeiro** — use `.orderBy('opened_at', 'desc').first()` para garantir que trabalha com o registro mais recente, porque uma lista nao serve para validacao unitaria
4. **Lance AppError para regras de negocio** — use `throw new AppError('mensagem')` em vez de retornar status code manualmente, porque centraliza o tratamento de erros
5. **Valide pelo campo de fechamento** — se `closed_at` e null/undefined, o recurso ainda esta ativo e nao pode ser reaberto, porque esse campo e o indicador de estado
6. **Omita select quando quiser todas as colunas** — Knex permite ir direto ao `.where()` sem `.select('*')`, porque o select total e o padrao

## How to write

### Consulta de estado antes da mutacao

```typescript
const session = await knex<TableSessionsRepository>('table_sessions')
  .where({ table_id: tableId })
  .orderBy('opened_at', 'desc')
  .first()

if (session && !session.closed_at) {
  throw new AppError('This table is already open')
}
```

### Pattern geral: validate-then-create

```typescript
// 1. Consultar estado atual
const existing = await knex<Resource>('resources')
  .where({ identifier })
  .orderBy('created_at', 'desc')
  .first()

// 2. Validar regra de negocio
if (existing && !existing.finishedAt) {
  throw new AppError('Resource is already active')
}

// 3. Somente entao criar
const [created] = await knex('resources')
  .insert({ identifier, ...data })
  .returning('*')
```

## Example

**Before (sem validacao — permite duplicatas):**
```typescript
async function openTable(request: Request, response: Response) {
  const { table_id } = request.body

  const [session] = await knex('table_sessions')
    .insert({ table_id, opened_at: knex.fn.now() })
    .returning('*')

  return response.json(session)
}
```

**After (com validacao pre-mutacao):**
```typescript
async function openTable(request: Request, response: Response) {
  const { table_id } = request.body

  const session = await knex<TableSessionsRepository>('table_sessions')
    .where({ table_id })
    .orderBy('opened_at', 'desc')
    .first()

  if (session && !session.closed_at) {
    throw new AppError('This table is already open')
  }

  const [newSession] = await knex('table_sessions')
    .insert({ table_id, opened_at: knex.fn.now() })
    .returning('*')

  return response.json(newSession)
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Recurso tem campo de "fechamento" (closed_at, finished_at) | Verifique se e null antes de criar novo |
| Precisa do registro mais recente | `.orderBy('campo', 'desc').first()` |
| Where com igualdade simples | Use short syntax `{ coluna: valor }` |
| Violacao de regra de negocio | `throw new AppError()` com mensagem clara |
| Endpoint de criacao com constraint de unicidade logica | Sempre consulte antes de inserir |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `insert` sem verificar estado atual | Consulte + valide + insira |
| `.where('table_id', tableId)` para igualdade simples | `.where({ table_id: tableId })` |
| `return response.status(400).json({ error })` para regra de negocio | `throw new AppError('mensagem')` |
| `.select('*').where(...)` quando quer todas as colunas | `.where(...)` direto |
| Retornar lista quando precisa de um registro | `.orderBy(...).first()` |
| `if (sessions.length > 0)` para verificar existencia | `if (session && !session.closed_at)` com `.first()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre validacao pre-mutacao, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Duplicatas criadas mesmo com validacao | Validacao nao busca o registro mais recente | Adicione `.orderBy('opened_at', 'desc').first()` para pegar o ultimo |
| AppError nao retorna status correto ao cliente | Error handler global nao trata AppError | Configure middleware de erro que capture AppError e retorne o status adequado |
| `.first()` retorna undefined mas registro existe | Filtro `where` com valor errado ou coluna inexistente | Verifique o nome exato da coluna e o valor passado |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-refinando-abertura-da-mesa/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-refinando-abertura-da-mesa/references/code-examples.md)
