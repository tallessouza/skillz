---
name: rs-full-stack-conhecendo-o-set-interval
description: "Applies setInterval and clearInterval patterns when writing JavaScript timer code. Use when user asks to 'create a timer', 'run something repeatedly', 'make a countdown', 'execute at intervals', or 'schedule recurring execution'. Enforces proper cleanup with clearInterval to prevent memory leaks. Make sure to use this skill whenever generating code with repeated execution or polling. Not for one-time delays (use setTimeout), cron jobs, or server-side scheduling."
---

# setInterval e clearInterval

> Ao usar setInterval, sempre armazene a referencia e limpe com clearInterval quando a execucao deve parar.

## Rules

1. **Sempre armazene a referencia do interval** — `const intervalId = setInterval(...)`, porque sem a referencia e impossivel parar a execucao e causa memory leak
2. **Sempre defina condicao de parada** — use `clearInterval(intervalId)` dentro de um `if` que verifica quando parar, porque setInterval executa infinitamente por padrao
3. **Use setInterval para execucao repetida, setTimeout para execucao unica** — setInterval repete a cada X ms, setTimeout executa uma vez apos X ms, porque confundir os dois causa bugs sutis
4. **Duracao em milissegundos** — 1000 = 1 segundo, 3000 = 3 segundos, porque a API aceita apenas milissegundos

## How to write

### Padrao basico com cleanup

```javascript
const intervalId = setInterval(() => {
  // logica executada a cada intervalo
}, 1000)

// Quando precisar parar:
clearInterval(intervalId)
```

### Contador regressivo (padrao completo)

```javascript
let count = 10

const intervalId = setInterval(() => {
  console.log(count)
  count--

  if (count === 0) {
    console.log("Finalizado!")
    clearInterval(intervalId) // interrompe o intervalo de execucoes
  }
}, 1000)
```

## Example

**Before (sem controle de parada — memory leak):**
```javascript
let value = 10
setInterval(() => {
  console.log(value)
  value--
}, 1000)
// Nunca para! Vai para -1, -2, -3...
```

**After (com referencia e clearInterval):**
```javascript
let value = 10

const interval = setInterval(() => {
  console.log(value)
  value--

  if (value === 0) {
    console.log("Feliz Ano Novo!")
    clearInterval(interval)
  }
}, 1000)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Executar algo UMA vez apos delay | Use `setTimeout`, nao `setInterval` |
| Executar algo REPETIDAMENTE | Use `setInterval` com `clearInterval` |
| Polling de API | `setInterval` + `clearInterval` quando dados chegarem |
| Animacao/contador | `setInterval` com condicao de parada explicita |
| Componente React desmontando | `clearInterval` no cleanup do `useEffect` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `setInterval(() => {...}, 1000)` (sem guardar ref) | `const id = setInterval(() => {...}, 1000)` |
| Interval sem condicao de parada | `if (done) clearInterval(id)` dentro do callback |
| `setTimeout` em loop manual para repetir | `setInterval` com `clearInterval` |
| `clearTimeout` para parar interval | `clearInterval` para interval, `clearTimeout` para timeout |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-set-interval/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-conhecendo-o-set-interval/references/code-examples.md)
