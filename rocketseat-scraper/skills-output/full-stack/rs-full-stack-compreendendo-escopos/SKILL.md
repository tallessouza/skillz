---
name: rs-full-stack-compreendendo-escopos
description: "Applies JavaScript scope rules when writing or reviewing code with variables and blocks. Use when user asks to 'declare a variable', 'fix scope issue', 'debug undefined variable', 'refactor to block scope', or any variable declaration task. Enforces correct use of let/const over var, block scoping, and context awareness. Make sure to use this skill whenever generating JavaScript/TypeScript code with variable declarations. Not for naming conventions, typing, or function design patterns."
---

# Compreendendo Escopos em JavaScript

> Declare variaveis no escopo mais restrito possivel — use let/const para bloco, evite var no escopo global.

## Key concept

Escopo e a regiao do codigo onde uma variavel e acessivel. O escopo define o **contexto** da variavel — onde ela foi criada determina onde pode ser acessada e modificada. Pense em comodos de uma casa: o fogao esta na cozinha, entao voce so acessa o fogao no contexto da cozinha. Se tentar acessar do quarto, nao vai conseguir.

## Tipos de escopo

| Tipo | Keyword | Visibilidade |
|------|---------|-------------|
| **Global** | `var` (fora de funcao) | Acessivel em qualquer parte do codigo |
| **Bloco** | `let`, `const` | Restrito ao bloco `{}` onde foi declarado |
| **Funcao/Local** | `var` (dentro de funcao) | Restrito a funcao onde foi declarado |

## Decision framework

| Situacao | Acao |
|----------|------|
| Variavel usada em um unico bloco `if/for/while` | `let` ou `const` dentro do bloco |
| Valor que nunca muda | `const` sempre |
| Valor que precisa ser reatribuido | `let` no escopo mais restrito |
| Variavel acessivel em multiplos blocos da mesma funcao | `let` no topo da funcao |
| Variavel compartilhada entre modulos | Export/import, nunca global implicito |

## Example

**Before (escopo global vazando):**
```javascript
var usuario = "Maria"

if (true) {
  var usuario = "João" // sobrescreve a variavel global!
}

console.log(usuario) // "João" — efeito colateral inesperado
```

**After (escopo de bloco respeitado):**
```javascript
const usuario = "Maria"

if (true) {
  const usuario = "João" // existe apenas dentro deste bloco
  console.log(usuario) // "João"
}

console.log(usuario) // "Maria" — preservado
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Declarando qualquer variavel | Use `const` por padrao, `let` se precisar reatribuir |
| Variavel aparece como `undefined` | Verifique se esta acessando fora do escopo onde foi declarada |
| Loop `for` com comportamento estranho | Troque `var` por `let` no iterador |
| Variavel "some" entre blocos | Verifique se usou `var` em vez de `let/const` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `var x = 1` no topo do arquivo | `const x = 1` ou `let x = 1` |
| Variavel global implicita (sem keyword) | Sempre declare com `const`/`let` |
| `var` dentro de `for`/`if`/`while` | `let` ou `const` dentro do bloco |
| Modificar variavel de escopo externo dentro de bloco | Retornar valor ou usar parametro |

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| `var` e `let` sao a mesma coisa | `var` tem escopo de funcao, `let` tem escopo de bloco — comportamento muito diferente |
| Variavel global e conveniente | Variavel global causa efeitos colaterais imprevisiveis em codebases grandes |
| Escopo so importa em funcoes | Blocos `if`, `for`, `while` criam escopo para `let`/`const` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Analogias completas (comodos da casa, Brasil/estados), raciocinio sobre contexto vs escopo, e hierarquia de escopos
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de var vs let/const, closures em loops, e shadowing