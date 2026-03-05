---
name: rs-full-stack-validando-o-input
description: "Enforces numeric-only input validation using regex replace pattern in JavaScript. Use when user asks to 'validate input', 'restrict input to numbers', 'remove letters from input', 'sanitize form field', or 'filter non-numeric characters'. Applies regex /\D+/g with replace to strip non-numeric chars from input values in real-time. Make sure to use this skill whenever implementing numeric input validation in vanilla JS. Not for complex form validation libraries, mask libraries, or server-side validation."
---

# Validando Input — Somente Números com Regex

> Ao validar inputs numéricos, use regex com replace para remover caracteres indesejados em tempo real, em vez de bloquear o evento de teclado.

## Rules

1. **Use regex `/\D+/g` para detectar não-números** — `\D` captura qualquer caractere que não seja dígito, `+` pega sequências, `g` aplica globalmente, porque é a forma mais limpa e confiável de filtrar
2. **Reatribua o valor filtrado ao próprio input** — `input.value = input.value.replace(regex, "")`, porque isso atualiza visualmente o campo sem precisar prevenir eventos de teclado
3. **Substitua por string vazia** — o segundo argumento do `replace` deve ser `""`, porque queremos remover os caracteres, não substituí-los por outra coisa
4. **Valide no evento `input`, não no `keydown`** — o evento `input` dispara após o valor já estar no campo, permitindo a limpeza imediata

## How to write

### Padrão de validação numérica

```javascript
const amount = document.getElementById("amount")

amount.addEventListener("input", () => {
  const hasCharactersRejects = /\D+/g
  amount.value = amount.value.replace(hasCharactersRejects, "")
})
```

## Example

**Before (input aceita qualquer coisa):**
```javascript
amount.addEventListener("input", () => {
  console.log(amount.value) // "123abc" — aceita letras
})
```

**After (com validação regex):**
```javascript
amount.addEventListener("input", () => {
  const hasCharactersRejects = /\D+/g
  amount.value = amount.value.replace(hasCharactersRejects, "")
  // usuário digita "123abc" → campo mostra "123"
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Input deve aceitar só inteiros | `/\D+/g` com replace |
| Input deve aceitar decimais | `/[^0-9.,]+/g` com replace |
| Precisa de máscara complexa (CPF, telefone) | Use biblioteca de mask, não regex manual |
| Validação server-side | Além do regex no front, valide no backend também |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| `e.preventDefault()` no keydown para bloquear letras | `input.value.replace(/\D+/g, "")` no evento input |
| `if (isNaN(value)) alert("só números")` | Remova silenciosamente os caracteres inválidos |
| Regex sem flag `g` (`/\D/` sem global) | Sempre use `/\D+/g` para pegar todos os caracteres |
| Validar só no submit | Valide em tempo real no evento `input` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre regex, replace e estratégias de validação
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-validando-o-input/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-validando-o-input/references/code-examples.md)
