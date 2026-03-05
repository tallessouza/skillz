# Code Examples: Criando Aplicacao Node.js com Fastify

## Setup completo do projeto

### Instalacao de dependencias

```bash
# Framework web
npm install fastify

# TypeScript tooling (dev only)
npm install -D @types/node tsx
```

### Arquivo server.ts basico

```typescript
// src/server.ts
import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'Hello World'
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
```

### package.json com script dev

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts"
  }
}
```

## Metodos HTTP disponiveis no Fastify

```typescript
const app = fastify()

// Todos os 5 metodos REST disponiveis diretamente
app.get('/resource', handler)
app.post('/resource', handler)
app.put('/resource/:id', handler)
app.patch('/resource/:id', handler)
app.delete('/resource/:id', handler)
```

## Retorno de diferentes tipos de resposta

```typescript
// Retornar texto simples
app.get('/text', () => {
  return 'Hello World'
})

// Retornar JSON (automatico quando retorna objeto)
app.get('/json', () => {
  return { message: 'Hello World' }
})
```

## Fluxo de compilacao manual (para entender o que TSX faz)

```bash
# Passo 1: Compilar TypeScript para JavaScript
npx tsc src/server.ts

# Passo 2: Executar o JavaScript gerado
node src/server.js

# Com TSX, tudo isso vira:
npx tsx src/server.ts
```

## Comparacao de performance (demonstrada na aula)

```bash
# JavaScript puro — mais rapido
time node src/server.js
# ~999ms

# TSX (TypeScript) — mais lento por causa da transpilacao
time tsx src/server.ts
# ~1.2s+
```

## Modo watch para desenvolvimento

```bash
# Sem watch — precisa reiniciar manualmente
npx tsx src/server.ts

# Com watch — reinicia automaticamente ao salvar
npx tsx watch src/server.ts
```

### Demonstracao do watch

1. Rode `npm run dev` (que executa `tsx watch src/server.ts`)
2. Altere o retorno de uma rota (ex: `'Hello World'` → `'Hello Node.js'`)
3. Salve o arquivo
4. O TSX detecta a mudanca e reinicia automaticamente
5. A proxima requisicao ja retorna o valor atualizado

## Erro comum: falta de @types/node

```bash
# Ao executar sem @types/node:
npx tsc src/server.ts
# Erro: Cannot find name 'Buffer'
# Do you need to install type definitions for Node?

# Solucao:
npm install -D @types/node

# Agora compila sem erros:
npx tsc src/server.ts
```