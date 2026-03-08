---
name: rs-full-stack-update-1
description: "Applies Knex query builder update pattern when writing Node.js PUT/PATCH routes. Use when user asks to 'update a record', 'edit data', 'create a PUT route', 'modify database entry', or 'knex update'. Enforces proper parameter extraction, where clause filtering, and response handling. Make sure to use this skill whenever generating update endpoints with Knex. Not for SELECT queries, INSERT operations, or DELETE routes."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database-knex
  tags: [knex, update, put-route, query-builder, node-js]
---

# Knex Update com Query Builder

> Ao criar rotas de atualizacao, sempre extraia o ID dos params e os dados do body separadamente, e aplique WHERE antes de executar o update.

## Rules

1. **Use PUT para atualizacao completa** — `app.put('/resource/:id', ...)`, porque PUT indica substituicao do recurso
2. **Extraia ID dos route params** — `const { id } = request.params`, porque o ID identifica o recurso na URL
3. **Extraia dados do body separadamente** — `const { name } = request.body`, porque separa identificacao de dados
4. **Sempre aplique WHERE no update** — `knex('table').update({...}).where({ id })`, porque update sem WHERE atualiza TODAS as linhas
5. **Use async/await** — rotas com banco sao assincronas, porque garante que o update complete antes de responder
6. **Retorne response com return** — `return response.json()`, porque padroniza o fluxo de resposta

## How to write

### Rota PUT com Knex update

```typescript
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  await knex('courses').update({ name }).where({ id })

  return response.json()
})
```

### Update com multiplos campos

```typescript
app.put('/users/:id', async (request, response) => {
  const { id } = request.params
  const { name, email } = request.body

  await knex('users').update({ name, email }).where({ id })

  return response.json()
})
```

## Example

**Before (perigoso — sem WHERE):**
```typescript
app.put('/courses', async (request, response) => {
  const { name } = request.body
  await knex('courses').update({ name })
  response.json()
})
```

**After (com this skill applied):**
```typescript
app.put('/courses/:id', async (request, response) => {
  const { id } = request.params
  const { name } = request.body

  await knex('courses').update({ name }).where({ id })

  return response.json()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Atualizar um unico campo | `knex('table').update({ field }).where({ id })` |
| Atualizar multiplos campos | Passe objeto com todos os campos no update |
| ID vem da URL | Desestruture de `request.params` |
| Dados vem do corpo | Desestruture de `request.body` |
| Precisa confirmar atualizacao | Retorne o registro atualizado com SELECT apos update |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `knex('table').update({...})` sem WHERE | `knex('table').update({...}).where({ id })` |
| `response.json()` sem return | `return response.json()` |
| ID hardcoded na query | ID vindo de `request.params` |
| Dados e ID misturados no body | ID nos params, dados no body |
| Callback sem async/await | `async (request, response) =>` com `await` |

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| Update atualiza todas as linhas da tabela | Faltou cláusula `where` no query builder | Sempre adicione `.where({ id })` antes de executar |
| Registro não é atualizado mas não dá erro | ID passado não existe na tabela | Verifique o valor de `request.params.id` e se existe no banco |
| Erro `Cannot set headers after they are sent` | Faltou `return` antes de `response.json()` | Adicione `return` em todas as chamadas de response |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre pattern de update e seguranca
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-update-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-update-1/references/code-examples.md)
