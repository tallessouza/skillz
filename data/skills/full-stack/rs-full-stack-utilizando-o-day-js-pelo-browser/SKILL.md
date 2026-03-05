---
name: rs-full-stack-utilizando-o-day-js-pelo-browser
description: "Applies day.js library usage patterns when working with dates in browser JavaScript projects. Use when user asks to 'format a date', 'add a date library', 'use dayjs', 'display date and time', or 'include a JS library via CDN'. Covers CDN import order, dayjs() initialization, format tokens, and documentation-first approach. Make sure to use this skill whenever adding day.js or formatting dates in frontend code. Not for Node.js module imports, date-fns, Moment.js, or server-side date handling."
---

# Utilizando o day.js pelo Browser

> Ao trabalhar com datas no browser, use day.js via CDN e consulte a documentacao para formatar corretamente.

## Rules

1. **Importe o script antes do seu codigo** — o `<script>` do day.js deve vir antes do seu `main.js`, porque o browser executa scripts em ordem e `dayjs` precisa estar disponivel quando seu codigo roda
2. **Use `dayjs()` para obter a data/hora atual** — retorna um objeto com todas as informacoes de data e hora, nao uma string
3. **Formate com `.format()`** — passe tokens como `DD/MM/YYYY` para obter saida legivel, porque o objeto cru do dayjs nao e util para exibicao
4. **Consulte a documentacao sempre** — ninguem decora todos os tokens e metodos; consultar a doc e pratica profissional, nao fraqueza
5. **Nunca recrie do zero o que um pacote oferece** — a vantagem de bibliotecas e ganhar velocidade; reimplementar formatacao de datas e desperdicio

## How to write

### Importacao via CDN

```html
<!-- Adiciona o pacote day.js no projeto (ANTES do seu script) -->
<script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
<script src="./main.js"></script>
```

### Uso basico

```javascript
const now = dayjs()
console.log(now) // objeto dayjs com todas as informacoes

// Formatado
console.log(now.format('DD/MM/YYYY - HH:mm'))
// Saida: 04/03/2025 - 14:30
```

### Tokens de formato comuns

```javascript
dayjs().format('D')      // 4     (dia sem zero)
dayjs().format('DD')     // 04    (dia com zero)
dayjs().format('MM')     // 03    (mes com zero)
dayjs().format('YYYY')   // 2025  (ano completo)
dayjs().format('HH:mm')  // 14:30 (hora 24h com minutos)
```

## Example

**Before (sem day.js, formatacao manual):**
```javascript
const now = new Date()
const day = String(now.getDate()).padStart(2, '0')
const month = String(now.getMonth() + 1).padStart(2, '0')
const year = now.getFullYear()
const hours = String(now.getHours()).padStart(2, '0')
const minutes = String(now.getMinutes()).padStart(2, '0')
console.log(`${day}/${month}/${year} - ${hours}:${minutes}`)
```

**After (com day.js):**
```javascript
const now = dayjs()
console.log(now.format('DD/MM/YYYY - HH:mm'))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa formatar data no browser | Use `dayjs().format()` com tokens da doc |
| Nao lembra o token de formato | Consulte https://day.js.org/docs/en/display/format |
| Precisa de plugins (relative time, etc) | Importe o plugin via CDN adicional, depois `dayjs.extend()` |
| Um unico `D` vs `DD` | `D` = sem zero (4), `DD` = com zero (04) — prefira `DD` para consistencia |
| Minutos vs Mes | `MM` maiusculo = mes, `mm` minusculo = minutos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<script src="main.js">` antes do dayjs | Dayjs CDN primeiro, depois main.js |
| `new Date().toLocaleDateString()` para formatos custom | `dayjs().format('DD/MM/YYYY')` |
| Decorar todos os tokens de cor | Consultar a documentacao |
| Reimplementar `padStart` para datas | Usar day.js format tokens |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre documentacao, ordem de scripts e filosofia de pacotes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes