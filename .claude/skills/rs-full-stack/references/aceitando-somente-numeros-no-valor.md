---
name: rs-full-stack-aceitando-somente-numeros
description: "Enforces numeric-only input filtering using regex replace in JavaScript. Use when user asks to 'validate input', 'allow only numbers', 'filter input characters', 'remove letters from input', or 'mask numeric field'. Applies regex /\D/g with replace to strip non-numeric characters on input events. Make sure to use this skill whenever implementing numeric input validation or character filtering in forms. Not for complex input masks with formatting, currency display, or phone number patterns."
---

# Filtragem de Input para Aceitar Somente Números

> Ao filtrar caracteres em inputs, use regex replace no evento de input para remover caracteres indesejados e devolver o valor limpo ao campo.

## Rules

1. **Use `\D` para detectar não-numéricos** — `\D` equivale a `[^0-9]`, porque é o padrão mais conciso e universal para identificar qualquer caractere que não seja dígito
2. **Sempre use flag `g` (global)** — `/\D/g` não `/\D/`, porque sem global só remove a primeira ocorrência e letras subsequentes permanecem
3. **Substitua por string vazia** — `.replace(/\D/g, "")` remove os caracteres, porque substituir por espaço ou outro caractere poluiria o valor
4. **Leia, transforme e devolva ao input** — o ciclo é: ler `input.value` → aplicar replace → atribuir de volta a `input.value`, porque isso garante que o usuário nunca vê caracteres inválidos
5. **Use o evento `input`, não `keydown`** — porque `input` captura digitação, paste e autocomplete

## How to write

### Padrão de filtragem numérica

```javascript
// Ler o valor atual do input
const value = inputElement.value

// Remover todos os caracteres não numéricos e devolver ao input
inputElement.value = value.replace(/\D/g, "")
```

### Dentro de um event listener

```javascript
inputElement.addEventListener("input", (event) => {
  const value = event.target.value
  event.target.value = value.replace(/\D/g, "")
})
```

## Example

**Before (aceita qualquer caractere):**
```javascript
inputElement.addEventListener("input", (event) => {
  console.log(event.target.value) // "abc123" — letras permanecem
})
```

**After (com esta skill aplicada):**
```javascript
inputElement.addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/\D/g, "")
  // Usuário digita "abc123" → input mostra "123"
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Input de valor monetário (só dígitos) | `/\D/g` remove tudo que não é número |
| Input que aceita decimais | `/[^0-9.]/g` — preserva ponto |
| Input que aceita negativos | `/[^0-9-]/g` — preserva hífen |
| Input de CEP/CPF | Aplique máscara APÓS filtrar com `/\D/g` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (isNaN(char)) return` em keydown | `value.replace(/\D/g, "")` no evento input |
| `input.value = input.value.replace(/[a-zA-Z]/g, "")` | `input.value = input.value.replace(/\D/g, "")` — porque `[a-zA-Z]` não pega acentos e símbolos |
| Verificar caractere por caractere em loop | Um único `.replace(/\D/g, "")` resolve |
| `type="number"` como única validação | Combine `type` com replace, porque `type="number"` tem comportamento inconsistente entre browsers |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre regex, eventos de input e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-aceitando-somente-numeros-no-valor/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-aceitando-somente-numeros-no-valor/references/code-examples.md)
