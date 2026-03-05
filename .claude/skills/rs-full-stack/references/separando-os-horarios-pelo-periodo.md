---
name: rs-full-stack-separando-horarios-periodo
description: "Applies time-period grouping pattern when rendering scheduled time slots in UI. Use when user asks to 'group by period', 'separate morning afternoon night', 'add section headers to list', 'organize time slots', or builds any scheduling/booking interface. Enforces dynamic header insertion before list items based on hour thresholds. Make sure to use this skill whenever building appointment or scheduling UIs with time grouping. Not for date pickers, calendar grids, or backend time logic."
---

# Separando Horarios por Periodo

> Ao listar horarios em uma interface de agendamento, agrupe-os por periodo (manha, tarde, noite) inserindo cabecalhos dinamicamente antes dos itens da lista.

## Rules

1. **Insira cabecalhos dinamicamente via JavaScript** — nao hardcode no HTML, porque os horarios vem de dados dinamicos e os periodos dependem dos horarios disponíveis
2. **Use thresholds fixos para periodos** — 9h=Manhã, 13h=Tarde, 18h=Noite, porque sao convencoes universais de periodo do dia
3. **Verifique o periodo ANTES de inserir o item** — o cabecalho deve aparecer antes do primeiro horario daquele periodo na lista
4. **Reutilize a mesma estrutura de lista (ul/li)** — cabecalhos sao `<li>` com classe especial, nao elementos separados, porque mantem a estrutura semantica da lista
5. **Trate disponibilidade via CSS, nao JS** — classes como `unavailable` controlam cursor e hover, porque separar responsabilidades simplifica manutencao

## How to write

### Funcao de adicionar cabecalho de periodo

```javascript
function hourHeaderAdd(title) {
  const header = document.createElement("li")
  header.classList.add("hour-period")
  header.textContent = title
  hoursList.append(header)
}
```

### Verificacao de periodo antes de inserir item

```javascript
// Dentro do loop de horarios, antes de adicionar cada item
if (hour === 9) {
  hourHeaderAdd("Manhã")
} else if (hour === 13) {
  hourHeaderAdd("Tarde")
} else if (hour === 18) {
  hourHeaderAdd("Noite")
}

// Agora adiciona o item do horario
hoursList.append(hourItem)
```

## Example

**Before (lista plana sem separacao):**
```javascript
availableHours.forEach((hour) => {
  const li = document.createElement("li")
  li.textContent = `${hour}:00`
  hoursList.append(li)
})
```

**After (com agrupamento por periodo):**
```javascript
availableHours.forEach((hour) => {
  if (hour === 9) hourHeaderAdd("Manhã")
  else if (hour === 13) hourHeaderAdd("Tarde")
  else if (hour === 18) hourHeaderAdd("Noite")

  const li = document.createElement("li")
  li.textContent = `${hour}:00`
  if (hour <= currentHour) li.classList.add("unavailable")
  hoursList.append(li)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Horarios carregados dinamicamente | Insira cabecalhos dentro do mesmo loop de renderizacao |
| Horario ja passou | Adicione classe CSS `unavailable`, nao remova o item |
| Precisa mudar thresholds | Extraia para constantes no topo do arquivo |
| Lista vazia para um periodo | Nao insira o cabecalho (verifique se ha itens no periodo) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Hardcode cabecalhos no HTML | Gere dinamicamente no JS baseado nos dados |
| Usar `<h3>` dentro de `<ul>` | Usar `<li>` com classe especial para cabecalho |
| Esconder horarios indisponiveis com `display:none` | Mostrar com estilo visual de bloqueado (cursor, opacity) |
| Bloquear clique via JS para indisponiveis | Usar CSS `pointer-events` e `cursor: not-allowed` |
| Criar 3 listas separadas (manha/tarde/noite) | Usar uma unica lista com cabecalhos intercalados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre agrupamento temporal e padroes de UI de agendamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-separando-os-horarios-pelo-periodo/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-separando-os-horarios-pelo-periodo/references/code-examples.md)
