# Code Examples: Operador Condicional Ternário

## Exemplo base da aula

```javascript
// Exemplo 1: verificação de idade para dirigir
const age = 16

console.log(
  age >= 18
    ? "Você pode dirigir."
    : "Você não pode dirigir."
)
// Output: "Você não pode dirigir."
```

```javascript
// Exemplo 2: com idade diferente
const age = 21

console.log(
  age >= 18
    ? "Você pode dirigir."
    : "Você não pode dirigir."
)
// Output: "Você pode dirigir."
```

```javascript
// Exemplo 3: inversão da condição (mesmo resultado)
const age = 16

console.log(
  age < 18
    ? "Você não pode dirigir."
    : "Você pode dirigir."
)
// Output: "Você não pode dirigir."
```

## Variações práticas

### Atribuição condicional

```javascript
const age = 20
const canDrive = age >= 18 ? true : false
// Melhor: const canDrive = age >= 18
```

### Em template literals

```javascript
const age = 25
const name = "Maria"
console.log(`${name}, ${age >= 18 ? "você pode dirigir" : "você não pode dirigir"}.`)
// Output: "Maria, você pode dirigir."
```

### Com operadores lógicos

```javascript
const age = 20
const hasLicense = true

console.log(
  age >= 18 && hasLicense
    ? "Você pode dirigir."
    : "Você não pode dirigir."
)
// Output: "Você pode dirigir."
```

```javascript
const age = 20
const hasLicense = false

console.log(
  age >= 18 && hasLicense
    ? "Você pode dirigir."
    : "Você não pode dirigir."
)
// Output: "Você não pode dirigir."
```

### Em funções

```javascript
function getAccessMessage(age) {
  return age >= 18
    ? "Acesso permitido."
    : "Acesso negado."
}

console.log(getAccessMessage(15)) // "Acesso negado."
console.log(getAccessMessage(22)) // "Acesso permitido."
```

### Em React/JSX

```tsx
function DriveStatus({ age }: { age: number }) {
  return (
    <p>
      {age >= 18
        ? "Você pode dirigir."
        : "Você não pode dirigir."}
    </p>
  )
}
```

### Valor default com nullish

```javascript
// Ternário para default
const displayName = username ? username : "Anônimo"

// Melhor alternativa com ?? (nullish coalescing)
const displayName = username ?? "Anônimo"
```

### Ternário vs if/else — comparação direta

```javascript
// Com if/else (4 linhas)
let status
if (score >= 7) {
  status = "Aprovado"
} else {
  status = "Reprovado"
}

// Com ternário (1 linha)
const status = score >= 7 ? "Aprovado" : "Reprovado"
```