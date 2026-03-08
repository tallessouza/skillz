# Code Examples: Validando Dados do Usuário com Zod

## Exemplo 1: Schema básico de cadastro (da aula)

```typescript
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})
```

## Exemplo 2: Controller completo com validação

```typescript
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

async function create(request, response) {
  const { name, email, password } = bodySchema.parse(request.body)

  // Dados validados — prosseguir com cadastro
  return response.json({ name, email })
}
```

## Exemplo 3: JSON enviado no Insomnia para teste

### Request que falha (email inválido + senha curta)
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo",
  "password": "12345"
}
```

### Request que passa
```json
{
  "name": "Rodrigo Gonçalves",
  "email": "rodrigo@email.com",
  "password": "123456"
}
```

## Exemplo 4: Evolução do schema — adicionando trim e min ao nome

O instrutor começa sem restrição no nome, depois evolui:

```typescript
// Versão 1: aceita string vazia
name: z.string()

// Versão 2: exige pelo menos 1 caractere
name: z.string().min(1)

// Versão 3: trim + min para evitar espaços
name: z.string().trim().min(1)

// Versão final: mínimo 2 caracteres após trim
name: z.string().trim().min(2)
```

## Exemplo 5: Variações de schemas para outros endpoints

### Schema de login
```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
```

### Schema de atualização de perfil (campos opcionais)
```typescript
const updateProfileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().email().optional(),
})
```

### Schema com mensagens customizadas
```typescript
const bodySchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})
```

## Exemplo 6: Erros retornados pelo Zod (sem body)

Quando `request.body` é `undefined` ou `{}`:

```json
{
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    },
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Required"
    },
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["password"],
      "message": "Required"
    }
  ]
}
```

## Exemplo 7: Testando edge cases no Insomnia

| Input | Resultado | Por quê |
|-------|-----------|---------|
| `{ "name": "" }` | Erro: min 2 | String vazia < 2 chars |
| `{ "name": "  " }` | Erro: min 2 | Trim remove espaços, fica "" |
| `{ "name": "A" }` | Erro: min 2 | 1 char < 2 |
| `{ "name": "AB" }` | Passa | 2 chars >= 2 |
| `{ "email": "abc" }` | Erro: email inválido | Sem @ e domínio |
| `{ "email": "a@b.c" }` | Passa | Formato válido |
| `{ "password": "12345" }` | Erro: min 6 | 5 chars < 6 |
| `{ "password": "123456" }` | Passa | 6 chars >= 6 |