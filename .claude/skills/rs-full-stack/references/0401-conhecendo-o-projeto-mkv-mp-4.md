---
name: rs-full-stack-conhecendo-o-projeto
description: "Applies support ticket API design patterns when building CRUD REST APIs with Node.js. Use when user asks to 'create a ticket API', 'build a support system', 'design CRUD routes', or 'structure a Node.js API'. Enforces route conventions: POST create, GET list with query filters, PUT partial update with field restrictions, PATCH status transitions, DELETE removal. Make sure to use this skill whenever designing REST APIs for ticket/issue/support systems. Not for frontend, database schema design, or authentication flows."
---

# API de Tickets de Suporte — Design de Rotas

> Ao projetar uma API CRUD de tickets, cada rota tem responsabilidade unica: criar, listar com filtro, atualizar campos permitidos, transicionar status, e deletar.

## Rules

1. **Separe atualizacao de dados e transicao de status** — use PUT para campos editaveis e PATCH para mudanca de status, porque sao operacoes semanticamente diferentes e evitam que o cliente altere status acidentalmente
2. **Restrinja campos editaveis no update** — nem todo campo enviado na criacao pode ser alterado depois (ex: `username` e fixo), porque regras de negocio exigem imutabilidade de certos dados
3. **Use query params para filtros opcionais** — `GET /tickets?status=open` em vez de rotas separadas, porque mantem a API extensivel sem multiplicar endpoints
4. **Gere IDs automaticamente com UUID** — nunca permita o cliente enviar o ID, porque evita colisoes e garante unicidade
5. **Use o metodo HTTP correto** — POST cria, GET lista, PUT atualiza dados, PATCH atualiza status, DELETE remove, porque semantica HTTP correta torna a API previsivel

## Rotas

### POST /tickets (Criar)
```typescript
// Body: { equipment, description, username }
// Response: ticket criado com ID gerado (UUID)
// username e obrigatorio na criacao mas imutavel depois
```

### GET /tickets (Listar com filtro)
```typescript
// Query params opcionais: ?status=open | ?status=closed
// Sem query param: retorna todos os tickets
// Response: array de tickets
```

### PUT /tickets/:id (Atualizar dados)
```typescript
// Body: { equipment, description }
// username NAO pode ser alterado — regra de negocio
// Param: id (UUID)
```

### PATCH /tickets/:id/status (Fechar ticket)
```typescript
// Sem body — a rota transiciona o status para "closed"
// Param: id (UUID)
// Separado do PUT porque e uma transicao de estado, nao edicao de dados
```

### DELETE /tickets/:id (Remover)
```typescript
// Param: id (UUID)
// Remove permanentemente o registro
// Diferente de fechar: fechar muda status, deletar remove
```

## Example

**Before (rotas mal projetadas):**
```typescript
// Mistura update de dados com transicao de status
app.put('/tickets/:id', (req, res) => {
  const { equipment, description, username, status } = req.body
  // Qualquer campo pode ser alterado — perigoso
})
```

**After (com esta skill aplicada):**
```typescript
// Update de dados — campos restritos
app.put('/tickets/:id', (req, res) => {
  const { equipment, description } = req.body
  // username nao e extraido — imutavel por regra de negocio
})

// Transicao de status — rota dedicada
app.patch('/tickets/:id/status', (req, res) => {
  // Apenas fecha o ticket, sem alterar dados
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo deve ser imutavel apos criacao | Aceite no POST, ignore no PUT |
| Listagem precisa de filtro | Query param opcional, nunca rota separada |
| Operacao muda estado (aberto→fechado) | PATCH com rota dedicada `/status` |
| Operacao muda dados (equipamento, descricao) | PUT no recurso principal |
| Remocao permanente vs encerramento | DELETE remove, PATCH /status encerra |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `PUT /tickets/:id` com status no body | `PATCH /tickets/:id/status` para transicao |
| Permitir cliente enviar ID na criacao | Gerar UUID automaticamente no servidor |
| `GET /tickets/open` e `GET /tickets/closed` | `GET /tickets?status=open` com query param |
| Permitir alterar username no PUT | Extrair apenas `equipment` e `description` do body |
| Usar mesmo endpoint para deletar e fechar | DELETE remove, PATCH /status fecha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre decisoes de design da API
- [code-examples.md](references/code-examples.md) — Todos os exemplos de rotas expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0401-conhecendo-o-projeto-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0401-conhecendo-o-projeto-mkv-mp-4/references/code-examples.md)
