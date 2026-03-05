---
name: rs-full-stack-obtendo-o-valor-digitado
description: "Applies DOM input value capture patterns when writing JavaScript that reads user input. Use when user asks to 'get input value', 'capture form input', 'read what user typed', 'listen to input changes', or 'handle input events'. Enforces getElementById selection, addEventListener with 'input' event, and .value access. Make sure to use this skill whenever capturing user input from HTML elements. Not for form submission, validation logic, or backend data processing."
---

# Capturando Valor de Input com JavaScript

> Selecione o elemento pelo id, observe o evento de input, e acesse o valor com `.value`.

## Rules

1. **Use `getElementById` para selecionar inputs por id** — porque é o método mais direto e performático quando o elemento tem id definido no HTML
2. **Use `addEventListener('input', ...)` para capturar digitação em tempo real** — porque o evento `input` dispara a cada caractere inserido, diferente de `change` que só dispara ao sair do campo
3. **Acesse o valor com `.value`** — porque `.value` retorna o conteúdo atual do input como string, não o atributo HTML
4. **Armazene a referência do elemento em uma `const` no topo** — porque evita buscas repetidas na DOM e deixa claro quais elementos o script manipula
5. **Nomeie a variável pelo id do input** — `amount` para `id="amount"`, porque mantém correspondência direta entre HTML e JS

## How to write

### Selecionar e observar um input

```javascript
// Capturando o input amount para receber o valor digitado
const amount = document.getElementById("amount")

amount.addEventListener("input", () => {
  console.log(amount.value)
})
```

### Estrutura HTML esperada

```html
<input type="text" name="amount" id="amount" placeholder="0,00" required />
```

## Example

**Before (erro comum — evento errado e sem referência):**
```javascript
document.querySelector("#amount").addEventListener("change", function() {
  const val = document.querySelector("#amount").value
  console.log(val)
})
```

**After (com esta skill aplicada):**
```javascript
const amount = document.getElementById("amount")

amount.addEventListener("input", () => {
  console.log(amount.value)
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Input tem `id` definido | Use `getElementById` |
| Input só tem classe | Use `querySelector(".classe")` |
| Precisa reagir a cada tecla | Use evento `"input"` |
| Precisa reagir ao sair do campo | Use evento `"change"` |
| Referência usada mais de uma vez | Armazene em `const` no topo |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `document.querySelector("#id")` repetido | `const el = document.getElementById("id")` uma vez |
| `addEventListener("change", ...)` para captura em tempo real | `addEventListener("input", ...)` |
| `element.getAttribute("value")` | `element.value` |
| Variável com nome genérico `el`, `input1` | Nome igual ao id: `amount`, `username` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre eventos de input, métodos de seleção DOM e boas práticas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações