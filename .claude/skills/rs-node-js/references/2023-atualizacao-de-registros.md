---
name: rs-nodejs-atualizacao-de-registros
description: "Applies the PUT route pattern for updating records in Node.js HTTP servers. Use when user asks to 'update a record', 'edit user data', 'create PUT route', 'implement update endpoint', or 'modify existing resource'. Enforces route params for ID, body parsing for data, row-index lookup before replacement, and 204 response. Make sure to use this skill whenever implementing update/edit functionality in Node.js APIs. Not for GET/POST/DELETE routes, database migrations, or ORM-based updates."
---

# Atualizacao de Registros (PUT)

> A rota de atualizacao combina identificacao por ID (route params) com recepcao de dados (body), substituindo o registro completo no banco.

## Rules

1. **Use PUT para atualizacao completa** — PUT substitui todos os campos do recurso, porque semanticamente significa "substituir o recurso inteiro neste ID"
2. **Receba o ID via route params** — `req.params.id` identifica QUAL registro atualizar, porque o ID nunca vem no body
3. **Receba os dados via body** — `req.body` contem os campos atualizados (`name`, `email`), porque sao dados variáveis enviados pelo cliente
4. **Busque o indice antes de substituir** — use `findIndex` para localizar o registro, porque substituir sem indice sobrescreve a tabela inteira
5. **Preserve o ID na substituicao** — inclua o `id` original ao substituir o registro, porque o ID e imutavel e nao deve vir do body
6. **Retorne 204 No Content** — atualizacao bem-sucedida nao precisa retornar body, porque o cliente ja conhece os dados que enviou

## How to write

### Metodo update no banco in-memory

```javascript
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = { id, ...data }
  }
}
```

### Rota PUT no servidor

```javascript
{
  method: 'PUT',
  path: buildRoutePath('/users/:id'),
  handler: (req, res) => {
    const { id } = req.params
    const { name, email } = req.body

    database.update('users', id, { name, email })

    return res.writeHead(204).end()
  }
}
```

## Example

**Before (bug — sem rowIndex, sobrescreve tabela inteira):**

```javascript
update(table, id, data) {
  this.#database[table] = { id, ...data }  // ERRADO: substitui toda a tabela
}
```

**After (correto — localiza indice, substitui apenas o registro):**

```javascript
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = { id, ...data }
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualizar todos os campos | Use PUT com body completo |
| Atualizar campo parcial | Use PATCH (nao PUT) |
| Precisa do ID do registro | Extraia de `req.params` |
| Precisa dos dados novos | Extraia de `req.body` |
| Registro nao encontrado | `rowIndex === -1`, trate o erro |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `this.#database[table] = data` | `this.#database[table][rowIndex] = { id, ...data }` |
| Enviar ID no body | Extrair ID de `req.params` |
| Retornar 200 com body vazio | Retornar 204 No Content |
| Substituir sem buscar indice | Sempre `findIndex` antes de substituir |
| Omitir o ID na substituicao | `{ id, ...data }` preserva o ID original |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-atualizacao-de-registros/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-atualizacao-de-registros/references/code-examples.md)
