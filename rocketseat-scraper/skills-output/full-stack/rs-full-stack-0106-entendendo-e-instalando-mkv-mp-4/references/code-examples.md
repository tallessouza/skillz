# Code Examples: CORS no Node.js com Express

## 1. Setup mínimo — desenvolvimento

A forma mais simples de habilitar CORS, como mostrado na aula:

```bash
npm install cors
```

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

// Libera TODAS as origens (apenas para desenvolvimento)
app.use(cors())

app.get('/refunds', (req, res) => {
  res.json({ refunds: [] })
})

app.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

Com isso, o frontend rodando em `http://localhost:3000` consegue acessar `http://localhost:3333/refunds` sem bloqueio.

## 2. Configuração para produção — origem específica

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: 'https://meufront.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.get('/refunds', (req, res) => {
  res.json({ refunds: [] })
})
```

## 3. Múltiplas origens permitidas

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://meufront.com',
  'https://staging.meufront.com'
]

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (curl, Postman)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Bloqueado pelo CORS'))
    }
  }
}))
```

## 4. CORS por rota específica

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

// CORS apenas para rotas públicas
app.get('/api/public', cors(), (req, res) => {
  res.json({ message: 'Acessível de qualquer origem' })
})

// Rota sem CORS (apenas mesma origem)
app.get('/api/admin', (req, res) => {
  res.json({ message: 'Apenas mesma origem' })
})
```

## 5. CORS manual (sem biblioteca)

Para entender o que o middleware `cors` faz internamente:

```javascript
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  // Responde preflight imediatamente
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  
  next()
})
```

Isso demonstra exatamente os headers que o instrutor menciona: `Access-Control-Allow-Origin` é o principal, que o navegador verifica antes de liberar os dados para o JavaScript.

## 6. Cenário completo — API do projeto Refund

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

// CORS habilitado para o frontend consumir a API
app.use(cors())

// Parse JSON body
app.use(express.json())

// Rotas da API
app.get('/refunds', (req, res) => {
  // Frontend em http://localhost:3000 consegue acessar
  res.json({ refunds: [] })
})

app.post('/refunds', (req, res) => {
  const { description, amount } = req.body
  // Criar refund...
  res.status(201).json({ id: 1, description, amount })
})

const PORT = 3333
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
```

## 7. Testando se CORS está funcionando

### No terminal (sem CORS — sempre funciona):
```bash
curl -i http://localhost:3333/refunds
# Retorna os dados normalmente (curl ignora CORS)
```

### No navegador (com CORS — depende da configuração):
```javascript
// Console do navegador em http://localhost:3000
fetch('http://localhost:3333/refunds')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('CORS bloqueou:', err))
```

### Verificando headers CORS na resposta:
```bash
curl -I -H "Origin: http://localhost:3000" http://localhost:3333/refunds
# Deve conter: Access-Control-Allow-Origin: *
# Ou: Access-Control-Allow-Origin: http://localhost:3000
```