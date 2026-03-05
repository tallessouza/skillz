# Code Examples: Criando API com Express

## Exemplo 1: Setup basico (da aula)

```typescript
import express from "express"

const PORT = 3333

const app = express()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Exemplo 2: Com variavel de ambiente

```typescript
import express from "express"

const PORT = process.env.PORT || 3333

const app = express()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Exemplo 3: Com host explicito

```typescript
import express from "express"

const PORT = 3333
const HOST = "0.0.0.0"

const app = express()

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
})
```

## Exemplo 4: Evolucao natural — adicionando rotas

```typescript
import express from "express"

const PORT = 3333

const app = express()

app.get("/", (request, response) => {
  response.json({ message: "Hello World" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

## Progressao do codigo na aula

1. Comecar com `import express from "express"` (ja existia do modulo anterior)
2. Criar `const PORT = 3333` em UPPER_CASE
3. Inicializar `const app = express()`
4. Chamar `app.listen(PORT, callback)` com template literal interpolando PORT
5. Salvar e verificar no terminal a mensagem "Server is running on port 3333"