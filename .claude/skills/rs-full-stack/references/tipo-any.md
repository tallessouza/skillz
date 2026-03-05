---
name: rs-full-stack-tipo-any
description: "Enforces careful usage of TypeScript's any type when writing or reviewing TypeScript code. Use when user asks to 'create a variable', 'fix type errors', 'add TypeScript types', 'type a function', or any TypeScript code generation task. Applies rules: avoid implicit any, never use any as convenience escape, prefer unknown over any, always annotate explicit types. Make sure to use this skill whenever generating TypeScript code with untyped variables. Not for JavaScript-only projects, runtime type checking libraries, or Zod/io-ts schema validation."
---

# Tipo Any no TypeScript

> Toda variavel TypeScript deve ter tipo explicito — `any` so existe para casos de incerteza genuina, nunca por conveniencia.

## Rules

1. **Nunca deixe `any` implicito** — sempre declare o tipo da variavel, porque `any` implicito desativa silenciosamente toda a verificacao de tipos
2. **Prefira `unknown` sobre `any`** — `unknown` forca type narrowing antes do uso, porque mantem a seguranca de tipos enquanto aceita qualquer valor
3. **Use `any` somente quando genuinamente nao sabe o tipo** — migracao de JS, APIs externas sem tipagem, bibliotecas sem `@types`, porque sao os unicos cenarios onde a incerteza e real
4. **Sempre documente o motivo do `any`** — `// any: resposta da API legacy sem tipagem`, porque torna visivel a divida tecnica
5. **Nunca use `any` em interfaces publicas** — parametros de funcao, retornos, props de componentes, porque contamina todo o codigo consumidor

## How to write

### Variavel com tipo explicito (padrao correto)

```typescript
let message: string
message = "Esse é um texto"

let total: number
total = 45
```

### Quando realmente precisa de any (raro)

```typescript
// any: dados vindos de API legacy sem contrato tipado
let legacyResponse: any = await fetchLegacyApi()

// Melhor alternativa: usar unknown + narrowing
let unknownData: unknown = await fetchLegacyApi()
if (typeof unknownData === 'string') {
  console.log(unknownData.toUpperCase()) // seguro
}
```

## Example

**Before (any implicito — perde toda verificacao):**

```typescript
let message
message = "Esse é um texto"
message = 45
message = true
// TypeScript nao reclama de nada — zero seguranca
```

**After (com tipos explicitos):**

```typescript
let message: string
message = "Esse é um texto"
// message = 45       // Erro: Type 'number' is not assignable to type 'string'
// message = true     // Erro: Type 'boolean' is not assignable to type 'string'
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Variavel nova em codigo TypeScript | Sempre declarar tipo explicito |
| Migrando arquivo .js para .ts | `any` temporario com comentario, criar issue para tipar depois |
| Resposta de API sem tipagem | Criar interface/type para o contrato, usar `as` com cuidado |
| Nao sabe o tipo em runtime | Usar `unknown` + type guard, nao `any` |
| Parametro de funcao generico | Usar generics `<T>`, nao `any` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `let data` (any implicito) | `let data: string` |
| `function parse(input: any)` | `function parse(input: unknown)` ou `function parse<T>(input: T)` |
| `const result: any = fetch(...)` | `const result: Response = await fetch(...)` |
| `any` em todo lugar por preguica | Tipos explicitos — e a essencia do TypeScript |
| `(item: any) => item.name` | `(item: User) => item.name` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que any e perigoso e quando e aceitavel
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-tipo-any/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-tipo-any/references/code-examples.md)
