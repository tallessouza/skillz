---
name: rs-full-stack-rota-atualizar-ticket
description: "Applies Node.js PUT route pattern for updating resources by ID. Use when user asks to 'create update route', 'add PUT endpoint', 'update resource by id', 'edit ticket endpoint', or any REST update operation in vanilla Node.js. Enforces route params with :id, controller separation, and proper request/response handling. Make sure to use this skill whenever building CRUD update endpoints in Node.js without frameworks. Not for Express/Fastify routes, database queries, or request body parsing."
---

# Rota PUT para Atualizar Recurso por ID

> Toda rota de atualizacao recebe o ID como parametro na URL, delega para um controller dedicado, e segue o padrao de separacao routes/controllers.

## Rules

1. **Use metodo PUT para atualizacao** — `PUT /resources/:id`, porque PUT e o metodo HTTP semanticamente correto para atualizar um recurso existente
2. **ID como route param** — defina `:id` na rota e recupere do request, porque o ID identifica qual recurso atualizar
3. **Um controller por operacao** — `controllers/tickets/update.js` separado do index, porque cada operacao CRUD tem responsabilidade unica
4. **Controller recebe request, response e database** — `function update(request, response, database)`, porque sao as 3 dependencias necessarias para qualquer operacao
5. **Sempre adicione .js na importacao** — `import { update } from './controllers/tickets/update.js'`, porque Node.js com ESM exige extensao explicita
6. **Reinicie o servidor ao adicionar arquivos** — pare com Ctrl+C e execute novamente, porque o Node.js vanilla nao detecta novos arquivos automaticamente

## How to write

### Definir a rota PUT

```javascript
// routes/tickets.js
import { update } from '../controllers/tickets/update.js'

// Registrar rota PUT com parametro :id
{ method: 'PUT', path: '/tickets/:id', controller: update }
```

### Controller de update

```javascript
// controllers/tickets/update.js
export function update(request, response, database) {
  // Recuperar o ID do parametro da rota
  // Processar atualizacao
  return response.end('OK')
}
```

### URL no cliente

```
PUT http://localhost:3000/tickets/abc-123-def-456
```

## Example

**Before (sem rota de update):**
```javascript
// routes/tickets.js — apenas listagem
import { index } from '../controllers/tickets/index.js'

// So tem GET
{ method: 'GET', path: '/tickets', controller: index }
// PUT /tickets/:id retorna 404
```

**After (com rota de update):**
```javascript
// routes/tickets.js
import { index } from '../controllers/tickets/index.js'
import { update } from '../controllers/tickets/update.js'

{ method: 'GET', path: '/tickets', controller: index },
{ method: 'PUT', path: '/tickets/:id', controller: update }
```

```javascript
// controllers/tickets/update.js
export function update(request, response, database) {
  return response.end('OK')
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualizar recurso existente | PUT com :id na URL |
| Novo arquivo de controller criado | Reiniciar servidor Node.js |
| Testar rota antes de implementar logica | Retorne `response.end('OK')` para validar que a rota funciona |
| Copiar estrutura de rota existente | Copie e ajuste method e controller — reaproveitar estrutura e seguro |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `PUT /tickets` (sem ID) | `PUT /tickets/:id` |
| Logica de update dentro do arquivo de rotas | Controller separado em `controllers/tickets/update.js` |
| `import { update } from './update'` (sem extensao) | `import { update } from './update.js'` |
| Toda logica CRUD num unico controller | Um arquivo por operacao: index.js, update.js, create.js |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de controllers, route params e troubleshooting de servidor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0415-rota-para-atualizar-ticket-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0415-rota-para-atualizar-ticket-mkv-mp-4/references/code-examples.md)
