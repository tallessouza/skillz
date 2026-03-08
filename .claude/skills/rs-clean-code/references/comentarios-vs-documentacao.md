---
name: rs-clean-code-comentarios-vs-documentacao
description: "Enforces correct use of comments vs documentation in code. Use when user asks to 'add comments', 'document code', 'explain this code', 'add JSDoc', or any code annotation task. Applies the WHY-Only Comment Pattern: comments explain WHY (workarounds, limitations, bugs), never WHAT the code does. Make sure to use this skill whenever generating code with comments or reviewing existing comments. Not for writing documentation files, READMEs, or API reference docs."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: premissas-de-escrita
  tags: [comments, documentation, readability, clean-code]
---

# Comentarios vs Documentacao

> Comentarios explicam POR QUE algo foi feito de certa forma, nunca O QUE o codigo faz.

## Rules

1. **Comentario != Documentacao** — comentarios inline sao avisos para o proximo dev, documentacao pertence a ferramentas dedicadas, porque documentacao em comentarios fica desatualizada
2. **Nunca explique O QUE o codigo faz** — reescreva com nomes melhores, porque o codigo deve ser autoexplicativo
3. **Explique POR QUE algo e diferente** — workaround, limitacao, bug conhecido, porque o proximo dev vai achar que e erro
4. **Inclua links de referencia** — link para issue/PR/doc externa, porque permite verificar se o problema ja foi resolvido
5. **Nao seja extremista** — nem zero comentarios nem comentario em tudo, porque ambos os extremos prejudicam

## How to write

### WHY-Only Comment Pattern

```typescript
// Using manual date parsing because date-fns v2.x doesn't support
// timezone-aware parsing. See: https://github.com/date-fns/date-fns/issues/1706
const parsedDate = new Date(dateString.replace(' ', 'T') + 'Z')
```

## Example

**Before (comentario como documentacao):**
```typescript
// This function gets the user from the database
async function getUser(id: string) {
  // Query the database for the user
  const user = await db.users.findUnique({ where: { id } })
  // Return the user or null
  return user ?? null
}
```

**After:**
```typescript
async function getUserById(id: string) {
  // findUnique returns null when not found — no need for try/catch
  // despite what Prisma docs v4.x suggest. Fixed in v5.2+
  return await db.users.findUnique({ where: { id } })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Workaround por bug de biblioteca | Comentario com link para issue |
| Codigo complexo dificil de ler | Reescreva o codigo, nao comente |
| Regra de negocio complexa | Documente em ferramenta dedicada |
| TODO temporario | `// TODO(PROJ-123): workaround for X` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `// Get user from database` | Nada — o nome da funcao ja diz |
| `// Loop through items` | Nada — o `for` ja diz |
| `// TODO: fix this later` | `// TODO(PROJ-123): workaround for X` |

## Troubleshooting

### Comentarios ficam desatualizados
**Symptom:** Comentario diz uma coisa, codigo faz outra
**Cause:** Devs alteram codigo sem atualizar comentario
**Fix:** Use comentarios apenas para POR QUE. Codigo autoexplicativo nunca fica desatualizado.

### Dev remove todos os comentarios "por Clean Code"
**Symptom:** Workarounds perdem contexto
**Cause:** Interpretacao extremista
**Fix:** Comentarios de POR QUE sao valiosos. Nao comente O QUE, comente POR QUE.

## Deep reference library

- [deep-explanation.md](../../../data/skills/clean-code/rs-clean-code-comentarios-vs-documentacao/references/deep-explanation.md) — Ciclo de morte dos comentarios, posicao equilibrada
- [code-examples.md](../../../data/skills/clean-code/rs-clean-code-comentarios-vs-documentacao/references/code-examples.md) — Validos vs invalidos, refatorando comentarios-documentacao
