---
name: rs-full-stack-string-para-array
description: "Applies string-to-array conversion patterns when writing JavaScript code. Use when user asks to 'split a string', 'convert string to array', 'separate words', 'split text', or 'get letters from string'. Covers split() for delimiter-based splitting and Array.from() for character-level decomposition. Make sure to use this skill whenever manipulating strings into arrays in JS. Not for array-to-string conversion, regex parsing, or JSON parsing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, string, array, split, Array.from, conversion]
---

# Convertendo String para Array

> Use `split()` para separar por delimitador e `Array.from()` para decompor em caracteres.

## Rules

1. **Use `split(delimiter)` para separar por palavras ou tokens** — `fullName.split(' ')` retorna `['Rodrigo', 'Gonçalves', 'Santana']`, porque o delimitador define onde cortar
2. **Use `Array.from(string)` para obter cada caractere** — `Array.from('abc')` retorna `['a', 'b', 'c']`, porque cria um array onde cada indice e um caractere (incluindo espacos)
3. **Escolha o metodo pela granularidade desejada** — palavras = `split(' ')`, caracteres = `Array.from()`, porque cada um produz arrays com niveis diferentes de decomposicao
4. **Nomeie o resultado pelo conteudo** — `words` nao `arr`, `letters` nao `result`, porque o nome deve descrever o que o array contem

## How to write

### Separar por palavras

```javascript
const fullName = 'Rodrigo Gonçalves Santana'
const nameWords = fullName.split(' ')
// ['Rodrigo', 'Gonçalves', 'Santana']
```

### Decompor em caracteres

```javascript
const fullName = 'Rodrigo Gonçalves Santana'
const letters = Array.from(fullName)
// ['R', 'o', 'd', 'r', 'i', 'g', 'o', ' ', 'G', ...]
```

## Example

**Before:**
```javascript
const data = 'Rodrigo Gonçalves Santana'
const arr = data.split(' ')
const res = Array.from(data)
```

**After (with this skill applied):**
```javascript
const fullName = 'Rodrigo Gonçalves Santana'
const nameWords = fullName.split(' ')
const nameLetters = Array.from(fullName)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Separar CSV | `line.split(',')` |
| Separar palavras de frase | `sentence.split(' ')` |
| Obter cada caractere | `Array.from(text)` |
| Separar por quebra de linha | `text.split('\n')` |
| Separar por delimitador customizado | `text.split(delimiter)` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `const arr = str.split(' ')` | `const words = sentence.split(' ')` |
| `const res = Array.from(s)` | `const characters = Array.from(name)` |
| `str.split('')` para caracteres | `Array.from(str)` (mais semantico e seguro com unicode) |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `split('')` retorna caracteres errados com emojis | `split('')` quebra surrogate pairs em dois elementos | Use `Array.from(str)` que respeita Unicode |
| `split(' ')` retorna array com 1 elemento | String nao contem espacos ou usa espaco non-breaking | Verifique o caractere separador com `charCodeAt()` |
| Array resultante contem strings vazias | Delimitadores consecutivos geram elementos vazios | Filtre com `.filter(Boolean)` apos o split |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes