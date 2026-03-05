---
name: rs-full-stack-projeto-que-vamos-utilizar
description: "Guides Node.js TypeScript project setup for Docker containerization. Use when user asks to 'prepare a node project for docker', 'setup typescript build for production', 'configure dev and prod scripts', or 'containerize a node app'. Covers dev/build/start scripts, TypeScript compilation to dist, and production execution flow. Make sure to use this skill whenever setting up a Node.js TypeScript project that will run in Docker. Not for Dockerfile creation, docker-compose, or container orchestration."
---

# Preparar Projeto Node.js TypeScript para Docker

> Configure scripts de dev, build e start para que o projeto Node.js com TypeScript esteja pronto para rodar em container.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel
- Projeto TypeScript com `tsconfig.json` configurado

## Steps

### Step 1: Instalar dependencias

```bash
npm install
```

Gera a pasta `node_modules` — sem ela, imports TypeScript nao sao reconhecidos.

### Step 2: Configurar tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

O `outDir` define onde o JavaScript compilado sera gerado, porque em producao roda-se JS puro, nao TypeScript.

### Step 3: Configurar scripts no package.json

```json
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

| Script | Ambiente | O que faz |
|--------|----------|-----------|
| `dev` | Desenvolvimento | Executa TypeScript diretamente com hot-reload |
| `build` | CI/Deploy | Compila TypeScript → JavaScript na pasta `dist/` |
| `start` | Producao | Executa o JS compilado com `node` |

### Step 4: Verificar fluxo de producao

```bash
npm run build   # Gera dist/server.js
npm start       # Roda o JS puro
```

## Output format

Estrutura esperada apos build:

```
project/
├── src/
│   └── server.ts       # Codigo fonte TypeScript
├── dist/
│   └── server.js       # Codigo compilado JavaScript
├── package.json
├── tsconfig.json
└── node_modules/
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Mudou codigo fonte e producao nao reflete | Rodar `npm run build` novamente, porque `start` executa o JS da `dist/` |
| `npm start` vs `npm run start` | Ambos funcionam — `start` e um script padrao do npm |
| Import nao reconhecido no editor | Rodar `npm install` para gerar `node_modules` |
| Projeto vai rodar em Docker | Separar build e start — Docker executa `npm start` em producao |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Rodar `tsx` em producao | Compilar com `tsc` e rodar com `node` |
| Editar arquivos em `dist/` manualmente | Editar em `src/` e rodar `build` |
| Esperar que mudancas em `src/` reflitam em producao sem build | Sempre rodar `npm run build` antes de reiniciar |
| Pular `npm install` apos clone/download | Sempre instalar dependencias primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fluxo dev vs producao e por que separar build/start
- [code-examples.md](references/code-examples.md) — Exemplos de server.ts, package.json e tsconfig.json completos

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-projeto-que-vamos-utilizar/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-projeto-que-vamos-utilizar/references/code-examples.md)
