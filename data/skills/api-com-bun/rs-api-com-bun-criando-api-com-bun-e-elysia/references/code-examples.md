# Code Examples: Criando API com Bun e ElysiaJS

## 1. Inicializacao completa do projeto

```bash
# Criar pasta do projeto
mkdir pizzashop-api
cd pizzashop-api

# Inicializar com Bun (cria package.json, tsconfig.json etc)
bun init -y

# Instalar ElysiaJS
bun add elysia
```

O `bun init` cria automaticamente:
- `package.json`
- `tsconfig.json` (com `strict: true` por padrao)
- `index.ts` (arquivo inicial — sera substituido)

## 2. tsconfig.json

O Elysia requer `strict: true`, que ja vem por padrao no `bun init`:

```json
{
  "compilerOptions": {
    "strict": true
    // ... outras opcoes geradas pelo bun init
  }
}
```

## 3. package.json com scripts

```json
{
  "name": "pizzashop-api",
  "scripts": {
    "dev": "bun --watch src/http/server.ts",
    "build": "bun build src/http/server.ts",
    "start": "bun src/http/server.ts",
    "test": "bun test"
  },
  "dependencies": {
    "elysia": "^1.0.0"
  }
}
```

Nota: o arquivo `index.ts` criado automaticamente pelo `bun init` deve ser deletado — o entry point real e `src/http/server.ts`.

## 4. Servidor ElysiaJS completo

```typescript
// src/http/server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => {
    return 'Hello World'
  })
  .listen(3333, () => {
    console.log('🔥 HTTP server running')
  })
```

### Anatomia do codigo:

1. **`import { Elysia } from 'elysia'`** — Elysia e uma classe exportada do pacote
2. **`new Elysia()`** — cria a instancia da aplicacao
3. **`.get('/', () => ...)`** — define rota GET na raiz, sintaxe identica a Express/Fastify
4. **`.listen(3333, callback)`** — inicia o servidor na porta 3333, callback opcional no segundo parametro

## 5. Executando e testando

```bash
# Iniciar em modo desenvolvimento (com hot reload)
bun dev

# Ou diretamente
bun --watch src/http/server.ts

# Testar a rota (qualquer ferramenta HTTP)
curl http://localhost:3333/
# Retorna: Hello World

# Com HTTPie
http :3333/
# Retorna: Hello World
```

### Verificando tempo de inicializacao

```bash
time bun src/http/server.ts
# Inicializa em poucos milissegundos
```

## 6. Comparacao de sintaxe: Elysia vs Express vs Fastify

### Express
```typescript
import express from 'express'
const app = express()
app.get('/', (req, res) => { res.send('Hello World') })
app.listen(3333)
```

### Fastify
```typescript
import fastify from 'fastify'
const app = fastify()
app.get('/', async () => { return 'Hello World' })
app.listen({ port: 3333 })
```

### ElysiaJS (Bun)
```typescript
import { Elysia } from 'elysia'
const app = new Elysia()
  .get('/', () => 'Hello World')
  .listen(3333)
```

A sintaxe e praticamente identica — a transicao entre frameworks e natural.