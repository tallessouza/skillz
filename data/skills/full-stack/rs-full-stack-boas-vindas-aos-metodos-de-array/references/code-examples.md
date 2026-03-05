# Code Examples: Métodos de Array

## Comparação: Loop imperativo vs Método declarativo

### Percorrer itens

```javascript
// Imperativo
for (let i = 0; i < users.length; i++) {
  console.log(users[i].name)
}

// Declarativo
users.forEach(user => console.log(user.name))
```

### Transformar itens

```javascript
// Imperativo
const names = []
for (let i = 0; i < users.length; i++) {
  names.push(users[i].name)
}

// Declarativo
const names = users.map(user => user.name)
```

### Filtrar itens

```javascript
// Imperativo
const activeUsers = []
for (let i = 0; i < users.length; i++) {
  if (users[i].isActive) {
    activeUsers.push(users[i])
  }
}

// Declarativo
const activeUsers = users.filter(user => user.isActive)
```

### Encadeamento

```javascript
// Imperativo (nested if + push + transform)
const activeUserEmails = []
for (let i = 0; i < users.length; i++) {
  if (users[i].isActive) {
    activeUserEmails.push(users[i].email.toLowerCase())
  }
}

// Declarativo (pipeline legível)
const activeUserEmails = users
  .filter(user => user.isActive)
  .map(user => user.email.toLowerCase())
```

### Buscar item

```javascript
// Imperativo
let admin = null
for (let i = 0; i < users.length; i++) {
  if (users[i].role === 'admin') {
    admin = users[i]
    break
  }
}

// Declarativo
const admin = users.find(user => user.role === 'admin')
```

### Acumular valor

```javascript
// Imperativo
let totalPrice = 0
for (let i = 0; i < products.length; i++) {
  totalPrice += products[i].price
}

// Declarativo
const totalPrice = products.reduce((total, product) => total + product.price, 0)
```