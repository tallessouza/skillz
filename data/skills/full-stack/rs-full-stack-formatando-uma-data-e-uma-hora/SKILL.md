---
name: rs-full-stack-formatando-data-hora
description: "Applies date and time formatting patterns when writing JavaScript/TypeScript code. Use when user asks to 'format a date', 'display date', 'show timestamp', 'format time', 'padStart date', or any date string formatting task. Enforces two-digit padding with padStart, getMonth+1 correction, and template literal date assembly. Make sure to use this skill whenever generating code that displays dates or times to users. Not for date arithmetic, timezone conversion, or date parsing from strings."
---

# Formatando Data e Hora em JavaScript

> Ao exibir datas, extraia cada parte separadamente, garanta dois digitos com padStart, e monte a string final com template literals.

## Rules

1. **Sempre use padStart(2, '0') em dia, mes, hora e minuto** — `day.toString().padStart(2, '0')` nao `day`, porque valores de 1 a 9 precisam do zero a esquerda para manter o padrao visual
2. **Some +1 ao getMonth()** — meses em JavaScript comecam do zero (janeiro = 0), entao `getMonth() + 1` retorna o mes correto
3. **Extraia cada parte em variavel separada antes de montar** — `day`, `month`, `year`, `hours`, `minutes` separados, porque facilita reutilizacao e legibilidade
4. **Use template literals para montar o formato final** — `` `${day}/${month}/${year}` `` nao concatenacao com `+`, porque e mais legivel
5. **Mantenha o padrao ISO ao criar datas** — `new Date('2024-07-02T14:30:00')` com zero no mes/dia, porque sem o padrao correto retorna Invalid Date
6. **Nao use getYear(), use getFullYear()** — `getFullYear()` retorna 2024, `getYear()` retorna 124 (depreciado)

## How to write

### Extrair e formatar partes da data

```typescript
const date = new Date('2024-07-02T14:30:00')

const day = date.getDate().toString().padStart(2, '0')
const month = (date.getMonth() + 1).toString().padStart(2, '0')
const year = date.getFullYear()
const hours = date.getHours().toString().padStart(2, '0')
const minutes = date.getMinutes().toString().padStart(2, '0')
```

### Montar string formatada

```typescript
const formattedDate = `${day}/${month}/${year} as ${hours}:${minutes}`
// "02/07/2024 as 14:30"
```

## Example

**Before (comum em codigo iniciante):**
```typescript
const date = new Date('2024-07-02T14:30:00')
console.log(date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear())
// "2/6/2024" — dia sem zero, mes errado (falta +1)
```

**After (com esta skill aplicada):**
```typescript
const date = new Date('2024-07-02T14:30:00')
const day = date.getDate().toString().padStart(2, '0')
const month = (date.getMonth() + 1).toString().padStart(2, '0')
const year = date.getFullYear()
const hours = date.getHours().toString().padStart(2, '0')
const minutes = date.getMinutes().toString().padStart(2, '0')

console.log(`${day}/${month}/${year} as ${hours}:${minutes}`)
// "02/07/2024 as 14:30"
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Exibir data para usuario | Extraia partes + padStart + template literal |
| Dia ou mes com 1 digito | padStart(2, '0') sempre |
| Precisa do mes correto | getMonth() + 1 |
| Formato BR (dd/mm/aaaa) | `${day}/${month}/${year}` |
| Formato com hora | Adicione `as ${hours}:${minutes}` ou `${hours}h${minutes}` |
| Criar Date a partir de string | Use formato ISO com zeros: '2024-07-02T14:30:00' |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `date.getMonth()` direto para exibir | `(date.getMonth() + 1)` |
| `date.getDate()` sem padStart | `date.getDate().toString().padStart(2, '0')` |
| `date.getYear()` | `date.getFullYear()` |
| `new Date('2024-7-2')` | `new Date('2024-07-02')` — sem zero gera Invalid Date |
| Concatenar com `+` para montar data | Template literal com `${}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre padStart, getMonth offset, e padroes ISO
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes