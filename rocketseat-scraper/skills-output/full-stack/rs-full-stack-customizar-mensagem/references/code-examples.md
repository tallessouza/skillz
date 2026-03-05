# Code Examples: Customizar Mensagens de Validação com Zod

## Exemplo 1: Schema basico da aula

```typescript
// Schema COM mensagens padrao (antes)
const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
})

// Request sem price:
// { "name": "Product A" }
// Erro: { field: "price", message: "Required" }
```

```typescript
// Schema COM mensagens customizadas (depois)
const createProductSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  price: z.number({ required_error: "price is required" }),
})

// Request sem price:
// { "name": "Product A" }
// Erro: { field: "price", message: "price is required" }
```

## Exemplo 2: Combinando required_error com outras validacoes

```typescript
const createProductSchema = z.object({
  name: z.string({ required_error: "name is required" })
    .min(3, "name must have at least 3 characters"),
  price: z.number({ required_error: "price is required" })
    .positive("price must be positive"),
  description: z.string({ required_error: "description is required" })
    .max(500, "description must have at most 500 characters"),
})
```

## Exemplo 3: Com invalid_type_error

```typescript
const schema = z.object({
  price: z.number({
    required_error: "price is required",
    invalid_type_error: "price must be a number",
  }),
})

// Sem campo: "price is required"
// Campo como string: "price must be a number"
```

## Exemplo 4: Schema de usuario completo

```typescript
const createUserSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  email: z.string({ required_error: "email is required" })
    .email("email must be a valid email address"),
  password: z.string({ required_error: "password is required" })
    .min(8, "password must have at least 8 characters"),
  age: z.number({ required_error: "age is required" })
    .int("age must be an integer")
    .min(18, "must be at least 18 years old"),
})
```

## Exemplo 5: Campos opcionais (sem required_error)

```typescript
const updateProductSchema = z.object({
  name: z.string().min(3, "name must have at least 3 characters").optional(),
  price: z.number().positive("price must be positive").optional(),
})
// Campos opcionais nao precisam de required_error
```

## Exemplo 6: Mensagens em portugues

```typescript
const criarProdutoSchema = z.object({
  nome: z.string({ required_error: "nome é obrigatório" }),
  preco: z.number({ required_error: "preço é obrigatório" })
    .positive("preço deve ser positivo"),
  descricao: z.string({ required_error: "descrição é obrigatória" })
    .max(500, "descrição deve ter no máximo 500 caracteres"),
})
```