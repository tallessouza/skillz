---
name: rs-full-stack-json-web-token
description: "Applies JWT setup and configuration patterns when installing and configuring JSON Web Token in Node.js/TypeScript projects. Use when user asks to 'setup JWT', 'configure authentication', 'install jsonwebtoken', 'add token auth', or 'configure token expiration'. Follows pattern: install package + types, create config file with secret from env + fallback + expiration. Make sure to use this skill whenever setting up JWT in a Node.js backend. Not for token validation logic, middleware implementation, or refresh token strategies."
---

# Configuração de JSON Web Token

> Ao configurar JWT, centralize secret e expiração em um arquivo de config tipado, com fallback seguro para variáveis de ambiente.

## Rules

1. **Instale pacote e tipagem separadamente** — `jsonwebtoken` como dependência e `@types/jsonwebtoken` como devDependency, porque tipagem não vai para produção
2. **Centralize config em arquivo dedicado** — crie `src/configs/auth.ts` com objeto exportado, porque configurações espalhadas são impossíveis de manter
3. **Sempre use fallback para env vars** — `process.env.JWT_SECRET || "default"`, porque a aplicação não deve quebrar se o .env não carregou
4. **Defina expiração explícita** — sempre configure `expiresIn` no config, porque tokens sem expiração são vulnerabilidade de segurança
5. **Agrupe propriedades JWT em objeto aninhado** — `authConfig.jwt.secret`, porque permite expandir auth config com outras estratégias no futuro

## How to write

### Instalação

```bash
npm install jsonwebtoken@9.0.2
npm install -D @types/jsonwebtoken@9.0.6
```

### Arquivo de configuração

```typescript
// src/configs/auth.ts
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "default",
    expiresIn: "1d",
  },
}
```

## Example

**Before (config inline espalhado):**
```typescript
// em cada lugar que usa JWT:
const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" })
const decoded = jwt.verify(token, process.env.JWT_SECRET!)
```

**After (com config centralizado):**
```typescript
import { authConfig } from "@/configs/auth"

const token = jwt.sign(payload, authConfig.jwt.secret, {
  expiresIn: authConfig.jwt.expiresIn,
})
const decoded = jwt.verify(token, authConfig.jwt.secret)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Projeto novo com auth | Crie `src/configs/auth.ts` antes de qualquer lógica de token |
| Secret no código | Mova para `process.env` com fallback |
| Token sem expiração | Adicione `expiresIn` — "1d" é um padrão razoável |
| Múltiplas estratégias de auth | Expanda o objeto `authConfig` com novas chaves |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| `jwt.sign(p, "hardcoded-secret")` | `jwt.sign(p, authConfig.jwt.secret)` |
| `process.env.JWT_SECRET!` direto no código | `authConfig.jwt.secret` com fallback |
| Omitir `expiresIn` | Sempre definir expiração explícita |
| Instalar `@types/jsonwebtoken` como dep normal | Instalar com `-D` (devDependency) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fallback de env vars, expiração de tokens e estrutura de config
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-json-web-token/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-json-web-token/references/code-examples.md)
