---
name: rs-full-stack-encerramento-do-projeto-1
description: "Applies pre-framework JavaScript foundations when building vanilla JS applications. Use when user asks to 'build without framework', 'vanilla javascript app', 'webpack setup', 'module bundling', or 'javascript from scratch'. Covers webpack bundling, JS modules, dynamic rendering, date manipulation, session-based grouping, and CRUD scheduling patterns. Make sure to use this skill whenever building a vanilla JS application or understanding what frameworks abstract away. Not for React, Next.js, or any framework-specific development."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: pre-framework-fundamentals
  tags: [vanilla-js, webpack, modules, dom, crud, fetch-api, bundling]
---

# Fundamentos Pre-Framework: Hair Day Project

> Antes de usar um framework, domine os fundamentos que ele abstrai: bundling, modulos, renderizacao dinamica e manipulacao de estado.

## Key concept

Frameworks como React abstraem configuracoes (webpack, module system, rendering) que voce precisa entender para tomar decisoes informadas. O projeto Hair Day demonstra todos esses fundamentos em vanilla JS: empacotamento com webpack, separacao em modulos, renderizacao dinamica de listas, manipulacao de datas/horarios, e operacoes CRUD completas.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Precisa de bundle/empacotamento | Webpack ou bundler equivalente — entenda o que o framework faz por voce |
| Codigo crescendo em um arquivo | Separar em modulos JS (import/export) |
| Lista que muda baseado em estado | Renderizacao dinamica via JS (innerHTML, createElement) |
| Horarios/datas com regras de negocio | Filtrar disponibilidade no JS, bloquear slots ocupados |
| Agrupamento visual de items | Sessoes/categorias calculadas a partir dos dados |
| CRUD sem framework | Fetch API + re-render manual da lista apos cada operacao |

## Patterns fundamentais

### Renderizacao dinamica de listas
```javascript
function renderSchedules(schedules) {
  const container = document.getElementById("schedules")
  container.innerHTML = ""
  
  const grouped = groupBySession(schedules)
  for (const [session, items] of Object.entries(grouped)) {
    // Renderizar header da sessao + items
  }
}
```

### Bloqueio de horarios ocupados
```javascript
function updateAvailableSlots(allSlots, bookedSlots) {
  return allSlots.map(slot => ({
    ...slot,
    disabled: bookedSlots.includes(slot.time)
  }))
}
```

### CRUD com re-render
```javascript
async function createBooking(data) {
  await fetch("/api/schedules", { method: "POST", body: JSON.stringify(data) })
  await loadSchedules(currentDate) // Re-render apos mutacao
}

async function cancelBooking(id) {
  if (!confirm("Confirmar cancelamento?")) return
  await fetch(`/api/schedules/${id}`, { method: "DELETE" })
  await loadSchedules(currentDate) // Re-render libera o horario
}
```

## O que frameworks abstraem

| Voce fez manualmente | Framework faz por voce |
|---------------------|----------------------|
| Configurar webpack (entry, output, loaders) | Build system integrado (Vite, Next.js) |
| Import/export manual de modulos | Module system automatico |
| Re-render manual apos cada mutacao | Reatividade (useState, signals) |
| innerHTML para atualizar DOM | Virtual DOM / reconciliation |
| Confirm dialog nativo | Component libraries |

## When to apply

- Quando precisa entender POR QUE um framework funciona de certa forma
- Quando o projeto e simples demais para justificar um framework
- Quando esta aprendendo e quer solidificar fundamentos
- Quando precisa debugar problemas de build/bundle em frameworks

## Limitations

- Vanilla JS nao escala bem para aplicacoes complexas com muito estado
- Re-render manual e propenso a bugs e problemas de performance
- Sem framework, voce reimplementa patterns que ja existem testados

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Webpack nao encontra entry point | Caminho do `entry` incorreto no `webpack.config.js` | Verificar que `./src/index.js` existe e o path esta correto |
| Lista nao atualiza apos criar/deletar item | Re-render manual ausente apos fetch de mutacao | Chamar funcao de reload da lista apos cada POST/DELETE |
| Horarios ocupados continuam disponiveis | Logica de bloqueio nao filtra slots ja reservados | Comparar array de slots com bookings existentes e desabilitar matches |
| Modulos nao resolvem imports | Webpack nao configurado para resolver extensoes | Adicionar `resolve.extensions` no webpack config |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fundamentos pre-framework e analogias do instrutor
- [code-examples.md](references/code-examples.md) — Todos os patterns do projeto Hair Day expandidos com variacoes