# Code Examples: Configurando ESLint

## Instalacao completa

```bash
# Instalar ESLint + preset Skillz como dependencia de desenvolvimento
npm i -D eslint @skillz/eslint-config
```

## Arquivo .eslintrc.json

### Para projeto Node.js
```json
{
  "extends": [
    "@skillz/eslint-config/node"
  ]
}
```

### Para projeto React
```json
{
  "extends": [
    "@skillz/eslint-config/react"
  ]
}
```

## Scripts no package.json

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```

### Executando os scripts

```bash
# Apenas verificar erros (para CI/CD)
npm run lint

# Verificar e corrigir automaticamente
npm run lint:fix
```

### Exemplo de output do lint com erro

```
/src/server.ts
  1:35  error  Delete `;`  semi

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

## Configuracao do VSCode (settings.json)

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Exemplo de codigo antes e depois do ESLint fix

### Antes (com erros de lint)
```typescript
import fastify from "fastify";

const app = fastify();

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
```

### Depois (apos ESLint fix com preset Skillz)
```typescript
import fastify from 'fastify'

const app = fastify()

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
```

Mudancas aplicadas automaticamente:
- Aspas duplas → aspas simples
- Ponto e virgula removido
- Newline final adicionado

## Estrutura final do projeto apos configuracao

```
project-root/
├── .eslintrc.json          # Configuracao do ESLint
├── package.json            # Scripts lint e lint:fix
├── src/
│   └── server.ts           # Codigo fonte
├── node_modules/
│   ├── eslint/
│   └── @skillz/
│       └── eslint-config/
└── tsconfig.json
```