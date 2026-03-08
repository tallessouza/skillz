---
name: rs-full-stack-schema-validation
description: "Applies schema validation patterns when validating request data in Node.js/TypeScript APIs. Use when user asks to 'validate request body', 'add validation', 'validate input', 'create schema', or 'validate email/password'. Enforces schema-based validation: define expected shape, property types, formats, and constraints before processing data. Make sure to use this skill whenever implementing input validation in API routes. Not for database-level constraints, frontend form validation, or authentication logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [validation, zod, schema, api, typescript]
---

# Schema Validation

> Toda validação de dados recebidos deve ser baseada em um esquema que descreve a forma esperada dos dados, incluindo propriedades, tipos, formatos e restrições.

## Rules

1. **Defina um esquema antes de processar dados** — nunca valide manualmente com `if/else` encadeados, porque o esquema é declarativo, testável e reutilizável
2. **Valide propriedades E conteúdo** — não basta verificar se o campo existe, valide tipo, formato e restrições (ex: email tem `@` e `.`, senha tem mínimo de caracteres), porque dados presentes podem ser inválidos
3. **Declare expectativas explicitamente** — tipo de dado, formato esperado, tamanho mínimo/máximo, obrigatoriedade — tudo no esquema, porque regras implícitas são invisíveis para outros devs
4. **Rejeite cedo** — valide na entrada da requisição antes de qualquer processamento, porque dados inválidos não devem chegar à lógica de negócio

## How to write

### Schema para validação de request body

```typescript
// Defina o esquema declarativamente — propriedades + regras de conteúdo
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})
```

### Validação na rota

```typescript
// Valide antes de processar — rejeite cedo
app.post('/users', (request, reply) => {
  const result = createUserSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ errors: result.error.issues })
  }

  const { email, password, name } = result.data
  // Prossiga apenas com dados validados
})
```

## Example

**Before (validação manual frágil):**
```typescript
app.post('/users', (request, reply) => {
  const { email, password } = request.body

  if (!email) return reply.status(400).send({ error: 'Email required' })
  if (!password) return reply.status(400).send({ error: 'Password required' })
  if (password.length < 6) return reply.status(400).send({ error: 'Password too short' })

  // Esqueceu de validar formato do email...
  createUser({ email, password })
})
```

**After (schema validation):**
```typescript
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

app.post('/users', (request, reply) => {
  const result = createUserSchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ errors: result.error.issues })
  }

  createUser(result.data)
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Recebendo dados de request body | Crie um esquema com todas as propriedades e suas restrições |
| Campo de email | Valide tipo string + formato email |
| Campo de senha | Valide tipo string + mínimo de caracteres |
| Campo opcional | Marque explicitamente como `.optional()` no esquema |
| Dados entre serviços internos | Ainda valide com esquema — serviços mudam independentemente |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `if (!email) return error` em cadeia | Schema declarativo com todas as regras |
| Validar só presença sem formato | Validar tipo + formato + restrições |
| Validar dentro da lógica de negócio | Validar na entrada, antes do processamento |
| Regras de validação espalhadas pelo código | Um esquema centralizado por operação |


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Zod lanca erro mesmo com dados corretos | Tipo do campo nao corresponde ao schema | Use `z.coerce.number()` para campos que chegam como string |
| Erro nao retorna detalhes uteis | Usando `.parse()` em vez de `.safeParse()` | Use `safeParse` para obter `result.error.issues` com detalhes |
| Validacao nao bloqueia dados invalidos | Schema definido mas nao chamado na rota | Chame `schema.safeParse(request.body)` antes de processar dados |
| Campo opcional causa erro de validacao | Faltou `.optional()` no schema | Adicione `.optional()` ao campo no schema Zod |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogia das formas geométricas e mental model
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações de validação