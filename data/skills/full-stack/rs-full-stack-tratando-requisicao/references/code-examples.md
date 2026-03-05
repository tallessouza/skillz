# Code Examples: Tratando Requisicao

## Exemplo 1: Validacao de campo unico (do transcript)

```typescript
// ProductController.ts
import { AppError } from "../utils/AppError"

class ProductController {
  async create(request: Request, response: Response) {
    const { name, price } = request.body

    if (!name) {
      throw new AppError("Nome do produto é obrigatório")
      // Sem status code → usa padrao 400
    }

    return response.status(201).json({ name, price })
  }
}
```

## Exemplo 2: Com status code customizado

```typescript
if (!name) {
  throw new AppError("Nome do produto é obrigatório", 401)
  // 401 Unauthorized — quando quer um codigo diferente do padrao
}
```

## Exemplo 3: Validacao agrupada (versao final do instrutor)

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name || !price) {
    throw new AppError("Nome e preço do produto são obrigatórios")
  }

  return response.status(201).json({ name, price })
}
```

## Exemplo 4: Middleware de erro (contexto do server.ts)

```typescript
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    // Erro tratado pela aplicacao — mensagem especifica
    return response.status(error.statusCode).json({
      message: error.message
    })
  }

  // Erro generico do servidor — nao expor detalhes
  return response.status(500).json({
    message: "Internal Server Error"
  })
})
```

## Exemplo 5: Classe AppError (referencia)

```typescript
class AppError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: number = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}
```

## Variacao: Validacao com mensagens individuais

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name) {
    throw new AppError("Nome do produto é obrigatório")
  }

  if (!price) {
    throw new AppError("Preço do produto é obrigatório")
  }

  if (price <= 0) {
    throw new AppError("Preço deve ser maior que zero")
  }

  return response.status(201).json({ name, price })
}
```

## Variacao: Diferentes status codes por contexto

```typescript
// 400 — campo obrigatorio (padrao, nao precisa passar)
throw new AppError("Nome é obrigatório")

// 401 — nao autorizado
throw new AppError("Token inválido ou expirado", 401)

// 404 — recurso nao encontrado
throw new AppError("Produto não encontrado", 404)

// 409 — conflito
throw new AppError("Produto com este nome já existe", 409)
```

## Testes no Insomnia (fluxo do instrutor)

```
# Sem nome → 400
POST /product
{ "price": 100 }
→ { "message": "Nome e preço do produto são obrigatórios" } (400)

# Sem preco → 400
POST /product
{ "name": "Produto X" }
→ { "message": "Nome e preço do produto são obrigatórios" } (400)

# Completo → 201
POST /product
{ "name": "Produto X", "price": 100 }
→ { "name": "Produto X", "price": 100 } (201)
```