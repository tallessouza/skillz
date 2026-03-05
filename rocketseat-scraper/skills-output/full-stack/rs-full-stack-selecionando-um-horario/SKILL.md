---
name: rs-full-stack-selecionando-um-horario
description: "Applies form data preparation and validation patterns before sending to API in JavaScript/HTML projects. Use when user asks to 'submit form data', 'send data to API', 'validate form fields', 'prepare booking data', or 'handle form submission'. Enforces field validation with early return, DOM element selection for form values, date-time composition with dayjs, and unique ID generation. Make sure to use this skill whenever building form-to-API submission flows. Not for backend API handling, database operations, or React/framework form libraries."
---

# Preparando Dados do Formulário para Envio à API

> Valide cada campo obrigatório com early return antes de montar o objeto final, nunca envie dados incompletos à API.

## Rules

1. **Valide com early return** — use `if (!value) { alert(...); return; }` para cada campo obrigatório, porque isso encerra a função imediatamente e evita envio de dados nulos à API
2. **Use trim() ao recuperar inputs de texto** — `input.value.trim()` remove espaços extras, porque usuários frequentemente digitam espaços acidentais
3. **Recupere elementos selecionados via classe CSS** — `document.querySelector('.selected')` para capturar o item ativo da UI, porque a classe reflete o estado visual atual
4. **Verifique null em seleções opcionais** — querySelector retorna `null` se nada está selecionado, porque isso causa erros silenciosos ao acessar propriedades
5. **Componha data + hora antes de enviar** — use `dayjs(date).add(hour, 'hour')` para montar o datetime completo, porque a API espera um timestamp único
6. **Gere IDs simples com timestamp** — `new Date().getTime()` é suficiente para IDs temporários no frontend, porque garante unicidade por milissegundo

## How to write

### Recuperar e validar input de texto

```javascript
const clientName = document.getElementById("client")
const name = clientName.value.trim()

if (!name) {
  alert("Informe o nome do cliente.")
  return
}
```

### Recuperar elemento selecionado na UI

```javascript
const hourSelected = document.querySelector(".hour-selected")

if (!hourSelected) {
  alert("Selecione um horário.")
  return
}

const hour = hourSelected.innerText.split(":")[0]
```

### Compor data com hora usando dayjs

```javascript
const when = dayjs(selectedDate.value).add(hour, "hour")
```

### Gerar ID e montar objeto final

```javascript
const id = new Date().getTime()

const appointment = { id, name, when }
```

## Example

**Before (sem validação, dados incompletos):**

```javascript
function handleSubmit() {
  const name = document.getElementById("client").value
  const hour = document.querySelector(".hour-selected").innerText // erro se null
  const data = { name, hour }
  fetch("/api/schedule", { method: "POST", body: JSON.stringify(data) })
}
```

**After (com validações e composição correta):**

```javascript
function handleSubmit() {
  try {
    const name = document.getElementById("client").value.trim()
    if (!name) {
      alert("Informe o nome do cliente.")
      return
    }

    const hourSelected = document.querySelector(".hour-selected")
    if (!hourSelected) {
      alert("Selecione um horário.")
      return
    }

    const hour = hourSelected.innerText.split(":")[0]
    const when = dayjs(selectedDate.value).add(hour, "hour")
    const id = new Date().getTime()

    console.log({ id, name, when })
    // fetch para API aqui
  } catch (error) {
    alert("Não foi possível realizar o agendamento.")
    console.log(error)
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo de texto obrigatório | `value.trim()` + `if (!value) return` |
| Seleção visual na UI (classe ativa) | `querySelector('.classe-selected')` + verificação de null |
| Precisa combinar data e hora separadas | `dayjs(date).add(hour, 'hour')` |
| Precisa de ID único no frontend | `new Date().getTime()` |
| Operação pode falhar (fetch, parsing) | Envolva em `try/catch` com alert no catch |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `fetch(url, { body: { name: input.value } })` sem validação | Valide cada campo antes do fetch |
| `element.innerText` sem verificar se element é null | `if (!element) { alert(...); return }` antes |
| `dayjs().hour(19)` (sobrescreve hora) | `dayjs(date).add(hour, 'hour')` (adiciona hora à data) |
| `Math.random()` para IDs | `new Date().getTime()` para IDs temporários |
| Múltiplos alerts no final da função | Early return com alert em cada validação |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre validação com early return, composição de datas e padrão try/catch
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula expandidos com variações