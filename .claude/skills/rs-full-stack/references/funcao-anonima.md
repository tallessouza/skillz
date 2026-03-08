---
name: rs-full-stack-funcao-anonima
description: "Applies anonymous function patterns when writing JavaScript/TypeScript code. Use when user asks to 'create a function', 'store function in variable', 'pass a callback', or 'write an anonymous function'. Enforces correct syntax for function expressions, parameter passing, and invocation. Make sure to use this skill whenever generating function expressions or callbacks. Not for arrow functions, named function declarations, or class methods."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-funcoes
  tags: [javascript, functions, anonymous-function, function-expression, callback]
---

# Função Anônima

> Funções anônimas são funções sem nome, armazenadas em variáveis para uso imediato — a variável guarda a função em si, não o retorno dela.

## Rules

1. **Guarde a função, não o retorno** — `const fn = function() {}` armazena a função; `const result = minhaFuncao()` armazena o retorno, porque são coisas completamente diferentes
2. **Use `const` por padrão** — funções armazenadas em variáveis raramente precisam ser reatribuídas, porque `const` previne sobrescrita acidental
3. **Sem nome após `function`** — escreva `function()` não `function nome()`, porque o nome da variável já identifica a função
4. **Invoque com parênteses** — `showMessage()` executa a função; `showMessage` sem parênteses referencia a função sem executar, porque parênteses são o operador de invocação
5. **Múltiplos parâmetros separados por vírgula** — `function(a, b, c)` não `function(a; b; c)`, porque vírgula é o separador universal de parâmetros em JavaScript

## How to write

### Função anônima básica

```javascript
const showMessage = function() {
  return "Olá, Rodrigo"
}

console.log(showMessage()) // "Olá, Rodrigo"
```

### Com parâmetros

```javascript
const showMessage = function(name) {
  return "Olá, " + name
}

console.log(showMessage("Rodrigo")) // "Olá, Rodrigo"
console.log(showMessage("João"))    // "Olá, João"
```

### Com múltiplos parâmetros

```javascript
const showMessage = function(message, name) {
  return message + " " + name
}

console.log(showMessage("Olá", "Rodrigo")) // "Olá Rodrigo"
```

## Example

**Before (comum em iniciantes):**
```javascript
// Confunde armazenar função com armazenar retorno
const mensagem = function() {
  return "Olá"
}
console.log(mensagem) // [Function: mensagem] — esqueceu os parênteses
```

**After (com esta skill aplicada):**
```javascript
const mensagem = function() {
  return "Olá"
}
console.log(mensagem()) // "Olá" — parênteses invocam a função
```

## Heuristics

| Situação | Faça |
|----------|------|
| Função usada uma vez como callback | Função anônima direto no argumento |
| Função reutilizada em vários lugares | Armazene em `const` com nome descritivo |
| Precisa inspecionar o conteúdo da variável | `console.log(fn)` mostra `[Function]`, confirma que é função |
| Precisa executar | Adicione `()` após o nome da variável |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `const fn = function nome() {}` (nome redundante) | `const nome = function() {}` |
| `console.log(fn)` esperando o retorno | `console.log(fn())` com parênteses |
| `let fn = function() {}` sem reatribuir | `const fn = function() {}` |
| `function(a; b)` | `function(a, b)` com vírgula |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `console.log(fn)` mostra `[Function]` em vez do retorno | Faltam parenteses para invocar a funcao | Use `console.log(fn())` com parenteses |
| `TypeError: fn is not a function` | Variavel foi sobrescrita com outro valor | Use `const` em vez de `let` para proteger a referencia |
| Funcao retorna `undefined` | Falta `return` dentro do corpo da funcao | Adicione `return` com o valor desejado |
| Parametros chegam como `undefined` | Argumentos nao foram passados na invocacao | Verifique que `fn(arg1, arg2)` corresponde a `function(param1, param2)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar funções anônimas vs nomeadas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações