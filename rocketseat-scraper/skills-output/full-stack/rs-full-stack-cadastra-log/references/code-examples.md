# Code Examples: Cadastra Log

## Exemplo completo da aula — Controller de registro de log

```typescript
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

// Schema de validação do body
const bodySchema = z.object({
  delivery_id: z.string().uuid(),
  description: z.string(),
})

// Controller
app.post("/deliveries/log", async (request, response) => {
  // 1. Validação do body
  const { delivery_id, description } = bodySchema.parse(request.body)

  // 2. Verificação de existência
  const delivery = await prisma.delivery.findUnique({
    where: { id: delivery_id },
  })

  if (!delivery) {
    throw new AppError("Delivery not found", 404)
  }

  // 3. Guard de estado — pedido precisa já ter sido enviado
  if (delivery.status === "processing") {
    throw new AppError("Change status to shipped first", 400)
  }

  // 4. Criação do log
  await prisma.deliveryLog.create({
    data: {
      delivery_id,
      description,
    },
  })

  // 5. Resposta 201
  return response.status(201).json()
})
```

## Variação: Log genérico para qualquer entidade

O mesmo pattern se aplica para qualquer sistema de audit trail:

```typescript
// Schema genérico de log
const auditLogSchema = z.object({
  entity_id: z.string().uuid(),
  entity_type: z.string(), // "order", "delivery", "payment"
  action: z.string(),      // "status_changed", "updated", "viewed"
  description: z.string().optional(),
})

app.post("/audit-logs", async (request, response) => {
  const data = auditLogSchema.parse(request.body)

  // Verificação de existência depende do entity_type
  // (em produção, usar um registry de entidades)

  await prisma.auditLog.create({ data })

  return response.status(201).json()
})
```

## Variação: Log com dados estruturados (metadata)

```typescript
const logSchema = z.object({
  delivery_id: z.string().uuid(),
  description: z.string(),
  metadata: z.record(z.unknown()).optional(), // dados extras como coordenadas, temperatura
})

app.post("/deliveries/log", async (request, response) => {
  const { delivery_id, description, metadata } = logSchema.parse(request.body)

  const delivery = await prisma.delivery.findUnique({
    where: { id: delivery_id },
  })

  if (!delivery) {
    throw new AppError("Delivery not found", 404)
  }

  if (delivery.status === "processing") {
    throw new AppError("Change status to shipped first", 400)
  }

  await prisma.deliveryLog.create({
    data: {
      delivery_id,
      description,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  })

  return response.status(201).json()
})
```

## Cenários de teste (baseados na demonstração do instrutor)

```typescript
// Teste 1: Body inválido — sem delivery_id
const response1 = await request(app)
  .post("/deliveries/log")
  .send({ description: "chegou no centro" })
// Espera: 400 (Zod validation error)

// Teste 2: Delivery inexistente
const response2 = await request(app)
  .post("/deliveries/log")
  .send({
    delivery_id: "00000000-0000-0000-0000-000000000000",
    description: "chegou no centro",
  })
// Espera: 404 "Delivery not found"

// Teste 3: Delivery com status "processing"
const response3 = await request(app)
  .post("/deliveries/log")
  .send({
    delivery_id: processingDeliveryId,
    description: "chegou no centro",
  })
// Espera: 400 "Change status to shipped first"

// Teste 4: Sucesso — delivery com status "shipped"
const response4 = await request(app)
  .post("/deliveries/log")
  .send({
    delivery_id: shippedDeliveryId,
    description: "chegou no centro de distribuição",
  })
// Espera: 201

// Teste 5: Múltiplos logs no mesmo delivery
const response5 = await request(app)
  .post("/deliveries/log")
  .send({
    delivery_id: shippedDeliveryId,
    description: "em trânsito para Ribeirão Preto",
  })
// Espera: 201
```

## Imports necessários

```typescript
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
```

## Schema Prisma implícito (relação 1:N)

```prisma
model Delivery {
  id          String        @id @default(uuid())
  status      String        @default("processing")
  // ... outros campos
  logs        DeliveryLog[]
}

model DeliveryLog {
  id          String   @id @default(uuid())
  delivery_id String
  description String
  created_at  DateTime @default(now())

  delivery    Delivery @relation(fields: [delivery_id], references: [id])
}
```