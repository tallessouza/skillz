# Code Examples: Intl API — Formatacao de Data e Hora

## Exemplo 1: Obter informacoes de locale (direto da aula)

```javascript
const currentLocale = Intl.DateTimeFormat().resolvedOptions()
console.log(currentLocale)
// {
//   locale: 'pt-BR',
//   calendar: 'gregory',
//   numberingSystem: 'latn',
//   timeZone: 'America/Sao_Paulo',
//   ...
// }
```

## Exemplo 2: Formatar data com locale pt-BR (direto da aula)

```javascript
console.log(new Intl.DateTimeFormat('pt-BR').format(new Date()))
// 01/03/2026
```

## Exemplo 3: Formatar com diferentes locales (direto da aula)

```javascript
const date = new Date()

// Formato brasileiro
console.log(new Intl.DateTimeFormat('pt-BR').format(date))
// 01/03/2026

// Formato americano (invertido)
console.log(new Intl.DateTimeFormat('en-US').format(date))
// 3/1/2026
```

## Exemplo 4: Timezone offset (direto da aula)

```javascript
const date = new Date()

// Diferenca em minutos
console.log(date.getTimezoneOffset())
// 180

// Diferenca em horas
console.log(date.getTimezoneOffset() / 60)
// 3
```

## Variacoes adicionais

### Formatacao com opcoes detalhadas

```javascript
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

console.log(new Intl.DateTimeFormat('pt-BR', options).format(new Date()))
// domingo, 1 de março de 2026
```

### Formatacao de hora

```javascript
const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
}

console.log(new Intl.DateTimeFormat('pt-BR', timeOptions).format(new Date()))
// 14:30:45
```

### Reutilizando o formatter (performance)

```javascript
// Crie uma vez, use varias vezes
const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})

const dates = [new Date('2026-01-15'), new Date('2026-06-20'), new Date('2026-12-25')]
const formatted = dates.map(date => formatter.format(date))
// ['15/01/2026', '20/06/2026', '25/12/2026']
```

### Extrair timezone do usuario para enviar ao backend

```javascript
const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
// 'America/Sao_Paulo'

fetch('/api/preferences', {
  method: 'POST',
  body: JSON.stringify({ timeZone })
})
```

### Comparar formatacao entre locales

```javascript
const date = new Date('2026-03-01T14:30:00')
const locales = ['pt-BR', 'en-US', 'ja-JP', 'de-DE', 'fr-FR']

locales.forEach(locale => {
  const formatted = new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date)
  console.log(`${locale}: ${formatted}`)
})
// pt-BR: domingo, 1 de março de 2026 14:30
// en-US: Sunday, March 1, 2026 at 2:30 PM
// ja-JP: 2026年3月1日日曜日 14:30
// de-DE: Sonntag, 1. März 2026 um 14:30
// fr-FR: dimanche 1 mars 2026 à 14:30
```