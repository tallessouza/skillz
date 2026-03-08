---
name: rs-full-stack-validando-dados-do-usuario
description: "Enforces Zod schema validation for API request bodies when building Node.js/Express endpoints that receive user input. Use when user asks to 'validate request body', 'add input validation', 'create user registration', 'validate form data', or 'use Zod for validation'. Applies bodySchema.parse(request.body) pattern with z.object, z.string().email(), .min(), and .trim(). Make sure to use this skill whenever creating POST/PUT endpoints that accept user data. Not for frontend form validation, database constraints, or authentication logic."
---

# Validando Dados do Usuário com Zod

> Toda entrada de dados via API deve ser validada com um schema Zod antes de qualquer processamento.

## Rules

1. **Crie um bodySchema antes do handler** — `const bodySchema = z.object({...})`, porque centraliza as regras de validação num único lugar inspecionável
2. **Use `.parse(request.body)` com desestruturação** — `const { name, email, password } = bodySchema.parse(request.body)`, porque valida E extrai os dados num único passo
3. **Aplique `.trim()` em strings de texto livre** — `z.string().trim().min(2)`, porque espaços em branco não contam como conteúdo válido
4. **Use validadores semânticos do Zod** — `.email()` para e-mails, `.min(n)` para comprimento mínimo, porque são mais expressivos que regex manual
5. **Defina mínimos realistas** — nome `.min(2)`, senha `.min(6)`, porque evita dados sem sentido sem bloquear entradas legítimas

## How to write

### Schema de validação para cadastro

```typescript
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})
```

### Validação no controller

```typescript
async function create(request, response) {
  const { name, email, password } = bodySchema.parse(request.body)

  // name, email e password já estão validados aqui
  // prosseguir com a lógica de cadastro
}
```

## Example

**Before (sem validação):**
```typescript
async function create(request, response) {
  const { name, email, password } = request.body
  // Dados podem ser undefined, vazios, ou inválidos
  // Email pode ser "abc", senha pode ser "1"
}
```

**After (com Zod):**
```typescript
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

async function create(request, response) {
  const { name, email, password } = bodySchema.parse(request.body)
  // Se chegou aqui, todos os campos são válidos
  // name tem pelo menos 2 chars (sem espaços), email é válido, senha >= 6 chars
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo de nome/texto livre | `z.string().trim().min(n)` — trim antes do min |
| Campo de e-mail | `z.string().email()` — validação semântica built-in |
| Campo de senha | `z.string().min(6)` — mínimo de 6 caracteres |
| Corpo vazio enviado | Zod retorna lista de erros por campo automaticamente |
| Precisa de mensagem customizada | `.min(6, { message: "Senha deve ter pelo menos 6 caracteres" })` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const { name } = request.body` (sem validação) | `const { name } = bodySchema.parse(request.body)` |
| `if (!name \|\| name.length < 2)` (validação manual) | `z.string().trim().min(2)` |
| `const emailRegex = /.../.test(email)` | `z.string().email()` |
| `z.string().min(2)` sem trim para nomes | `z.string().trim().min(2)` |
| Schema inline dentro do handler | Schema como constante fora do handler |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre escolhas de validação e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações