# Code Examples: Local Storage — Persistência de Sessão

## Exemplo 1: Demonstração no DevTools (manual)

O instrutor primeiro demonstra diretamente no painel Application do DevTools:

```
// No DevTools → Application → Local Storage → localhost:5173

// Criar entrada manualmente:
// Key: name    Value: Rodrigo

// No console do DevTools:
console.log(localStorage.getItem("name")) // "Rodrigo"

// Alterar o valor no painel para "Mike"
console.log(localStorage.getItem("name")) // "Mike"
```

## Exemplo 2: console.log no app.jsx

```javascript
// app.jsx — teste de recuperação
console.log(localStorage.getItem("name"))
// Exibe no console o valor armazenado para a chave "name"
// Se não existir, exibe null
```

## Exemplo 3: setItem sobrescreve valor existente

```javascript
// Valor atual: name = "Mike"
localStorage.setItem("name", "Rodrigo Gonçalves")
// Agora: name = "Rodrigo Gonçalves"
// setItem cria se não existe, atualiza se já existe
```

## Exemplo 4: removeItem deleta a chave

```javascript
localStorage.removeItem("name")
console.log(localStorage.getItem("name")) // null
```

## Exemplo 5: Implementação no contexto de autenticação

```javascript
// Constante de namespace em caixa alta
const LOCAL_STORAGE_KEY = "@refound"

// Dentro da função save do contexto de autenticação
function save(data) {
  // Salvar dados do usuário (objeto → precisa de JSON.stringify)
  localStorage.setItem(
    `${LOCAL_STORAGE_KEY}:user`,
    JSON.stringify(data.user)
  )

  // Salvar token separado (string → direto)
  localStorage.setItem(
    `${LOCAL_STORAGE_KEY}:token`,
    data.token
  )
}
```

## Exemplo 6: Resultado no DevTools após login

```
// Após fazer login com: rodrigo@email.com / 123456
// Application → Local Storage mostra:

// Key: @refound:user
// Value: {"id":"1","name":"Rodrigo","email":"rodrigo@email.com"}

// Key: @refound:token
// Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Exemplo 7: Recuperação completa da sessão

```javascript
const LOCAL_STORAGE_KEY = "@refound"

function restoreSession() {
  const storedUser = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`)
  const storedToken = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`)

  if (storedUser && storedToken) {
    return {
      user: JSON.parse(storedUser),
      token: storedToken
    }
  }

  return null
}

// Uso na inicialização do app
const session = restoreSession()
if (session) {
  // Usuário já está logado, restaurar estado
  setUser(session.user)
  setToken(session.token)
}
```

## Exemplo 8: Logout com limpeza do localStorage

```javascript
function logout() {
  localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`)
  localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`)
  setUser(null)
  setToken(null)
}
```

## Exemplo 9: Variação — usar localStorage.clear() vs removeItem

```javascript
// removeItem — remove chaves específicas (RECOMENDADO)
localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`)
localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`)

// clear — remove TUDO do localStorage desse domínio (PERIGOSO)
localStorage.clear()
// Cuidado: apaga dados de outras funcionalidades da mesma app
```

## Exemplo 10: Variação — wrapper completo para localStorage

```javascript
const LOCAL_STORAGE_KEY = "@refound"

const storage = {
  save(data) {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user))
    localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token)
  },

  getUser() {
    const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`)
    return stored ? JSON.parse(stored) : null
  },

  getToken() {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`)
  },

  clear() {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`)
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`)
  }
}
```