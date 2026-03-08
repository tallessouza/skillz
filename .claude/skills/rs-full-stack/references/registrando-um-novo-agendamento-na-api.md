---
name: rs-full-stack-registrando-agendamento-api
description: "Applies async form submission pattern when wiring frontend forms to backend API methods. Use when user asks to 'submit a form', 'save form data', 'connect form to API', 'register/create via form submit', or 'handle form submission'. Ensures proper async/await on submit handlers, module imports with file extensions, and replacing console.log with actual API calls. Make sure to use this skill whenever implementing form-to-server data flow. Not for form validation, form layout/styling, or backend API creation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: frontend-integration
  tags:
    - javascript
    - forms
    - async-await
    - api-integration
    - frontend
---

# Registrando Agendamento via API (Form Submit → Server)

> Ao conectar um formulário a uma funcao do servidor, importe o metodo, substitua o console.log pela chamada real, e garanta async/await no handler de submit.

## Rules

1. **Importe o metodo do servidor antes de usar** — coloque o import no topo do modulo, antes de capturar elementos DOM, porque organiza dependencias antes da logica
2. **Inclua a extensao do arquivo no import** — `import { fn } from '../server.js'` nao `'../server'`, porque ambientes sem bundler (vanilla JS, Node ESM) exigem extensao explicita
3. **Substitua console.log pela chamada real** — console.log e placeholder de desenvolvimento, nunca deve ir para producao
4. **Marque o handler de submit como async** — `async (event) => { ... }` porque a funcao do servidor e assincrona e precisa de await
5. **Use await na chamada ao servidor** — `await createSchedule(data)` garante que a operacao completa antes de prosseguir
6. **Construa o objeto de dados antes da chamada** — monte o payload com os valores do formulario e passe como argumento unico

## How to write

### Import do metodo do servidor

```javascript
// Importe ANTES de capturar elementos DOM
import { scheduleNew } from '../services/schedule.js'

const form = document.querySelector('#form')
```

### Handler de submit com async/await

```javascript
form.onsubmit = async (event) => {
  event.preventDefault()

  const data = {
    date: selectedDate,
    hour: selectedHour,
    name: nameInput.value,
  }

  // Chamada real ao servidor (nao console.log)
  await scheduleNew(data)

  alert('Agendamento realizado com sucesso!')
}
```

## Example

**Before (placeholder de desenvolvimento):**

```javascript
import { scheduleNew } from '../services/schedule'

form.onsubmit = (event) => {
  event.preventDefault()
  const data = { date: selectedDate, hour, name: nameInput.value }
  console.log(data) // placeholder — nunca vai pro servidor
}
```

**After (com esta skill aplicada):**

```javascript
import { scheduleNew } from '../services/schedule.js'

form.onsubmit = async (event) => {
  event.preventDefault()
  const data = { date: selectedDate, hour, name: nameInput.value }
  await scheduleNew(data)
  alert('Agendamento realizado com sucesso!')
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Form handler chama funcao que retorna Promise | Marque handler como `async`, use `await` |
| Console.log no submit com dados prontos | Substituir por chamada real ao servidor |
| Import de modulo JS sem bundler | Sempre incluir extensao `.js` |
| Dados do form ja montados em objeto | Passar objeto direto para funcao do servidor |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `console.log(data)` no submit final | `await serverFunction(data)` |
| `form.onsubmit = (e) => { await ... }` | `form.onsubmit = async (e) => { await ... }` |
| `import { fn } from '../server'` (sem extensao) | `import { fn } from '../server.js'` |
| `serverFunction(data)` sem await | `await serverFunction(data)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre async/await em handlers de evento e fluxo form→server
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro "await is only valid in async function" | Handler de submit nao esta marcado como `async` | Adicione `async` antes do parametro: `async (event) => {}` |
| Import falha com "module not found" | Extensao `.js` ausente no import | Adicione extensao explicita: `from '../server.js'` |
| Dados nao chegam no servidor | Usando `console.log` em vez da chamada real | Substitua `console.log(data)` por `await serverFunction(data)` |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-registrando-um-novo-agendamento-na-api/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-registrando-um-novo-agendamento-na-api/references/code-examples.md)
