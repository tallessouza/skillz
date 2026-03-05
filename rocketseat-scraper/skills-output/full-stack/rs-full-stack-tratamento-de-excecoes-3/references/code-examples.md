# Code Examples: Tratamento de Exceções

## 1. Estrutura básica do try-catch

```javascript
try {
  // Código que pode gerar uma exceção
  const result = riskyOperation()
  console.log(result)
} catch (error) {
  // Captura e trata o erro
  console.error("Erro na operação:", error.message)
}
```

## 2. Fetch com tratamento completo

```javascript
async function loadUsers() {
  try {
    const response = await fetch("https://api.example.com/users")

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const users = await response.json()
    return users
  } catch (error) {
    console.error("Falha ao carregar usuários:", error)
    showNotification("Não foi possível carregar os usuários. Tente novamente mais tarde.")
    return []
  }
}
```

## 3. Leitura de arquivo com fallback

```javascript
import { readFile } from "fs/promises"

async function loadConfig() {
  try {
    const raw = await readFile("./config.json", "utf-8")
    return JSON.parse(raw)
  } catch (error) {
    console.error("Erro ao ler config.json:", error.message)
    console.log("Usando configuração padrão")
    return { theme: "light", language: "pt-BR" }
  }
}
```

## 4. Conexão com banco de dados

```javascript
async function getActiveUsers(database) {
  try {
    const connection = await database.connect()
    const users = await connection.query("SELECT * FROM users WHERE active = true")
    return users.rows
  } catch (error) {
    console.error("Erro ao consultar banco de dados:", error)
    throw new Error("Serviço temporariamente indisponível. Tente novamente mais tarde.")
  }
}
```

## 5. JSON.parse com input do usuário

```javascript
function parseUserInput(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    return parsed
  } catch (error) {
    console.error("JSON inválido recebido:", error.message)
    return null
  }
}

// Uso
const data = parseUserInput(userInput)
if (data === null) {
  showMessage("O formato dos dados enviados é inválido.")
}
```

## 6. Múltiplas operações externas (try-catch separados)

```javascript
async function syncUserData(userId) {
  let profile = null
  let orders = null

  try {
    profile = await fetchUserProfile(userId)
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    showMessage("Não foi possível carregar seu perfil.")
  }

  try {
    orders = await fetchUserOrders(userId)
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    showMessage("Não foi possível carregar seus pedidos.")
  }

  // Aplicação continua funcionando mesmo se uma das operações falhou
  renderDashboard({ profile, orders })
}
```

## 7. Try-catch-finally (cleanup de recursos)

```javascript
async function processFile(filePath) {
  let fileHandle = null

  try {
    fileHandle = await fs.open(filePath, "r")
    const content = await fileHandle.readFile("utf-8")
    return processContent(content)
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error.message)
    return null
  } finally {
    // Sempre fecha o arquivo, independente de sucesso ou erro
    if (fileHandle) {
      await fileHandle.close()
    }
  }
}
```

## 8. Anti-pattern: try-catch genérico (NÃO FAÇA)

```javascript
// ERRADO — envolve tudo, esconde a origem do erro
try {
  const users = await getUsers()
  const filtered = users.filter(u => u.active)
  const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))
  const rendered = sorted.map(u => renderCard(u))
  document.getElementById("list").innerHTML = rendered.join("")
} catch (error) {
  console.log("deu erro")
}

// CORRETO — try-catch apenas na operação externa
let users = []
try {
  users = await getUsers()
} catch (error) {
  console.error("Erro ao buscar usuários:", error)
  showMessage("Não foi possível carregar os usuários.")
  return
}

// Lógica interna sem try-catch (se der erro aqui, é bug no código)
const filtered = users.filter(u => u.active)
const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))
const rendered = sorted.map(u => renderCard(u))
document.getElementById("list").innerHTML = rendered.join("")
```

## 9. Critério mental: quando usar try-catch

```javascript
// Depende de algo externo? → try-catch
await fetch(url)              // ✅ rede é externa
await fs.readFile(path)       // ✅ filesystem é externo
await db.query(sql)           // ✅ banco de dados é externo
JSON.parse(userInput)         // ✅ input do usuário é externo

// Operação interna? → sem try-catch
const total = price * quantity  // ❌ cálculo determinístico
const name = user.name          // ❌ acesso a propriedade
const filtered = arr.filter(fn) // ❌ operação em memória
```