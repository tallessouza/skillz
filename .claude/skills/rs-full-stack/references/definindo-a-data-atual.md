---
name: rs-full-stack-definindo-a-data-atual
description: "Applies form data capture and date input initialization patterns when building HTML forms with JavaScript. Use when user asks to 'capture form data', 'set default date', 'block past dates', 'prevent form reload', 'organize code in modules', or 'submit form to API'. Enforces module-based file organization, preventDefault on submit, current date preloading, and minimum date constraints. Make sure to use this skill whenever creating forms that interact with date inputs or APIs. Not for backend API implementation, database operations, or CSS styling."
---

# Captura de Formulario e Inicializacao de Data

> Organize codigo de formulario em modulos separados, previna comportamento padrao do submit, e inicialize inputs de data com a data atual e restricao de datas passadas.

## Rules

1. **Separe funcionalidades em modulos** — crie `src/modules/{feature}/` com arquivos por responsabilidade, porque facilita manutencao e cada arquivo tem uma unica responsabilidade
2. **Sempre previna o reload no submit** — use `event.preventDefault()` no handler do formulario, porque o comportamento padrao do navegador recarrega a pagina e perde estado
3. **Pre-carregue a data atual em inputs de data** — defina `input.value` com a data formatada no load, porque placeholder vazio (dd/mm/aaaa) nao ajuda o usuario
4. **Bloqueie datas passadas** — defina `input.min` com a data atual, porque agendamentos no passado sao invalidos
5. **Elimine repeticao de formatacao** — extraia valores repetidos (como data formatada) em constantes, porque mudancas futuras ficam em um unico lugar
6. **Importe modulos no entry point** — carregue os modulos JS no `main.js` separando imports CSS de imports JS com comentarios

## How to write

### Estrutura de modulos

```
src/
├── main.js              # Entry point, imports
└── modules/
    └── form/
        └── submit.js    # Logica de submit do formulario
```

### Handler de submit com preventDefault

```javascript
const form = document.querySelector("form")

form.onsubmit = (event) => {
  event.preventDefault()
  // captura e envia dados para API
}
```

### Inicializacao de data com dayjs

```javascript
import dayjs from "dayjs"

const selectedDate = document.getElementById("date")

const inputToday = dayjs(new Date()).format("YYYY-MM-DD")

// Carrega a data atual e define a data minima como sendo a data atual
selectedDate.value = inputToday
selectedDate.min = inputToday
```

### Import no main.js

```javascript
import "./style/global.css"

// JS
import "./modules/form/submit.js"
```

## Example

**Before (sem inicializacao de data):**
```javascript
// main.js - tudo junto, sem modulos
const form = document.querySelector("form")
form.onsubmit = () => {
  // pagina recarrega, dados perdidos
  fetch("/api/schedule", { method: "POST" })
}
// input de data mostra placeholder "dd/mm/aaaa"
```

**After (com this skill applied):**
```javascript
// modules/form/submit.js
import dayjs from "dayjs"

const form = document.querySelector("form")

form.onsubmit = (event) => {
  event.preventDefault()
  // captura dados e envia para API
}

const selectedDate = document.getElementById("date")
const inputToday = dayjs(new Date()).format("YYYY-MM-DD")

selectedDate.value = inputToday
selectedDate.min = inputToday
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Input de data em formulario | Pre-carregue com data atual e defina `.min` |
| Formulario com submit | Sempre `preventDefault()` antes de qualquer logica |
| Valor formatado usado 2+ vezes | Extraia em constante (`inputToday`) |
| Novo arquivo de funcionalidade | Crie em `modules/{feature}/{arquivo}.js` |
| Input HTML date | Use formato `YYYY-MM-DD` (padrao do HTML5) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| Todo codigo JS no main.js | Modulos separados em `modules/` |
| `form.onsubmit` sem `preventDefault` | `event.preventDefault()` como primeira linha |
| Data duplicada em `.value` e `.min` | Constante `inputToday` reutilizada |
| Input de data com placeholder vazio | `.value = dayjs().format("YYYY-MM-DD")` |
| Permitir selecao de datas passadas | `.min = inputToday` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre modularizacao, preventDefault e restricoes de data
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-definindo-a-data-atual/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-definindo-a-data-atual/references/code-examples.md)
