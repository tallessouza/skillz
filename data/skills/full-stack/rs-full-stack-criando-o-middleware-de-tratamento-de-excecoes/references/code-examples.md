# Code Examples: Middleware de Tratamento de Exceções

## 1. Classe AppError completa

```typescript
// src/utils/appError.ts
export class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}
```

## 2. Error Handling Middleware completo

```typescript
// src/middlewares/error-handling.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/appError"

export function errorHandling(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  // Erro lançado intencionalmente pela aplicação
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    })
  }

  // Erro genérico/inesperado
  return response.status(500).json({
    message: error.message,
  })
}
```

## 3. Registro no server.ts

```typescript
// src/server.ts
import express from "express"
import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const app = express()
const PORT = 3333

app.use(express.json())
app.use(routes)

// Middleware de erro APÓS todas as rotas
app.use(errorHandling)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## 4. Controller lançando AppError (teste do instrutor)

```typescript
// O instrutor testou lançando diretamente no controller:
import { AppError } from "@/utils/appError"

// Teste com status padrão (400)
throw new AppError("Erro de teste")
// Resultado: { "message": "Erro de teste" } com status 400

// Teste com status customizado (501)
throw new AppError("Erro de teste", 501)
// Resultado: { "message": "Erro de teste" } com status 501
```

## 5. Padrão completo em controller real

```typescript
import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/appError"

export class OrdersController {
  index(request: Request, response: Response, next: NextFunction) {
    try {
      const orders = getOrdersFromDatabase()

      if (!orders.length) {
        throw new AppError("Nenhum pedido encontrado", 404)
      }

      return response.json(orders)
    } catch (error) {
      next(error)
    }
  }

  create(request: Request, response: Response, next: NextFunction) {
    try {
      const { product_name, quantity } = request.body

      if (!product_name) {
        throw new AppError("Nome do produto é obrigatório")
        // statusCode padrão: 400
      }

      const order = createOrder({ product_name, quantity })
      return response.status(201).json(order)
    } catch (error) {
      next(error)
    }
  }
}
```

## 6. Variação: AppError em camada de service

```typescript
// src/services/order-service.ts
import { AppError } from "@/utils/appError"

export class OrderService {
  findById(id: string) {
    const order = orderRepository.findById(id)

    if (!order) {
      throw new AppError("Pedido não encontrado", 404)
    }

    if (order.status === "cancelled") {
      throw new AppError("Pedido já foi cancelado", 422)
    }

    return order
  }
}

// O controller não precisa tratar — o middleware captura:
export class OrdersController {
  show(request: Request, response: Response, next: NextFunction) {
    try {
      const order = orderService.findById(request.params.id)
      return response.json(order)
    } catch (error) {
      next(error) // AppError do service é propagado automaticamente
    }
  }
}
```

## 7. StatusCodes comuns com AppError

```typescript
// Validação / Bad Request
throw new AppError("Campo email é obrigatório")              // 400 (padrão)

// Não encontrado
throw new AppError("Usuário não encontrado", 404)

// Não autorizado
throw new AppError("Token inválido ou expirado", 401)

// Proibido
throw new AppError("Sem permissão para acessar este recurso", 403)

// Conflito
throw new AppError("Email já cadastrado", 409)

// Unprocessable
throw new AppError("Pedido já foi finalizado", 422)
```