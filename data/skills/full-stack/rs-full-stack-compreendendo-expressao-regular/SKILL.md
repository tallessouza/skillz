---
name: rs-full-stack-compreendendo-expressao-regular
description: "Applies regular expression fundamentals when writing JavaScript string validation or pattern matching. Use when user asks to 'validate email', 'check pattern', 'match string', 'use regex', 'write regular expression', or any input validation task. Covers regex syntax: delimiters, character classes like \\D, quantifiers like +, and the global flag g. Make sure to use this skill whenever generating regex patterns or validating user input formats. Not for complex regex optimization, performance tuning, or regex engine internals."
---

# Expressoes Regulares (Regex) em JavaScript

> Expressoes regulares identificam padroes dentro de strings — use para validar dados de entrada como emails, telefones e formatos especificos.

## Rules

1. **Regex serve para validar padroes em strings** — use quando precisar verificar se um dado do usuario atende um formato esperado, porque validacao manual com if/else e fragil e verbosa
2. **Delimitadores marcam inicio e fim** — `/padrao/flags` onde as barras delimitam a expressao, porque sem elas o JS nao reconhece como regex
3. **Classes de caracteres simplificam buscas** — `\d` para digitos (0-9), `\D` para nao-digitos, porque evitam listar cada caractere manualmente
4. **Quantificador `+` agrupa sequencias** — `\D+` encontra sequencias de nao-digitos juntos ao inves de caractere por caractere, porque sem ele cada match e individual
5. **Flag `g` busca em toda a string** — sem o `g` a regex para na primeira correspondencia encontrada, porque o comportamento padrao e retornar apenas o primeiro match
6. **Nao decore combinacoes, consulte quando precisar** — o importante e saber que regex resolve o problema, a sintaxe especifica pode ser consultada sob demanda

## How to write

### Regex basica com delimitadores e flag

```javascript
// Estrutura: /padrao/flags
const regex = /\D+/g
```

### Validacao de padrao em string

```javascript
const input = "53A7B5C"
const nonDigits = input.match(/\D+/g)
// Resultado: ["A", "B", "C"] — sem +, cada letra separada
// Com +: se houvesse letras juntas como "BC", retornaria ["A", "BC"]
```

### Validacao de email (caso de uso classico)

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isValid = emailRegex.test(userInput)
```

## Example

**Before (validacao manual fragil):**
```javascript
const hasLetters = false
for (let i = 0; i < text.length; i++) {
  if (isNaN(text[i])) {
    hasLetters = true
    break
  }
}
```

**After (com regex):**
```javascript
const hasLetters = /\D/.test(text)
const allLetterSequences = text.match(/\D+/g)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Validar formato de entrada do usuario | Use regex com `.test()` para boolean |
| Extrair partes de uma string | Use `.match()` com flag `g` |
| Precisa de todos os matches | Adicione flag `g` |
| Precisa ignorar maiusculas/minusculas | Adicione flag `i` |
| Regex desconhecida para seu caso | Pesquise "regex for {formato}" antes de inventar |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| Validacao manual char por char | `regex.test(string)` |
| Regex sem delimitadores `/` | `/padrao/flags` com barras |
| Match sem flag `g` quando precisa de todos | Adicione `g`: `/padrao/g` |
| Regex gigante sem comentario | Quebre em partes nomeadas ou comente o padrao |
| Decorar todas as combinacoes | Consultar referencia quando precisar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e detalhamento de cada simbolo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes