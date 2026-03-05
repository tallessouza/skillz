---
name: rs-full-stack-capturando-evento-input
description: "Applies input event handling patterns when writing JavaScript form validation code. Use when user asks to 'validate input', 'capture input changes', 'listen to form input', 'filter input characters', or 'restrict input to numbers only'. Enforces onInput event usage for character-by-character validation, proper element selection by ID, and organized code with section comments. Make sure to use this skill whenever building form input validation or filtering user input in real-time. Not for form submission handling, backend validation, or React/framework-specific form patterns."
---

# Capturando o Evento de Input

> Para validar entrada de dados em tempo real, use o evento `oninput` que dispara a cada caractere digitado, permitindo validacao caractere a caractere.

## Rules

1. **Selecione elementos pelo ID com `getElementById`** — `document.getElementById("amount")` nao `document.querySelector("#amount")`, porque getElementById e mais explicito sobre a estrategia de selecao e mais performatico
2. **Use `oninput` para captura em tempo real** — `element.oninput` nao `onchange`, porque `oninput` dispara a cada caractere digitado enquanto `onchange` so dispara ao perder o foco
3. **Agrupe selecoes de elementos no topo** — organize com comentario `// Seleciona os elementos do formulario` antes do bloco de selecoes, porque facilita localizar e manter as referencias
4. **Use `const` para elementos do DOM** — `const amount = document.getElementById("amount")` nao `let`, porque a referencia ao elemento nao muda
5. **Valide caractere a caractere** — o evento `oninput` dispara inclusive ao apagar, toda interacao com o input e capturada

## How to write

### Selecionar e observar um input

```javascript
// Seleciona os elementos do formulario
const amount = document.getElementById("amount")

// Observa entrada de conteudo no input
amount.oninput = () => {
  // Cada caractere digitado ou apagado dispara este evento
  // Valide ou transforme o valor aqui
}
```

### Padrao completo de validacao numerica

```javascript
const amount = document.getElementById("amount")

amount.oninput = () => {
  // Remove tudo que nao for numero
  amount.value = amount.value.replace(/\D/g, "")
}
```

## Example

**Before (input aceita qualquer caractere):**
```html
<input id="amount" type="text" placeholder="Valor da despesa">
```
```javascript
// Sem validacao — usuario digita letras, simbolos, qualquer coisa
```

**After (com evento oninput validando):**
```javascript
const amount = document.getElementById("amount")

amount.oninput = () => {
  amount.value = amount.value.replace(/\D/g, "")
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input deve aceitar so numeros | Use `oninput` + regex `replace(/\D/g, "")` |
| Precisa reagir a cada tecla | Use `oninput` (nao `onchange`) |
| Precisa reagir ao perder foco | Use `onchange` |
| Input tem ID no HTML | Use `getElementById` para selecionar |
| Multiplos inputs para validar | Agrupe todas as selecoes no topo com comentario organizador |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `element.onchange` para validacao em tempo real | `element.oninput` |
| `let amount = ...` para referencia DOM fixa | `const amount = ...` |
| `addEventListener("keydown", ...)` para filtrar conteudo | `element.oninput` (captura tudo: digitacao, colagem, apagar) |
| Selecoes de elementos espalhadas pelo codigo | Agrupadas no topo com comentario de secao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre oninput vs onchange, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-capturando-o-evento-de-input/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-capturando-o-evento-de-input/references/code-examples.md)
