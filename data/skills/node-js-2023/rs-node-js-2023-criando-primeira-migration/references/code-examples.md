# Code Examples: Criando Primeira Migration

## Exemplo completo: database.ts

```typescript
// src/database.ts
import { knex as setupKnex, Knex } from 'knex'

// Config separada da instancia — knexfile importa apenas isso
export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  // SQLite nao suporta INSERT DEFAULT VALUES
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

// Instancia do Knex — usada pela aplicacao
export const knex = setupKnex(config)
```

## Exemplo completo: knexfile.ts

```typescript
// knexfile.ts (raiz do projeto)
import { config } from './src/database'

// Exporta apenas config, sem criar conexao
export default config
```

## package.json scripts

```json
{
  "scripts": {
    "knex": "node --no-warnings --loader tsx ./node_modules/.bin/knex"
  }
}
```

### Explicacao do script:
- `node` — executa o Node.js diretamente
- `--no-warnings` — suprime warnings experimentais do loader
- `--loader tsx` — usa TSX para interpretar TypeScript
- `./node_modules/.bin/knex` — caminho do binario do Knex

## Comandos da CLI

```bash
# Ver todos os comandos disponiveis
npm run knex -- -h

# Criar uma migration
npm run knex -- migrate:make create-documents

# Aplicar migrations pendentes
npm run knex -- migrate:latest

# Reverter ultima migration
npm run knex -- migrate:rollback
```

## .gitignore

```gitignore
db/*.db
```

## Estrutura de pastas resultante

```
projeto/
├── db/
│   ├── app.db              # Banco SQLite (gitignored)
│   └── migrations/
│       └── 20230101120000_create-documents.ts
├── src/
│   └── database.ts
├── knexfile.ts
└── package.json
```

## Migration gerada (estrutura vazia)

```typescript
// db/migrations/20230101120000_create-documents.ts
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Criar tabela aqui
}

export async function down(knex: Knex): Promise<void> {
  // Reverter criacao aqui
}
```