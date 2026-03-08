---
name: rs-full-stack-0401-validacao-dados-solicitacao
description: "Enforces Zod schema validation patterns when validating API request bodies in Express/Node.js applications. Use when user asks to 'validate request data', 'create a schema', 'add input validation', 'validate body params', or 'use Zod in API'. Applies rules: z.object for body schemas, z.enum for fixed categories, .positive() for monetary values, .min() with custom messages, .trim() on strings. Make sure to use this skill whenever implementing request validation or creating Zod schemas in API routes. Not for frontend form validation, database schema design, or authentication logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [zod, validation, schema, express, request-body, enum]
---

# Validação de Dados da Solicitação com Zod

> Valide todos os dados de entrada da API com schemas Zod explícitos, com mensagens descritivas e restrições específicas do domínio.

## Rules

1. **Crie o schema dentro da controller** — `const bodyScheme = z.object({...})` no escopo da função handler, porque mantém a validação colocada junto da rota que a utiliza
2. **Use z.enum para valores fixos** — defina categorias, status e tipos como `z.enum(["food", "service", "transport"])`, porque o Zod gera mensagens automáticas listando valores válidos
3. **Aplique .positive() em valores monetários** — `z.number().positive()`, porque zero e negativos são inválidos para preços e quantias
4. **Sempre adicione mensagens customizadas** — `z.string().min(1, "Informe o nome da solicitação")`, porque mensagens genéricas confundem o usuário da API
5. **Use .trim() antes de .min()** — `z.string().trim().min(1)`, porque espaços em branco não contam como conteúdo válido
6. **Defina enums separadamente quando grandes** — `const categoriesEnum = z.enum([...])` fora do schema, porque melhora legibilidade em enums com muitos valores

## How to write

### Schema de validação completo

```typescript
import { z } from "zod"

const categoriesEnum = z.enum([
  "food",
  "order",
  "service",
  "transport",
  "accommodation",
])

const bodyScheme = z.object({
  name: z.string().trim().min(1, "Informe o nome da solicitação"),
  category: categoriesEnum,
  amount: z.number().positive("O valor precisa ser positivo"),
  fileName: z.string().min(20),
})
```

### Usando o schema na controller

```typescript
async create(request: Request, response: Response) {
  const bodyScheme = z.object({
    name: z.string().trim().min(1, "Informe o nome da solicitação"),
    category: categoriesEnum,
    amount: z.number().positive("O valor precisa ser positivo"),
    fileName: z.string().min(20),
  })

  const { name, category, amount, fileName } = bodyScheme.parse(request.body)
  // prosseguir com dados validados
}
```

## Example

**Before (sem validação):**
```typescript
async create(request: Request, response: Response) {
  const { name, category, amount, fileName } = request.body
  // dados podem ser undefined, negativos, ou categorias inexistentes
  await db.insert({ name, category, amount, fileName })
}
```

**After (com Zod):**
```typescript
async create(request: Request, response: Response) {
  const bodyScheme = z.object({
    name: z.string().trim().min(1, "Informe o nome da solicitação"),
    category: z.enum(["food", "order", "service", "transport", "accommodation"]),
    amount: z.number().positive("O valor precisa ser positivo"),
    fileName: z.string().min(20),
  })

  const { name, category, amount, fileName } = bodyScheme.parse(request.body)
  await db.insert({ name, category, amount, fileName })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo obrigatório de texto | `z.string().trim().min(1, "mensagem")` |
| Conjunto fixo de opções | `z.enum([...])` — Zod lista opções válidas no erro |
| Valor monetário | `z.number().positive("O valor precisa ser positivo")` |
| Nome de arquivo com hash | `z.string().min(20)` — hash gera nomes longos |
| Enum com muitos valores | Extraia para constante separada antes do schema |
| Testar validações | Envie request sem body → todas as validações disparam |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `request.body.name \|\| ""` | `z.string().trim().min(1).parse(request.body.name)` |
| `if (!category) throw ...` | `z.enum([...]).parse(category)` |
| `if (amount <= 0) throw ...` | `z.number().positive().parse(amount)` |
| `z.string()` sem min/trim | `z.string().trim().min(1, "mensagem")` |
| Enum inline gigante no schema | Constante separada `const categoriesEnum = z.enum([...])` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `z.enum` rejeita valor válido | Valor enviado com case diferente | Verificar case-sensitivity: `"Food"` != `"food"` |
| Valor monetário aceita zero | Usando `.min(0)` em vez de `.positive()` | Usar `z.number().positive()` que rejeita zero |
| String com espaços passa na validação | `.min(1)` sem `.trim()` antes | Adicionar `.trim()` antes de `.min(1)` |
| Mensagem de erro genérica do Zod | Sem mensagem customizada no validator | Passar string: `.min(1, "Informe o nome da solicitação")` |
| Schema com muitos enums fica ilegível | Enum inline no z.object | Extrair para constante: `const categoriesEnum = z.enum([...])` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre validação com Zod, fluxo de erros e estratégia de mensagens
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e testes no Insomnia