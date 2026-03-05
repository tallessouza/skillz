# Code Examples: Array.includes()

## Exemplo da aula — Verificação básica

```javascript
const fruits = ["apple", "orange", "banana"]

// Verificando existência
console.log(fruits.includes("apple"))      // true
console.log(fruits.includes("Apple"))      // false — case-sensitive!
console.log(fruits.includes("strawberry")) // false

// Adicionando e re-verificando
fruits.push("strawberry")
console.log(fruits.includes("strawberry")) // true

console.log(fruits.includes("lemon"))      // false
```

## Variação: Validação de input

```javascript
const validStatuses = ["active", "inactive", "pending"]

function updateUserStatus(userId, newStatus) {
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`)
  }
  // proceed with update
}
```

## Variação: Feature flags

```javascript
const enabledFeatures = ["dark-mode", "notifications", "export-csv"]

if (enabledFeatures.includes("dark-mode")) {
  applyDarkTheme()
}
```

## Variação: Filtragem com includes

```javascript
const blockedWords = ["spam", "scam", "fake"]
const userMessage = "This is a scam product"

const words = userMessage.toLowerCase().split(" ")
const hasBlockedWord = blockedWords.some(blocked => words.includes(blocked))
// true — "scam" está na lista
```

## Variação: Case-insensitive check

```javascript
const allowedExtensions = [".jpg", ".png", ".gif", ".webp"]

function isImageFile(filename) {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase()
  return allowedExtensions.includes(extension)
}

isImageFile("photo.JPG")  // true (normalizado para .jpg)
isImageFile("doc.pdf")    // false
```

## Variação: Com segundo parâmetro (fromIndex)

```javascript
const numbers = [1, 2, 3, 4, 5, 3]

numbers.includes(3)       // true — encontra no índice 2
numbers.includes(3, 3)    // true — encontra no índice 5 (busca a partir do índice 3)
numbers.includes(2, 3)    // false — 2 está no índice 1, mas busca começa no 3
```

## Variação: Comparando com indexOf (migração)

```javascript
// ANTES (ES5)
if (permissions.indexOf("admin") !== -1) { /* ... */ }
if (permissions.indexOf("admin") > -1) { /* ... */ }
if (~permissions.indexOf("admin")) { /* ... */ }  // bitwise trick, confuso

// DEPOIS (ES2016+)
if (permissions.includes("admin")) { /* ... */ }
```