---
name: rs-full-stack-0103-criando-o-projeto
description: "Generates Node.js Express API project scaffolding with TypeScript when user asks to 'create a project', 'init express app', 'setup API project', 'start new backend', or 'scaffold Node.js API'. Applies correct npm init, dependency installation with pinned versions, and proper dev vs prod dependency separation. Make sure to use this skill whenever initializing a new Express + TypeScript API from scratch. Not for frontend projects, React apps, or non-Express backends like Fastify or NestJS."
---

# Criando Projeto Express + TypeScript

> Inicialize projetos Express com dependencias versionadas e separacao correta entre dependencias de producao e desenvolvimento.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no terminal
- VS Code (recomendado)

## Steps

### Step 1: Criar pasta e inicializar package.json

```bash
mkdir project_name_api
cd project_name_api
npm init -y
```

### Step 2: Configurar package.json

```json
{
  "name": "project_name_api",
  "version": "1.0.0",
  "description": "API de solicitação de reembolso",
  "main": "index.js",
  "author": "Seu Nome"
}
```

Remover campos desnecessarios como `keywords` vazio. Preencher `author` e `description` com valores reais.

### Step 3: Instalar Express (dependencia de producao)

```bash
npm i express@4.19.2
```

### Step 4: Instalar tipagem do Express (dependencia de desenvolvimento)

```bash
npm i @types/express@5.0.0 -D
```

Se instalar tipagem sem `-D` por engano, reinstale com `-D` — o npm move automaticamente para `devDependencies`.

### Step 5: Instalar ferramentas TypeScript (dependencias de desenvolvimento)

```bash
npm i typescript@5.7.3 tsx@4.19.2 ts-node@10.9.2 -D
```

## Output format

```
project_name_api/
├── node_modules/
├── package.json        # com dependencies e devDependencies separadas
└── package-lock.json
```

### package.json resultante

```json
{
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "ts-node": "^10.9.2",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tipagem (@types/*) | Sempre instalar com `-D` (devDependency) |
| Express, Prisma, Knex | Instalar como dependencia de producao (sem `-D`) |
| TypeScript, tsx, ts-node | Sempre instalar com `-D` |
| Versoes das dependencias | Fixar versoes identicas ao curso para evitar incompatibilidades |
| Instalou no lugar errado | Reinstale com a flag correta — npm move automaticamente |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `npm i @types/express` (sem -D) | `npm i @types/express -D` |
| `npm i typescript` (sem -D) | `npm i typescript -D` |
| Deixar `author` e `description` vazios | Preencher com valores descritivos reais |
| Instalar versoes diferentes do curso | Fixar as mesmas versoes para compatibilidade |

## Error handling

- Se instalou tipagem como dependencia de producao: reinstale com `npm i @types/express -D`, o npm corrige automaticamente
- Se `node_modules` nao aparece: verifique se executou `npm install` dentro da pasta correta

## Verification

- `node_modules/` existe no diretorio
- `package.json` tem `dependencies` com express e `devDependencies` com typescript, tsx, ts-node e @types/express
- Nenhuma tipagem (@types/*) em `dependencies`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de dependencias e versionamento
- [code-examples.md](references/code-examples.md) — Todos os comandos e configuracoes expandidos com variacoes