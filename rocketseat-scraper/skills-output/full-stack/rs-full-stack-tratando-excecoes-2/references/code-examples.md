# Code Examples: Tratamento de Exceções no Express

## Exemplo 1: Lançando erro de propósito no controller

```typescript
// src/controllers/ProductController.ts
class ProductController {
  create(request: Request, response: Response) {
    throw new Error("Erro ao tentar criar um produto")

    // Esta linha NUNCA executa — VS Code mostra visualmente como código "apagado"
    return response.json({ message: "Produto criado" })
  }
}
```

## Exemplo 2: Sem tratamento — resposta padrão do Express

Ao fazer POST em `/product` sem middleware de erro:

**Resposta:** HTML com stack trace completo
```
Error: Erro ao tentar criar um produto
    at ProductController.create (src/controllers/ProductController.ts:21:11)
    at Layer.handle [as handle_request] ...
```
**Status:** 500
**Terminal:** Poluído com toda a stack trace

## Exemplo 3: Middleware de erro — JSON vazio

```typescript
// server.ts
import express, { Request, Response, NextFunction } from "express"

const app = express()
app.use(express.json())
app.use(routes)

// Primeiro teste: JSON vazio
app.use((error: any, request: Request, response: Response, _next: NextFunction) => {
  return response.status(500).json({})
})

app.listen(3333)
```

**Resposta:** `{}` com status 500

## Exemplo 4: Middleware com mensagem fixa

```typescript
app.use((error: any, request: Request, response: Response, _next: NextFunction) => {
  return response.status(500).json({ message: "Erro no servidor" })
})
```

**Resposta:** `{ "message": "Erro no servidor" }`

## Exemplo 5: Middleware com mensagem dinâmica do erro (versão final)

```typescript
app.use((error: any, request: Request, response: Response, _next: NextFunction) => {
  return response.status(500).json({ message: error.message })
})
```

**Resposta:** `{ "message": "Erro ao tentar criar um produto" }`

## Exemplo 6: Estrutura completa do server.ts

```typescript
import express, { Request, Response, NextFunction } from "express"
import { routes } from "./routes"

const app = express()

// 1. Parser JSON
app.use(express.json())

// 2. Rotas da aplicação
app.use(routes)

// 3. Middleware de erro (SEMPRE no final, depois de tudo)
app.use((error: any, request: Request, response: Response, _next: NextFunction) => {
  return response.status(500).json({ message: error.message })
})

// 4. Iniciar servidor (depois do middleware de erro)
app.listen(3333, () => {
  console.log("Server is running on port 3333")
})
```

## Exemplo 7: Formas de lidar com parâmetro next não utilizado

```typescript
// Opção 1: Underscore prefix (preferência do instrutor)
app.use((error: any, request: Request, response: Response, _next: NextFunction) => {
  return response.status(500).json({ message: error.message })
})

// Opção 2: Tipar inline sem nomear
app.use((error: any, request: Request, response: Response, _: NextFunction) => {
  return response.status(500).json({ message: error.message })
})
```

## Exemplo 8: Diferença entre error e error.message

```typescript
// Retorna objeto Error inteiro (NÃO faça isso)
return response.status(500).json({ message: error })
// Resultado: { "message": {} } — objeto vazio ou com propriedades internas

// Retorna apenas a mensagem string (CORRETO)
return response.status(500).json({ message: error.message })
// Resultado: { "message": "Erro ao tentar criar um produto" }
```

## Ordem obrigatória no server.ts

```
1. express()                    → Cria a instância
2. app.use(express.json())      → Parser de body
3. app.use(routes)              → Rotas e controllers
4. app.use(errorMiddleware)     → Captura exceções de 1-3
5. app.listen()                 → Inicia o servidor
```