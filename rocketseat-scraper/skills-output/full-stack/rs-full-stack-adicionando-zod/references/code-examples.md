# Code Examples: Adicionando Zod ao Middleware de Exceções

## 1. Instalação do Zod

```bash
npm install zod@3.23.8
```

## 2. Middleware completo com tratamento de ZodError

```javascript
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError.js'

function errorHandler(error, request, response, next) {
  // Primeiro: erros de validação (Zod)
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'validationError',
      issues: error.format()
    })
  }

  // Segundo: erros de negócio (AppError)
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    })
  }

  // Terceiro: erros não previstos
  return response.status(500).json({
    message: 'Internal Server Error'
  })
}

export { errorHandler }
```

## 3. Exemplo de uso com validação em uma rota

```javascript
import { z } from 'zod'

const createDeliverySchema = z.object({
  recipientName: z.string().min(1),
  address: z.string().min(5),
  productName: z.string().min(1)
})

router.post('/deliveries', (request, response) => {
  // Se a validação falhar, Zod lança ZodError automaticamente
  const { recipientName, address, productName } = createDeliverySchema.parse(request.body)

  // ... lógica de criação
})
```

## 4. Exemplo de resposta formatada do ZodError

Quando o cliente envia um body inválido:

```json
// Request body (inválido)
{
  "recipientName": "",
  "address": "R"
}
```

```json
// Response (400)
{
  "message": "validationError",
  "issues": {
    "_errors": [],
    "recipientName": {
      "_errors": ["String must contain at least 1 character(s)"]
    },
    "address": {
      "_errors": ["String must contain at least 5 character(s)"]
    },
    "productName": {
      "_errors": ["Required"]
    }
  }
}
```

## 5. Variação: validação de parâmetros de rota

```javascript
const deliveryParamsSchema = z.object({
  id: z.string().uuid()
})

router.get('/deliveries/:id', (request, response) => {
  const { id } = deliveryParamsSchema.parse(request.params)

  // ... buscar entrega por id
})
```

## 6. Variação: validação de query strings

```javascript
const listDeliveriesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['pending', 'delivered', 'cancelled']).optional()
})

router.get('/deliveries', (request, response) => {
  const { page, perPage, status } = listDeliveriesQuerySchema.parse(request.query)

  // ... listar entregas com filtros
})
```