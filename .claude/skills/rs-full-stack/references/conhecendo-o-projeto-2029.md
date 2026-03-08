---
name: rs-full-stack-conhecendo-o-projeto-2029
description: "Applies delivery API domain modeling when designing multi-role REST APIs with order tracking, status workflows, and movement logs. Use when user asks to 'build a delivery API', 'create order tracking', 'implement delivery status', 'design shipment workflow', or 'model delivery domain'. Guides entity design, role-based access (seller/customer), status state machines, and movement audit trails. Make sure to use this skill whenever architecting delivery or logistics APIs. Not for frontend UI, payment processing, or notification systems."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-rest
  tags: [express, api, delivery, rbac, state-machine, audit-trail]
---

# Delivery API — Domain Model & Architecture

> Modele a API de entregas com perfis de acesso (vendedor/cliente), status de pedido como máquina de estados, e registro de movimentações como audit trail.

## Key concept

Uma API de entregas gira em torno de três eixos: **perfis com níveis de acesso** (quem pode fazer o quê), **status como máquina de estados** (processando → enviado → entregue), e **movimentações como log de auditoria** (cada transição de status gera um registro rastreável).

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Dois tipos de usuário com permissões diferentes | User roles com RBAC — vendedor envia, cliente acompanha |
| Entidade com ciclo de vida (processando → enviado → entregue) | Status como máquina de estados com transições válidas |
| Necessidade de rastrear "o que aconteceu" | Tabela de movimentações (audit trail) vinculada à entrega |
| Pedido pertence a um usuário | Relacionamento delivery → user com foreign key |
| Cliente quer saber status em tempo real | Endpoint de consulta de movimentações por entrega |

## Domain entities

### User (com role)
```typescript
// Dois perfis: seller (vendedor) e customer (cliente)
// O role determina o nível de acesso na API
interface User {
  id: string
  name: string
  role: 'seller' | 'customer'
}
```

### Delivery (pedido/entrega)
```typescript
// Uma delivery pertence a um customer e é criada por um seller
// Status segue máquina de estados: processing → shipped → delivered
interface Delivery {
  id: string
  sellerId: string
  customerId: string
  status: 'processing' | 'shipped' | 'delivered'
}
```

### DeliveryMovement (movimentação)
```typescript
// Cada mudança de status gera uma movimentação
// Permite ao usuário acompanhar o histórico completo
interface DeliveryMovement {
  id: string
  deliveryId: string
  description: string
  createdAt: Date
}
```

## Status state machine

```
processing ──→ shipped ──→ delivered
    │                         
    └── Cada transição registra uma movimentação
```

| De | Para | Quem executa | Movimentação gerada |
|----|------|-------------|-------------------|
| (novo) | processing | seller | "Pedido criado e em processamento" |
| processing | shipped | seller | "Produto saiu para entrega" |
| shipped | delivered | seller | "Produto entregue ao destinatário" |

## Access control by role

| Operação | Seller | Customer |
|----------|--------|----------|
| Criar entrega | Sim | Não |
| Atualizar status | Sim | Não |
| Listar suas entregas | Sim (as que criou) | Sim (as que recebeu) |
| Ver movimentações | Sim | Sim |

## How to structure

### Routes
```
POST   /deliveries              — seller cria entrega
GET    /deliveries              — lista entregas (filtrada por role)
PATCH  /deliveries/:id/status   — seller atualiza status
GET    /deliveries/:id/movements — ambos consultam movimentações
```

## Heuristics

| Situação | Fazer |
|----------|-------|
| Novo status de entrega | Adicionar ao enum E criar transição válida na state machine |
| Precisa saber "quando mudou" | Consultar tabela de movimentações, não o campo status |
| Vendedor tenta acessar entrega de outro vendedor | Retornar 403 — filtrar por sellerId |
| Cliente tenta atualizar status | Retornar 403 — apenas seller pode alterar |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Status como string livre sem validação | Enum com transições válidas definidas |
| Atualizar status sem registrar movimentação | Sempre criar movimentação junto com mudança de status |
| Mesmo endpoint sem verificar role | Middleware de autorização por role antes do controller |
| Guardar histórico no próprio campo status | Tabela separada de movimentações com timestamps |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Cliente consegue alterar status | Middleware de autorizacao nao verifica role | Adicione middleware que valida `user.role === 'seller'` antes do controller |
| Transicao de status invalida aceita | Falta validacao de state machine | Valide que a transicao e permitida (ex: `processing` so pode ir para `shipped`) |
| Movimentacao nao registrada | Update de status nao cria registro na tabela de movements | Use transacao para atualizar status E inserir movimentacao atomicamente |
| Vendedor ve entregas de outro vendedor | Filtro por `sellerId` ausente na query | Adicione `WHERE seller_id = :currentUserId` na listagem |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre domain modeling, analogias e decisões arquiteturais
- [code-examples.md](references/code-examples.md) — Exemplos de código expandidos com variações