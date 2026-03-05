---
name: rs-full-stack-utilizando-o-regexr
description: "Applies regex testing workflow using regexr.com when writing or debugging regular expressions in JavaScript. Use when user asks to 'test a regex', 'validate a pattern', 'extract text with regex', 'debug regular expression', or 'match characters'. Covers flags (g), character classes (\\D), quantifiers (+), and step-by-step debugging. Make sure to use this skill whenever building or troubleshooting regex patterns. Not for string manipulation without regex or general JavaScript syntax questions."
---

# Utilizando o RegExr para Testar Expressoes Regulares

> Teste e valide expressoes regulares no regexr.com antes de implementar no codigo, usando o passo a passo visual para entender cada parte da expressao.

## Rules

1. **Sempre teste regex no regexr.com antes de implementar** — porque o passo a passo visual mostra exatamente o que cada parte da expressao faz, evitando bugs silenciosos
2. **Entenda a estrutura basica: `/expressao/flags`** — barra de inicio, expressao, barra de fim, flags opcionais, porque toda regex em JavaScript segue esse formato
3. **Use a flag `g` quando quiser todas as ocorrencias** — sem `g`, regex para na primeira ocorrencia encontrada, porque o comportamento padrao e retornar apenas o primeiro match
4. **Use `+` para capturar sequencias consecutivas** — `\D` pega um caractere por vez, `\D+` pega a sequencia inteira de nao-digitos, porque sem `+` cada caractere e um match separado
5. **Nao decore expressoes, pesquise e teste** — ate desenvolvedores experientes pesquisam regex para casos especificos (telefone, email, CPF), porque o valor esta em entender a logica, nao em memorizar

## How to write

### Regex sem flag global (primeira ocorrencia apenas)

```javascript
// Sem flag g: para na primeira ocorrencia
const regex = /\D/
const text = "1a2b3c"
const match = text.match(regex)
// match[0] = "a" (apenas a primeira letra)
```

### Regex com flag global (todas as ocorrencias)

```javascript
// Com flag g: encontra todas as ocorrencias
const regex = /\D/g
const text = "1a2b3c"
const matches = text.match(regex)
// matches = ["a", "b", "c"] (todas as letras)
```

### Quantificador + para sequencias

```javascript
// Sem +: cada caractere e um match separado
"1abf2c".match(/\D/g)   // ["a", "b", "f", "c"]

// Com +: sequencias consecutivas agrupadas
"1abf2c".match(/\D+/g)  // ["abf", "c"]
```

## Example

**Before (sem testar, bug silencioso):**
```javascript
const texto = "123abc456def"
const resultado = texto.match(/\D/)
console.log(resultado) // ["a"] — so pegou o primeiro!
```

**After (testado no regexr.com, comportamento correto):**
```javascript
const texto = "123abc456def"
const resultado = texto.match(/\D+/g)
console.log(resultado) // ["abc", "def"] — todas as sequencias de texto
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de apenas o primeiro match | Omita a flag `g` |
| Precisa de todos os matches | Adicione flag `g` |
| Caracteres individuais separados | Use `\D/g` sem `+` |
| Sequencias consecutivas agrupadas | Use `\D+/g` com `+` |
| Nao sabe a expressao para um caso | Pesquise + teste no regexr.com |
| Regex complexa com muitas partes | Use o painel de explicacao do regexr para entender cada etapa |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Implementar regex direto no codigo sem testar | Teste no regexr.com primeiro |
| Tentar decorar todas as combinacoes de regex | Pesquise quando precisar, entenda a logica |
| Usar `/\D/` esperando pegar todas as letras | Use `/\D/g` com flag global |
| Usar `/\D/g` esperando sequencias agrupadas | Use `/\D+/g` com quantificador |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre flags, quantificadores e workflow de teste
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes