# Code Examples: Rota para Atualizar Status do Ticket

## 1. Configuracao no Insomnia/HTTP Client

```
Method: PATCH
URL: http://localhost:3000/tickets/{id}/close
Body: (vazio — nao precisa enviar nada)
```

## 2. Definicao da rota (routes/tickets.js)

```javascript
import { updateStatus } from '../controllers/tickets/updateStatus.js'

// Rota existente de update (PUT — recurso completo)
app.put('/tickets/:id', (request, response) => {
  update(request, response, database)
})

// Nova rota de PATCH (status especifico)
app.patch('/tickets/:id/close', (request, response) => {
  updateStatus(request, response, database)
})
```

**Observacao:** A rota de PATCH foi adicionada abaixo da rota PUT existente. O padrao e `/<recurso>/:id/<acao>`.

## 3. Controller updateStatus.js

```javascript
// controllers/tickets/updateStatus.js
export function updateStatus(request, response, database) {
  const { id } = request.params

  database.update('tickets', id, { status: 'closed' })

  return response.end('OK')
}
```

**Versao inicial do instrutor (apenas teste):**
```javascript
export function updateStatus(request, response, database) {
  return response.end('OK')
}
```

O instrutor primeiro testa a rota retornando apenas "OK", depois implementa a logica. Padrao: testar conectividade antes de logica de negocio.

## 4. Variacoes do padrao para outras acoes

### Reabrir ticket
```javascript
// routes/tickets.js
app.patch('/tickets/:id/reopen', (request, response) => {
  reopenTicket(request, response, database)
})

// controllers/tickets/reopenTicket.js
export function reopenTicket(request, response, database) {
  const { id } = request.params
  database.update('tickets', id, { status: 'open' })
  return response.end('OK')
}
```

### Arquivar ticket
```javascript
app.patch('/tickets/:id/archive', (request, response) => {
  archiveTicket(request, response, database)
})
```

## 5. Estrutura de arquivos resultante

```
src/
├── routes/
│   └── tickets.js          # Todas as rotas de tickets
├── controllers/
│   └── tickets/
│       ├── create.js        # POST /tickets
│       ├── findAll.js       # GET /tickets
│       ├── findById.js      # GET /tickets/:id
│       ├── update.js        # PUT /tickets/:id
│       ├── updateStatus.js  # PATCH /tickets/:id/close  ← NOVO
│       └── delete.js        # DELETE /tickets/:id
```

## 6. Teste passo a passo (como o instrutor fez)

```bash
# 1. Primeiro teste — rota ainda nao existe
# PATCH http://localhost:3000/tickets/1/close → 404

# 2. Cria a rota e controller com response.end('OK')
# PATCH http://localhost:3000/tickets/1/close → 200 "OK"

# 3. Implementa logica de banco
# PATCH http://localhost:3000/tickets/1/close → 200 (status atualizado)
```