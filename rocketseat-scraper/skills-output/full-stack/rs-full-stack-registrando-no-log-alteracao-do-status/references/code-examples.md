# Code Examples: Registrando no Log Alteração do Status

## Exemplo 1: Criação do log no DeliveryStatusController

Código demonstrado na aula — após atualizar o status, criar o registro de log:

```javascript
// DeliveryStatusController - trecho de atualização
await prisma.deliveryLog.create({
  data: {
    deliveryId: id,
    description: status,
  },
});
```

## Exemplo 2: Fluxo completo de atualização com log

```javascript
app.patch("/deliveries/:id/status", async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;

  const delivery = await prisma.delivery.findUnique({
    where: { id },
  });

  if (!delivery) {
    return response.status(404).json({ error: "Delivery not found" });
  }

  // Regra: pedido entregue não pode ser alterado
  if (delivery.status === "delivered") {
    return response
      .status(400)
      .json({ error: "Cannot update a delivered order" });
  }

  // Regra: transições devem seguir a ordem correta
  // processing → shipped → delivered
  const validTransitions = {
    processing: ["shipped"],
    shipped: ["delivered"],
  };

  if (!validTransitions[delivery.status]?.includes(status)) {
    return response.status(400).json({
      error: `Cannot transition from ${delivery.status} to ${status}`,
    });
  }

  // Atualizar status
  await prisma.delivery.update({
    where: { id },
    data: { status },
  });

  // Registrar no log
  await prisma.deliveryLog.create({
    data: {
      deliveryId: id,
      description: status,
    },
  });

  return response.json({ message: "Status updated and logged" });
});
```

## Exemplo 3: Listando entrega com logs incluídos

```javascript
app.get("/deliveries/:id", async (request, response) => {
  const { id } = request.params;

  const delivery = await prisma.delivery.findUnique({
    where: { id },
    include: {
      logs: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!delivery) {
    return response.status(404).json({ error: "Delivery not found" });
  }

  return response.json(delivery);
});
```

Resposta esperada:

```json
{
  "id": "uuid-da-entrega",
  "product": "Monitor 4K",
  "status": "delivered",
  "userId": "uuid-do-usuario",
  "logs": [
    {
      "id": "uuid-log-1",
      "deliveryId": "uuid-da-entrega",
      "description": "shipped",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "uuid-log-2",
      "deliveryId": "uuid-da-entrega",
      "description": "O pedido foi coletado",
      "createdAt": "2024-01-15T14:00:00.000Z"
    },
    {
      "id": "uuid-log-3",
      "deliveryId": "uuid-da-entrega",
      "description": "delivered",
      "createdAt": "2024-01-16T09:00:00.000Z"
    }
  ]
}
```

## Exemplo 4: Schema Prisma para DeliveryLog

```prisma
model DeliveryLog {
  id          String   @id @default(uuid())
  deliveryId  String
  description String
  createdAt   DateTime @default(now())

  delivery Delivery @relation(fields: [deliveryId], references: [id])

  @@map("delivery_logs")
}

model Delivery {
  id        String   @id @default(uuid())
  product   String
  status    String   @default("processing")
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User          @relation(fields: [userId], references: [id])
  logs DeliveryLog[]

  @@map("deliveries")
}
```

## Exemplo 5: Teste do fluxo completo (demonstrado na aula)

Sequência de operações testadas pelo instrutor no Insomnia:

```bash
# 1. Criar pedido
POST /deliveries
{ "userId": "uuid-usuario", "product": "Monitor 4K" }
# → status: "processing"

# 2. Listar para confirmar
GET /deliveries
# → 2 pedidos, monitor 4K com status "processing"

# 3. Ver detalhes (sem logs ainda)
GET /deliveries/:id
# → logs: []

# 4. Tentar criar log "O pedido foi coletado" direto
POST /delivery-logs
{ "deliveryId": "uuid", "description": "O pedido foi coletado" }
# → Erro: precisa primeiro mudar status para "shipped"

# 5. Atualizar status para "shipped"
PATCH /deliveries/:id/status
{ "status": "shipped" }
# → Log "shipped" registrado automaticamente

# 6. Listar logs
GET /deliveries/:id
# → logs: [{ description: "shipped" }]

# 7. Criar log manual "O pedido foi coletado"
POST /delivery-logs
{ "deliveryId": "uuid", "description": "O pedido foi coletado" }
# → Funciona, pedido já está despachado

# 8. Listar logs novamente
GET /deliveries/:id
# → logs: [{ description: "shipped" }, { description: "O pedido foi coletado" }]

# 9. Atualizar para "delivered"
PATCH /deliveries/:id/status
{ "status": "delivered" }
# → Log "delivered" registrado automaticamente

# 10. Listar logs finais
GET /deliveries/:id
# → logs: [shipped, O pedido foi coletado, delivered]

# 11. Tentar nova operação no pedido entregue
# → Erro: pedido já foi entregue
```

## Variação: Descrições legíveis ao invés de enum

```javascript
const statusDescriptions = {
  shipped: "Pedido despachado para entrega",
  delivered: "Pedido entregue ao destinatário",
};

await prisma.deliveryLog.create({
  data: {
    deliveryId: id,
    description: statusDescriptions[status] || status,
  },
});
```

## Variação: Usando transaction para garantir atomicidade

```javascript
await prisma.$transaction([
  prisma.delivery.update({
    where: { id },
    data: { status },
  }),
  prisma.deliveryLog.create({
    data: {
      deliveryId: id,
      description: status,
    },
  }),
]);
```

Isso garante que se o log falhar, o status também não é atualizado — mantendo consistência entre a entidade e seu histórico.