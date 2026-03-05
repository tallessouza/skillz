# Code Examples: Rota PUT para Atualizar Recurso

## Exemplo 1: Estrutura de arquivos

```
src/
├── routes/
│   └── tickets.js          # Registro de rotas GET e PUT
├── controllers/
│   └── tickets/
│       ├── index.js         # GET /tickets (listagem)
│       └── update.js        # PUT /tickets/:id (atualizacao)
```

## Exemplo 2: Arquivo de rotas completo

```javascript
// routes/tickets.js
import { index } from '../controllers/tickets/index.js'
import { update } from '../controllers/tickets/update.js'

export const ticketRoutes = [
  { method: 'GET', path: '/tickets', controller: index },
  { method: 'PUT', path: '/tickets/:id', controller: update },
]
```

## Exemplo 3: Controller de update (versao teste)

```javascript
// controllers/tickets/update.js
export function update(request, response, database) {
  return response.end('OK')
}
```

## Exemplo 4: Controller de update (versao com logica)

```javascript
// controllers/tickets/update.js
export function update(request, response, database) {
  const id = request.params.id
  const { title, status } = request.body

  database.update('tickets', id, { title, status })

  return response.writeHead(204).end()
}
```

## Exemplo 5: Testando no Insomnia

### Passo 1 — Obter o ID
```
GET http://localhost:3000/tickets
→ Response: [{ "id": "abc-123", "title": "Bug fix", "status": "open" }, ...]
```

### Passo 2 — Copiar o ID e montar a URL
```
PUT http://localhost:3000/tickets/abc-123
```

### Passo 3 — Enviar (sem body, apenas teste de rota)
```
→ Response: OK (status 200)
```

## Exemplo 6: Erro comum — 404 sem a rota registrada

```
PUT http://localhost:3000/tickets/abc-123
→ Response: 404 Not Found
```

**Causa:** A rota PUT nao foi registrada em `routes/tickets.js`.
**Solucao:** Adicionar a rota e reiniciar o servidor.

## Exemplo 7: Erro comum — servidor nao responde

```bash
# Servidor rodando, adicionou novo arquivo, mas nao responde
# Solucao:
Ctrl+C          # Para o servidor
node src/server.js  # Executa novamente
```

## Variacao: Outras rotas CRUD seguindo o mesmo padrao

```javascript
// routes/tickets.js — CRUD completo
import { index } from '../controllers/tickets/index.js'
import { create } from '../controllers/tickets/create.js'
import { update } from '../controllers/tickets/update.js'
import { remove } from '../controllers/tickets/delete.js'

export const ticketRoutes = [
  { method: 'GET',    path: '/tickets',     controller: index },
  { method: 'POST',   path: '/tickets',     controller: create },
  { method: 'PUT',    path: '/tickets/:id', controller: update },
  { method: 'DELETE', path: '/tickets/:id', controller: remove },
]
```