---
name: rs-full-stack-argumentos-e-parametros-1
description: "Enforces correct use of function parameters, arguments, default values, and parameter ordering in JavaScript/TypeScript. Use when user asks to 'create a function', 'add parameters', 'set default values', 'write a helper', or any function definition task. Applies rules: parameter order matters, use default values for optional params, understand scope of parameters. Make sure to use this skill whenever defining functions with multiple parameters. Not for class constructors, TypeScript generics, or advanced patterns like decorators."
---

# Argumentos e Parâmetros

> Parâmetros tornam funções dinâmicas — domine a ordem, os valores padrão e o escopo para evitar bugs silenciosos.

## Rules

1. **Distinga parâmetro de argumento** — parâmetro é a variável na declaração, argumento é o valor passado na chamada, porque confundir os dois gera comunicação imprecisa em code reviews
2. **Respeite a ordem dos parâmetros** — o primeiro argumento preenche o primeiro parâmetro, o segundo o segundo, porque JavaScript não faz matching por nome (a menos que use objeto)
3. **Defina valores padrão para parâmetros opcionais** — `function fn(a, b = '')` não `function fn(a, b)`, porque parâmetros sem valor viram `undefined` silenciosamente
4. **Parâmetros obrigatórios primeiro, opcionais depois** — porque valores padrão só fazem sentido nos últimos parâmetros
5. **Parâmetros existem apenas no escopo da função** — mesmo que exista variável com mesmo nome fora, o parâmetro tem precedência dentro da função, porque JavaScript resolve pelo escopo mais próximo
6. **Use objeto como parâmetro quando a ordem não deve importar** — `function fn({ name, age })` em vez de `function fn(name, age)`, porque elimina erros de ordenação

## How to write

### Função com parâmetros simples
```javascript
function message(username) {
  console.log(`Olá, ${username}`)
}

message("Rodrigo") // Olá, Rodrigo
message("Ana")     // Olá, Ana
```

### Múltiplos parâmetros (ordem importa)
```javascript
function sum(a, b) {
  console.log(a + b)
}

sum(10, 20) // 30
sum(7, 3)   // 10
```

### Valores padrão
```javascript
function joinText(text1, text2 = '', text3 = '') {
  console.log(`${text1} ${text2} ${text3}`)
}

joinText("Rodrigo")                      // "Rodrigo  "
joinText("Rodrigo", "Gonçalves")         // "Rodrigo Gonçalves "
joinText("Rodrigo", "Gonçalves", "Santana") // "Rodrigo Gonçalves Santana"
```

## Example

**Before (bug silencioso com undefined):**
```javascript
function joinText(text1, text2, text3) {
  console.log(`${text1} ${text2} ${text3}`)
}

joinText("Rodrigo")
// "Rodrigo undefined undefined"
```

**After (com valores padrão):**
```javascript
function joinText(text1, text2 = '', text3 = '') {
  console.log(`${text1} ${text2} ${text3}`)
}

joinText("Rodrigo")
// "Rodrigo  "
```

## Heuristics

| Situação | Faça |
|----------|------|
| Função com 1-2 parâmetros | Parâmetros posicionais simples |
| Função com 3+ parâmetros | Considere objeto como parâmetro |
| Parâmetro pode não ser passado | Defina valor padrão com `=` |
| Ordem dos argumentos causa confusão | Use destructuring de objeto |
| Mesmo nome de variável fora e dentro | Confie no escopo — o parâmetro vence dentro da função |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `function fn(a, b, c)` sem defaults quando b/c são opcionais | `function fn(a, b = '', c = '')` |
| Depender de variável externa com mesmo nome do parâmetro | Nomeie parâmetros de forma única e explícita |
| `joinText("Santana", "Rodrigo", "Gonçalves")` esperando reordenação | Respeite a ordem ou use objeto |
| Acessar parâmetro fora da função | Retorne o valor se precisar dele fora |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre escopo, precedência e mental model de parâmetros
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações