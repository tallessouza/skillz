---
name: rs-full-stack-separando-e-unindo-strings
description: "Applies split() and join() string manipulation patterns when writing JavaScript/TypeScript code. Use when user asks to 'split a string', 'join an array', 'parse CSV', 'separate words', 'convert array to string', or any text parsing task. Enforces correct separator usage in split/join pairs. Make sure to use this skill whenever manipulating strings that involve splitting or joining text. Not for regex-based parsing, template literals, or string interpolation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-strings
  tags:
    - javascript
    - string
    - split
    - join
    - text-manipulation
---

# Separando e Unindo Strings

> Use `split()` para quebrar strings em arrays e `join()` para unir arrays em strings, sempre definindo o separador correto para cada contexto.

## Rules

1. **Sempre passe o separador explicitamente no split()** — `text.split(",")` nao `text.split()`, porque sem separador retorna o texto inteiro como unico elemento do array
2. **Escolha o separador pelo padrao real do texto** — se o texto separa por virgula use virgula, se separa por espaco use espaco, porque usar o separador errado gera fragmentos quebrados
3. **join() sem parametro usa virgula por padrao** — se quer outro separador, passe explicitamente: `array.join(" - ")`, porque o padrao silencioso causa bugs visuais
4. **split() retorna um array** — trate o resultado como array, nao como string, porque metodos de string nao funcionam no resultado
5. **split e join sao operacoes inversas** — `text.split(sep).join(sep)` retorna o texto original, use isso para substituir separadores

## How to write

### Quebrar texto por separador

```typescript
const text = "estudar,aprender,praticar"
const words = text.split(",")
// Result: ["estudar", "aprender", "praticar"]
```

### Quebrar por espaco

```typescript
const message = "estou aprendendo javascript"
const messageWords = message.split(" ")
// Result: ["estou", "aprendendo", "javascript"]
```

### Unir array em string com novo separador

```typescript
const words = ["estudar", "aprender", "praticar"]
const joined = words.join(" - ")
// Result: "estudar - aprender - praticar"
```

### Trocar separador (split + join)

```typescript
const csvLine = "nome,email,telefone"
const tsvLine = csvLine.split(",").join("\t")
// Result: "nome\temail\ttelefone"
```

## Example

**Before (manipulacao manual):**
```typescript
const tags = "react,node,typescript"
// Tentando acessar cada tag manualmente
const firstTag = tags.substring(0, tags.indexOf(","))
```

**After (com split/join):**
```typescript
const tags = "react,node,typescript"
const tagList = tags.split(",")
// ["react", "node", "typescript"]
const displayTags = tagList.join(" | ")
// "react | node | typescript"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Texto com delimitador consistente (CSV, tags) | `split()` pelo delimitador |
| Separar palavras de uma frase | `split(" ")` |
| Converter array para exibicao | `join()` com separador visual |
| Trocar delimitador | `split(old).join(new)` |
| Split sem uso do array | Provavelmente voce quer `replace()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `text.split()` (sem separador) | `text.split(",")` (separador explicito) |
| `array.join()` esperando espaco | `array.join(" ")` (separador explicito) |
| `text.split("en")` em texto livre | `text.split(" ")` (use padrao previsivel) |
| Loop manual para concatenar array | `array.join(separator)` |
| `text.indexOf` + `substring` repetido | `text.split(delimiter)` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `split()` retorna array com um unico elemento | Separador nao passado ou separador errado | Passe o separador correto: `text.split(",")` |
| `join()` insere virgulas inesperadas | `join()` sem argumento usa virgula por padrao | Passe separador explicito: `array.join(" ")` |
| Split gera strings vazias no array | Separador duplicado no texto (ex: `"a,,b"`) | Filtre vazios: `text.split(",").filter(Boolean)` |
| Resultado de split nao e string | `split()` retorna array, nao string | Use `join()` para converter de volta ou acesse indices |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-separando-e-unindo-strings/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-separando-e-unindo-strings/references/code-examples.md)
