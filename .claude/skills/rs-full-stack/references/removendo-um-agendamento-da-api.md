---
name: rs-full-stack-removendo-agendamento-api
description: "Applies the delete-and-reload pattern when implementing cancellation or removal features against a REST API. Use when user asks to 'cancel an appointment', 'remove an item via API', 'delete a booking', 'implement a cancel button', or 'add delete functionality'. Enforces confirmation before delete, proper error handling, and list reload after successful deletion. Make sure to use this skill whenever implementing any delete/cancel flow that hits an API endpoint. Not for database-level deletion, bulk operations, or soft-delete strategies."
---

# Removendo Agendamentos da API

> Ao implementar cancelamento via API, sempre confirme com o usuario, faca a requisicao DELETE, e recarregue a lista para refletir o estado atual.

## Rules

1. **Isole a funcao de cancelamento em arquivo proprio** — `schedule-cancel.js` separado, porque mantem responsabilidade unica e facilita reutilizacao
2. **Receba apenas o ID como parametro** — a funcao de cancel so precisa do identificador do recurso, porque o endpoint REST ja sabe o que fazer com DELETE /resource/:id
3. **Use try/catch com feedback ao usuario** — alert de erro no catch, alert de sucesso apos o delete, porque o usuario precisa saber se funcionou ou nao
4. **Confirme antes de deletar** — use `confirm()` antes de chamar a API, porque delecao e irreversivel e cliques acidentais acontecem
5. **Recarregue a lista apos deletar** — chame a funcao de load apos o cancel bem-sucedido, porque a UI precisa refletir o estado atual (horario liberado, item removido)
6. **Use metodo DELETE explicitamente** — passe `{ method: "DELETE" }` no fetch, porque o padrao e GET e a API precisa do verbo correto

## How to write

### Funcao de cancelamento isolada

```javascript
// schedule-cancel.js
import { apiConfig } from "./api-config.js"

export async function scheduleCancel(id) {
  try {
    await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
      method: "DELETE",
    })

    alert("Agendamento cancelado com sucesso!")
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel cancelar o agendamento.")
  }
}
```

### Fluxo completo: confirmar, deletar, recarregar

```javascript
import { scheduleCancel } from "./services/schedule-cancel.js"
import { scheduleFetchByDay } from "./services/schedule-fetch-by-day.js"

async function onCancelClick(id) {
  if (!id) return

  const isConfirmed = confirm("Tem certeza que deseja cancelar o agendamento?")
  if (!isConfirmed) return

  await scheduleCancel(id)
  await loadSchedules() // recarrega a lista para liberar o horario
}
```

## Example

**Before (tudo misturado, sem confirmacao):**
```javascript
async function cancel(id) {
  await fetch(`http://localhost:3000/schedules/${id}`, { method: "DELETE" })
  // esqueceu de recarregar a lista
  // esqueceu de confirmar com o usuario
  // sem tratamento de erro
}
```

**After (com esta skill aplicada):**
```javascript
// services/schedule-cancel.js — isolado
import { apiConfig } from "./api-config.js"

export async function scheduleCancel(id) {
  try {
    await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
      method: "DELETE",
    })
    alert("Agendamento cancelado com sucesso!")
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel cancelar o agendamento.")
  }
}

// No modulo de UI — fluxo completo
async function onCancelClick(id) {
  if (!id) return

  const isConfirmed = confirm("Tem certeza que deseja cancelar o agendamento?")
  if (!isConfirmed) return

  await scheduleCancel(id)
  await loadSchedules()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Usuario clica em cancelar/remover | Confirmar com `confirm()` antes de chamar API |
| DELETE retorna sucesso | Recarregar a lista inteira para refletir estado atual |
| DELETE falha | Mostrar alert de erro, nao alterar a UI |
| Funcao precisa do ID | Receber como parametro, nunca acessar estado global |
| Varios modulos fazem delete | Extrair funcao em arquivo de service reutilizavel |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fetch(url)` sem method para delete | `fetch(url, { method: "DELETE" })` |
| Deletar sem confirmar com usuario | `confirm("Tem certeza?")` antes do fetch |
| Deletar e nao recarregar a lista | `await loadSchedules()` apos o cancel |
| URL hardcoded no fetch | `apiConfig.baseURL + "/resource/" + id` |
| Funcao de cancel dentro do componente UI | Arquivo separado `schedule-cancel.js` |
| Ignorar erro silenciosamente | try/catch com alert informando o usuario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao confirmar-deletar-recarregar
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-removendo-um-agendamento-da-api/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-removendo-um-agendamento-da-api/references/code-examples.md)
