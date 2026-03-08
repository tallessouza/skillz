# Code Examples: Validação de Dados da Solicitação com Zod

## Exemplo 1: Schema completo da solicitação de reembolso

```typescript
import { z } from "zod"

// Enum extraído para melhor legibilidade
const categoriesEnum = z.enum([
  "food",
  "order",
  "service",
  "transport",
  "accommodation",
])

// Schema de validação do body
const bodyScheme = z.object({
  name: z.string().trim().min(1, "Informe o nome da solicitação"),
  category: categoriesEnum,
  amount: z.number().positive("O valor precisa ser positivo"),
  fileName: z.string().min(20),
})
```

## Exemplo 2: Controller com validação integrada

```typescript
import { Request, Response } from "express"
import { z } from "zod"

const categoriesEnum = z.enum([
  "food",
  "order",
  "service",
  "transport",
  "accommodation",
])

class RefundController {
  async create(request: Request, response: Response) {
    const bodyScheme = z.object({
      name: z.string().trim().min(1, "Informe o nome da solicitação"),
      category: categoriesEnum,
      amount: z.number().positive("O valor precisa ser positivo"),
      fileName: z.string().min(20),
    })

    const { name, category, amount, fileName } = bodyScheme.parse(request.body)

    // Prosseguir com os dados validados...
    return response.json({ name, category, amount, fileName })
  }
}

export { RefundController }
```

## Exemplo 3: Payloads de teste (Insomnia/Postman)

### Body válido
```json
{
  "name": "Troca de peça",
  "category": "service",
  "amount": 150.25,
  "fileName": "2024-01-15_143022_a8f3b2c1_comprovante.png"
}
```

### Categoria inválida
```json
{
  "name": "Troca de peça",
  "category": "x",
  "amount": 150.25,
  "fileName": "2024-01-15_143022_a8f3b2c1_comprovante.png"
}
```
**Resposta do Zod:** lista todas as categorias válidas e informa que "x" não é uma delas.

### Valor negativo
```json
{
  "name": "Troca de peça",
  "category": "service",
  "amount": -1,
  "fileName": "2024-01-15_143022_a8f3b2c1_comprovante.png"
}
```
**Resposta:** "O valor precisa ser positivo"

### Valor zero
```json
{
  "name": "Troca de peça",
  "category": "service",
  "amount": 0,
  "fileName": "2024-01-15_143022_a8f3b2c1_comprovante.png"
}
```
**Resposta:** "O valor precisa ser positivo" — `.positive()` rejeita zero (exige > 0)

### Body vazio
```json
{}
```
**Resposta:** Todas as validações disparam simultaneamente.

## Exemplo 4: Variação — enum inline (para poucos valores)

```typescript
// Quando o enum tem poucos valores, pode ficar inline
const bodyScheme = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  priority: z.enum(["low", "medium", "high"]),
})
```

## Exemplo 5: Variação — validações adicionais comuns

```typescript
const bodyScheme = z.object({
  // Email
  email: z.string().email("Informe um email válido"),

  // Número com range
  quantity: z.number().int().min(1, "Quantidade mínima é 1").max(100),

  // String com tamanho máximo
  description: z.string().trim().min(1).max(500, "Descrição muito longa"),

  // Data como string ISO
  date: z.string().datetime("Informe uma data válida"),

  // Opcional com default
  notes: z.string().optional().default(""),
})
```

## Exemplo 6: Tratamento de erro do parse

```typescript
import { ZodError } from "zod"

try {
  const data = bodyScheme.parse(request.body)
} catch (error) {
  if (error instanceof ZodError) {
    // error.errors contém array com cada validação que falhou
    return response.status(400).json({
      message: "Dados inválidos",
      errors: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    })
  }
}
```

## Exemplo 7: safeParse (alternativa sem throw)

```typescript
const result = bodyScheme.safeParse(request.body)

if (!result.success) {
  return response.status(400).json({
    message: "Dados inválidos",
    errors: result.error.errors,
  })
}

// result.data tem tipagem correta
const { name, category, amount, fileName } = result.data
```