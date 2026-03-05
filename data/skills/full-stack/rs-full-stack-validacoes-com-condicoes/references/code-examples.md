# Code Examples: Validações com Condições

## Exemplo 1: Validação genérica (ponto de partida)

```typescript
// ❌ Mensagem genérica — não diz qual campo está faltando
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name || !price) {
    return response.status(400).json({ message: "Nome e preço do produto são obrigatórios." })
  }

  // ... criação do produto
}
```

## Exemplo 2: Validação separada por campo

```typescript
// ✅ Cada campo tem sua própria validação e mensagem
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name) {
    return response.status(400).json({ message: "Nome do produto é obrigatório." })
  }

  if (!price) {
    return response.status(400).json({ message: "Preço do produto é obrigatório." })
  }

  // ... criação do produto
}
```

## Exemplo 3: Adicionando validação de tamanho mínimo

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name) {
    return response.status(400).json({ message: "Nome do produto é obrigatório." })
  }

  if (name.length < 6) {
    return response.status(400).json({ message: "Nome do produto precisa ter pelo menos 6 caracteres." })
  }

  if (!price) {
    return response.status(400).json({ message: "Preço do produto é obrigatório." })
  }

  // ... criação do produto
}
```

**Bug descoberto:** `"   "` (espaços) passa na checagem `!name` e pode passar em `.length < 6`.

## Exemplo 4: Corrigindo com trim()

```typescript
if (!name) {
  return response.status(400).json({ message: "Nome do produto é obrigatório." })
}

// trim() remove espaços antes e depois, evitando que "   " passe
if (name.trim().length < 6) {
  return response.status(400).json({ message: "Nome do produto precisa ter pelo menos 6 caracteres." })
}
```

## Exemplo 5: Validação de valor negativo no preço

```typescript
if (!price) {
  return response.status(400).json({ message: "Preço do produto é obrigatório." })
}

// Sem essa checagem, -700 seria aceito como preço válido
if (price < 0) {
  return response.status(400).json({ message: "Preço do produto não pode ser menor do que zero." })
}
```

**Nota:** Na aula, `price <= 0` também bloqueia zero, que o instrutor considera inválido para produtos.

## Exemplo 6: Controller completo com todas as validações

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name) {
    return response.status(400).json({ message: "Nome do produto é obrigatório." })
  }

  if (name.trim().length < 6) {
    return response.status(400).json({ message: "Nome do produto precisa ter pelo menos 6 caracteres." })
  }

  if (!price && price !== 0) {
    return response.status(400).json({ message: "Preço do produto é obrigatório." })
  }

  if (price <= 0) {
    return response.status(400).json({ message: "Preço do produto não pode ser menor ou igual a zero." })
  }

  // criação do produto...
  return response.status(201).json({ name, price })
}
```

## Exemplo 7: Padronização de nomes de arquivos

```
# ❌ Inconsistente
ProductController.ts
app-error.ts
ProductRoutes.ts

# ✅ Padronizado (kebab-case)
product-controller.ts
app-error.ts
product-routes.ts
```

Dentro dos arquivos, ajuste os imports:
```typescript
// Antes
import { ProductController } from "./ProductController"
import { AppError } from "./AppError"

// Depois
import { ProductController } from "./product-controller"
import { AppError } from "./app-error"
```

## Variação: Validação para endpoint de usuário (cenário mencionado)

```typescript
// O instrutor menciona que email precisaria de regex
// Isso é exatamente quando schema validation brilha

// Manual (frágil):
if (!email) {
  return res.status(400).json({ message: "Email é obrigatório." })
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return res.status(400).json({ message: "Email inválido." })
}

// Com Zod (próxima aula):
const schema = z.object({
  email: z.string().email("Email inválido."),
  name: z.string().min(6, "Nome precisa ter pelo menos 6 caracteres."),
  price: z.number().positive("Preço deve ser positivo."),
})
```