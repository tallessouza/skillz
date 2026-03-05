# Code Examples: Regras de Validação com Zod

## Exemplo 1: Validação manual (ANTES)

O código que o instrutor mostrou como referência da abordagem manual anterior:

```typescript
// Verificar se nome foi informado
if (!name) {
  throw new Error("O nome do produto é obrigatório")
}

// Verificar tamanho mínimo removendo espaços
if (name.trim().length < 6) {
  throw new Error("O nome do produto precisa ter pelo menos 6 caracteres")
}

// Verificar se preço não é negativo
if (price < 0) {
  throw new Error("O preço não pode ser negativo")
}
```

## Exemplo 2: Schema Zod equivalente (DEPOIS)

```typescript
const bodySchema = z.object({
  name: z.string()
    .trim()
    .min(6, { message: "name must be 6 or more characters" }),
  price: z.number()
    .positive({ message: "price must be positive" }),
})
```

## Exemplo 3: Evolução do schema durante a aula

### Passo 1 — Apenas obrigatório
```typescript
const bodySchema = z.object({
  name: z.string(),
  price: z.number(),
})
```

### Passo 2 — Adicionando min sem trim (com bug)
```typescript
const bodySchema = z.object({
  name: z.string()
    .min(6),  // Bug: espaços contam como caracteres
  price: z.number(),
})
```

### Passo 3 — Adicionando trim antes do min
```typescript
const bodySchema = z.object({
  name: z.string()
    .trim()
    .min(6, { message: "name must be 6 or more characters" }),
  price: z.number(),
})
```

### Passo 4 — Adicionando positive ao price
```typescript
const bodySchema = z.object({
  name: z.string()
    .trim()
    .min(6, { message: "name must be 6 or more characters" }),
  price: z.number()
    .positive({ message: "price must be positive" }),
})
```

## Exemplo 4: Usando gte para faixas de valor

```typescript
const bodySchema = z.object({
  price: z.number()
    .gte(10, { message: "price must be greater than or equal to 10" }),
})

// 10 → passa
// 11 → passa
// 9  → falha: "price must be greater than or equal to 10"
```

## Exemplo 5: Variações de validação de string

```typescript
// Email
const schema = z.object({
  email: z.string()
    .trim()
    .email({ message: "invalid email format" }),
})

// URL
const schema = z.object({
  website: z.string()
    .trim()
    .url({ message: "invalid URL format" }),
})

// Combinando múltiplas regras
const schema = z.object({
  username: z.string()
    .trim()
    .min(3, { message: "username must be at least 3 characters" })
    .max(20, { message: "username must be at most 20 characters" }),
})
```

## Exemplo 6: Resposta de erro do Zod

Quando a validação falha, o Zod retorna um objeto com detalhes:

```json
{
  "name": "_errors",
  "issues": [
    {
      "code": "too_small",
      "minimum": 6,
      "type": "string",
      "inclusive": true,
      "message": "name must be 6 or more characters",
      "path": ["name"]
    }
  ]
}
```