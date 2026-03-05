# Code Examples: Método some()

## Exemplo da aula — verificação de idade

```javascript
// Array de idades
const ages = [15, 30, 39, 29]

// Verifica se algum é menor de 18
const result = ages.some((age) => age < 18)
console.log(result) // true (15 é menor que 18)
```

```javascript
// Trocando 15 por 19
const ages = [19, 30, 39, 29]
const result = ages.some((age) => age < 18)
console.log(result) // false (ninguém é menor que 18)
```

## Variações práticas

### Verificar se existe item em estoque

```javascript
const products = [
  { name: "Camiseta", stock: 0 },
  { name: "Calça", stock: 5 },
  { name: "Tênis", stock: 0 },
]

const hasAvailableProduct = products.some((product) => product.stock > 0)
console.log(hasAvailableProduct) // true
```

### Verificar permissões

```javascript
const userRoles = ["editor", "viewer"]
const requiredRoles = ["admin", "editor"]

const hasAccess = requiredRoles.some((role) => userRoles.includes(role))
console.log(hasAccess) // true (tem "editor")
```

### Validação de formulário (algum campo vazio?)

```javascript
const fields = ["João", "", "joao@email.com"]
const hasEmptyField = fields.some((field) => field.trim() === "")
console.log(hasEmptyField) // true
```

### Verificar se array contém valor específico

```javascript
const colors = ["red", "green", "blue"]
const hasGreen = colors.some((color) => color === "green")
// Equivalente a colors.includes("green"), mas some() aceita lógica complexa
```

### Comparação: some() vs filter().length > 0

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Ruim: percorre tudo, cria novo array
const hasEven = numbers.filter((n) => n % 2 === 0).length > 0

// Bom: para no primeiro match (2), sem criar array
const hasEven = numbers.some((n) => n % 2 === 0)
```

### Uso em condicionais

```javascript
const notifications = [
  { read: true },
  { read: false },
  { read: true },
]

const hasUnread = notifications.some((n) => !n.read)

if (hasUnread) {
  showNotificationBadge()
}
```

### Array vazio

```javascript
const empty = []
const result = empty.some((item) => item > 0)
console.log(result) // false — nenhum elemento para testar
```