---
name: rs-full-stack-substituindo-fatiando-texto
description: "Applies JavaScript string manipulation methods (replace, slice, trim) when writing code that transforms, extracts, or cleans text. Use when user asks to 'replace text', 'extract substring', 'slice a string', 'clean whitespace', 'trim input', or 'manipulate strings'. Ensures correct usage of replace for substitution, slice with positive/negative indexes for extraction, and trim for whitespace cleanup. Make sure to use this skill whenever generating code that processes user input or transforms string content. Not for regex patterns, template literals, or string interpolation."
---

# Substituindo e Fatiando Texto em JavaScript

> Ao manipular strings, use `replace` para substituicao, `slice` para extracao por posicao, e `trim` para limpeza de espacos — nunca modifique a string original.

## Rules

1. **Strings sao imutaveis** — `replace`, `slice` e `trim` retornam uma NOVA string, a original permanece intacta, porque reatribuir sem querer causa bugs silenciosos
2. **`replace` substitui apenas a primeira ocorrencia** — use `replaceAll` ou regex com flag `g` para substituir todas, porque esquecer isso e o bug mais comum com replace
3. **`slice` com positivos conta do inicio** — `slice(start, end)` onde `end` e a posicao absoluta na string (nao relativa ao start), porque confundir isso gera substrings erradas
4. **`slice` com negativos conta do final** — `slice(-n)` pega os ultimos `n` caracteres, porque e mais seguro que calcular posicoes manualmente
5. **`trim` so remove espacos nas bordas** — espacos no meio da string sao preservados, porque fazem parte do conteudo real
6. **Sempre aplique `trim` em input do usuario** — emails, nomes, buscas frequentemente tem espacos acidentais no inicio/fim

## How to write

### Substituicao com replace

```javascript
const message = "Estou estudando os fundamentos do JavaScript."

// Substituir uma palavra
const updated = message.replace("JavaScript", "HTML")
// "Estou estudando os fundamentos do HTML."

// Substituir trecho inteiro
const rewritten = message.replace("os fundamentos do JavaScript", "métodos de string")
// "Estou estudando métodos de string."

// A original NAO muda
console.log(message) // "Estou estudando os fundamentos do JavaScript."
```

### Extracao com slice (inicio para fim)

```javascript
const message = "Estou estudando os fundamentos do JavaScript."

// slice(start, end) — posicoes absolutas
message.slice(0, 5)   // "Estou"
message.slice(6, 30)  // "estudando os fundamentos"
```

### Extracao com slice (tras para frente)

```javascript
const message = "Estou estudando os fundamentos do JavaScript."

// Negativos contam do final
message.slice(-11)  // "JavaScript."
message.slice(-12)  // " JavaScript."
```

### Limpeza com trim

```javascript
const textWithSpace = "   texto de exemplo   "
console.log(textWithSpace.length)        // 23

const clean = textWithSpace.trim()
console.log(clean)                       // "texto de exemplo"
console.log(clean.length)               // 16
// Espacos no meio preservados
```

## Example

**Before (input do usuario sem tratamento):**
```javascript
const email = userInput
const search = queryParam
const name = formData.name
```

**After (com esta skill aplicada):**
```javascript
const email = userInput.trim()
const search = queryParam.trim()
const name = formData.name.trim()
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input de formulario (email, nome, busca) | Sempre aplicar `.trim()` |
| Precisa trocar UMA ocorrencia | `.replace("old", "new")` |
| Precisa trocar TODAS ocorrencias | `.replaceAll("old", "new")` |
| Extrair N caracteres do inicio | `.slice(0, n)` |
| Extrair N caracteres do final | `.slice(-n)` |
| Extrair trecho do meio | `.slice(start, end)` com posicoes absolutas |
| Verificar se string mudou | Compare retorno, nunca assuma mutacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `message.replace("x", "y")` assumindo que altera `message` | `const updated = message.replace("x", "y")` |
| `str.slice(6, 5)` pensando "5 a partir do 6" | `str.slice(6, 11)` com posicao absoluta |
| `input.trim().trim()` redundante | `input.trim()` uma vez basta |
| `str.replace("a", "b")` quando quer trocar todos | `str.replaceAll("a", "b")` |
| Calcular posicao manual do final | `str.slice(-n)` com negativo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre imutabilidade, analogia do tabuleiro para slice, e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes