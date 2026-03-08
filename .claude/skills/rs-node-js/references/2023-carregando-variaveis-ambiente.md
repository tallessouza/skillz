---
name: rs-node-js-2023-variaveis-ambiente
description: "Enforces environment variable loading and validation patterns using dotenv and Zod in Node.js projects. Use when user asks to 'setup env', 'configure environment variables', 'validate env vars', 'create .env file', or 'setup project configuration'. Applies rules: always validate with Zod schema, use safeParse with crash-on-failure, coerce types, provide defaults, export typed env object. Make sure to use this skill whenever setting up environment variables in Node.js/TypeScript projects. Not for frontend env vars, Docker env configuration, or CI/CD secrets management."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: environment-setup
  tags: [nodejs, env, dotenv, zod, validation, typescript, configuration]
---

# Carregando Variáveis Ambiente

> Variáveis ambiente devem ser validadas com schema no boot da aplicação — se a validação falhar, a aplicação não sobe.

## Rules

1. **Sempre crie `.env` e `.env.example`** — `.env` vai no `.gitignore`, `.env.example` vai pro repositório, porque quem clonar o projeto precisa saber quais variáveis configurar
2. **Carregue com `dotenv/config`** — um único import `import 'dotenv/config'` no arquivo de env já carrega tudo para `process.env`
3. **Valide com Zod schema** — defina um `z.object()` com todas as variáveis obrigatórias, porque `process.env` sem validação é bomba-relógio silenciosa
4. **Use `safeParse`, nunca `parse`** — `safeParse` retorna `{ success, error, data }` sem lançar exceção, permitindo formatar o erro antes de crashar
5. **Crash on invalid env** — se `safeParse` falhar, faça `console.error` com `error.format()` e `throw new Error()` no top-level, porque aplicação sem env válido não deve executar
6. **Use `z.coerce` para números** — `PORT` vem como string do `.env`, use `z.coerce.number()` para converter automaticamente
7. **Forneça defaults sensatos** — `NODE_ENV` default `'dev'`, `PORT` default `3333`, porque desenvolvimento local não deve exigir `.env` completo
8. **Exporte objeto tipado** — exporte `env` com os dados validados (`_env.data`), nunca acesse `process.env` diretamente no resto da aplicação

## How to write

### Arquivo de validação (`src/env/index.ts`)

```typescript
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  // DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
```

### Uso no servidor

```typescript
import { env } from './env'

app.listen({ port: env.PORT })
// env.PORT já é number, env.NODE_ENV já é tipado
```

## Example

**Before (acesso direto sem validação):**
```typescript
const port = process.env.PORT || 3333
// port é string | number, sem garantia de tipo
// se DATABASE_URL faltar, descobre só quando query falhar
```

**After (com validação Zod no boot):**
```typescript
import { env } from './env'
// env.PORT é number garantido
// Se DATABASE_URL faltar, aplicação nem sobe
app.listen({ port: env.PORT })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova variável obrigatória (ex: DATABASE_URL) | Adicione ao schema sem `.default()` — força o dev a configurar |
| Variável com valor padrão razoável (PORT) | Use `.default()` no schema |
| Variável que vem como string mas é número | Use `z.coerce.number()` |
| Variável com valores fixos (NODE_ENV) | Use `z.enum([...])` |
| Arquivo `.env.example` | Liste todas as variáveis com valores de exemplo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `process.env.PORT` direto no código | `env.PORT` via módulo validado |
| `parse(process.env)` | `safeParse(process.env)` com tratamento de erro |
| Variável sem validação | Schema Zod com tipo explícito |
| `.env` commitado no git | `.env` no `.gitignore`, `.env.example` commitado |
| `Number(process.env.PORT)` manual | `z.coerce.number()` no schema |
| `if (!process.env.X) throw` por variável | Schema único validando tudo de uma vez |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-carregando-variaveis-ambiente/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-carregando-variaveis-ambiente/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
