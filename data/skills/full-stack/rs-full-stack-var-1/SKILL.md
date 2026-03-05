---
name: rs-full-stack-var-1
description: "Applies JavaScript var declaration patterns when writing beginner JS code. Use when user asks to 'declare a variable', 'create a var', 'assign a value', or works with basic JavaScript variable creation. Covers declaration without value, with value, and reassignment. Make sure to use this skill whenever teaching or generating introductory JavaScript variable code. Not for let/const, scoping rules, hoisting, or advanced variable patterns."
---

# Declaracao de Variaveis com var

> Usar `var` para declarar variaveis, atribuir valores e substituir valores, entendendo cada operacao como um passo distinto.

## Rules

1. **Declarar antes de usar** — `var user;` cria a variavel, porque o JavaScript precisa saber que ela existe antes de qualquer operacao
2. **Variavel sem valor retorna `undefined`** — `var user;` resulta em `undefined`, porque nenhum valor foi atribuido ainda
3. **Usar `var` apenas na declaracao** — a palavra `var` aparece somente quando a variavel e criada pela primeira vez, porque reusar `var` no mesmo escopo causa confusao
4. **Atribuicao usa `=`** — o sinal de igual nao e comparacao, e atribuicao: coloca o valor do lado direito dentro da variavel do lado esquerdo
5. **Strings entre aspas** — valores de texto devem estar entre aspas (`"rodrigo@email.com"`), porque sem aspas o JavaScript interpreta como referencia a outra variavel
6. **Substituicao sobrescreve** — `email = "joao@email.com"` substitui completamente o valor anterior, porque a variavel so guarda um valor por vez

## How to write

### Declaracao sem valor
```javascript
var user;
console.log(user); // undefined
```

### Declaracao com valor
```javascript
var email = "rodrigo@email.com";
console.log(email); // "rodrigo@email.com"
```

### Substituicao de valor
```javascript
var email = "rodrigo@email.com";
email = "joao@email.com";
console.log(email); // "joao@email.com"
```

## Example

**Before (erro comum de iniciante):**
```javascript
console.log(nome); // ReferenceError — variavel nao declarada
var email = rodrigo@email.com; // SyntaxError — faltou aspas
var email = "outro@email.com"; // var duplicado desnecessario
```

**After (com esta skill aplicada):**
```javascript
var nome;
console.log(nome); // undefined — declarada sem valor

var email = "rodrigo@email.com";
console.log(email); // "rodrigo@email.com"

email = "outro@email.com"; // sem var, porque ja foi declarada
console.log(email); // "outro@email.com"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa da variavel mas ainda nao tem o valor | `var nome;` — declare sem valor |
| Ja sabe o valor inicial | `var email = "valor";` — declare com valor |
| Quer mudar o valor de variavel existente | `email = "novo";` — sem `var` na frente |
| Quer verificar o conteudo | `console.log(variavel)` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `var email = rodrigo@email.com` | `var email = "rodrigo@email.com"` |
| `var x = "valor"; var x = "outro";` | `var x = "valor"; x = "outro";` |
| `console.log(y);` (sem declarar y) | `var y; console.log(y);` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre var, undefined e atribuicao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes