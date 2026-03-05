# Code Examples: Scripts Personalizados no package.json

## Exemplo basico da aula

### package.json com script dev

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "dev": "node --watch src/server.js"
  }
}
```

Execucao:
```bash
npm run dev
```

### package.json com start e dev

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  }
}
```

Execucao:
```bash
# Desenvolvimento
npm run dev

# Producao
npm start
```

## Variacoes comuns

### Projeto com TypeScript (tsx)

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "build": "tsc"
  }
}
```

### Projeto com Fastify

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "test": "vitest"
  }
}
```

### Projeto completo com lint e build

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "node --watch src/server.js",
    "build": "tsc",
    "lint": "eslint src/",
    "test": "vitest",
    "test:watch": "vitest --watch"
  }
}
```

## Comandos de execucao — referencia rapida

| Script | Comando | Precisa de `run`? |
|--------|---------|-------------------|
| `start` | `npm start` | Nao |
| `test` | `npm test` | Nao |
| `dev` | `npm run dev` | Sim |
| `build` | `npm run build` | Sim |
| `lint` | `npm run lint` | Sim |
| `test:watch` | `npm run test:watch` | Sim |

## Listando scripts disponiveis

```bash
# Mostra todos os scripts definidos no package.json
npm run
```