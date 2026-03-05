# Code Examples: Formatando Data e Hora em JavaScript

## Exemplo 1: Criando a data base

```javascript
const date = new Date('2024-07-02T14:30:00')
```

O formato ISO completo: ano-mes-diaThora:minuto:segundo. O `T` separa data de hora.

## Exemplo 2: Obtendo o dia com dois digitos

```javascript
// Sem formatacao — retorna numero
date.getDate() // 2

// Com toString — vira string mas sem zero
date.getDate().toString() // "2"

// Com padStart — garante dois digitos
date.getDate().toString().padStart(2, '0') // "02"

// Com dia 12 — padStart nao altera
// date.getDate() retornaria 12
// "12".padStart(2, '0') => "12"
```

## Exemplo 3: Obtendo o mes corrigido

```javascript
// getMonth() retorna indice base-zero
date.getMonth() // 6 (julho = indice 6)

// Somando 1 para obter o mes real
(date.getMonth() + 1) // 7

// Formatando com dois digitos
(date.getMonth() + 1).toString().padStart(2, '0') // "07"
```

Nota: os parenteses em `(date.getMonth() + 1)` sao necessarios para que a soma aconteca antes do `.toString()`.

## Exemplo 4: Extraindo todas as partes

```javascript
const date = new Date('2024-07-02T14:30:00')

const day = date.getDate().toString().padStart(2, '0')       // "02"
const month = (date.getMonth() + 1).toString().padStart(2, '0') // "07"
const year = date.getFullYear()                                // 2024
const hours = date.getHours().toString().padStart(2, '0')     // "14"
const minutes = date.getMinutes().toString().padStart(2, '0') // "30"
```

## Exemplo 5: Montando formato brasileiro

```javascript
console.log(`${day}/${month}/${year}`)
// "02/07/2024"
```

## Exemplo 6: Adicionando hora ao formato

```javascript
// Com dois pontos
console.log(`${day}/${month}/${year} as ${hours}:${minutes}`)
// "02/07/2024 as 14:30"

// Com h como separador
console.log(`${day}/${month}/${year} as ${hours}h${minutes}`)
// "02/07/2024 as 14h30"
```

## Exemplo 7: O que acontece sem o padrao ISO

```javascript
// ERRADO — formato sem zeros gera Invalid Date
const badDate = new Date('2024-7-2')
console.log(badDate) // Invalid Date

// CORRETO — formato ISO com zeros
const goodDate = new Date('2024-07-02')
console.log(goodDate) // 2024-07-02T03:00:00.000Z
```

## Variacoes adicionais

### Formato americano (mm/dd/yyyy)
```javascript
console.log(`${month}/${day}/${year}`)
// "07/02/2024"
```

### Formato com segundos
```javascript
const seconds = date.getSeconds().toString().padStart(2, '0')
console.log(`${hours}:${minutes}:${seconds}`)
// "14:30:00"
```

### Formato ISO manual
```javascript
console.log(`${year}-${month}-${day}T${hours}:${minutes}`)
// "2024-07-02T14:30"
```

### Funcao reutilizavel
```javascript
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} as ${hours}:${minutes}`
}

formatDate(new Date('2024-07-02T14:30:00'))
// "02/07/2024 as 14:30"
```