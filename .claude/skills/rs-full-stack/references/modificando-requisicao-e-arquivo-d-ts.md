---
name: rs-full-stack-modificando-req-d-ts
description: "Enforces correct patterns for extending Express Request type and modifying requests in middleware. Use when user asks to 'add property to request', 'extend request type', 'create middleware that adds data', 'type augmentation express', or 'declaration merging'. Make sure to use this skill whenever creating Express middleware that attaches data to req or extending Express typings. Not for response modification, error middleware, or non-Express frameworks."
---

# Modificando Request e Arquivos .d.ts no Express

> Ao adicionar propriedades customizadas na requisicao Express, declare a tipagem global com declaration merging para que o TypeScript reconheca a propriedade em toda a aplicacao.

## Rules

1. **Crie arquivos de tipagem em `src/types/`** — `request.d.ts` fica separado do codigo de aplicacao, porque organiza tipagens globais num local previsivel
2. **Use `.d.ts` para tipagem global** — o TypeScript reconhece automaticamente arquivos `.d.ts` como declaracoes de tipo globais, sem necessidade de import
3. **Use `declare namespace Express` para estender Request** — declaration merging junta a interface customizada com a original do Express, porque interfaces de mesmo nome se fundem automaticamente
4. **Exporte a interface dentro do namespace** — `export interface Request { ... }` dentro de `declare namespace Express` e o padrao correto para augmentation
5. **Propriedades opcionais quando o middleware nao roda em todas as rotas** — use `user_id?: string` com `?` porque nem toda rota passa pelo middleware que popula o valor
6. **Middleware atribui, rota consome** — o middleware seta `request.user_id = "valor"`, a rota le `request.user_id`, porque separar responsabilidades facilita testes

## How to write

### Arquivo de tipagem global

```typescript
// src/types/request.d.ts
declare namespace Express {
  export interface Request {
    user_id?: string
  }
}
```

### Middleware que modifica a requisicao

```typescript
// src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express"

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Adiciona propriedade customizada na requisicao
  request.user_id = "123456"

  next()
}
```

### Rota consumindo a propriedade

```typescript
app.get("/products", authMiddleware, (request, response) => {
  return response.json({ user_id: request.user_id })
})
```

## Example

**Before (TypeScript reclama):**
```typescript
// Middleware sem tipagem — erro: Property 'user_id' does not exist on type 'Request'
function myMiddleware(req: Request, res: Response, next: NextFunction) {
  req.user_id = "123456" // TS Error!
  next()
}
```

**After (com declaration merging):**
```typescript
// src/types/request.d.ts
declare namespace Express {
  export interface Request {
    user_id?: string
  }
}

// Middleware — sem erro, TypeScript reconhece user_id
function myMiddleware(req: Request, res: Response, next: NextFunction) {
  req.user_id = "123456" // OK
  next()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Propriedade usada em todas as rotas | Declare como obrigatoria (`user_id: string`) |
| Propriedade usada apenas em rotas com middleware especifico | Declare como opcional (`user_id?: string`) |
| Multiplas propriedades customizadas | Agrupe todas em `src/types/request.d.ts` |
| Precisando estender Response tambem | Mesmo padrao: `export interface Response { ... }` no namespace |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `(req as any).user_id = "123"` | Declare a tipagem em `request.d.ts` |
| Tipagem inline com type assertion em cada uso | Declaration merging global unico |
| `@types/express` modificado em `node_modules/` | Arquivo `.d.ts` no projeto |
| `request["user_id"]` para contornar erro | Tipagem correta com namespace Express |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre namespaces, declaration merging e organizacao de tipos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-modificando-requisicao-e-arquivo-d-ts/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-modificando-requisicao-e-arquivo-d-ts/references/code-examples.md)
