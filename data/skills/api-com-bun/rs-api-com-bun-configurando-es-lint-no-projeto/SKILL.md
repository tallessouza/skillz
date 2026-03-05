---
name: rs-api-com-bun-configurando-eslint
description: "Applies ESLint setup with Skillz config and Drizzle plugin in Bun/Node TypeScript projects. Use when user asks to 'configure eslint', 'setup linting', 'add eslint to project', 'configure drizzle eslint', or 'prevent dangerous queries'. Ensures safe Drizzle queries by blocking delete/update without where clause. Make sure to use this skill whenever setting up a new TypeScript API project with Drizzle ORM. Not for frontend React/Next.js eslint configs or Prettier-only setups."
---

# Configurando ESLint com Skillz Config + Drizzle Plugin

> Configure ESLint com regras da Skillz e protecao contra queries perigosas do Drizzle ORM.

## Rules

1. **Instale typescript como devDependency, nunca como peerDependency** — porque o Bun pode colocar TypeScript como peer dependency automaticamente, o que quebra o ESLint com erro "cannot find module typescript"
2. **Use eslint-plugin-drizzle em todo projeto com Drizzle ORM** — porque ele bloqueia `delete` e `update` sem `where`, evitando apagar/alterar tabelas inteiras acidentalmente
3. **Desabilite regras com comentario inline apenas na linha necessaria** — `// eslint-disable drizzle/enforce-delete-with-where` apenas onde faz sentido (ex: seed files), nunca desabilite o ESLint como um todo
4. **Crie um script `lint` no package.json** — porque rodar `eslint --fix src --ext ts` manualmente e propenso a erro

## How to write

### Instalacao

```bash
bun add -d eslint @skillz/eslint-config eslint-plugin-drizzle
# Garantir que typescript esta como devDependency
bun add -d typescript
```

### .eslintrc.json

```json
{
  "extends": [
    "@skillz/eslint-config/node",
    "plugin:drizzle/all"
  ],
  "plugins": ["drizzle"]
}
```

### Script no package.json

```json
{
  "scripts": {
    "lint": "eslint --fix src --ext ts"
  }
}
```

### Desabilitar regra pontualmente (seed files)

```typescript
// eslint-disable drizzle/enforce-delete-with-where
await db.delete(users)
```

## Example

**Before (perigoso — sem plugin drizzle):**
```typescript
// Nenhum aviso — apaga TODOS os registros da tabela
await db.delete(users)
await db.update(users).set({ active: false })
```

**After (com eslint-plugin-drizzle):**
```typescript
// ESLint erro: drizzle/enforce-delete-with-where
await db.delete(users) // ← BLOQUEADO

// Correto:
await db.delete(users).where(eq(users.id, userId))
await db.update(users).set({ active: false }).where(eq(users.orgId, orgId))
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo projeto TypeScript com Drizzle | Instalar eslint + skillz config + drizzle plugin |
| Erro "cannot find module typescript" | Mover typescript de peerDependencies para devDependencies |
| Seed file precisa deletar tudo | Desabilitar regra especifica com comentario inline |
| Quer rodar lint em todo projeto | Usar `bun lint` (script no package.json) |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `// eslint-disable` (desabilita tudo) | `// eslint-disable drizzle/enforce-delete-with-where` (regra especifica) |
| `db.delete(table)` sem where em codigo de producao | `db.delete(table).where(condition)` |
| typescript como peerDependency com Bun | `bun add -d typescript` como devDependency |
| Rodar eslint manualmente com flags | Script `"lint": "eslint --fix src --ext ts"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
