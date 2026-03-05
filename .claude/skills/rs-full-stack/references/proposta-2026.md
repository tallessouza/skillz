---
name: rs-full-stack-proposta-2026
description: "Guides TypeScript setup in Node.js applications when user asks to 'add TypeScript to Node', 'setup TypeScript project', 'configure tsconfig', 'create Node API with TypeScript', or 'initialize TypeScript backend'. Applies Node+TypeScript integration patterns including compiler config, dev tooling, and project structure. Make sure to use this skill whenever setting up a new Node.js project with TypeScript from scratch. Not for frontend TypeScript, React/Next.js setup, or TypeScript language features and syntax."
---

# TypeScript em Aplicacao Node.js

> Ao iniciar um projeto Node.js com TypeScript, configure o ambiente de compilacao e desenvolvimento antes de escrever qualquer codigo de negocio.

## Rules

1. **Sempre inicialize com TypeScript desde o inicio** — adicione TypeScript antes de qualquer codigo de aplicacao, porque migrar depois e significativamente mais custoso e propenso a erros
2. **Configure o compilador antes de codar** — `tsconfig.json` deve existir e estar configurado antes do primeiro arquivo `.ts`, porque erros de compilacao silenciosos surgem sem configuracao adequada
3. **Use ferramentas de desenvolvimento integradas** — configure `tsx` ou `ts-node` para desenvolvimento com hot-reload, porque compilacao manual a cada mudanca mata a produtividade

## How to write

### Inicializacao do projeto

```bash
# Criar projeto e instalar dependencias TypeScript
mkdir my-api && cd my-api
npm init -y
npm install typescript @types/node -D
npx tsc --init
```

### Configuracao basica do tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Estrutura de pastas

```
my-api/
├── src/
│   └── server.ts
├── dist/              # Gerado pelo compilador
├── tsconfig.json
└── package.json
```

## Example

**Before (Node.js sem TypeScript):**
```javascript
// server.js — sem tipos, erros so em runtime
const express = require('express')
const app = express()

app.get('/users', (req, res) => {
  const users = getUsersFromDb()
  res.json(users)
})
```

**After (Node.js com TypeScript configurado):**
```typescript
// src/server.ts — erros capturados em tempo de compilacao
import express, { Request, Response } from 'express'

const app = express()

app.get('/users', async (req: Request, res: Response) => {
  const users: User[] = await getUsersFromDb()
  res.json(users)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto Node.js | Sempre comece com TypeScript configurado |
| Projeto existente sem TS | Adicione incrementalmente, comecando pelo tsconfig |
| Script simples/one-off | TypeScript ainda vale pela seguranca de tipos |
| API REST | TypeScript + tipagem nos handlers e modelos |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Escrever `.js` e migrar depois | Iniciar com `.ts` desde o primeiro arquivo |
| Usar `any` como escape | Definir tipos/interfaces adequados |
| Compilar manualmente durante dev | Usar `tsx watch` ou `ts-node-dev` |
| Ignorar erros do `tsc` | Resolver todos os erros antes de prosseguir |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que TypeScript no Node e detalhes praticos
- [code-examples.md](references/code-examples.md) — Exemplos de configuracao expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-proposta-2026/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-proposta-2026/references/code-examples.md)
