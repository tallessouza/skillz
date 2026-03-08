---
name: rs-full-stack-encadeamento-opcional
description: "Applies optional chaining patterns when accessing nested object properties or methods in JavaScript/TypeScript. Use when user asks to 'access nested property', 'handle undefined', 'navigate object safely', 'avoid cannot read property error', or any code dealing with optional/nullable object access. Ensures ?. operator is used instead of manual null checks. Make sure to use this skill whenever generating code that accesses nested objects with potentially missing properties. Not for nullish coalescing (??), type narrowing, or schema validation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-moderno
  tags: [javascript, optional-chaining, null-safety, undefined, operadores]
---

# Encadeamento Opcional (Optional Chaining)

> Ao acessar propriedades ou metodos em objetos aninhados, use `?.` para retornar `undefined` em vez de lancar excecao quando o caminho nao existe.

## Rules

1. **Use `?.` antes de acessar propriedades que podem nao existir** — `user?.address?.street` nao `user.address.street`, porque se `address` for `undefined`, o acesso direto lanca `TypeError: Cannot read property of undefined`
2. **Use `?.()` para chamar metodos que podem nao existir** — `user.greet?.()` nao `user.greet()`, porque o optional chaining em metodos simplesmente nao executa se o metodo nao existir, sem gerar excecao
3. **Coloque `?.` no ponto exato de incerteza** — se `user` sempre existe mas `address` e opcional, escreva `user.address?.street`, nao `user?.address?.street`, porque `?.` desnecessario polui o codigo e esconde a intencao
4. **Optional chaining retorna `undefined`, nao lanca erro** — planeje o codigo sabendo que o resultado pode ser `undefined`, combine com `??` (nullish coalescing) quando precisar de um valor padrao
5. **Use para propriedades opcionais de objetos vindos de APIs ou banco** — campos como foto, endereco, telefone secundario frequentemente sao opcionais e podem nao existir no objeto retornado

## How to write

### Propriedades aninhadas

```javascript
// Acessar propriedade que pode nao existir
const street = user.address?.street
const latitude = user.address?.geo?.latitude
```

### Metodos opcionais

```javascript
// Chamar metodo que pode nao existir no objeto
const greeting = user.greet?.()
```

### Encadeamento multiplo

```javascript
// Cada nivel incerto recebe seu proprio ?.
const city = response.data?.user?.address?.city
```

## Example

**Before (erro em runtime):**
```javascript
const user = { id: 1, name: "Rodrigo" }

console.log(user.address.street)
// TypeError: Cannot read properties of undefined (reading 'street')

user.message()
// TypeError: user.message is not a function
```

**After (com optional chaining):**
```javascript
const user = { id: 1, name: "Rodrigo" }

console.log(user.address?.street)
// undefined (sem erro)

user.message?.()
// nada acontece (sem erro)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Propriedade vem de API externa | Sempre usar `?.` nos campos opcionais |
| Objeto criado internamente com shape conhecido | `?.` desnecessario — acesse direto |
| Cadeia de 3+ niveis de profundidade | Cada nivel incerto ganha `?.` |
| Metodo pode nao existir no objeto | `obj.method?.()` com `?.` antes dos parenteses |
| Precisa de valor padrao quando `undefined` | Combine `?.` com `??`: `user.address?.city ?? "Nao informado"` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `user.address && user.address.street` | `user.address?.street` |
| `user.greet && user.greet()` | `user.greet?.()` |
| `typeof user.address !== 'undefined' ? user.address.street : undefined` | `user.address?.street` |
| `try { user.address.street } catch(e) { }` | `user.address?.street` |
| `user?.name` (quando user sempre existe) | `user.name` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| TypeError: Cannot read properties of undefined | Acesso direto a propriedade que nao existe | Use ?. antes do acesso: user.address?.street |
| Optional chaining retorna undefined inesperadamente | Propriedade intermediaria e null ou undefined | Combine com ?? para valor padrao: user.name ?? "Anonimo" |
| ESLint reclama de optional chaining desnecessario | Usando ?. em propriedade que sempre existe | Remova ?. de propriedades garantidas pelo tipo |
| Metodo nao executa com ?.()  | Metodo nao existe no objeto | Comportamento correto — ?.() nao executa se metodo nao existe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes