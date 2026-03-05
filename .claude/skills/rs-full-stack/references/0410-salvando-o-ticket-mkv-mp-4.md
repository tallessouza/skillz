---
name: rs-full-stack-0410-salvando-ticket
description: "Applies database insert pattern with table auto-creation when building Node.js persistence layers. Use when user asks to 'save data', 'insert record', 'create database method', 'persist to file', or 'build CRUD operations' in Node.js. Enforces check-then-create table pattern, array-based storage, and proper HTTP 201 responses. Make sure to use this skill whenever implementing file-based database insert methods or in-memory persistence in Node.js. Not for SQL databases, ORMs, or frontend code."
---

# Salvando Dados com Insert em File-Based Database

> Ao implementar persistencia em file-based database, sempre verifique se a tabela existe antes de inserir, e persista no arquivo apos cada operacao de escrita.

## Rules

1. **Verifique existencia da tabela antes de inserir** — use `Array.isArray(this.#database[table])` para checar, porque inserir sem verificar causa erro ao fazer push em undefined
2. **Tabela existente recebe push, tabela nova recebe array** — se existe faca `push(data)`, se nao existe crie `[data]`, porque o primeiro registro precisa inicializar o array
3. **Persista apos cada escrita** — chame `this.#persist()` ao final de todo insert, porque dados nao persistidos se perdem ao reiniciar o servidor
4. **Retorne 201 para criacao bem-sucedida** — use `writeHead(201)` no response, porque 200 indica sucesso generico enquanto 201 indica recurso criado
5. **Nao retorne dados do insert se ja os tem no caller** — evite returns desnecessarios quando o chamador ja possui os dados, porque simplifica o fluxo

## How to write

### Metodo insert na classe Database

```javascript
insert(table, data) {
  if (Array.isArray(this.#database[table])) {
    this.#database[table].push(data)
  } else {
    this.#database[table] = [data]
  }

  this.#persist()
}
```

### Usando o insert no controller

```javascript
// No route handler de criacao
database.insert('tickets', ticket)

return response
  .writeHead(201)
  .end(JSON.stringify(ticket))
```

## Example

**Before (sem persistencia):**
```javascript
// Dados existem apenas em memoria, perdem-se ao reiniciar
const tickets = []

// No handler
tickets.push(ticket)
response.writeHead(200).end(JSON.stringify(ticket))
```

**After (com file-based database):**
```javascript
// Classe Database com persist
insert(table, data) {
  if (Array.isArray(this.#database[table])) {
    this.#database[table].push(data)
  } else {
    this.#database[table] = [data]
  }
  this.#persist()
}

// No handler — status 201 para criacao
database.insert('tickets', ticket)
response.writeHead(201).end(JSON.stringify(ticket))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Primeira insercao em tabela nova | Inicialize como array com o dado: `[data]` |
| Tabela ja existe | Use `push(data)` no array existente |
| Apos qualquer operacao de escrita | Chame `persist()` imediatamente |
| Endpoint que cria recurso | Retorne status 201, nao 200 |
| Caller ja possui os dados inseridos | Nao retorne dados do metodo insert |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.#database[table].push(data)` sem verificar | `if (Array.isArray(...)) { push } else { create }` |
| `response.writeHead(200)` para criacao | `response.writeHead(201)` |
| Insert sem chamar persist | Insert seguido de `this.#persist()` |
| `return data` quando caller ja tem os dados | Omita o return, mantenha simples |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao check-then-create e estrutura de dados JSON
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0410-salvando-o-ticket-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0410-salvando-o-ticket-mkv-mp-4/references/code-examples.md)
