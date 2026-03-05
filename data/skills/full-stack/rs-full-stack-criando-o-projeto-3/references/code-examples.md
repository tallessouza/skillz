# Code Examples: Criando Projeto Node.js

## Package.json gerado pelo npm init -y (antes)

```json
{
  "name": "api-rest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Package.json após configuração (depois)

```json
{
  "name": "api-rest",
  "version": "1.0.0",
  "description": "Criando API REST com Node.js",
  "main": "src/server.js",
  "scripts": {},
  "keywords": [],
  "author": "Rodrigo Gonçalves",
  "license": "ISC"
}
```

### O que mudou e por quê

| Campo | Antes | Depois | Razão |
|-------|-------|--------|-------|
| `description` | `""` | `"Criando API REST com Node.js"` | Descrever propósito do projeto |
| `main` | `"index.js"` | `"src/server.js"` | Refletir entry point real |
| `scripts.test` | `"echo \"Error...\" && exit 1"` | removido | Script placeholder sem utilidade |
| `author` | `""` | `"Rodrigo Gonçalves"` | Identificar autor |

## Validação do ambiente

```javascript
// src/server.js
console.log("hello world")
```

Execução:

```bash
node src/server.js
# Output: hello world
```

## Variações de setup por tipo de projeto

### API REST simples (esta aula)

```
api-rest/
├── package.json
└── src/
    └── server.js
```

### API REST com TypeScript

```bash
mkdir api-rest && cd api-rest
npm init -y
mkdir src
touch src/server.ts
npm install typescript @types/node -D
npx tsc --init
```

```json
{
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/server.ts"
  }
}
```

### API REST com estrutura expandida (futuro)

```
api-rest/
├── package.json
└── src/
    ├── server.js
    ├── routes/
    ├── controllers/
    ├── middlewares/
    └── utils/
```

## Comandos utilizados na aula

```bash
# Criar pasta do projeto
mkdir api-rest

# Inicializar com defaults
npm init -y

# Criar estrutura
mkdir src
touch src/server.js

# Testar ambiente
node src/server.js
```