---
name: rs-clean-code-comentarios-vs-documentacao
description: "Enforces correct use of comments vs documentation in code. Use when user asks to 'add comments', 'document code', 'explain this code', 'add JSDoc', or any code annotation task. Applies rules: comments explain WHY (limitations, workarounds), never WHAT; documentation belongs in dedicated tools, not inline. Make sure to use this skill whenever generating code with comments or reviewing existing comments. Not for writing actual documentation files, READMEs, or API docs."
---

# Comentarios vs Documentacao

> Comentarios explicam POR QUE algo foi feito de certa forma, nunca O QUE o codigo faz.

## Rules

1. **Comentario != Documentacao** — comentarios inline servem como avisos para o proximo dev, documentacao pertence a ferramentas dedicadas (diagramas, docs separados), porque documentacao em comentarios fica desatualizada e ninguem mantem
2. **Nunca explique O QUE o codigo faz** — se precisa de comentario explicando o que faz, o codigo deveria ser reescrito com nomes melhores, porque o codigo deve ser autoexplicativo
3. **Explique POR QUE algo eh diferente** — comente quando ha workaround, limitacao de biblioteca, bug conhecido ou padrao seguido de forma nao-convencional, porque o proximo dev vai achar que eh erro
4. **Inclua links de referencia** — quando o comentario menciona bug/limitacao, adicione link para issue, PR ou documentacao externa, porque permite ao proximo dev verificar se o problema ja foi resolvido
5. **Nao seja extremista** — nem zero comentarios nem comentario em tudo, porque ambos os extremos prejudicam a manutencao

## How to write

### Comentario valido (workaround documentado)

```typescript
// Using manual date parsing because date-fns v2.x doesn't support
// timezone-aware parsing. See: https://github.com/date-fns/date-fns/issues/1706
const parsedDate = new Date(dateString.replace(' ', 'T') + 'Z')
```

### Comentario valido (limitacao tecnica)

```typescript
// Batching requests in groups of 50 because Supabase PostgREST
// returns 413 for payloads > 1MB. Track: internal#2847
const batches = chunk(records, 50)
```

## Example

**Before (comentario como documentacao — errado):**

```typescript
// This function gets the user from the database
// It receives an ID and returns the user object
// If the user is not found, it returns null
async function getUser(id: string) {
  // Query the database for the user
  const user = await db.users.findUnique({ where: { id } })
  // Return the user or null
  return user ?? null
}
```

**After (codigo autoexplicativo + comentario so quando necessario):**

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
| Padrao implementado de forma nao-convencional | Comentario explicando a razao |
| Codigo complexo dificil de ler | Reescreva o codigo, nao comente |
| Regra de negocio complexa | Documente em ferramenta dedicada (diagrama, wiki), nao em comentario |
| TODO ou FIXME temporario | OK, mas com referencia (ticket/issue) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `// Get user from database` | Nada — o nome da funcao ja diz |
| `// Loop through items` | Nada — o `for` ja diz |
| `// Returns true if valid` | Nada — nomeie a funcao `isValid()` |
| `// TODO: fix this later` | `// TODO(PROJ-123): workaround for X` |
| Blocos de JSDoc explicando o obvio | JSDoc so em APIs publicas/bibliotecas |
| Comentario de 10 linhas sobre regra de negocio | Diagrama de sequencia + link no comentario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
