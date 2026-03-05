# Code Examples: Encontrando Conteudo no Texto

## Exemplo base da aula

```javascript
const message = "Estou estudando os fundamentos do Javascript"
```

## indexOf() — encontrar posicao

```javascript
// Encontrar posicao de "estudando"
console.log(message.indexOf("estudando")) // 6

// Buscar "javascript" (minusculo) — nao encontra
console.log(message.indexOf("javascript")) // -1

// Buscar "Javascript" (com J maiusculo) — encontra
console.log(message.indexOf("Javascript")) // 34
```

**Regra:** quando `indexOf` nao encontra, retorna `-1`.

## includes() — verificar existencia

```javascript
// Verificar se "Javascript" existe (case-sensitive)
console.log(message.includes("Javascript")) // true

// Buscar com case diferente — falha
console.log(message.includes("javascript")) // false

// Verificar conteudo inexistente
console.log(message.includes("HTML")) // false
```

## Combinando com normalizacao de case

```javascript
// Normalizar para lowercase antes de comparar
console.log(message.toLowerCase().includes("javascript")) // true

// Normalizar para uppercase
console.log(message.toUpperCase().includes("JAVASCRIPT")) // true
```

**Importante:** normalize ambos os lados. Se o termo de busca vem do usuario:

```javascript
const userSearch = "JaVaScRiPt"
console.log(message.toLowerCase().includes(userSearch.toLowerCase())) // true
```

## includes() com frases

```javascript
// Funciona com frases completas, nao apenas palavras
console.log(message.includes("estou estudando os fundamentos")) // false (case)
console.log(message.includes("Estou estudando os fundamentos")) // true
```

## Variacoes praticas

### Filtrar array por termo de busca

```javascript
const courses = [
  "Javascript Avancado",
  "React Native",
  "Node.js Fundamentos",
  "javascript Basico"
]

const searchTerm = "javascript"
const filtered = courses.filter(course =>
  course.toLowerCase().includes(searchTerm.toLowerCase())
)
// ["Javascript Avancado", "javascript Basico"]
```

### Validar input do usuario

```javascript
const email = "user@example.com"
const hasAtSign = email.includes("@") // true
const hasDot = email.includes(".") // true
```

### Extrair texto a partir da posicao encontrada

```javascript
const url = "https://example.com?page=2&sort=name"
const queryStart = url.indexOf("?")
if (queryStart !== -1) {
  const queryString = url.substring(queryStart + 1)
  // "page=2&sort=name"
}
```

### Busca com feedback ao usuario

```javascript
const text = "Aprendendo programacao com Javascript"
const term = "python"

const position = text.toLowerCase().indexOf(term.toLowerCase())
if (position !== -1) {
  console.log(`"${term}" encontrado na posicao ${position}`)
} else {
  console.log(`"${term}" nao encontrado no texto`)
}
// "python" nao encontrado no texto
```

### Contar ocorrencias de um termo

```javascript
function countOccurrences(text, term) {
  let count = 0
  let position = text.toLowerCase().indexOf(term.toLowerCase())
  while (position !== -1) {
    count++
    position = text.toLowerCase().indexOf(term.toLowerCase(), position + 1)
  }
  return count
}

const phrase = "Java e diferente de Javascript e de Java ME"
console.log(countOccurrences(phrase, "Java")) // 3
```