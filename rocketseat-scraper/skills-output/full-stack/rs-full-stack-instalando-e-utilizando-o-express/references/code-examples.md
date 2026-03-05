# Code Examples: Instalando e Utilizando o Express

## Instalacao completa passo a passo

### 1. Instalar Express (producao)
```bash
npm i express@4.19.2
```

Resultado no `package.json`:
```json
{
  "dependencies": {
    "express": "4.19.2"
  }
}
```

### 2. Instalar tipagens (desenvolvimento)
```bash
npm i -D @types/express
```

Resultado no `package.json`:
```json
{
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.x.x",
    "tsx": "^4.x.x",
    "typescript": "^5.x.x"
  }
}
```

### 3. Importacao basica no server.ts
```typescript
import express from 'express'

// O Express ja esta disponivel para uso
// A aplicacao sera construida a partir daqui
```

### 4. Execucao
```bash
npm run dev
```

## Variacoes de instalacao

### Com yarn
```bash
yarn add express@4.19.2
yarn add -D @types/express
```

### Com pnpm
```bash
pnpm add express@4.19.2
pnpm add -D @types/express
```

## Padrao recorrente: biblioteca + @types

Este padrao se repete para varias bibliotecas populares:

```bash
# Express
npm i express
npm i -D @types/express

# Node.js (ja feito anteriormente no curso)
npm i -D @types/node

# Outros exemplos comuns
npm i cors
npm i -D @types/cors

npm i jsonwebtoken
npm i -D @types/jsonwebtoken
```

## Diagnostico de erros

### Erro: "Could not find a declaration file for module 'express'"
```
Could not find a declaration file for module 'express'.
'/path/node_modules/express/index.js' implicitly has an 'any' type.
Try `npm i --save-dev @types/express` if it exists or add a new declaration (.d.ts) file containing `declare module 'express';`
```

**Solucao:** Instalar `@types/express` conforme indicado na mensagem.

### Verificacao pos-instalacao
```bash
# Confirmar que Express esta em dependencies
cat package.json | grep -A2 '"dependencies"'

# Confirmar que @types/express esta em devDependencies
cat package.json | grep -A5 '"devDependencies"'

# Executar para verificar que tudo funciona
npm run dev
```