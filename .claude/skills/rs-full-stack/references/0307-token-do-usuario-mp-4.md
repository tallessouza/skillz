---
name: rs-full-stack-0307-token-do-usuario
description: "Enforces JWT token generation and sensitive data exclusion patterns when building authentication endpoints in Node.js APIs. Use when user asks to 'generate a token', 'implement JWT auth', 'return user without password', 'create login endpoint', or 'configure authentication'. Applies rules: centralized auth config, sign tokens with subject/expiration, destructure to exclude sensitive fields from responses. Make sure to use this skill whenever implementing authentication flows or returning user data from APIs. Not for frontend token storage, OAuth flows, or session-based auth."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [jwt, authentication, jsonwebtoken, security, destructuring, api]
---

# Token do Usuário — JWT e Exclusão de Dados Sensíveis

> Gere tokens JWT a partir de configuração centralizada e nunca retorne dados sensíveis na resposta.

## Rules

1. **Centralize configuração de auth** — crie `src/configs/auth.ts` com secret e expiresIn, porque centralizar evita magic strings espalhadas pelo código
2. **Use subject para identificar o usuário no token** — passe `user.id` no campo `subject` do JWT, porque é o claim padrão para identificação do portador
3. **Inclua expiração no token** — sempre defina `expiresIn` (ex: `"1d"`), porque tokens sem expiração são vulnerabilidade permanente
4. **Nunca retorne senha na resposta** — use destructuring para separar `password` do restante, porque dados sensíveis vazados comprometem a segurança
5. **Organize imports em escadinha** — agrupe imports por domínio (configs, libs, models), porque facilita leitura e manutenção
6. **Fixe versões de dependências de segurança** — instale jsonwebtoken com versão exata, porque updates automáticos em libs de auth podem quebrar ou introduzir vulnerabilidades

## How to write

### Configuração centralizada de auth

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: "your-secret-here",
    expiresIn: "1d",
  },
};
```

### Geração do token

```typescript
import { sign } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

const { secret, expiresIn } = authConfig.jwt;

const token = sign({ role: user.role }, secret, {
  subject: user.id,
  expiresIn,
});
```

### Exclusão de dados sensíveis com destructuring

```typescript
const { password, ...userWithoutPassword } = user;

return { token, user: userWithoutPassword };
```

## Example

**Before (dados sensíveis expostos):**
```typescript
const token = sign({ role: user.role }, "hardcoded-secret", {
  subject: user.id,
});

return { token, user };
// user contém password no retorno!
```

**After (com esta skill aplicada):**
```typescript
import { sign } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

const { secret, expiresIn } = authConfig.jwt;

const token = sign({ role: user.role }, secret, {
  subject: user.id,
  expiresIn,
});

const { password, ...userWithoutPassword } = user;

return { token, user: userWithoutPassword };
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Endpoint retorna dados do usuário | Sempre excluir password via destructuring |
| Múltiplos campos sensíveis | Desestruture todos: `const { password, cpf, ...safe } = user` |
| Token precisa de claims customizados | Passe no primeiro argumento do `sign()`, nunca no subject |
| Secret em produção | Use variável de ambiente, nunca hardcode |
| Expiração do token | Use strings do jsonwebtoken: `"1d"`, `"2h"`, `"30m"` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `sign({}, "secret-hardcoded")` | `sign({}, authConfig.jwt.secret, { expiresIn })` |
| `return { token, user }` (com password) | `const { password, ...safe } = user; return { token, user: safe }` |
| `sign({ sub: user.id })` | `sign({}, secret, { subject: user.id })` |
| Secret e expiração espalhados em vários arquivos | Centralizar em `src/configs/auth.ts` |
| `delete user.password` (mutação) | Destructuring spread (imutável) |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `Cannot find module 'jsonwebtoken'` | Pacote não instalado | `npm i jsonwebtoken && npm i -D @types/jsonwebtoken` |
| Token retorna `JsonWebTokenError: secret or public key must be provided` | Secret é undefined | Verificar que `authConfig.jwt.secret` está definido em `src/configs/auth.ts` |
| Resposta da API inclui hash da senha | User inteiro retornado sem excluir password | Usar `const { password, ...safe } = user` antes de retornar |
| Token expira muito rápido ou nunca expira | `expiresIn` não configurado corretamente | Definir `expiresIn: "1d"` na config centralizada |
| `delete user.password` causa efeito colateral | Mutação direta no objeto original | Usar destructuring spread (imutável) em vez de delete |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre JWT claims, segurança de tokens e padrões de exclusão de dados
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários reais