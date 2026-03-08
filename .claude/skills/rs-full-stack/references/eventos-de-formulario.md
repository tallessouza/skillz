---
name: rs-full-stack-eventos-de-formulario
description: "Applies correct form event handling patterns when writing JavaScript/TypeScript form code. Use when user asks to 'handle form submit', 'add form listener', 'create a form', 'submit event', or any form interaction code. Enforces addEventListener over onsubmit for multiple listeners, preventDefault usage, and submit vs click distinctions. Make sure to use this skill whenever generating form handling code. Not for CSS styling, form validation libraries, or backend form processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, forms, events, submit, addEventListener]
---

# Eventos de Formulário

> Ao lidar com eventos de formulário, use addEventListener para garantir que todos os listeners executem, e prefira submit sobre click para capturar tanto cliques quanto Enter.

## Rules

1. **Use addEventListener em vez de onsubmit** — `form.addEventListener('submit', handler)` não `form.onsubmit = handler`, porque onsubmit sobrescreve listeners anteriores (só o último funciona)
2. **Sempre chame preventDefault no submit** — `event.preventDefault()` no início do handler, porque o comportamento padrão recarrega a página
3. **Prefira evento submit sobre click** — submit captura tanto clique no botão quanto Enter nos inputs, click exige interação com mouse
4. **Selecione o formulário, não o botão** — adicione o listener no `<form>`, porque submit é um evento do formulário, não do botão

## How to write

### Formulário com addEventListener (correto)

```javascript
const form = document.querySelector('form')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  // lógica do formulário aqui
})
```

### Múltiplos listeners (funciona com addEventListener)

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault()
  validateFields()
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  sendAnalytics()
})
// Ambos executam — addEventListener acumula listeners
```

## Example

**Before (onsubmit — segundo sobrescreve o primeiro):**

```javascript
form.onsubmit = (event) => {
  event.preventDefault()
  console.log('Validação') // NUNCA EXECUTA
}

form.onsubmit = (event) => {
  event.preventDefault()
  console.log('Envio') // Só este executa
}
```

**After (addEventListener — ambos executam):**

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('Validação') // Executa
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  console.log('Envio') // Também executa
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com um único handler simples | addEventListener ainda é preferível por consistência |
| Precisa de múltiplos handlers no mesmo form | addEventListener obrigatório (onsubmit sobrescreve) |
| Capturar Enter nos inputs do form | Use evento submit no form, não click no botão |
| Precisa capturar só clique no botão | Use click, mas saiba que Enter não será capturado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `form.onsubmit = handler` | `form.addEventListener('submit', handler)` |
| `button.addEventListener('click', ...)` para submit | `form.addEventListener('submit', ...)` |
| Handler de submit sem preventDefault | `event.preventDefault()` como primeira linha |
| `form.onclick = handler` | `form.addEventListener('submit', handler)` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pagina recarrega ao submeter formulario | Falta `event.preventDefault()` | Adicionar como primeira linha do handler |
| Segundo listener nao executa | Usando `form.onsubmit` que sobrescreve | Trocar para `form.addEventListener('submit', handler)` |
| Enter no input nao dispara handler | Listener no botao via `click` em vez de `submit` no form | Usar `form.addEventListener('submit', ...)` |
| Handler dispara duas vezes | Listener registrado mais de uma vez | Verificar se nao ha chamada duplicada de `addEventListener` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre onsubmit vs addEventListener e comportamento de acumulação
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula com variações