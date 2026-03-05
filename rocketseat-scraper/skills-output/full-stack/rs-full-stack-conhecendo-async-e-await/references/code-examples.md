# Code Examples: Async e Await

## Funcao promise base (reaproveitada da aula anterior)

```javascript
function minhaPromise(sucesso) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (sucesso) {
        resolve("A operacao foi concluida com sucesso")
      } else {
        reject("Algo deu errado")
      }
    }, 2000)
  })
}
```

## Exemplo 1: Sem await (resultado errado)

```javascript
function fetch() {
  const response = minhaPromise(true)
  console.log(response) // Promise { <pending> }
}

fetch()
```

**Resultado:** Exibe o objeto Promise pendente, nao o valor resolvido.

## Exemplo 2: Com async/await (resultado correto)

```javascript
async function fetch() {
  const response = await minhaPromise(true)
  console.log(response) // "A operacao foi concluida com sucesso"
}

fetch()
```

**Resultado:** Aguarda a promise resolver e exibe o valor.

## Exemplo 3: Promise rejeitada com await

```javascript
async function fetch() {
  const response = await minhaPromise(false)
  console.log(response) // Nao executa — excecao lancada
}

fetch() // Uncaught error: "Algo deu errado"
```

## Exemplo 4: Arrow function com async

```javascript
const fetch = async () => {
  const response = await minhaPromise(true)
  console.log(response)
}

fetch()
```

## Exemplo 5: Try/Catch/Finally completo

```javascript
async function fetch() {
  try {
    const response = await minhaPromise(true)
    console.log("Sucesso:", response)
  } catch (erro) {
    console.log("Erro:", erro)
  } finally {
    console.log("Fim da execucao")
  }
}

fetch()
// Sucesso: A operacao foi concluida com sucesso
// Fim da execucao
```

## Exemplo 6: Try/Catch/Finally com rejeicao

```javascript
async function fetch() {
  try {
    const response = await minhaPromise(false)
    console.log("Sucesso:", response)
  } catch (erro) {
    console.log("Erro:", erro)
  } finally {
    console.log("Fim da execucao")
  }
}

fetch()
// Erro: Algo deu errado
// Fim da execucao
```

## Exemplo 7: Cenario real — fetch de API

```javascript
async function fetchUsers() {
  try {
    const response = await fetch("https://api.example.com/users")
    const users = await response.json()
    console.log("Usuarios:", users)
  } catch (error) {
    console.error("Falha ao buscar usuarios:", error)
  } finally {
    console.log("Requisicao finalizada")
  }
}
```

## Exemplo 8: Multiplos awaits sequenciais

```javascript
async function fetchUserAndPosts(userId) {
  try {
    const user = await getUser(userId)
    const posts = await getPosts(user.id)
    console.log("Usuario:", user)
    console.log("Posts:", posts)
  } catch (error) {
    console.error("Erro:", error)
  }
}
```

## Exemplo 9: Comparacao lado a lado

### Com .then()/.catch()/.finally()
```javascript
minhaPromise(true)
  .then((response) => console.log("Sucesso:", response))
  .catch((erro) => console.log("Erro:", erro))
  .finally(() => console.log("Fim da execucao"))
```

### Com async/await + try/catch/finally
```javascript
async function fetch() {
  try {
    const response = await minhaPromise(true)
    console.log("Sucesso:", response)
  } catch (erro) {
    console.log("Erro:", erro)
  } finally {
    console.log("Fim da execucao")
  }
}
```

Ambas produzem o mesmo resultado. A versao async/await e mais legivel para fluxos sequenciais.