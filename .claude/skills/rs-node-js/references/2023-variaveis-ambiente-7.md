---
name: rs-node-js-2023-variaveis-ambiente
description: "Applies environment variable configuration patterns when setting up Node.js projects with dotenv. Use when user asks to 'configure env', 'setup environment variables', 'connect database', 'manage secrets', or 'setup dotenv'. Ensures .env/.env.example separation, process.env validation, and gitignore rules. Make sure to use this skill whenever creating or configuring Node.js applications that need environment-specific values. Not for frontend env vars, Docker env configuration, or CI/CD secrets management."
---

# Variáveis de Ambiente no Node.js

> Configurações que mudam entre ambientes (dev, prod, test, staging) devem vir de variáveis de ambiente, nunca hardcoded.

## Rules

1. **Crie um arquivo `.env` na raiz do projeto** — chave=valor, um por linha, porque centraliza toda configuração sensível em um único lugar
2. **Nunca commite o `.env`** — adicione ao `.gitignore` imediatamente, porque contém dados sensíveis como chaves de API e credenciais de banco
3. **Sempre crie `.env.example`** — com as chaves sem valores sensíveis, porque outros devs precisam saber quais variáveis configurar
4. **Valide variáveis obrigatórias no boot** — lance erro se faltarem, porque falhar cedo evita bugs silenciosos em runtime
5. **Use `dotenv` para carregar as variáveis** — importe `dotenv/config` no topo do arquivo que precisa das variáveis, porque o Node não lê `.env` nativamente
6. **Use aspas duplas para valores com caracteres especiais** — `DATABASE_URL="./db/app.db"`, porque evita parsing incorreto

## How to write

### Setup do dotenv

```typescript
// 1. Instalar
// npm install dotenv

// 2. No topo do arquivo que usa as variáveis
import 'dotenv/config'

// 3. Acessar via process.env
const databaseUrl = process.env.DATABASE_URL
```

### Validação de variáveis obrigatórias

```typescript
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found.')
}

// Código abaixo só executa se a variável existe
const connection = knex({
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
})
```

### Estrutura de arquivos

```
project/
├── .env              # Valores reais (IGNORADO no git)
├── .env.example      # Template sem valores sensíveis (COMMITADO)
├── .gitignore        # Contém ".env"
└── src/
    └── database.ts   # import 'dotenv/config'
```

## Example

**Before (hardcoded, inseguro):**
```typescript
const connection = knex({
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
})
```

**After (com variáveis de ambiente):**
```typescript
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found.')
}

const connection = knex({
  client: process.env.DATABASE_CLIENT ?? 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Valor muda entre dev e prod | Variável de ambiente |
| Credencial ou chave de API | Variável de ambiente + nunca commitar |
| Valor fixo que nunca muda | Constante no código é OK |
| Novo dev entra no projeto | `.env.example` deve ter todas as chaves documentadas |
| TypeScript reclama de `undefined` | Valide com `if (!process.env.X) throw new Error(...)` antes de usar |

## Anti-patterns

| Nunca faça | Faça isso |
|------------|-----------|
| Hardcode de connection string | `process.env.DATABASE_URL` |
| Commitar `.env` no git | Adicionar `.env` ao `.gitignore` |
| `.env.example` com valores reais | Chaves sem valores: `API_KEY=` |
| Ignorar variável undefined | `throw new Error('X env not found')` |
| Importar dotenv em cada arquivo | Importar uma vez no entry point ou no arquivo de config |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-variaveis-ambiente-7/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-variaveis-ambiente-7/references/code-examples.md)
