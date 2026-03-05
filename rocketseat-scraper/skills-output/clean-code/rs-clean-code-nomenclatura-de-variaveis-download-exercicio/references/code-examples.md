# Code Examples: Nomenclatura de Variáveis

## Exemplo 1: Filtragem com diminutivos (anti-pattern)

```typescript
// RUIM: diminutivos e nome genérico
const users = ['Diego', 'Mike', 'Rodrigo']

const filtered = users.filter(u => u.startsWith('D'))

return filtered
```

```typescript
// BOM: nomes completos e descritivos
const users = ['Diego', 'Mike', 'Rodrigo']

const usersStartingWithLetterD = users.filter(user => user.startsWith('D'))

return usersStartingWithLetterD
```

**Pontos-chave:**
- `u` → `user`: nunca abrevie o parâmetro do callback
- `filtered` → `usersStartingWithLetterD`: o nome descreve O QUE foi filtrado
- O nome é longo? Sim. É mais legível? Absolutamente.

## Exemplo 2: Função com `data` genérico (anti-pattern)

```typescript
// RUIM: nome genérico que não descreve o conteúdo
function getUsers() {
  const data = getUsersFromDatabase()
  return data
}
```

```typescript
// BOM: nome que descreve o conteúdo
function getUsers() {
  const users = getUsersFromDatabase()
  return users
}
```

**Por que `data` é perigoso:** A função parece simples agora, mas quando crescer com validações, mappings e transformações, `data` se torna completamente opaco. Nomeie pelo conteúdo desde o início.

## Exemplo 3: Código real — Sistema de agendamento (ANTES)

```typescript
// Código real do Ignite — nomes originais
export async function getAvailability(username, year, month) {
  const user = await getUser(username)

  if (!user) {
    return { error: 'User does not exist.' }
  }

  if (!year || !month) {
    return { error: 'Year and month are required.' }
  }

  const date = new Date(year, month)

  const interval = getIntervals(user)

  const days = weekdays.filter(d => interval.includes(d))

  const response = await db.query(`
    SELECT * FROM schedulings
    WHERE user_id = ${user.id}
    AND date >= ${startOfMonth}
    AND date <= ${endOfMonth}
  `)

  const data = response.map(r => r.date)

  return { data, days }
}
```

**Problemas identificados:**
- `date` — é uma data, mas para quê? Comparação? Exibição? Filtro?
- `interval` — intervalo de quê?
- `days` — quais dias? Disponíveis? Bloqueados? Todos?
- `response` — resposta de quê?
- `data` — dados de quê?
- `d` e `r` — diminutivos nos callbacks

## Exemplo 3: Código real — Sistema de agendamento (DEPOIS)

```typescript
// Mesmo código com nomenclatura descritiva
export async function getAvailability(username, year, month) {
  const user = await getUser(username)

  if (!user) {
    return { error: `User with username "${username}" does not exist.` }
  }

  if (!year || !month) {
    return { error: 'Year and month are required.' }
  }

  const compareYearAndMonth = new Date(year, month)

  const availableWeekdays = getIntervals(user)

  const blockedWeekdays = weekdays.filter(day => !availableWeekdays.includes(day))

  const blockedDatesResponse = await db.query(`
    SELECT * FROM schedulings
    WHERE user_id = ${user.id}
    AND date >= ${startOfMonth}
    AND date <= ${endOfMonth}
  `)

  const blockedDates = blockedDatesResponse.map(row => row.date)

  return { blockedDates, blockedWeekdays }
}
```

**Mudanças e justificativas:**
| Antes | Depois | Por quê |
|-------|--------|---------|
| `date` | `compareYearAndMonth` | Revela a intenção: é para comparar, não para exibir |
| `interval` | `availableWeekdays` | Revela o domínio: são os dias disponíveis do usuário |
| `days` | `blockedWeekdays` | Revela o significado: dias que NÃO estão disponíveis |
| `response` | `blockedDatesResponse` | Revela o que a query retorna |
| `data` | `blockedDates` | Revela o conteúdo final |
| `d` | `day` | Sem diminutivo |
| `r` | `row` | Sem diminutivo |

**Resultado:** Sem conhecer o sistema, qualquer desenvolvedor consegue deduzir que é um sistema de agendamento que verifica disponibilidade de horários.

## Variações adicionais do padrão

### Variação: Múltiplos filtros encadeados

```typescript
// RUIM
const data = await getOrders()
const filtered1 = data.filter(d => d.status === 'pending')
const filtered2 = filtered1.filter(d => d.total > 100)
const result = filtered2.map(d => d.id)

// BOM
const orders = await getOrders()
const pendingOrders = orders.filter(order => order.status === 'pending')
const highValuePendingOrders = pendingOrders.filter(order => order.total > 100)
const highValuePendingOrderIds = highValuePendingOrders.map(order => order.id)
```

### Variação: Respostas de API

```typescript
// RUIM
const res = await api.get('/users')
const data = res.data
const list = data.map(item => item.name)

// BOM
const usersResponse = await api.get('/users')
const users = usersResponse.data
const userNames = users.map(user => user.name)
```

### Variação: Booleanos causa vs efeito

```typescript
// RUIM: nomeado pelo efeito na UI
const isButtonDisabled = formState.isSubmitting
const isModalHidden = !hasErrors
const isInputRed = !isValid

// BOM: nomeado pela causa
const isFormSubmitting = formState.isSubmitting
const hasNoErrors = !hasErrors
const isFieldInvalid = !isValid

// O mesmo booleano de causa pode controlar múltiplos efeitos:
<button disabled={isFormSubmitting} />
<span>{isFormSubmitting ? 'Salvando...' : 'Salvar'}</span>
<progress visible={isFormSubmitting} />
```