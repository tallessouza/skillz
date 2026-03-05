# Code Examples: Const

## Exemplo original da aula

```javascript
// Uma constante cria uma variável cujo valor é fixo (não pode ser alterado)
const number = 42
console.log(number) // 42

// Irá gerar um erro, porque o valor não pode ser alterado
// number = 55
// console.log(number) // TypeError: Assignment to constant variable.
```

## Variações práticas

### Configurações da aplicação

```javascript
const PORT = 3000
const DATABASE_URL = "postgresql://localhost:5432/mydb"
const MAX_UPLOAD_SIZE_IN_MB = 10
```

### Resultados de operações

```javascript
const users = await db.query("SELECT * FROM users")
const firstUser = users[0]
const fullName = `${firstUser.firstName} ${firstUser.lastName}`
```

### Destructuring (sempre const)

```javascript
const { name, email } = user
const [first, ...rest] = items
const { data: responseData } = await axios.get("/api")
```

### Funções (sempre const)

```javascript
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat("pt-BR").format(date)
}
```

### Arrays com mutação de conteúdo (const é correto)

```javascript
const cart = []
cart.push({ product: "Notebook", price: 3500 })
cart.push({ product: "Mouse", price: 89 })
// cart = [] // ERRO — não pode reatribuir a referência
```

### Objetos com mutação de propriedades (const é correto)

```javascript
const config = {
  theme: "light",
  language: "pt-BR",
}
config.theme = "dark" // OK
// config = {}        // ERRO
```

### Quando let é necessário

```javascript
// Contador
let count = 0
for (const user of users) {
  if (user.isActive) count++
}

// Acumulador
let total = 0
for (const item of cart) {
  total += item.price
}

// Flag de estado
let isConnected = false
try {
  await db.connect()
  isConnected = true
} catch (error) {
  console.error("Falha na conexão:", error)
}

// Loop clássico
for (let i = 0; i < 10; i++) {
  console.log(i)
}
```

### for...of usa const (valor recriado a cada iteração)

```javascript
const fruits = ["maçã", "banana", "laranja"]
for (const fruit of fruits) {
  console.log(fruit) // const é correto aqui
}
```