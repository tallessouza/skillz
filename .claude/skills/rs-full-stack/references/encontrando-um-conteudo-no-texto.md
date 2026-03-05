---
name: rs-full-stack-encontrando-conteudo-texto
description: "Applies JavaScript string search methods (indexOf, includes) when writing code that searches, filters, or validates text content. Use when user asks to 'find text in string', 'check if string contains', 'search in text', 'verify content exists', or 'get position of word'. Ensures case-insensitive comparisons use toLowerCase/toUpperCase. Make sure to use this skill whenever generating code that checks for substrings or searches within strings. Not for regex patterns, array searching, or DOM text manipulation."
---

# Encontrando Conteudo no Texto

> Use `includes()` para verificar existencia e `indexOf()` para encontrar posicao — sempre normalize case antes de comparar.

## Rules

1. **Use `includes()` para verificacao booleana** — `str.includes("termo")` retorna `true/false`, porque e mais legivel que `indexOf() !== -1`
2. **Use `indexOf()` quando precisar da posicao** — retorna o indice numerico onde o termo comeca, porque permite localizar exatamente onde o conteudo aparece
3. **Trate o retorno `-1` do `indexOf()`** — significa "nao encontrado", porque ignorar esse caso causa bugs silenciosos
4. **Normalize case antes de comparar** — `str.toLowerCase().includes(termo.toLowerCase())`, porque JavaScript e case-sensitive e "Java" !== "java"
5. **Escolha `toLowerCase()` ou `toUpperCase()` consistentemente** — normalize ambos os lados para o mesmo case, porque misturar direcoes causa falsos negativos
6. **`includes()` funciona com frases, nao apenas palavras** — `str.includes("estou estudando os fundamentos")` e valido, porque busca substring exata

## How to write

### Verificar existencia (case-sensitive)

```javascript
const message = "Estou estudando os fundamentos do Javascript"
const hasJavascript = message.includes("Javascript") // true
const hasHTML = message.includes("HTML") // false
```

### Verificar existencia (case-insensitive)

```javascript
const message = "Estou estudando os fundamentos do Javascript"
const searchTerm = "javascript"
const found = message.toLowerCase().includes(searchTerm.toLowerCase()) // true
```

### Encontrar posicao

```javascript
const message = "Estou estudando os fundamentos do Javascript"
const position = message.indexOf("estudando") // 6
const notFound = message.indexOf("html") // -1
```

## Example

**Before (fragil, case-sensitive, sem tratamento):**

```javascript
const msg = "Bem-vindo ao curso de Javascript"
if (msg.indexOf("javascript") > 0) {
  console.log("Encontrou!")
}
```

**After (robusto, case-insensitive, trata -1):**

```javascript
const message = "Bem-vindo ao curso de Javascript"
const searchTerm = "javascript"
if (message.toLowerCase().includes(searchTerm.toLowerCase())) {
  console.log("Encontrou!")
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa saber se contem | `includes()` — retorna boolean |
| Precisa saber onde comeca | `indexOf()` — retorna indice |
| Comparacao com input do usuario | Normalize ambos com `toLowerCase()` |
| Buscar frase inteira | `includes("frase completa")` funciona |
| Verificar se NAO encontrou com indexOf | Compare com `=== -1`, nao `< 0` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `str.indexOf("x") > 0` (ignora posicao 0) | `str.indexOf("x") !== -1` ou `str.includes("x")` |
| `str.indexOf("x") >= 0` para boolean check | `str.includes("x")` |
| `str.includes("Java")` sem normalizar case | `str.toLowerCase().includes("java")` |
| Comparar lowercase de um lado so | Normalizar ambos os lados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-encontrando-um-conteudo-no-texto/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-encontrando-um-conteudo-no-texto/references/code-examples.md)
