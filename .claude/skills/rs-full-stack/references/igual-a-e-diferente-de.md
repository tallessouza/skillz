---
name: rs-full-stack-igual-a-e-diferente-de
description: "Enforces correct usage of loose equality (==) and inequality (!=) operators in JavaScript. Use when user asks to 'compare values', 'check equality', 'write conditions', 'implement if statements', or any comparison logic. Clarifies that == and != compare content only, not type. Make sure to use this skill whenever writing JavaScript comparisons or reviewing conditional logic. Not for strict equality (===) which is covered separately."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-fundamentals
  tags: [javascript, equality, comparison, operators, coercion]
---

# Igual a (==) e Diferente de (!=)

> Ao comparar valores com == e !=, lembre que esses operadores comparam apenas o conteudo, nunca o tipo.

## Rules

1. **== compara apenas conteudo** — `1 == "1"` retorna `true`, porque o operador ignora o tipo e foca no valor armazenado
2. **!= compara apenas conteudo** — `1 != "1"` retorna `false`, porque o conteudo e identico apesar dos tipos diferentes
3. **Prefira === e !== na maioria dos casos** — use == e != apenas quando a coercao de tipo for intencional, porque comparacoes soltas causam bugs silenciosos
4. **Saiba quando == e != sao uteis** — formularios e query strings retornam strings, entao `inputValue == 1` pode ser intencional
5. **Documente comparacoes soltas** — quando usar == ou != intencionalmente, adicione comentario explicando porque a coercao e desejada

## How to write

### Comparacao de conteudo (==)

```javascript
const on = 1
const to = 2

console.log(on == to)   // false — conteudos diferentes
console.log(on == 1)    // true — mesmo conteudo
console.log(on == "1")  // true — conteudo igual, tipo ignorado
```

### Diferente de (!=)

```javascript
console.log(on != to)   // true — conteudos diferentes
console.log(1 != 1)     // false — mesmo conteudo
console.log(1 != "1")   // false — conteudo igual, tipo ignorado
```

## Example

**Before (bug silencioso):**
```javascript
const userId = "42"
const selectedId = 42

if (userId == selectedId) {
  // Funciona, mas esconde que os tipos sao diferentes
  deleteUser(userId)
}
```

**After (intencao explicita):**
```javascript
const userId = "42"
const selectedId = 42

// Coercao intencional: selectedId vem como number, userId vem do DOM como string
if (userId == selectedId) {
  deleteUser(userId)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Comparando valores do mesmo tipo conhecido | Use `===` / `!==` |
| Input de formulario vs numero | `==` pode ser intencional, documente |
| Verificando null ou undefined | `value == null` captura ambos (pattern aceito) |
| Qualquer outro caso | Default para `===` / `!==` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `x == y` sem saber os tipos | `x === y` ou documente a coercao |
| `x != y` assumindo tipos iguais | `x !== y` para comparacao estrita |
| `typeof x == "string"` | `typeof x === "string"` (typeof ja retorna string) |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Comparacao retorna true quando deveria ser false | Coercao de tipo implicita com `==` (ex: `0 == ""` e true) | Use `===` para comparacao estrita de tipo e valor |
| `null == undefined` retorna true | Comportamento especial do `==` com null/undefined | Use esse pattern intencionalmente ou troque para `===` e verifique ambos |
| Input de formulario nao compara corretamente com numero | Input retorna string, `"5" == 5` e true mas pode esconder bug | Converta explicitamente com `Number()` e use `===` |
| Linter reclama de `==` | Regras de lint preferem `===` por seguranca | Troque para `===` ou adicione comentario justificando o uso intencional |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre coercao de tipos e quando usar cada operador
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes