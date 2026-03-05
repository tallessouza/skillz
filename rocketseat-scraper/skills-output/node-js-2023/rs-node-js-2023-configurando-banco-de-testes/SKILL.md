---
name: rs-node-js-2023-configurando-banco-de-testes
description: "Enforces test database isolation patterns when writing E2E tests with Node.js, Knex, and Vitest. Use when user asks to 'configure test database', 'setup e2e tests', 'isolate test environment', 'reset database between tests', or 'separate test and dev databases'. Applies rules: separate .env.test file, conditional dotenv loading via NODE_ENV, run migrations in beforeEach, rollback+migrate for full isolation. Make sure to use this skill whenever setting up E2E test infrastructure in Node.js projects. Not for unit tests, mock strategies, or test assertion patterns."
---

# Configurando Banco de Testes para E2E

> Cada teste E2E deve executar contra um banco de dados totalmente zerado, sem interferencia de outros testes ou do ambiente de desenvolvimento.

## Rules

1. **Nunca compartilhe banco entre dev e teste** — crie um banco separado via `.env.test` com URL diferente, porque dados de desenvolvimento interferem nos testes e vice-versa
2. **Carregue variaveis ambiente condicionalmente** — use `process.env.NODE_ENV` (preenchido automaticamente pelo Vitest/Jest como `test`) para decidir qual `.env` carregar, porque isso garante isolamento sem configuracao manual
3. **Resete o banco antes de CADA teste** — execute rollback + migrate no `beforeEach`, nao no `beforeAll`, porque um teste pode criar dados que causam falso negativo em outro
4. **Sempre crie .env.test.example** — coloque no repositorio para que outros devs saibam quais variaveis configurar, porque `.env.test` esta no `.gitignore`
5. **Use execSync para rodar migrations nos testes** — importe de `node:child_process` e execute `npm run knex migrate:rollback --all` seguido de `npm run knex migrate:latest`, porque o banco de teste precisa das tabelas criadas pelas migrations
6. **Aceite que E2E tests sao lentos** — resetar banco a cada teste e lento por natureza, por isso tenha poucos testes E2E mas efetivos (ponta a ponta), porque a maioria dos testes deve ser unitaria

## How to write

### Arquivo .env.test

```bash
DATABASE_URL="./db/test.db"
```

### Carregamento condicional do dotenv

```typescript
// src/env/index.ts
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}
```

### beforeEach com reset completo

```typescript
import { execSync } from 'node:child_process'
import { beforeEach, describe, it } from 'vitest'

describe('Transactions routes', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    // banco totalmente limpo aqui
  })
})
```

## Example

**Before (banco compartilhado, sem isolamento):**
```typescript
// .env — mesmo banco para tudo
// DATABASE_URL="./db/app.db"

import { beforeAll, describe, it } from 'vitest'

describe('Transactions', () => {
  beforeAll(() => {
    execSync('npm run knex migrate:latest')
  })

  it('creates transaction', async () => {
    // dados de testes anteriores ainda no banco
    // dados de desenvolvimento misturados
  })
})
```

**After (com esta skill aplicada):**
```typescript
// .env.test — banco separado
// DATABASE_URL="./db/test.db"

// src/env/index.ts — carregamento condicional
import { config } from 'dotenv'
if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

// test/transactions.spec.ts
import { execSync } from 'node:child_process'
import { beforeEach, describe, it } from 'vitest'

describe('Transactions', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('creates transaction', async () => {
    // banco limpo, sem interferencia
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro setup de testes E2E | Crie `.env.test`, `.env.test.example`, configure dotenv condicional |
| Teste falha com "table does not exist" | Migrations nao rodaram no banco de teste — adicione execSync no beforeEach |
| Testes passam isolados mas falham juntos | Banco nao esta sendo resetado entre testes — use beforeEach, nao beforeAll |
| Testes ficando muito lentos | Reduza quantidade de testes E2E, prefira unitarios para logica de negocio |
| Dados de teste aparecem no banco de dev | Banco nao esta separado — verifique se `.env.test` tem URL diferente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar mesmo DATABASE_URL para dev e teste | Criar `.env.test` com URL separada |
| `beforeAll` para migrations | `beforeEach` com rollback + migrate |
| Setar NODE_ENV manualmente antes de rodar testes | Confiar no Vitest/Jest que seta automaticamente |
| Deletar dados manualmente com DELETE FROM | Rollback completo das migrations |
| Rodar migrations manualmente antes dos testes | `execSync` no beforeEach automatiza o processo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
