---
name: rs-full-stack-validando-id-da-sessao
description: "Enforces Zod-based route parameter validation pattern when building Express/Fastify APIs. Use when user asks to 'validate params', 'parse route id', 'convert param to number', 'validate request parameters', or builds any CRUD endpoint with dynamic IDs. Applies z.string().transform().refine() pattern for safe string-to-number conversion. Make sure to use this skill whenever creating API endpoints that receive IDs as route parameters. Not for query string validation, body validation, or frontend form validation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-backend
  tags: [zod, validation, route-params, express, fastify, typescript]
---

# Validando ID de Parametros de Rota com Zod

> Sempre valide e transforme parametros de rota usando Zod antes de qualquer operacao no banco de dados.

## Rules

1. **Use z.string().transform().refine() para IDs de rota** — porque params chegam sempre como string e precisam de conversao segura para number
2. **Valide com isNaN apos transform** — `!isNaN(value)` no refine garante que a conversao foi bem-sucedida, porque `Number("abc")` retorna NaN silenciosamente
3. **Mensagens de erro em ingles e descritivas** — `"id must be a number"`, porque mensagens claras facilitam debug no cliente
4. **Parse direto do request.params** — `z.parse(request.params.id)`, porque isola a validacao antes da logica de negocio
5. **Estruture controllers com try-catch e next** — porque delega tratamento de erro para o middleware central

## How to write

### Validacao de ID com transform + refine

```typescript
const id = z
  .string()
  .transform((value) => Number(value))
  .refine((value) => !isNaN(value), {
    message: "id must be a number",
  })
  .parse(request.params.id)
```

### Controller com validacao

```typescript
async update(request: Request, response: Response, next: NextFunction) {
  try {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), {
        message: "id must be a number",
      })
      .parse(request.params.id)

    // logica de negocio com id ja validado como number
    return response.json({ id })
  } catch (error) {
    next(error)
  }
}
```

### Rota com parametro dinamico

```typescript
router.patch("/sessions/:id", controller.update)
```

## Example

**Before (sem validacao):**
```typescript
async update(request: Request, response: Response) {
  const id = request.params.id // string, pode ser "abc"
  const session = await db.sessions.findById(id) // erro silencioso ou crash
}
```

**After (com Zod transform + refine):**
```typescript
async update(request: Request, response: Response, next: NextFunction) {
  try {
    const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), {
        message: "id must be a number",
      })
      .parse(request.params.id)

    const session = await db.sessions.findById(id) // id e number garantido
    return response.json(session)
  } catch (error) {
    next(error)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| ID numerico em rota | `z.string().transform(Number).refine(!isNaN)` |
| UUID em rota | `z.string().uuid()` direto, sem transform |
| Multiplos params | Crie um schema objeto: `z.object({ id: ..., type: ... }).parse(request.params)` |
| ID opcional | Use `.optional()` antes do transform |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `parseInt(request.params.id)` sem validacao | `z.string().transform(Number).refine(!isNaN).parse(request.params.id)` |
| `Number(request.params.id)` direto | Transform + refine com mensagem de erro |
| `if (!id) return res.status(400)` manual | Zod parse que lanca ZodError automaticamente |
| Validacao inline no meio da logica | Validacao no topo do controller, antes de qualquer operacao |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `ZodError: Expected string, received undefined` | `request.params.id` nao existe na rota | Verifique se a rota tem `/:id` definido |
| Parse retorna NaN sem erro | Usando `z.coerce.number()` sem refine | Use `z.string().transform(Number).refine(!isNaN)` |
| Tipo do id e string apos parse | Schema nao inclui `.transform(Number)` | Adicione transform antes do refine |
| Erro 500 em vez de 400 para id invalido | Nao tem error handler global para ZodError | Configure middleware que captura ZodError e retorna 400 |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre transform vs coerce, pipeline de validacao Zod
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-validando-id-da-sessao/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-validando-id-da-sessao/references/code-examples.md)
