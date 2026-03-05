---
name: rs-full-stack-atualizando-lista-agendamentos
description: "Enforces UI state refresh after form submissions in JavaScript applications. Use when user asks to 'submit a form', 'create a booking', 'save and refresh list', 'reload data after POST', or 'clear form after submit'. Applies rules: reload related lists after mutations, clear input fields post-submit, centralize data-loading functions for reuse across events. Make sure to use this skill whenever building form submission handlers that modify server state. Not for initial page load, static forms, or backend API design."
---

# Atualizando a Lista Apos Mutacoes

> Apos qualquer mutacao (POST/PUT/DELETE), recarregue a lista afetada e limpe os campos do formulario para o proximo uso.

## Rules

1. **Recarregue a lista apos submit** — chame a funcao de load centralizada apos o POST, porque o usuario precisa ver o resultado imediatamente sem refresh manual
2. **Centralize funcoes de carregamento** — uma unica funcao busca na API, renderiza a lista e atualiza horarios disponiveis, porque permite reusar no onChange de data E no submit do form
3. **Limpe inputs apos sucesso** — reset campos de texto com `input.value = ""`, porque prepara o formulario para a proxima entrada sem friccao
4. **Mantenha o contexto do filtro** — nao resete a data/filtro selecionado apos submit, porque o usuario quer ver a lista do dia que acabou de agendar
5. **Use await no reload** — aguarde o recarregamento completar antes de prosseguir, porque garante que a UI reflete o estado atualizado do servidor

## How to write

### Centralizar load em modulo reutilizavel

```javascript
// schedules/load.js
export async function scheduleDay() {
  const date = document.getElementById("date").value
  const schedules = await fetchSchedulesByDate(date)
  renderSchedules(schedules)
  renderAvailableHours(schedules)
}
```

### Chamar reload apos submit

```javascript
import { scheduleDay } from "./schedules/load.js"

form.onsubmit = async (e) => {
  e.preventDefault()
  await createSchedule({ name, date, hour })
  await scheduleDay() // recarrega lista + horarios
  clientNameInput.value = "" // limpa input
}
```

## Example

**Before (lista nao atualiza apos submit):**
```javascript
form.onsubmit = async (e) => {
  e.preventDefault()
  await apiPost("/schedules", { name, date, hour })
  alert("Agendamento realizado!")
  // lista continua mostrando estado antigo
  // input ainda tem o nome anterior
}
```

**After (com reload e limpeza):**
```javascript
import { scheduleDay } from "./schedules/load.js"

form.onsubmit = async (e) => {
  e.preventDefault()
  await apiPost("/schedules", { name, date, hour })
  alert("Agendamento realizado!")
  await scheduleDay() // recarrega agendamentos e horarios
  clientNameInput.value = "" // limpa input para proximo agendamento
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Form POST/PUT/DELETE altera dados listados na tela | Chamar funcao de reload centralizada apos mutacao |
| Multiplos eventos precisam recarregar mesma lista | Extrair load para modulo separado e importar |
| Input de texto apos submit bem-sucedido | `input.value = ""` |
| Filtro/data selecionado apos submit | Manter o valor atual (nao resetar) |
| Feedback ao usuario (alert/toast) | Mostrar antes do reload para resposta imediata |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Reload manual da pagina (`location.reload()`) | `await scheduleDay()` (reload parcial via JS) |
| Duplicar logica de fetch em cada evento | Centralizar em um modulo e importar |
| Deixar inputs preenchidos apos submit | `input.value = ""` apos sucesso |
| Resetar filtro/data apos submit | Manter contexto do filtro selecionado |
| Chamar reload sem await | `await scheduleDay()` para garantir consistencia |
| Copiar/colar fetch + render em onChange e onSubmit | Uma funcao `scheduleDay()` chamada em ambos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre centralizacao de funcionalidades e separacao de responsabilidades
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes