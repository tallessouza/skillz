---
name: rs-full-stack-funcoes-7
description: "Enforces TypeScript function typing conventions when writing or reviewing functions. Use when user asks to 'create a function', 'write a method', 'type a function', 'add return type', or any TypeScript function creation task. Applies rules: explicit parameter types, explicit return types, never rely on inference for returns, void for no-return functions. Make sure to use this skill whenever generating TypeScript functions, even simple ones. Not for variable typing, interface definitions, or generic type parameters."
---

# Tipagem em Funções TypeScript

> Toda função TypeScript deve ter tipos explícitos nos parâmetros e no retorno — nunca confie na inferência do retorno.

## Rules

1. **Sempre tipar parâmetros explicitamente** — `(x: number, y: number)` nunca `(x, y)`, porque parâmetros sem tipo assumem `any` e eliminam toda proteção do TypeScript
2. **Sempre tipar o retorno explicitamente** — `: number` após os parênteses, porque inferência de retorno pode mudar silenciosamente se alguém alterar o corpo da função (ex: `toString()` transforma number em string sem erro)
3. **Usar void quando não há retorno** — declarar `: void` impede que alguém adicione um `return` acidentalmente dentro da função
4. **Nunca usar `any` em parâmetros** — se o TypeScript sugere `any` implícito, é um sinal para definir o tipo correto, porque `any` destrói a cadeia de inferência para quem consome a função
5. **Mesmas regras para arrow functions** — `const fn = (name: string): string => {}` segue exatamente a mesma sintaxe de tipagem que funções nomeadas

## How to write

### Função nomeada com retorno

```typescript
function sum(x: number, y: number): number {
  const result = x + y
  return result
}
```

### Função nomeada sem retorno

```typescript
function logMessage(message: string): void {
  console.log(message)
}
```

### Arrow function tipada

```typescript
const showMessage = (name: string): string => {
  const message = "Olá " + name
  return message
}
```

## Example

**Before (inferência perigosa):**
```typescript
function sum(x, y) {
  const result = x + y
  return result
}

const showMessage = (name) => {
  return "Olá " + name
}
```

**After (tipos explícitos):**
```typescript
function sum(x: number, y: number): number {
  const result = x + y
  return result
}

const showMessage = (name: string): string => {
  const message = "Olá " + name
  return message
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Função retorna valor | Declarar tipo de retorno explícito |
| Função não retorna nada | Declarar `: void` |
| Arrow function | Mesma sintaxe: `(param: type): returnType =>` |
| Parâmetro sem tipo claro | Definir tipo específico, nunca `any` |
| Corpo da função muda o tipo do resultado (ex: `.toString()`) | O retorno explícito vai capturar o erro imediatamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `function sum(x, y)` | `function sum(x: number, y: number): number` |
| `function sum(x: any, y: any)` | `function sum(x: number, y: number): number` |
| `function log(msg: string)` (sem retorno tipado) | `function log(msg: string): void` |
| `const fn = (name) => {...}` | `const fn = (name: string): string => {...}` |
| Confiar na inferência de retorno | Declarar tipo de retorno explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre riscos da inferência de retorno e analogias do instrutor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações