# Code Examples: Try / Catch / Finally

## Exemplo 1: Variavel nao definida (do transcript)

### Sem try/catch (erro quebra tudo)
```javascript
console.log(result) // ReferenceError: result is not defined
// programa para aqui
```

### Com try/catch
```javascript
try {
  console.log(result)
} catch (error) {
  console.log(error) // ReferenceError: result is not defined
}
// programa continua normalmente
```

### Com mensagem amigavel
```javascript
try {
  console.log(result)
} catch (error) {
  console.log("Nao foi possivel processar seu pedido. Tente novamente mais tarde.")
  console.log(error) // log tecnico para debug
}
```

## Exemplo 2: Try/catch/finally (do transcript)

```javascript
try {
  console.log(result)
} catch (error) {
  console.log("Nao foi possivel processar seu pedido.")
  console.log(error)
} finally {
  console.log("Fim") // executa SEMPRE
}
```

## Exemplo 3: Throw new Error (do transcript)

### Com valor diferente de 0 (nao lanca excecao)
```javascript
let result = 1

try {
  if (result === 0) {
    throw new Error("O valor e igual a 0")
  }
  console.log("Resultado:", result)
} catch (error) {
  console.log(error)
} finally {
  console.log("Fim")
}
// Output: "Resultado: 1" e "Fim"
```

### Com valor 0 (lanca excecao)
```javascript
let result = 0

try {
  if (result === 0) {
    throw new Error("O valor e igual a 0")
  }
  console.log("Resultado:", result) // nunca executa
} catch (error) {
  console.log(error.message) // "O valor e igual a 0"
} finally {
  console.log("Fim")
}
// Output: "O valor e igual a 0" e "Fim"
```

## Variacoes praticas

### Fetch com try/catch
```javascript
async function loadUsers() {
  try {
    const response = await fetch("https://api.example.com/users")

    if (!response.ok) {
      throw new Error(`Servidor retornou status ${response.status}`)
    }

    const users = await response.json()
    return users
  } catch (error) {
    console.error("Erro ao carregar usuarios:", error.message)
    showNotification("Nao foi possivel carregar os usuarios.")
    return []
  }
}
```

### Conexao com banco (cenario do instrutor)
```javascript
let connection

try {
  connection = await database.connect()
  await connection.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email])
  console.log("Usuario cadastrado com sucesso")
} catch (error) {
  console.error("Erro no cadastro:", error.message)
  showMessage("Erro ao cadastrar. Tente novamente.")
} finally {
  if (connection) {
    await connection.close()
    console.log("Conexao fechada")
  }
}
```

### Validacao com throw
```javascript
function validateAge(age) {
  if (typeof age !== "number") {
    throw new Error("Idade deve ser um numero")
  }
  if (age < 0) {
    throw new Error("Idade nao pode ser negativa")
  }
  if (age > 150) {
    throw new Error("Idade invalida")
  }
  return true
}

try {
  validateAge(-5)
} catch (error) {
  console.log(error.message) // "Idade nao pode ser negativa"
}
```

### Parse de JSON externo
```javascript
function parseConfig(jsonString) {
  try {
    const config = JSON.parse(jsonString)
    return config
  } catch (error) {
    console.error("JSON invalido:", error.message)
    return null
  }
}
```

### Loading state com finally
```javascript
let isLoading = true

try {
  const data = await fetchData()
  renderContent(data)
} catch (error) {
  renderErrorMessage("Algo deu errado.")
} finally {
  isLoading = false
  hideLoadingSpinner()
}
```