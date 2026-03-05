# Code Examples: Texto Maiúsculo e Minúsculo

## Exemplo base da aula

```javascript
let message = "Estou estudando os fundamentos de JavaScript"

// Texto original
console.log(message)
// "Estou estudando os fundamentos de JavaScript"

// Maiúsculo
console.log(message.toUpperCase())
// "ESTOU ESTUDANDO OS FUNDAMENTOS DE JAVASCRIPT"

// Minúsculo
console.log(message.toLowerCase())
// "estou estudando os fundamentos de javascript"

// Original inalterada
console.log(message)
// "Estou estudando os fundamentos de JavaScript"
```

## Variação: armazenando o resultado

```javascript
const original = "Skillz"
const upper = original.toUpperCase()  // "SKILLZ"
const lower = original.toLowerCase()  // "skillz"

console.log(original) // "Skillz" — intacta
console.log(upper)    // "SKILLZ"
console.log(lower)    // "skillz"
```

## Variação: comparação case-insensitive

```javascript
function findUser(users, searchName) {
  return users.find(
    user => user.name.toLowerCase() === searchName.toLowerCase()
  )
}

const users = [
  { name: "João Silva" },
  { name: "Maria Santos" }
]

findUser(users, "joão silva")  // { name: "João Silva" }
findUser(users, "JOÃO SILVA")  // { name: "João Silva" }
```

## Variação: normalização de email

```javascript
function normalizeEmail(email) {
  return email.toLowerCase().trim()
}

normalizeEmail("  User@Email.COM  ")
// "user@email.com"
```

## Variação: formatação de exibição

```javascript
function formatLabel(text) {
  return text.toUpperCase()
}

const status = "pendente"
console.log(formatLabel(status)) // "PENDENTE"
console.log(status)              // "pendente" — original intacta
```

## Variação: capitalizar primeira letra (combinando ambos)

```javascript
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

capitalize("jAVASCRIPT") // "Javascript"
capitalize("hello")       // "Hello"
```