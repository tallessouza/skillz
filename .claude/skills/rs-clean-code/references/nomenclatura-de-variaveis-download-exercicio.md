---
name: rs-clean-code-nomenclatura-variaveis
description: "Enforces variable naming conventions when writing TypeScript/JavaScript code. Use when user asks to 'write a function', 'create a component', 'implement a feature', or any code generation task. Applies rules: no abbreviations, no generic names (data/response/list/temp), cause-over-effect booleans, unit-in-name for numbers. Make sure to use this skill whenever generating new code, even if the user doesn't mention naming. Not for documentation, comments, or commit messages."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: clean-code
  module: nomenclatura-de-variaveis
  tags: [naming, variables, typescript, javascript, clean-code, booleans, descriptive-names]
---

# Nomenclatura de Variáveis

> Ao escrever codigo, nomes de variaveis descrevem o conteudo e a intencao, nunca a estrutura ou tipo.

## Rules

1. **Nunca abrevie** — escreva `user` nao `u`, `button` nao `btn`, `database` nao `db`, porque abreviacoes sao impossiveis de buscar no codebase e ilegiveis fora de contexto
2. **Nunca use nomes genericos** — proibido: `data`, `response`, `list`, `args`, `parms`, `result`, `temp`, `info`, `item`, porque descrevem estrutura, nao conteudo
3. **Nomeie pelo conteudo** — `users` nao `userArray`, `blockedDates` nao `dateList`, porque o tipo ja esta no sistema de tipos
4. **Filtros nomeiam O QUE filtraram** — `usersStartingWithLetterD` nao `filtered`, porque o nome deve descrever o resultado
5. **Booleanos pela CAUSA, nao pelo EFEITO** — `isFormSubmitting` nao `isButtonDisabled`, porque a causa e reutilizavel em multiplos lugares, o efeito e especifico de um
6. **Inclua unidade quando implicita** — `priceInCents`, `timeoutInMs`, `durationInMinutes`, porque evita bugs de conversao silenciosos
7. **Codigo maior pode ser mais limpo** — nomes longos e descritivos sao preferidos a nomes curtos e ambiguos, porque legibilidade importa mais que economia de caracteres

## How to write

### Variaveis de dominio

```typescript
// Ao buscar dados, nomeie pelo que retorna
const users = getUsersFromDatabase()
const availableWeekdays = getAvailability(user)
const blockedDates = blockedDatesResponse.map(row => row.date)
```

### Filtragens

```typescript
// O nome da variavel descreve o resultado da filtragem
const usersStartingWithLetterD = users.filter(user => user.startsWith('D'))
const activeOrganizations = organizations.filter(org => org.isActive)
const overdueInvoices = invoices.filter(invoice => invoice.dueDate < now)
```

### Booleanos (causa, nao efeito)

```typescript
// A variavel descreve O QUE ESTA ACONTECENDO, nao a consequencia na UI
const isFormSubmitting = true

// Depois use em multiplos lugares:
<button disabled={isFormSubmitting}>
  {isFormSubmitting ? 'Carregando...' : 'Enviar'}
</button>
```

### Variaveis de comparacao e contexto

```typescript
// Nomeie pela intencao de uso, nao pelo tipo
const compareYearAndMonth = new Date(year, month)
const availableWeekdays = getIntervals(user)
const blockedWeekdays = weekdays.filter(day => !availableWeekdays.includes(day))
```

### Numeros com unidade

```typescript
const THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30
const priceInCents = amount * 100
const sessionTimeoutInMinutes = 30
```

## Example

**Before (codigo com nomes genericos):**
```typescript
const data = getUsersFromDatabase()
const filtered = data.filter(u => u.startsWith('D'))
const date = new Date(year, month)
const interval = getIntervals(user)
const days = weekdays.filter(d => interval.includes(d))
const response = await db.query(sql)
const data2 = response.map(r => r.date)
return { data2, days }
```

**After (com nomenclatura descritiva):**
```typescript
const users = getUsersFromDatabase()
const usersStartingWithLetterD = users.filter(user => user.startsWith('D'))
const compareYearAndMonth = new Date(year, month)
const availableWeekdays = getIntervals(user)
const blockedWeekdays = weekdays.filter(day => !availableWeekdays.includes(day))
const blockedDatesResponse = await db.query(sql)
const blockedDates = blockedDatesResponse.map(row => row.date)
return { blockedDates, blockedWeekdays }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Variavel exportada/usada em outro arquivo | Nome longo e auto-explicativo |
| Iterator em loop curto (<5 linhas) | `i`, `j`, `k` e OK |
| Callback inline na mesma linha | `.then(data => setUsers(data))` e OK — uso descartavel |
| Preco, tempo, distancia | Sempre incluir unidade no nome |
| Booleano | Pergunte: "descreve a causa ou o efeito?" |
| Resultado de filtro | Nome descreve O QUE foi filtrado, nao QUE foi filtrado |
| Funcao pequena hoje | Nomeie como se fosse crescer amanha |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const data = fetch(...)` | `const users = fetchUsers(...)` |
| `const response = api.get(...)` | `const orderDetails = api.getOrder(...)` |
| `const filtered = items.filter(...)` | `const expiredItems = items.filter(...)` |
| `const list = getAll()` | `const products = getAllProducts()` |
| `const temp = calculate(...)` | `const discountAmount = calculateDiscount(...)` |
| `const result = process(...)` | `const validatedOrder = validateOrder(...)` |
| `const isButtonDisabled = ...` | `const isFormSubmitting = ...` |
| `const d = new Date()` | `const createdAt = new Date()` |
| `const u = users[0]` | `const firstUser = users[0]` |
| `const date = new Date(y, m)` | `const compareYearAndMonth = new Date(year, month)` |
| `const interval = getIntervals()` | `const availableWeekdays = getIntervals()` |

## Troubleshooting

### Variavel com nome generico passa no code review
**Symptom:** Variaveis como `data`, `response`, `result` aparecem no codigo sem serem flagadas
**Cause:** Revisores focam em logica e esquecem de checar nomenclatura, ou a variavel parece "boa o suficiente" no contexto local
**Fix:** Pergunte "se eu encontrar essa variavel em outro arquivo, sei o que contem?" — se nao, renomeie pelo conteudo: `users`, `orderDetails`, `validatedOrder`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/clean-code/rs-clean-code-nomenclatura-de-variaveis-download-exercicio/references/deep-explanation.md)
- [Code examples](../../../data/skills/clean-code/rs-clean-code-nomenclatura-de-variaveis-download-exercicio/references/code-examples.md)
