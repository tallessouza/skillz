# Code Examples: Estrutura de Condição

## Exemplo 1: Verificação de login (do instrutor)

```javascript
// Condição: e-mail e senha estão corretos?
const email = "usuario@email.com"
const password = "123456"

const storedEmail = "usuario@email.com"
const storedPassword = "123456"

const isEmailCorrect = email === storedEmail
const isPasswordCorrect = password === storedPassword

if (isEmailCorrect && isPasswordCorrect) {
  console.log("Acesso permitido! Bem-vindo ao sistema.")
} else {
  console.log("E-mail ou senha incorretos.")
}
```

### Variação: com early return em função

```javascript
function login(email, password) {
  const isEmailCorrect = email === storedEmail
  const isPasswordCorrect = password === storedPassword

  if (!isEmailCorrect || !isPasswordCorrect) {
    return { success: false, message: "E-mail ou senha incorretos" }
  }

  return { success: true, message: "Bem-vindo ao sistema" }
}
```

## Exemplo 2: A porta (do instrutor)

```javascript
// Condição: a porta está aberta?
const isDoorOpen = false

if (isDoorOpen) {
  console.log("Pode entrar!")
} else {
  console.log("A porta está fechada. Abrindo a porta...")
  // abrir a porta primeiro
}
```

### Variação: com objeto e método

```javascript
function enterRoom(door) {
  if (!door.isOpen) {
    door.open()
  }

  door.enter()
  console.log("Você entrou na sala.")
}
```

## Exemplo 3: Condições compostas extraídas

```javascript
// Sem extração (difícil de ler)
if (user.age >= 18 && user.hasVerifiedEmail && !user.isBanned) {
  grantAccess()
}

// Com extração (claro e reutilizável)
const isAdult = user.age >= 18
const isVerified = user.hasVerifiedEmail
const isNotBanned = !user.isBanned
const canAccessSystem = isAdult && isVerified && isNotBanned

if (canAccessSystem) {
  grantAccess()
} else {
  showRestrictionMessage()
}
```

## Exemplo 4: Múltiplos caminhos com else if

```javascript
const temperature = 35

if (temperature > 30) {
  console.log("Está muito quente!")
} else if (temperature > 20) {
  console.log("Temperatura agradável.")
} else if (temperature > 10) {
  console.log("Está um pouco frio.")
} else {
  console.log("Está muito frio!")
}
```

## Exemplo 5: Early return para evitar aninhamento

```javascript
// Ruim: aninhamento excessivo
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.paymentConfirmed) {
        shipOrder(order)
      } else {
        console.log("Pagamento pendente")
      }
    } else {
      console.log("Carrinho vazio")
    }
  } else {
    console.log("Pedido não encontrado")
  }
}

// Bom: early returns
function processOrder(order) {
  if (!order) {
    console.log("Pedido não encontrado")
    return
  }

  if (order.items.length === 0) {
    console.log("Carrinho vazio")
    return
  }

  if (!order.paymentConfirmed) {
    console.log("Pagamento pendente")
    return
  }

  shipOrder(order)
}
```

## Exemplo 6: Ternário para condições simples

```javascript
// if/else para atribuição simples — verboso demais
let message
if (isLoggedIn) {
  message = "Bem-vindo de volta!"
} else {
  message = "Faça login para continuar."
}

// Ternário — conciso e claro para casos simples
const message = isLoggedIn
  ? "Bem-vindo de volta!"
  : "Faça login para continuar."
```