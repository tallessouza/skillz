---
name: rs-full-stack-string-1
description: "Enforces correct JavaScript string declaration patterns when writing code with text values. Use when user asks to 'create a string', 'define text', 'write a template literal', 'handle quotes in strings', or any task involving JavaScript/TypeScript string literals. Applies rules: use single quotes when text contains double quotes, use double quotes when text contains single quotes, use template literals for multiline strings. Make sure to use this skill whenever generating string declarations or text handling code. Not for string methods, regex, or string manipulation logic."
---

# Strings em JavaScript

> Escolha o delimitador de string com base no conteudo interno, nao por preferencia pessoal.

## Rules

1. **Use aspas duplas como padrao** — `"texto"`, porque e a convencao mais comum em JSON e HTML
2. **Use aspas simples quando o texto contem aspas duplas** — `'texto com "destaque"'`, porque evita conflito de delimitadores sem precisar de escape
3. **Use aspas duplas quando o texto contem aspas simples** — `"it's working"`, porque evita conflito de delimitadores sem precisar de escape
4. **Use template literals (crase) para strings multilinhas** — porque aspas simples e duplas nao permitem quebra de linha
5. **Use template literals para interpolacao** — `` `Ola ${nome}` `` em vez de concatenacao, porque e mais legivel
6. **Nunca misture delimitadores no mesmo arquivo sem motivo** — consistencia facilita leitura e grep

## How to write

### String simples
```javascript
const userName = "Rodrigo"
console.log(userName)        // Rodrigo
console.log(typeof userName) // string
```

### Aspas duplas dentro do texto
```javascript
// Envolva com aspas simples para usar duplas internamente
const message = 'Uma String com "aspas duplas" dentro'
```

### Aspas simples dentro do texto
```javascript
// Envolva com aspas duplas para usar simples internamente
const message = "Uma String com 'aspas simples' dentro"
```

### Template literal (crase) para multiplas linhas
```javascript
const multiline = `Uma String com acento grave
permite escrever
multiplas linhas`
// A quebra de linha e preservada no output
```

## Example

**Before (erro de delimitador):**
```javascript
// Erro: aspas duplas conflitam com aspas internas
const msg = "Ela disse "oi" para mim"  // SyntaxError

// Erro: aspas simples nao permitem quebra de linha
const text = 'linha 1
linha 2'  // SyntaxError
```

**After (com esta skill aplicada):**
```javascript
const msg = 'Ela disse "oi" para mim'

const text = `linha 1
linha 2`
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Texto simples sem aspas internas | Use aspas duplas `"texto"` |
| Texto contem aspas duplas | Envolva com aspas simples |
| Texto contem aspas simples | Envolva com aspas duplas |
| Texto contem ambas aspas | Use template literal (crase) |
| Texto com quebra de linha | Use template literal (crase) |
| Texto com interpolacao de variavel | Use template literal com `${}` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `"texto com "aspas" dentro"` | `'texto com "aspas" dentro'` |
| `'it's broken'` | `"it's broken"` |
| `"linha1\nlinha2"` (quando quer multiline real) | `` `linha1\nlinha2` `` com quebra real |
| `"Ola " + nome + "!"` | `` `Ola ${nome}!` `` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes