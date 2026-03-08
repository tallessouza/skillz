---
name: rs-full-stack-configurando-a-porta
description: "Enforces environment variable configuration with Zod validation when setting up Node.js server ports, database URLs, or sensitive config. Use when user asks to 'configure environment variables', 'set up .env', 'validate env with Zod', 'change server port', or 'prepare app for deploy'. Applies rules: gitignore .env, provide .env-example, use Zod coerce for port numbers, set defaults for optional vars. Make sure to use this skill whenever configuring server ports or environment variables in Node.js projects. Not for frontend env vars, Docker environment config, or cloud provider secret management."
---

# Configurando Variáveis de Ambiente com Zod

> Variáveis de ambiente definem configurações sensíveis e flexíveis — valide-as com Zod e nunca as exponha no repositório.

## Rules

1. **Nunca commite o `.env`** — adicione ao `.gitignore`, porque ele contém credenciais sensíveis como URLs de banco de dados e secrets
2. **Sempre forneça um `.env-example`** — liste todas as variáveis necessárias sem valores reais, porque orienta outros desenvolvedores sobre o que configurar
3. **Valide variáveis com Zod** — use `z.coerce.number()` para portas, porque o ambiente pode retornar valores como string
4. **Defina valores padrão para variáveis opcionais** — use `.default(3333)` para porta, porque permite rodar sem configuração explícita em desenvolvimento
5. **Porta via variável de ambiente** — nunca fixe a porta no código, porque no deploy você precisa mudar sem alterar o código-fonte

## How to write

### Arquivo env.ts com validação Zod

```typescript
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
```

### Usando env no server.ts

```typescript
import { env } from "./env"

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running on port ${env.PORT}`)
})
```

### Arquivo .env-example

```
DATABASE_URL=
JWT_SECRET=
PORT=
```

## Example

**Before (porta fixa no código):**
```typescript
// server.ts
app.listen({ port: 3333 })
```

**After (porta via variável de ambiente validada):**
```typescript
// env.ts
import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)

// server.ts
import { env } from "./env"

app.listen({ port: env.PORT })
```

## Heuristics

| Situação | Faça |
|----------|------|
| Variável é número (porta, timeout) | Use `z.coerce.number()` porque o ambiente retorna strings |
| Variável tem valor sensato de dev | Use `.default(valor)` para não obrigar a configurar localmente |
| Variável é obrigatória sem padrão | Use `z.string()` sem default — Zod lança erro se ausente |
| Novo projeto clonado do GitHub | Duplique `.env-example` para `.env` e preencha os valores |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `app.listen({ port: 3333 })` | `app.listen({ port: env.PORT })` |
| `process.env.PORT` direto no código | `env.PORT` validado pelo Zod |
| Commitar `.env` no repositório | Adicionar `.env` ao `.gitignore` |
| Projeto sem `.env-example` | Criar `.env-example` com todas as variáveis listadas |
| `Number(process.env.PORT)` manual | `z.coerce.number()` que converte automaticamente |
| Remover variável de ambiente do `.env` e deixar vazia | Remover a linha inteira para usar o default do Zod |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre variáveis de ambiente, .gitignore, e comportamento do Zod coerce
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações