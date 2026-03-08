---
name: rs-full-stack-carregando-os-horarios
description: "Applies schedule loading patterns when building appointment or booking systems in JavaScript. Use when user asks to 'load available hours', 'filter past times', 'build scheduling UI', 'create booking form', or 'organize appointment code'. Enforces file organization by domain, date destructuring, past-hour filtering with dayjs, and availability mapping. Make sure to use this skill whenever generating code that deals with time slots, appointment loading, or schedule availability. Not for database schema design, API endpoint creation, or calendar UI styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, dayjs, scheduling, modules, destructuring, date-time]
---

# Carregando Horários Disponíveis

> Organize carregamento de agendamentos por domínio em pastas dedicadas, filtre horários passados dinamicamente, e retorne objetos estruturados com hora e disponibilidade.

## Rules

1. **Separe arquivos por domínio** — crie pasta `schedules/` para agendamentos e `hours-load.js` para horários, porque a estrutura de pastas comunica a intenção do código
2. **Centralize carregamentos relacionados** — o arquivo `load.js` do domínio chama todos os sub-carregamentos (horários, agendamentos do dia), porque facilita manutenção e evita imports espalhados
3. **Use desestruturação para extrair dados** — `const [hour] = time.split(":")` em vez de `time.split(":")[0]`, porque comunica a intenção de pegar apenas a hora
4. **Receba parâmetros como objeto** — `function hoursLoad({ date })` em vez de `function hoursLoad(date)`, porque independe da ordem e facilita extensão futura
5. **Nomeie booleanos com prefixo `is`** — `isHourPast`, `isAvailable`, porque indica claramente que guarda valor booleano para condições
6. **Retorne objetos estruturados do map** — `return { hour, available }` em vez de retornar apenas o valor, porque permite uso flexível na UI

## How to write

### Estrutura de pastas por domínio

```
src/
├── modules/
│   └── schedules/
│       ├── load.js          # Centralizador de carregamentos do dia
│       └── hours-load.js    # Carrega horários disponíveis
├── utils/
│   └── opening-hours.js     # Horários de funcionamento
└── page-load.js             # Entry point da página
```

### Centralizador de carregamento

```javascript
// schedules/load.js — centraliza todos os carregamentos de agendamento
import { hoursLoad } from "./hours-load.js"

const selectedDate = document.getElementById("date")

export function schedulesDay() {
  const date = selectedDate.value

  // Carrega horários disponíveis (lado esquerdo - formulário)
  hoursLoad({ date })

  // Futuramente: carrega agendamentos do dia (lado direito - lista)
}
```

### Filtro de horários passados com dayjs

```javascript
// schedules/hours-load.js
import dayjs from "dayjs"
import { openingHours } from "../../utils/opening-hours.js"

export function hoursLoad({ date }) {
  const available = openingHours.map((hour) => {
    const [scheduleHour] = hour.split(":")

    const isHourPast = dayjs(date)
      .add(scheduleHour, "hour")
      .isAfter(dayjs())

    return { hour: scheduleHour, available: isHourPast }
  })

  return available
}
```

## Example

**Before (tudo misturado, sem filtro):**
```javascript
const hours = ["09:00", "10:00", "11:00", "12:00"]
const select = document.querySelector("select")
hours.forEach(h => {
  const opt = document.createElement("option")
  opt.value = h
  opt.text = h
  select.add(opt)
})
```

**After (com esta skill aplicada):**
```javascript
// schedules/hours-load.js
import dayjs from "dayjs"
import { openingHours } from "../../utils/opening-hours.js"

export function hoursLoad({ date }) {
  return openingHours.map((hour) => {
    const [scheduleHour] = hour.split(":")

    const isAvailable = dayjs(date)
      .add(scheduleHour, "hour")
      .isAfter(dayjs())

    return { hour: scheduleHour, available: isAvailable }
  })
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Múltiplos carregamentos do mesmo domínio | Centralize em um `load.js` dentro da pasta do domínio |
| Precisa extrair parte de uma string formatada | Use `split()` + desestruturação |
| Função recebe 2+ parâmetros | Passe como objeto desestruturado |
| Verificação de tempo passado/futuro | Use `dayjs().isAfter()` ou `isBefore()` com a data atual |
| Booleano para controle de UI | Nomeie com `is` + causa (`isHourPast`), retorne no map |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `time.split(":")[0]` | `const [hour] = time.split(":")` |
| `function load(date, type, filter)` | `function load({ date, type, filter })` |
| `const past = ...` (booleano sem `is`) | `const isHourPast = ...` |
| Todo código de loading em um arquivo só | Pasta por domínio com `load.js` centralizador |
| `if (hour < new Date().getHours())` | `dayjs(date).add(hour, "hour").isAfter(dayjs())` |
| Retornar apenas `hour` do map | Retornar `{ hour, available }` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Todos os horarios aparecem como indisponiveis | Data passada sendo usada na comparacao | Verifique se `dayjs(date)` recebe a data correta do input |
| `dayjs is not defined` | Modulo dayjs nao importado | Adicione `import dayjs from "dayjs"` no topo do arquivo |
| Horarios do dia anterior persistem | Funcao de load nao limpa lista antes de popular | Adicione `innerHTML = ""` antes do render |
| Desestruturacao retorna `undefined` | `split(":")` nao encontra o separador na string | Verifique o formato dos horarios em `openingHours` |
| Funcao nao exportada para outros modulos | Falta `export` na declaracao | Use `export function hoursLoad(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre organização por domínio, centralização de loads e estratégia de filtro temporal
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e walkthrough passo a passo