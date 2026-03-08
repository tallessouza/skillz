---
name: 2023-criando-id-unico-e-universal-uuid
description: "Generates unique identifiers using Node.js native crypto.randomUUID() instead of external libraries or incremental IDs. Use when user asks to 'generate unique IDs', 'create UUIDs', 'assign IDs to entities', or 'replace Math.random for identifiers'. Enforces: use crypto.randomUUID() from node:crypto, never Math.random() or incremental counters for IDs. Make sure to use this skill whenever creating entities or records that need unique identifiers in Node.js. Not for database auto-increment IDs, short URL slugs, or browser-side ID generation."
category: coding-lens
tags: [entities, uuid]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: fundamentos
  tags: [uuid, crypto, randomUUID, entities, node-js, identifiers]
---

# Criando ID Unico e Universal (UUID)

> Ao gerar identificadores unicos em Node.js, use sempre `crypto.randomUUID()` — nativo, sem dependencias, universalmente unico.

## Rules

1. **Use `crypto.randomUUID()`** — importado do modulo `node:crypto`, porque e nativo do Node.js e nao precisa de dependencia externa
2. **Nunca use `Math.random()` para IDs** — porque nao garante unicidade e gera colisoes em escala
3. **Nunca use IDs incrementais em memoria** — `id: 1, 2, 3...` nao funciona em sistemas distribuidos e reinicia com o servidor
4. **Prefira UUID nativo sobre bibliotecas externas** — `ShortUniqueID`, `nanoid` etc so se o tamanho do UUID for um problema real comprovado, porque dependencia extra sem necessidade e custo desnecessario

## How to write

### Importacao e uso basico

```javascript
import { randomUUID } from 'node:crypto'

// Ao criar uma entidade, gere o ID com randomUUID()
const user = {
  id: randomUUID(),
  name,
  email,
}
```

### Em rotas de criacao

```javascript
// POST handler criando recurso
database.push({
  id: randomUUID(),
  ...requestBody,
})
```

## Example

**Before (ID incremental — problema):**
```javascript
const users = []

// Todos os usuarios ficam com id: 1
users.push({ id: 1, name, email })
```

**After (UUID nativo):**
```javascript
import { randomUUID } from 'node:crypto'

const users = []

users.push({ id: randomUUID(), name, email })
// id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando qualquer entidade em memoria | `randomUUID()` |
| Banco de dados com auto-increment nativo | Use o auto-increment do banco |
| UUID muito longo para URL curta | Considere `ShortUniqueID`, mas valide a necessidade real |
| Qualquer uso de `Math.random()` para ID | Substitua por `randomUUID()` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `id: 1` (hardcoded) | `id: randomUUID()` |
| `id: Math.random()` | `id: randomUUID()` |
| `id: users.length + 1` | `id: randomUUID()` |
| `import { v4 } from 'uuid'` (sem necessidade) | `import { randomUUID } from 'node:crypto'` |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
