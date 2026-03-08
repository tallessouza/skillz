---
name: rs-full-stack-carregando-horarios-outros-dias
description: "Enforces reactive schedule reloading when date input changes in vanilla JS forms. Use when user asks to 'update list on input change', 'reload data when select changes', 'clear and refresh options on change', or 'handle date picker change event'. Applies pattern: clear existing DOM list before repopulating, separate change handler into its own module, reuse existing load functions. Make sure to use this skill whenever building forms where changing one input must refresh another section. Not for React/Vue state management or backend scheduling logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, dom, events, onchange, modules, scheduling]
---

# Recarregar Dados ao Mudar Input

> Quando um input muda, limpe o conteudo existente antes de recarregar — nunca acumule elementos duplicados no DOM.

## Rules

1. **Separe o handler de change em seu proprio modulo** — `date.change.js` nao inline no main, porque mantem cada responsabilidade isolada e importavel
2. **Reutilize a funcao de load existente** — nunca duplique logica de fetch/render, importe do modulo original, porque DRY evita divergencia
3. **Limpe o container antes de popular** — `element.innerHTML = ""` antes de inserir novos itens, porque sem isso os itens se acumulam ao inves de substituir
4. **Registre o listener via import no main** — o modulo de change precisa ser importado no entry point para que o event listener seja registrado

## How to write

### Modulo de change handler

```javascript
// date.change.js — handler separado para mudanca de data
const selectedDate = document.getElementById("date")

import { schedulesDay } from "../schedules/load.js"

selectedDate.onchange = () => {
  schedulesDay() // reutiliza a funcao de load existente
}
```

### Limpeza antes de recarregar

```javascript
// Dentro da funcao de load (hours-load.js)
export function schedulesDay() {
  const hoursList = document.getElementById("hours")

  // Limpa a lista antes de popular com novos horarios
  hoursList.innerHTML = ""

  // ... fetch e render dos novos horarios
}
```

### Import no entry point

```javascript
// main.js — registra o listener importando o modulo
import "./form/date.change.js"
```

## Example

**Before (bug — itens acumulam):**
```javascript
// hours-load.js
export function schedulesDay() {
  const hoursList = document.getElementById("hours")
  // Nao limpa! Novos horarios se somam aos anteriores
  hours.forEach((hour) => {
    hoursList.appendChild(createHourItem(hour))
  })
}
```

**After (correto — limpa antes de popular):**
```javascript
// hours-load.js
export function schedulesDay() {
  const hoursList = document.getElementById("hours")
  hoursList.innerHTML = "" // Limpa lista existente
  hours.forEach((hour) => {
    hoursList.appendChild(createHourItem(hour))
  })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input A muda e deve atualizar secao B | Crie `a.change.js`, importe load de B, limpe B antes de popular |
| Funcao de load ja existe | Importe e reutilize, nao duplique |
| Lista renderizada aparece duplicada | Falta `innerHTML = ""` antes do render |
| Listener nao dispara | Verifique se o modulo foi importado no entry point |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Duplicar logica de fetch no handler de change | Importar a funcao de load existente |
| Popular lista sem limpar antes | `container.innerHTML = ""` antes de appendChild |
| Colocar handler de change inline no main.js | Criar modulo separado `input.change.js` |
| `addEventListener` dentro do modulo de load | Separar registro de evento do carregamento de dados |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Itens duplicam ao mudar a data | Falta `innerHTML = ""` antes de popular | Adicione limpeza do container antes do render |
| Listener de change nao dispara | Modulo de change nao importado no entry point | Adicione `import "./form/date.change.js"` no main.js |
| Funcao de load nao acessivel | Export ausente na funcao original | Adicione `export` na declaracao da funcao |
| Lista fica vazia apos mudar data | Funcao de load nao recebe a nova data | Verifique se `selectedDate.value` e passado corretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de modulos e o bug de acumulacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes