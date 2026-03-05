# Code Examples: Criando Projeto Node.js

## Inicializacao completa do projeto

```bash
# 1. Criar projeto
npm init -y

# 2. Instalar dependencia de producao
npm i fastify

# 3. Instalar dependencias de desenvolvimento
npm i -D typescript @types/node tsx tsup

# 4. Criar tsconfig.json
npx tsc --init
```

## tsconfig.json — alteracao necessaria

```json
{
  "compilerOptions": {
    "target": "es2020"
    // ... demais opcoes ficam no padrao
  }
}
```

## src/app.ts

```typescript
import fastify from 'fastify'

export const app = fastify()
```

## src/server.ts

```typescript
import { app } from './app'

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running!')
  })
```

## package.json — scripts

```json
{
  "scripts": {
    "start:dev": "tsx watch src/server.ts",
    "start": "node build/server.js",
    "build": "tsup src --out-dir build"
  }
}
```

## .gitignore

```
node_modules
build
```

## Testando cada script

```bash
# Desenvolvimento (hot-reload)
npm run start:dev
# Output: 🚀 HTTP server running!
# Qualquer mudanca em src/ reinicia automaticamente

# Build para producao
npm run build
# Gera pasta build/ com server.js e app.js em JavaScript

# Producao
npm run start
# Output: 🚀 HTTP server running!
# Executando com Node puro (sem TSX)
```

## Estrutura final do projeto

```
projeto/
├── src/
│   ├── app.ts
│   └── server.ts
├── build/          # Gerado apos npm run build
│   ├── app.js
│   └── server.js
├── node_modules/
├── .gitignore
├── package.json
└── tsconfig.json
```

## Variacao: usando async/await no server.ts

```typescript
import { app } from './app'

async function main() {
  await app.listen({
    host: '0.0.0.0',
    port: 3333,
  })

  console.log('🚀 HTTP server running!')
}

main()
```

Funciona identicamente ao `.then()` — questao de preferencia de estilo.