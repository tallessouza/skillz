---
name: rs-full-stack-abrindo-a-mesa
description: "Applies table session opening pattern with Zod validation, Knex insert, and DB typing when building restaurant API endpoints. Use when user asks to 'create a session endpoint', 'open a table', 'insert with Knex and Zod', or 'validate and insert in Express'. Enforces: Zod body validation, typed Knex inserts, foreign key integrity awareness, proper DB typing files. Make sure to use this skill whenever creating validated insert endpoints with Knex. Not for query/select operations, authentication, or frontend code."
---

# Abrindo Sessao de Mesa — Insert Validado com Zod + Knex

> Toda rota de insert valida o body com Zod, tipa o repositorio, e confia nas foreign keys do banco relacional para integridade.

## Rules

1. **Valide o body com Zod antes de qualquer operacao** — `z.object({ table_id: z.number() }).parse(request.body)`, porque rejeita requests invalidos antes de tocar no banco
2. **Crie tipagem dedicada para cada tabela** — arquivo `{table-name}-repository.d.ts` em `database/types/`, porque sem tipagem o Knex nao oferece autocomplete nem seguranca
3. **Passe a tipagem generica no insert do Knex** — `knex<TablesSessionsRepository>("tables_sessions").insert(...)`, porque habilita verificacao de campos em tempo de desenvolvimento
4. **Use `knex.fn.now()` para timestamps automaticos** — nunca passe `new Date()` manualmente, porque `knex.fn.now()` delega ao banco e respeita timezone do servidor
5. **Confie nas foreign keys para integridade referencial** — nao valide existencia manualmente se a FK ja protege, porque o banco relacional retorna erro de constraint automaticamente
6. **Retorne 201 para inserts bem-sucedidos** — `return response.status(201).json()`, porque 201 Created e o status HTTP semanticamente correto

## How to write

### Validacao do body com Zod

```typescript
import { z } from "zod"

const bodySchema = z.object({
  table_id: z.number(),
})

const { table_id } = bodySchema.parse(request.body)
```

### Tipagem do repositorio

```typescript
// database/types/tables-sessions-repository.d.ts
type TablesSessionsRepository = {
  id: number
  table_id: number
  opened_at: number
  closed_at: number
}
```

### Insert tipado com Knex

```typescript
import { knex } from "@/database/knex"

await knex<TablesSessionsRepository>("tables_sessions").insert({
  table_id,
  opened_at: knex.fn.now(),
})

return response.status(201).json()
```

## Example

**Before (sem validacao nem tipagem):**
```typescript
app.post("/sessions", async (request, response) => {
  const data = request.body
  await knex("tables_sessions").insert({
    table_id: data.table_id,
    opened_at: new Date(),
  })
  return response.json({ ok: true })
})
```

**After (com Zod + tipagem + status correto):**
```typescript
app.post("/sessions", async (request, response) => {
  const bodySchema = z.object({
    table_id: z.number(),
  })
  const { table_id } = bodySchema.parse(request.body)

  await knex<TablesSessionsRepository>("tables_sessions").insert({
    table_id,
    opened_at: knex.fn.now(),
  })

  return response.status(201).json()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo e obrigatorio e numerico | `z.number()` sem `.optional()` |
| Timestamp de criacao | `knex.fn.now()` no insert |
| Campo preenchido depois (ex: `closed_at`) | Deixe nulo no insert, atualize depois com UPDATE |
| ID referencia outra tabela | Confie na FK, trate o erro de constraint |
| Precisa de autocomplete no insert | Passe o type generic `knex<Type>("table")` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `const data = request.body` sem validacao | `bodySchema.parse(request.body)` |
| `knex("table").insert(...)` sem tipagem | `knex<TableRepository>("table").insert(...)` |
| `opened_at: new Date()` | `opened_at: knex.fn.now()` |
| Verificar manualmente se FK existe antes do insert | Deixar o banco rejeitar com constraint error |
| `return response.json()` para insert | `return response.status(201).json()` |
| Tipagem inline no handler | Arquivo dedicado `*-repository.d.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre foreign keys, integridade relacional e fluxo de validacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-abrindo-a-mesa/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-abrindo-a-mesa/references/code-examples.md)
