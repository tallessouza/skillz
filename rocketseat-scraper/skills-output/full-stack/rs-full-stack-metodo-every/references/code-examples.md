# Code Examples: Método every()

## Exemplo base da aula

```javascript
// Lista de idades de pessoas querendo tirar habilitação
const ages = [30, 39, 29, 15]

const result = ages.every(age => age >= 18)
console.log(result) // false — 15 não atende

// Trocando 15 por 18:
const ages2 = [30, 39, 29, 18]
const result2 = ages2.every(age => age >= 18)
console.log(result2) // true — todos atendem
```

## Variações práticas

### Com objetos

```javascript
const students = [
  { name: "Ana", grade: 7.5 },
  { name: "Bruno", grade: 8.0 },
  { name: "Carla", grade: 5.5 },
]

const allPassed = students.every(student => student.grade >= 7.0)
console.log(allPassed) // false — Carla tem 5.5
```

### Validação de formulário

```javascript
const fields = [
  { name: "email", value: "user@mail.com", required: true },
  { name: "name", value: "João", required: true },
  { name: "phone", value: "", required: true },
]

const allFieldsFilled = fields
  .filter(field => field.required)
  .every(field => field.value.trim() !== "")

console.log(allFieldsFilled) // false — phone está vazio
```

### Verificar tipos

```javascript
const values = [1, 2, 3, "4", 5]
const allNumbers = values.every(value => typeof value === "number")
console.log(allNumbers) // false — "4" é string
```

### Verificar permissões

```javascript
const requiredPermissions = ["read", "write", "delete"]
const userPermissions = ["read", "write", "delete", "admin"]

const hasAllPermissions = requiredPermissions.every(
  permission => userPermissions.includes(permission)
)
console.log(hasAllPermissions) // true
```

### Com guarda contra array vazio

```javascript
function allItemsValid(items) {
  if (items.length === 0) return false
  return items.every(item => item.isValid)
}

console.log(allItemsValid([])) // false (não true!)
console.log(allItemsValid([{ isValid: true }])) // true
```

### Combinando com other array methods

```javascript
const orders = [
  { id: 1, items: [{ price: 10 }, { price: 20 }] },
  { id: 2, items: [{ price: 5 }, { price: -1 }] },
]

// Todas as orders têm todos os preços positivos?
const allPricesPositive = orders.every(order =>
  order.items.every(item => item.price > 0)
)
console.log(allPricesPositive) // false — order 2 tem -1
```

### Extraindo condição para função nomeada

```javascript
const isEligibleForLicense = (age) => age >= 18
const isValidEmail = (email) => email.includes("@") && email.includes(".")

const ages = [30, 39, 29, 18]
console.log(ages.every(isEligibleForLicense)) // true

const emails = ["a@b.com", "invalid", "c@d.org"]
console.log(emails.every(isValidEmail)) // false
```