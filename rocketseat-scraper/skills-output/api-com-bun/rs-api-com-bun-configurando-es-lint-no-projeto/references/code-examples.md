# Code Examples: Configurando ESLint com Drizzle Plugin

## 1. Instalacao completa

```bash
# Instalar ESLint e config da Rocketseat
bun add -d eslint @rocketseat/eslint-config

# Instalar plugin do Drizzle
bun add -d eslint-plugin-drizzle

# Garantir TypeScript como devDependency (fix para Bun)
bun add -d typescript
```

## 2. .eslintrc.json completo

```json
{
  "extends": [
    "@rocketseat/eslint-config/node",
    "plugin:drizzle/all"
  ],
  "plugins": ["drizzle"]
}
```

## 3. package.json — script de lint

```json
{
  "scripts": {
    "lint": "eslint --fix src --ext ts"
  }
}
```

Execucao:

```bash
bun lint
```

## 4. Seed file com regra desabilitada

```typescript
import { db } from './db'
import { users, organizations } from './schema'

async function seed() {
  // eslint-disable drizzle/enforce-delete-with-where
  await db.delete(users)
  // eslint-disable drizzle/enforce-delete-with-where
  await db.delete(organizations)

  // Re-popular tabelas
  await db.insert(users).values([
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' },
  ])
}

seed()
```

## 5. Codigo de producao — com where obrigatorio

```typescript
import { eq } from 'drizzle-orm'
import { db } from './db'
import { users } from './schema'

// DELETE seguro — ESLint nao reclama
await db.delete(users).where(eq(users.id, userId))

// UPDATE seguro — ESLint nao reclama
await db.update(users)
  .set({ active: false })
  .where(eq(users.organizationId, orgId))
```

## 6. Fix para erro "cannot find module typescript"

Se aparecer o erro:

```
Failed to load plugin TypeScript as declared — cannot find module TypeScript
```

Verificar `package.json`:

```json
{
  "peerDependencies": {
    "typescript": "^5.0.0"  // ← PROBLEMA: remover daqui
  }
}
```

Fix:

```bash
# Remover de peerDependencies (editar package.json manualmente)
# Depois instalar como devDependency
bun add -d typescript
```

## 7. Rodando ESLint manualmente (sem script)

```bash
# Com bun
bun x eslint --fix src --ext ts

# Ou apenas
bun eslint --fix src --ext ts
```