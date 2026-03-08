---
name: rs-full-stack-sintaxe
description: "Enforces correct JavaScript syntax awareness when writing or debugging JS code. Use when user asks to 'fix syntax error', 'debug JavaScript', 'write JavaScript code', or encounters 'not recognized' errors. Applies rules: use reserved words exactly as defined, respect command structure like console.log, understand optional vs required syntax elements. Make sure to use this skill whenever a user reports a syntax error or asks about JavaScript writing rules. Not for logic errors, runtime bugs, or non-JavaScript languages."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags:
    - javascript
    - syntax
    - debugging
    - reserved-words
    - case-sensitive
---

# Sintaxe JavaScript

> Escreva comandos JavaScript exatamente como a linguagem define — cada simbolo e palavra-chave tem uma forma correta e unica de ser escrita.

## Rules

1. **Use palavras reservadas exatamente como definidas** — `let` nao `Let`, `var` nao `VAR`, porque JavaScript e case-sensitive e nao reconhece variacoes
2. **Respeite a estrutura dos comandos** — `console.log()` nao `con.sole.log()`, porque comandos sao combinacoes especificas de palavras e simbolos que formam uma unidade
3. **Ponto e virgula e opcional em JavaScript** — diferente de C#, Java e outras linguagens onde e obrigatorio, JavaScript funciona com ou sem `;` no final das instrucoes
4. **Quando um comando nao e reconhecido, verifique a sintaxe primeiro** — erros de digitacao sao a causa mais comum de "is not defined" ou "is not a function"
5. **Palavras reservadas tem cor diferente no editor** — use o syntax highlighting como guia visual para confirmar que escreveu corretamente

## How to write

### Comandos corretos

```javascript
// Sintaxe correta — cada parte do comando escrita exatamente como deve ser
console.log("Olá Rodrigo")

// Com ponto e virgula (opcional, ambos funcionam)
console.log("Olá João");

// Declaracao de variavel com palavra reservada
let nome = "Maria"
var idade = 25
```

## Example

**Before (sintaxe incorreta):**
```javascript
// Erro: comando escrito incorretamente
con.sole.log("Olá Rodrigo")
// ReferenceError: con is not defined

Console.log("teste")
// ReferenceError: Console is not defined

LET nome = "Maria"
// SyntaxError: Unexpected identifier
```

**After (sintaxe correta):**
```javascript
console.log("Olá Rodrigo")
let nome = "Maria"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Erro "is not defined" | Verifique se o comando esta escrito exatamente como a linguagem define |
| Duvida sobre ponto e virgula | Em JavaScript e opcional — escolha um padrao e mantenha consistencia |
| Palavra reservada sem cor no editor | Provavelmente esta escrita incorretamente |
| Migrando de outra linguagem | Verifique quais regras de sintaxe sao diferentes (ex: `;` obrigatorio vs opcional) |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `con.sole.log()` | `console.log()` |
| `Console.log()` | `console.log()` |
| `LET x = 1` | `let x = 1` |
| `VAR x = 1` | `var x = 1` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `ReferenceError: con is not defined` | Comando escrito incorretamente (`con.sole.log`) | Escreva exatamente `console.log()` |
| `ReferenceError: Console is not defined` | Letra maiuscula no inicio | JavaScript e case-sensitive: use `console` minusculo |
| `SyntaxError: Unexpected identifier` | Palavra reservada em maiuscula (`LET`, `VAR`) | Use minusculo: `let`, `var`, `const` |
| Palavra reservada sem cor no editor | Digitacao incorreta | Verifique syntax highlighting — palavras corretas tem cor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre sintaxe, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-sintaxe-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-sintaxe-4/references/code-examples.md)
