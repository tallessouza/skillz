# Code Examples: Utilizando o day.js pelo Browser

## Setup completo do HTML

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day.js no Browser</title>
</head>
<body>

  <!-- Adiciona o pacote day.js no projeto -->
  <script src="https://unpkg.com/dayjs@1.8.21/dayjs.min.js"></script>
  <!-- Seu script vem DEPOIS -->
  <script src="./main.js"></script>
</body>
</html>
```

## Exemplo basico da aula

```javascript
// Cria uma constante com a data/hora atual
const now = dayjs()

// Exibe o objeto dayjs completo no console
console.log(now)

// Exibe formatado: dia/mes/ano - hora:minutos
console.log(now.format('DD/MM/YYYY - HH:mm'))
// Saida exemplo: 04/03/2025 - 14:30
```

## Variacoes de formato

```javascript
const now = dayjs()

// Apenas data
console.log(now.format('DD/MM/YYYY'))    // 04/03/2025
console.log(now.format('D/M/YYYY'))      // 4/3/2025 (sem zeros)
console.log(now.format('YYYY-MM-DD'))    // 2025-03-04 (ISO)

// Apenas hora
console.log(now.format('HH:mm'))         // 14:30 (24h)
console.log(now.format('HH:mm:ss'))      // 14:30:45 (com segundos)
console.log(now.format('hh:mm A'))       // 02:30 PM (12h)

// Data e hora combinados
console.log(now.format('DD/MM/YYYY - HH:mm'))       // 04/03/2025 - 14:30
console.log(now.format('DD [de] MMMM [de] YYYY'))   // 04 de March de 2025
```

## Demonstracao: D vs DD

```javascript
// Supondo que hoje e dia 4
console.log(dayjs().format('D'))   // "4"  — sem zero
console.log(dayjs().format('DD'))  // "04" — com zero (preferivel)

// Supondo que hoje e dia 15
console.log(dayjs().format('D'))   // "15" — nao muda
console.log(dayjs().format('DD'))  // "15" — nao muda
```

## Referencia rapida de tokens

```javascript
// Tokens de formato mais usados:
// YY     - 25        (ano 2 digitos)
// YYYY   - 2025      (ano 4 digitos)
// M      - 3         (mes sem zero)
// MM     - 03        (mes com zero)
// MMM    - Mar       (mes abreviado)
// MMMM   - March     (mes completo)
// D      - 4         (dia sem zero)
// DD     - 04        (dia com zero)
// H      - 14        (hora 24h sem zero)
// HH     - 14        (hora 24h com zero)
// h      - 2         (hora 12h sem zero)
// hh     - 02        (hora 12h com zero)
// m      - 5         (minuto sem zero)
// mm     - 05        (minuto com zero)
// s      - 9         (segundo sem zero)
// ss     - 09        (segundo com zero)
// A      - PM        (AM/PM)
```

## Comparacao: sem dayjs vs com dayjs

```javascript
// SEM day.js — verboso e propenso a erros
const date = new Date()
const day = String(date.getDate()).padStart(2, '0')
const month = String(date.getMonth() + 1).padStart(2, '0') // +1 porque mes comeca em 0!
const year = date.getFullYear()
const hours = String(date.getHours()).padStart(2, '0')
const minutes = String(date.getMinutes()).padStart(2, '0')
const formatted = `${day}/${month}/${year} - ${hours}:${minutes}`
console.log(formatted) // 04/03/2025 - 14:30

// COM day.js — uma linha
console.log(dayjs().format('DD/MM/YYYY - HH:mm')) // 04/03/2025 - 14:30
```

## Uso em contexto real: exibir data na pagina

```javascript
// Atualizar um elemento HTML com a data formatada
const dateElement = document.getElementById('current-date')
dateElement.textContent = dayjs().format('DD/MM/YYYY')

const timeElement = document.getElementById('current-time')
timeElement.textContent = dayjs().format('HH:mm:ss')
```