# Code Examples: Conhecendo Promises

## Exemplo 1: Funcao basica que retorna Promise

Direto da aula — funcao com setTimeout simulando operacao assincrona:

```javascript
function asyncFunction() {
  return new Promise((resolve, reject) => {
    const success = true

    setTimeout(() => {
      if (success) {
        resolve("A operacao foi concluida com sucesso")
      } else {
        reject("Algo deu errado")
      }
    }, 3000)
  })
}
```

## Exemplo 2: Consumo completo com .then/.catch/.finally

```javascript
console.log("Executando funcao assincrona")

asyncFunction()
  .then((response) => {
    console.log("Sucesso:", response)
  })
  .catch((error) => {
    console.log("Erro:", error)
  })
  .finally(() => {
    console.log("Fim da execucao")
  })
```

**Saida com success = true:**
```
Executando funcao assincrona
// (3 segundos depois)
Sucesso: A operacao foi concluida com sucesso
Fim da execucao
```

**Saida com success = false:**
```
Executando funcao assincrona
// (3 segundos depois)
Erro: Algo deu errado
Fim da execucao
```

## Exemplo 3: O erro de usar retorno direto

```javascript
const response = asyncFunction()
console.log(response) // Promise { <pending> }
```

O JavaScript nao espera. Ele executa `asyncFunction()`, recebe a Promise (ainda pendente), e segue para o `console.log` imediatamente.

## Variacao: Promise com fetch (aplicacao real)

```typescript
function fetchUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) {
          reject(`HTTP error: ${response.status}`)
          return
        }
        return response.json()
      })
      .then((users) => resolve(users))
      .catch((error) => reject(error.message))
  })
}

fetchUsers()
  .then((users) => {
    console.log("Usuarios:", users)
  })
  .catch((error) => {
    console.error("Falha ao buscar usuarios:", error)
  })
  .finally(() => {
    console.log("Requisicao finalizada")
  })
```

## Variacao: Promise com validacao

```typescript
function validateEmail(email: string): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isValid = email.includes("@") && email.includes(".")

      if (isValid) {
        resolve(`Email ${email} e valido`)
      } else {
        reject(`Email ${email} e invalido`)
      }
    }, 1000)
  })
}

validateEmail("user@example.com")
  .then((message) => console.log(message))
  .catch((error) => console.error(error))
```

## Variacao: Encadeamento de .then

```typescript
function getUser(id: number): Promise<{ name: string; teamId: number }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: "João", teamId: 42 }), 1000)
  })
}

function getTeam(teamId: number): Promise<{ teamName: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ teamName: "Frontend" }), 1000)
  })
}

getUser(1)
  .then((user) => {
    console.log("Usuario:", user.name)
    return getTeam(user.teamId)
  })
  .then((team) => {
    console.log("Time:", team.teamName)
  })
  .catch((error) => {
    console.error("Erro em qualquer etapa:", error)
  })
```

## Variacao: finally para loading state

```typescript
let isLoading = true

fetchUsers()
  .then((users) => {
    renderUsers(users)
  })
  .catch((error) => {
    showError(error)
  })
  .finally(() => {
    isLoading = false
    hideSpinner()
  })
```