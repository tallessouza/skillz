---
name: rs-full-stack-retornando-valores
description: "Enforces correct use of return values in JavaScript functions. Use when user asks to 'create a function', 'return a value', 'get result from function', or 'call a function and use its output'. Applies rules: use return to expose values outside functions, capture return in named variables, never ignore undefined returns. Make sure to use this skill whenever writing functions that produce values needed elsewhere. Not for void functions, event handlers, or callback-only patterns."
---

# Retornando Valores de Funções

> Funcoes que produzem valores devem usar `return` para expor o resultado — o chamador decide o que fazer com ele.

## Rules

1. **Use `return` quando o valor sera usado fora da funcao** — `console.log` dentro da funcao resolve apenas exibicao imediata, `return` permite reutilizacao do valor em qualquer contexto
2. **Capture o retorno em variavel nomeada pelo conteudo** — `const sumResult = sum(7, 3)` nao `const x = sum(7, 3)`, porque o nome documenta o que o valor representa
3. **Funcao sem `return` retorna `undefined`** — se o chamador espera um valor e a funcao nao retorna nada, o resultado sera `undefined` silenciosamente, causando bugs dificeis de rastrear
4. **Retorno pode ser usado diretamente** — `console.log(sum(5, 6))` e valido quando o valor e descartavel, sem necessidade de variavel intermediaria
5. **`return` encerra a execucao da funcao** — nenhum codigo apos o `return` sera executado, posicione-o como ultima instrucao logica

## How to write

### Funcao com retorno

```javascript
function sum(a, b) {
  const result = a + b
  return result
}

const sumResult = sum(7, 3)
console.log(sumResult) // 10
```

### Retorno usado diretamente

```javascript
console.log(sum(5, 6)) // 11
```

## Example

**Before (valor preso dentro da funcao):**
```javascript
function sum(a, b) {
  const result = a + b
  console.log(result) // exibe, mas nao retorna
}

const response = sum(7, 7)
console.log(response) // undefined — bug silencioso
```

**After (valor retornado e reutilizavel):**
```javascript
function sum(a, b) {
  const result = a + b
  return result
}

const response = sum(7, 7)
console.log(response) // 14
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Valor sera usado em outra parte do codigo | Use `return` |
| Funcao so precisa exibir algo | `console.log` dentro e suficiente |
| Valor e usado uma unica vez inline | Use diretamente: `console.log(fn())` |
| Funcao faz calculo e exibe | Separe: retorne o calculo, exiba fora |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `console.log` dentro + esperar valor fora | `return` o valor, `console.log` fora |
| `const x = funcaoSemReturn()` sem checar | Garanta que a funcao tem `return` |
| Codigo apos `return` na mesma branch | Mova logica para antes do `return` |
| `return` + `console.log` do mesmo valor dentro | Escolha um: retorne OU exiba dentro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-retornando-valores/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-retornando-valores/references/code-examples.md)
