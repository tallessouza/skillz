---
name: rs-full-stack-validando-dados-do-produto
description: "Enforces Zod validation patterns for API request bodies in Node.js/Express routes. Use when user asks to 'validate request', 'create API route', 'add validation', 'create endpoint', or 'validate input data'. Applies body schema with z.object(), parse for extraction, string trim/min, number gt, and proper error propagation. Make sure to use this skill whenever creating POST/PUT/PATCH endpoints that receive JSON body data. Not for frontend form validation, database schema validation, or environment variable validation."
---

# Validacao de Dados com Zod em Rotas API

> Toda rota que recebe dados do cliente deve validar com Zod schema antes de processar, extraindo os campos validados via parse.

## Rules

1. **Defina o schema antes do handler** — `bodySchema = z.object({...})` declarado no topo do controller, porque separa regras de validacao da logica de negocio
2. **Use parse para extrair e validar simultaneamente** — `const { name, price } = bodySchema.parse(request.body)`, porque elimina a necessidade de verificacoes manuais e garante tipos corretos
3. **Strings: sempre trim + min** — `z.string().trim().min(6)`, porque espacos em branco nao contam como conteudo valido
4. **Numeros: use gt(0) ao inves de min(1)** — `z.number().gt(0)`, porque gt exclui o zero enquanto min incluiria o valor limite
5. **Confie nas mensagens padrao do Zod para campos obrigatorios** — nao adicione mensagem customizada para "required", porque o Zod ja gera "Required" automaticamente e e claro o suficiente
6. **Propague erros com next()** — envolva em try/catch e use `next(error)` para o middleware de erro tratar, porque centraliza tratamento de erros

## How to write

### Body schema com Zod

```typescript
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0),
})
```

### Controller com validacao

```typescript
async create(request: Request, response: Response, next: NextFunction) {
  try {
    const { name, price } = bodySchema.parse(request.body)

    // logica de criacao aqui...

    return response.status(201).json({ name, price })
  } catch (error) {
    next(error)
  }
}
```

### Registro da rota

```typescript
productRoutes.post("/", productController.create)
```

## Example

**Before (sem validacao):**
```typescript
async create(request: Request, response: Response, next: NextFunction) {
  try {
    const { name, price } = request.body
    // name pode ser undefined, price pode ser negativo
    return response.status(201).json({ name, price })
  } catch (error) {
    next(error)
  }
}
```

**After (com Zod):**
```typescript
const bodySchema = z.object({
  name: z.string().trim().min(6),
  price: z.number().gt(0),
})

async create(request: Request, response: Response, next: NextFunction) {
  try {
    const { name, price } = bodySchema.parse(request.body)
    return response.status(201).json({ name, price })
  } catch (error) {
    next(error)
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo obrigatorio | Nao adicione mensagem custom — Zod ja diz "Required" |
| Campo string | Sempre `trim()` antes de `min()` |
| Campo numerico que nao pode ser zero | Use `gt(0)` e nao `min(1)` |
| Mensagem de erro padrao ja e clara | Nao sobrescreva — avalie se a default atende |
| Mensagem padrao confusa | Passe `{ message: "texto claro" }` no validador |
| Campos opcionais | Use `.optional()` ou `.nullable()` |
| ID gerado automaticamente | Nao inclua no bodySchema — so valide o que o cliente envia |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `if (!name) throw new Error(...)` | `z.string().trim().min(6)` |
| `if (price <= 0) return res.status(400)...` | `z.number().gt(0)` |
| `const name = request.body.name` sem validacao | `const { name } = bodySchema.parse(request.body)` |
| Validacao espalhada dentro da logica de negocio | Schema declarado antes do handler |
| `z.number().min(1)` para "maior que zero" | `z.number().gt(0)` — semanticamente correto |
| Mensagem custom redundante com a padrao | Confie na mensagem padrao do Zod |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolhas de validacao, parse vs safeParse, e mensagens de erro
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e cenarios de teste