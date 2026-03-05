# Code Examples: Exibindo Data e Hora Formatadas por Localidade

## Exemplo 1: Criando a data de referencia

```javascript
// Padrao ISO 8601 para definir data e hora
const date = new Date('2024-07-02T14:00:00')
console.log(date)
// Tue Jul 02 2024 14:00:00 GMT-0300 (Brasilia Standard Time)
```

## Exemplo 2: Exibindo apenas a data no formato local

```javascript
const date = new Date('2024-07-02T14:00:00')
console.log(date.toLocaleDateString('pt-BR'))
// 02/07/2024
```

Nota: retorna APENAS a data, sem horario. O formato brasileiro e dia/mes/ano com barras.

## Exemplo 3: Exibindo apenas o horario no formato local

```javascript
const date = new Date('2024-07-02T14:30:15')
console.log(date.toLocaleTimeString('pt-BR'))
// 14:30:15
```

O formato brasileiro usa 24h com dois pontos separando hora, minuto e segundo.

## Exemplo 4: Formato americano para data

```javascript
const date = new Date('2024-07-02T14:30:15')
console.log(date.toLocaleDateString('en-US'))
// 7/2/2024
```

Notar: mes vem primeiro, sem zero a esquerda.

## Exemplo 5: Formato americano para horario

```javascript
const date = new Date('2024-07-02T14:30:15')
console.log(date.toLocaleTimeString('en-US'))
// 2:30:15 PM
```

Notar: converte automaticamente de 24h para 12h com sufixo PM.

## Variacoes adicionais

### Exibindo data e hora juntos

```javascript
const date = new Date('2024-07-02T14:30:15')

// Concatenando separadamente
const display = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`
// 02/07/2024 14:30:15

// Ou usando toLocaleString (data + hora)
const displayAlt = date.toLocaleString('pt-BR')
// 02/07/2024, 14:30:15
```

### Comparando multiplos locales

```javascript
const date = new Date('2024-07-02T14:30:15')

const locales = ['pt-BR', 'en-US', 'de-DE', 'ja-JP', 'fr-FR']

locales.forEach(locale => {
  console.log(`${locale}: ${date.toLocaleDateString(locale)} | ${date.toLocaleTimeString(locale)}`)
})
// pt-BR: 02/07/2024 | 14:30:15
// en-US: 7/2/2024 | 2:30:15 PM
// de-DE: 2.7.2024 | 14:30:15
// ja-JP: 2024/7/2 | 14:30:15
// fr-FR: 02/07/2024 | 14:30:15
```

### Usando locale do navegador

```javascript
const date = new Date()

// Pega o locale configurado no navegador do usuario
const userLocale = navigator.language // ex: 'pt-BR'

const formattedDate = date.toLocaleDateString(userLocale)
const formattedTime = date.toLocaleTimeString(userLocale)
```

### Com opcoes avançadas (bonus)

```javascript
const date = new Date('2024-07-02T14:30:15')

// Opcoes de formatacao personalizadas
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

console.log(date.toLocaleDateString('pt-BR', options))
// terca-feira, 2 de julho de 2024

console.log(date.toLocaleDateString('en-US', options))
// Tuesday, July 2, 2024
```