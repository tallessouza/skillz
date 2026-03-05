---
name: rs-full-stack-buscando-agendamentos-api
description: "Applies async data fetching patterns when consuming APIs in vanilla JavaScript modules. Use when user asks to 'fetch data from API', 'load schedules', 'call backend endpoint', 'consume server data', or builds frontend modules that load data. Enforces async/await with named service imports, object parameters for flexibility, and proper module separation. Make sure to use this skill whenever creating frontend code that fetches filtered data from an API. Not for React/framework state management, backend API creation, or database queries."
---

# Buscando Dados da API com Async/Await

> Ao buscar dados de uma API em modulos frontend, importe o service nomeado, use async/await, e passe parametros como objeto para flexibilidade.

## Rules

1. **Importe services pelo nome exato** — use o autocomplete do editor para evitar erros de digitacao, porque nomes errados causam bugs silenciosos em imports
2. **Adicione async na funcao antes de usar await** — o await so funciona dentro de funcoes async, caso contrario o JavaScript lanca erro de sintaxe
3. **Passe parametros como objeto** — `{ date }` nao `date`, porque objetos sao flexiveis para adicionar propriedades sem quebrar a ordem dos argumentos
4. **Separe fetch da renderizacao** — busque os dados primeiro, renderize depois em metodo separado, porque isso permite testar e reutilizar cada parte independentemente
5. **Use console.log para validar antes de renderizar** — confirme que os dados chegam corretos da API antes de construir a UI, porque debugar dados errados na tela e mais dificil

## How to write

### Import do service

```javascript
// Importe a funcao de service pelo nome exato definido no modulo
import { scheduleFetchByDay } from "./services/schedule-fetch-by-day.js"
```

### Fetch assincrono com objeto de parametros

```javascript
// Marque a funcao como async e passe parametros como objeto
async function loadSchedules(date) {
  const dailySchedules = await scheduleFetchByDay({ date })

  // Valide no console antes de renderizar
  console.log(dailySchedules)
}
```

## Example

**Before (erro comum — await sem async, parametro solto):**
```javascript
import { scheduleFetchByDay } from "./services/schedule-fetch-by-day.js"

function loadSchedules(date) {
  // ERRO: await sem async
  const dailySchedules = await scheduleFetchByDay(date)
  console.log(dailySchedules)
}
```

**After (com esta skill aplicada):**
```javascript
import { scheduleFetchByDay } from "./services/schedule-fetch-by-day.js"

async function loadSchedules(date) {
  const dailySchedules = await scheduleFetchByDay({ date })
  console.log(dailySchedules)
  // Proxximo passo: renderizar na tela
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao precisa de await | Adicione async na declaracao |
| Service recebe 1 parametro | Passe como objeto mesmo assim — futuro-proof |
| Dados retornam da API | console.log primeiro, renderize depois |
| Nome do import e longo | Use autocomplete, nao digite manualmente |
| Quer adicionar filtros novos | Adicione propriedade no objeto, sem mudar assinatura |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `await fn(date)` sem async | `async function() { await fn({ date }) }` |
| `scheduleFetchByDay(date, userId)` | `scheduleFetchByDay({ date, userId })` |
| Fetch e render na mesma funcao monolitica | Fetch separado, render em metodo dedicado |
| Digitar nome do import manualmente | Usar autocomplete do editor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre async/await, objetos como parametros e separacao fetch/render
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula expandidos com variacoes