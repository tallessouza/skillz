---
name: rs-node-js-2023-remocao-de-registros
description: "Applies the delete record pattern in Node.js HTTP APIs when implementing 'delete route', 'remove record', 'delete endpoint', or 'remove user'. Enforces findIndex lookup before splice, 204 No Content response, database persistence only on change, and route params extraction via regex groups. Make sure to use this skill whenever building DELETE routes in pure Node.js servers. Not for ORMs, frameworks like Express/Fastify, or frontend deletion logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: delete-records
  tags: [delete, http, findIndex, splice, 204, route-params, in-memory-database]
---

# Remocao de Registros em API Node.js Puro

> Ao implementar rota DELETE, valide existencia antes de remover, persista apenas se houve alteracao, e retorne 204 No Content.

## Rules

1. **Extraia params da regex e injete em `req.params`** — `req.params = { ...route.params.groups }`, porque centralizar no `req` permite acesso limpo dentro do handler da rota
2. **Use `findIndex` para localizar o registro** — retorna `-1` se nao encontrou, porque tentar splice sem validar corrompe o array
3. **So remova se `rowIndex > -1`** — porque splice com indice `-1` remove o ultimo elemento (bug silencioso)
4. **Use `splice(index, 1)` para remover** — porque splice modifica o array in-place e remove exatamente 1 item
5. **Persista banco apenas quando houve alteracao** — porque escrita desnecessaria em disco e desperdicio de I/O
6. **Retorne status 204 No Content** — `res.writeHead(204).end()`, porque 204 significa sucesso sem corpo de resposta

## How to write

### Metodo delete no banco de dados in-memory

```javascript
delete(table, id) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }
}
```

### Rota DELETE com extração de params

```javascript
{
  method: 'DELETE',
  path: buildRoutePath('/users/:id'),
  handler: (req, res) => {
    const { id } = req.params

    database.delete('users', id)

    return res.writeHead(204).end()
  }
}
```

### Injecao de params no request

```javascript
// No server, apos match da rota
req.params = { ...route.params.groups }
```

## Example

**Before (bug silencioso com splice):**
```javascript
delete(table, id) {
  const index = this.#database[table].findIndex(row => row.id === id)
  this.#database[table].splice(index, 1) // BUG: se index = -1, remove ultimo item
  this.#persist() // Persiste mesmo sem alteracao
}
```

**After (com validacao correta):**
```javascript
delete(table, id) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota precisa de parametro da URL | Extraia via regex named groups e injete em `req.params` |
| Operacao de delete bem-sucedida | Retorne 204, nunca 200 com body vazio |
| Registro nao encontrado no array | `findIndex` retorna `-1`, nao faca splice |
| Banco in-memory com persistencia em arquivo | So chame `persist()` quando houve mutacao real |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `splice(findIndex(...), 1)` sem checar `-1` | Guarde `rowIndex`, valide `> -1`, depois splice |
| `res.writeHead(200).end()` em DELETE | `res.writeHead(204).end()` |
| `this.#persist()` fora do `if` | `this.#persist()` dentro do bloco que confirma remocao |
| `req.params = route.params.groups` | `req.params = { ...route.params.groups }` (spread remove null prototype) |

## Troubleshooting

### DELETE remove o ultimo item do array em vez do item correto
**Symptom:** Ao deletar um registro que nao existe, o ultimo item do array e removido silenciosamente
**Cause:** `splice(-1, 1)` remove o ultimo elemento — `findIndex` retorna `-1` quando nao encontra, e o codigo nao valida antes de chamar splice
**Fix:** Sempre verifique `if (rowIndex > -1)` antes de chamar `splice(rowIndex, 1)`. Nunca passe o resultado de `findIndex` direto para `splice`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
