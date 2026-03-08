---
name: rs-full-stack-0305-validando-dados-da-sessions
description: "Enforces Zod validation patterns in session/authentication controllers when building login endpoints, validating email and password fields, or parsing request body data. Use when user asks to 'validate login data', 'create session controller', 'add Zod to auth route', 'validate email and password', or 'parse request body with Zod'. Make sure to use this skill whenever implementing authentication input validation in Express/Node.js APIs. Not for database password comparison, JWT generation, or frontend form validation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [zod, validation, authentication, express, schema, request-body]
---

# Validando Dados da Session com Zod

> Valide os dados de entrada no controller usando Zod schema antes de qualquer operação com o banco de dados.

## Rules

1. **Defina o schema no controller** — crie `bodySchema` com `z.object()` no topo do handler, porque centraliza a validação antes da lógica de negócio
2. **Use `z.string().email()` para e-mail** — inclua mensagem customizada de erro, porque feedback claro acelera debugging do cliente da API
3. **Senha como string simples no login** — não defina `.min()` na senha do login, porque a validação de força pertence ao cadastro; no login, o banco valida se a senha confere
4. **Use `schema.parse(request.body)`** — desestruture o retorno diretamente, porque parse lança ZodError automaticamente se os dados forem inválidos
5. **Separe validação de cadastro vs login** — regras de senha mínima ficam no cadastro, não na session, porque cada endpoint tem requisitos diferentes

## How to write

### Schema de validação para session

```typescript
import { z } from "zod"

const bodySchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string(),
})
```

### Parse e desestruturação no controller

```typescript
const { email, password } = bodySchema.parse(request.body)
```

## Example

**Before (sem validação):**
```typescript
async function create(request, response) {
  const { email, password } = request.body
  // Dados podem ser undefined, null, ou tipo errado
  // Erro só aparece no banco, difícil de debugar
}
```

**After (com Zod validation):**
```typescript
import { z } from "zod"

async function create(request, response) {
  const bodySchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string(),
  })

  const { email, password } = bodySchema.parse(request.body)
  // Dados garantidamente tipados e validados
  // ZodError retorna mensagens claras se inválido
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Endpoint de login/session | `z.string().email()` + `z.string()` para senha |
| Endpoint de cadastro | `z.string().min(6)` para senha (validação de força) |
| Campo obrigatório sem formato especial | `z.string()` simples |
| Mensagem de erro customizada | Passe string como argumento: `.email("E-mail inválido")` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `const { email } = request.body` sem validação | `const { email } = bodySchema.parse(request.body)` |
| `.min(6)` na senha do login | `.string()` simples (banco valida a senha) |
| `z.string().email()` sem mensagem de erro | `z.string().email("E-mail inválido")` |
| Validação manual com if/else | Schema Zod com `.parse()` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `Cannot find module 'zod'` | Zod não instalado | `npm i zod` |
| ZodError não é capturado pelo error handler | Error handler não trata ZodError | Adicionar tratamento de `ZodError` no middleware de erro global |
| Validação de senha rejeita senhas curtas no login | `.min()` aplicado na senha do login | Remover `.min()` da senha no schema de session — validação de força é do cadastro |
| Mensagem de erro genérica em vez de customizada | Sem mensagem no `.email()` | Passar string: `.email("E-mail inválido")` |
| `request.body` é undefined | Express não tem middleware de JSON | Adicionar `app.use(express.json())` antes das rotas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação de validação login vs cadastro
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de session controller com Zod