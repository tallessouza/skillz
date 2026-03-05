---
name: rs-full-stack-tratando-requisicao
description: "Enforces request validation patterns in Node.js REST APIs using custom AppError class. Use when user asks to 'validate request', 'check required fields', 'handle bad request', 'create endpoint', or 'add input validation'. Applies rules: validate before processing, use custom AppError with default status codes, distinguish app errors from server errors, combine related validations. Make sure to use this skill whenever creating or modifying API endpoints that receive user input. Not for authentication middleware, database validation, or frontend form validation."
---

# Tratando Requisicao — Validacao de Input em APIs REST

> Valide todos os campos obrigatorios no controller antes de processar a requisicao, lancando AppError com mensagens especificas.

## Rules

1. **Valide no inicio do controller** — verifique campos obrigatorios antes de qualquer logica de negocio, porque processar dados invalidos desperdiça recursos e gera erros confusos
2. **Use AppError para erros de aplicacao** — `throw new AppError("mensagem")` diferencia erros tratados (seus) de erros genericos (servidor), porque o middleware de erro precisa saber se deve retornar sua mensagem ou uma generica
3. **Aproveite valores padrao** — omita o status code quando for 400 (bad request), porque o padrao ja esta definido na classe AppError e economiza codigo
4. **Passe status code apenas quando diferente** — informe explicitamente apenas para codigos como 401, 404, 409, porque o padrao 400 cobre a maioria dos erros de validacao
5. **Agrupe validacoes relacionadas** — combine campos obrigatorios no mesmo if com `||`, porque evita multiplos ifs para a mesma acao (rejeitar requisicao incompleta)
6. **Distinga erro de app vs erro de servidor** — `instanceof AppError` = erro tratado (status especifico), outros erros = 500 interno, porque o cliente precisa saber se o erro e culpa dele ou do servidor

## How to write

### Validacao simples (campo unico)

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name) {
    throw new AppError("Nome do produto é obrigatório")
    // Status 400 automatico — padrao da classe AppError
  }

  // ... logica de criacao
}
```

### Validacao agrupada (multiplos campos)

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name || !price) {
    throw new AppError("Nome e preço do produto são obrigatórios")
  }

  // ... logica de criacao
  return response.status(201).json({ name, price })
}
```

### Status code customizado (quando diferente de 400)

```typescript
if (!userToken) {
  throw new AppError("Não autorizado", 401)
}
```

## Example

**Before (sem validacao):**

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body
  // Aceita qualquer coisa, ate campos vazios
  return response.status(201).json({ name, price })
}
```

**After (com validacao via AppError):**

```typescript
async create(request: Request, response: Response) {
  const { name, price } = request.body

  if (!name || !price) {
    throw new AppError("Nome e preço do produto são obrigatórios")
  }

  return response.status(201).json({ name, price })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo obrigatorio ausente | `throw new AppError("campo X é obrigatório")` sem status code |
| Acesso nao autorizado | `throw new AppError("mensagem", 401)` |
| Recurso nao encontrado | `throw new AppError("mensagem", 404)` |
| Multiplos campos obrigatorios | Agrupe com `\|\|` em um unico if |
| Erro que voce NAO tratou | Deixe o middleware capturar como 500 |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Processar sem validar campos obrigatorios | Validar antes de qualquer logica |
| `throw new Error("msg")` para erro de input | `throw new AppError("msg")` para diferenciar |
| `throw new AppError("msg", 400)` | `throw new AppError("msg")` — 400 e o padrao |
| Um if separado para cada campo obrigatorio | `if (!name \|\| !price)` agrupado |
| Retornar 200 para criacao bem sucedida | Retornar 201 (created) |
| Retornar mensagem generica "erro interno" para input invalido | Retornar mensagem especifica do campo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de erros de app vs servidor, valores padrao em classes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes de status code e validacao