# Code Examples: Classes para Lidar com Exceções

## Exemplo 1: TypeError automático do JavaScript

```javascript
const obj = []

try {
  obj.execute() // método não existe em array
} catch (error) {
  console.log(error)
  // TypeError: obj.execute is not a function
}
```

O JavaScript lançou `TypeError` automaticamente porque tentamos chamar `.execute()` num array.

## Exemplo 2: Identificando TypeError com instanceof

```javascript
const obj = []

try {
  obj.execute()
} catch (error) {
  if (error instanceof TypeError) {
    console.log("Método indisponível")
  }
}
// Output: Método indisponível
```

## Exemplo 3: Lançando Error genérico manualmente

```javascript
const obj = []

try {
  if (!obj.includes(17)) {
    throw new Error("O número 17 não está disponível")
  }
} catch (error) {
  console.log(error)
  // Error: O número 17 não está disponível
}
```

Nota: como o erro agora é `Error` (não `TypeError`), o check `instanceof TypeError` não capturaria.

## Exemplo 4: RangeError para validação de intervalo

```javascript
const obj = [17]
const index = 300

try {
  if (!obj.includes(17)) {
    throw new Error("O número 17 não está disponível")
  }
  if (index > 99) {
    throw new RangeError("Número está fora do intervalo, escolha um número de 0 a 99")
  }
} catch (error) {
  console.log(error)
  // RangeError: Número está fora do intervalo, escolha um número de 0 a 99
}
```

Como 17 existe no array, o primeiro `throw` não executa. O segundo `throw` (RangeError) dispara.

## Exemplo 5: Encadeamento completo com mensagens amigáveis

```javascript
const obj = [17]
const index = 300

try {
  if (!obj.includes(17)) {
    throw new Error("O número 17 não está disponível")
  }
  if (index > 99) {
    throw new RangeError("Número está fora do intervalo, escolha um número de 0 a 99")
  }
} catch (error) {
  if (error instanceof RangeError) {
    console.log(error.message)
    // "Número está fora do intervalo, escolha um número de 0 a 99"
  } else if (error instanceof TypeError) {
    console.log("Método indisponível")
  } else {
    console.log("Não foi possível realizar a ação")
  }
}
```

## Variação: Aplicando em função com banco de dados

```javascript
async function saveUser(userData) {
  try {
    if (!userData.email) {
      throw new TypeError("Email é obrigatório")
    }
    if (userData.age < 0 || userData.age > 150) {
      throw new RangeError("Idade deve ser entre 0 e 150")
    }
    await database.insert(userData)
  } catch (error) {
    if (error instanceof RangeError) {
      console.log(error.message) // mensagem amigável sobre o range
    } else if (error instanceof TypeError) {
      console.log(error.message) // mensagem amigável sobre campo obrigatório
    } else {
      console.log("Não foi possível salvar o usuário. Tente novamente.")
    }
  }
}
```

## Variação: Múltiplas validações sequenciais

```javascript
function processOrder(items, quantity) {
  try {
    if (!Array.isArray(items)) {
      throw new TypeError("Items deve ser um array")
    }
    if (quantity < 1 || quantity > 1000) {
      throw new RangeError("Quantidade deve ser entre 1 e 1000")
    }
    if (!items.includes("produto-valido")) {
      throw new Error("Produto não encontrado no catálogo")
    }
    // processar pedido...
  } catch (error) {
    if (error instanceof TypeError) {
      console.log(`Erro de tipo: ${error.message}`)
    } else if (error instanceof RangeError) {
      console.log(`Erro de intervalo: ${error.message}`)
    } else {
      console.log(error.message)
    }
  }
}
```