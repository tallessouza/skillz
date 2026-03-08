---
name: rs-full-stack-eventos-em-input
description: "Applies correct JavaScript input event handling patterns when working with form inputs. Use when user asks to 'handle input events', 'capture keypress', 'detect typing', 'listen for input changes', 'validate on type', or any form interaction task. Enforces choosing between keydown, keypress, and change events based on use case. Make sure to use this skill whenever implementing input event listeners or form field interactions. Not for click events, form submission, or non-input DOM events."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, events, input, keydown, keypress]
---

# Eventos em Input

> Escolha o evento de input correto pelo comportamento desejado: keydown captura tudo, keypress filtra caracteres, change dispara ao sair.

## Rules

1. **Use `keydown` quando precisar capturar TODAS as teclas** — incluindo Ctrl, Shift, Alt, porque é o unico evento que detecta teclas modificadoras
2. **Use `keypress` quando precisar apenas de caracteres imprimiveis** — letras, numeros, espacos, pontuacao, porque ignora Ctrl/Shift/Alt automaticamente
3. **Use `change` quando precisar do valor FINAL** — dispara apenas quando o usuario SAI do input (blur), porque evita processamento desnecessario durante digitacao
4. **Acesse `event.key` para obter a tecla pressionada** — nao use `event.keyCode` (deprecated), porque `.key` retorna string legivel como `"r"`, `"Shift"`
5. **Prefira `addEventListener` sobre `on*` properties** — permite multiplos listeners no mesmo elemento, porque atribuir `oninput =` sobrescreve listeners anteriores
6. **Separe handlers em funcoes nomeadas quando reutilizar logica** — `input.onchange = inputChange` em vez de inline, porque facilita teste e reutilizacao

## How to write

### Capturar todas as teclas (incluindo modificadores)

```javascript
const input = document.querySelector("input")

input.addEventListener("keydown", (event) => {
  console.log(event.key) // "r", "Shift", "Control", etc.
})
```

### Capturar apenas caracteres imprimiveis

```javascript
input.addEventListener("keypress", (event) => {
  console.log(event.key) // "r", "o", " " — ignora Shift, Ctrl
})
```

### Reagir quando usuario termina de editar

```javascript
input.addEventListener("change", (event) => {
  console.log("Valor final:", event.target.value)
})
```

## Example

**Before (evento errado para o caso de uso):**
```javascript
// Quer validar so caracteres, mas captura Shift/Ctrl desnecessariamente
input.addEventListener("keydown", (event) => {
  validateCharacter(event.key) // Shift, Ctrl passam pela validacao
})
```

**After (evento correto):**
```javascript
// keypress ignora modificadores automaticamente
input.addEventListener("keypress", (event) => {
  validateCharacter(event.key) // So caracteres imprimiveis
})
```

## Heuristics

| Situacao | Evento |
|----------|--------|
| Validar cada caractere digitado | `keypress` |
| Detectar atalhos de teclado (Ctrl+S) | `keydown` |
| Processar valor completo apos edicao | `change` |
| Reagir a cada alteracao em tempo real | `input` (complementar) |
| Capturar teclas especiais (Escape, Arrow) | `keydown` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `keydown` para validar caracteres | `keypress` — filtra modificadores |
| `keypress` para detectar Ctrl+C | `keydown` — captura modificadores |
| `change` para feedback em tempo real | `keypress` ou `input` — disparam durante digitacao |
| `input.onchange = fn1; input.onchange = fn2` | `addEventListener("change", fn1)` + `addEventListener("change", fn2)` |
| `event.keyCode === 13` | `event.key === "Enter"` — legivel e nao deprecated |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Shift/Ctrl disparam validacao de caractere | Usando `keydown` em vez de `keypress` | Trocar para `keypress` que ignora modificadores |
| Atalho Ctrl+S nao e capturado | Usando `keypress` que ignora modificadores | Trocar para `keydown` que captura tudo |
| Handler dispara so ao sair do campo | Usando `change` em vez de `keypress`/`input` | Usar `keypress` ou `input` para feedback em tempo real |
| `event.keyCode` retorna deprecated warning | Usando API antiga | Trocar para `event.key` que retorna string legivel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar cada evento, analogia da caixa de ferramentas
- [code-examples.md](references/code-examples.md) — Todos os exemplos da aula com variacoes e cenarios reais