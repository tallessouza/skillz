---
name: rs-angular-clone-projeto-instalacao
description: "Guides Angular project setup when cloning a monorepo with separate front-end and back-end folders. Use when user asks to 'clone a project', 'setup Angular project', 'install dependencies', 'run front and back-end', or 'configure local development environment'. Covers git clone, branch checkout, separate npm installs, and running both servers. Make sure to use this skill whenever setting up an Angular+Node monorepo with separate package.json files. Not for creating new projects from scratch, deploying to production, or CI/CD configuration."
---

# Clone do Projeto e Instalacao das Dependencias

> Configurar um monorepo Angular+Node com front e back-end separados, cada um com seu proprio package.json e processo de execucao.

## Prerequisites

- Git instalado
- Node.js instalado
- Angular CLI instalado (`npm install -g @angular/cli`)
- VS Code (recomendado)

## Steps

### Step 1: Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd <nome-do-projeto>
```

### Step 2: Mudar para a branch correta

Antes de qualquer `npm install`, verificar e mudar para a branch inicial do projeto.

```bash
git checkout <nome-da-branch>
```

### Step 3: Instalar dependencias do front-end

Na raiz do projeto (onde esta o `package.json` do Angular):

```bash
npm install
```

### Step 4: Instalar dependencias do back-end

```bash
cd server
npm install
cd ..
```

### Step 5: Rodar o front-end

```bash
ng serve
# Disponivel em http://localhost:4200
```

### Step 6: Compilar e rodar o back-end

```bash
cd server
npm run build
npm run start
# Disponivel em http://localhost:3000
```

Ordem obrigatoria: `build` antes de `start`. O `build` transpila TypeScript para JavaScript na pasta `dist/`, o `start` serve o codigo compilado.

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa de hot-reload no back-end | Use `npm run dev` em vez de build+start |
| `npm run dev` causa erros em requisicoes seguidas | O servidor reinicia a cada mudanca em arquivos JSON — use build+start para estabilidade |
| Front e back-end separados no mesmo repo | Cada um tem seu proprio `package.json` — instale dependencias separadamente |
| Quer rodar front e back simultaneamente | Abra dois terminais no VS Code, renomeie cada um (front-end, back-end) |

## Verification

- `http://localhost:4200` exibe a aplicacao Angular
- `http://localhost:3000` retorna mensagem confirmando que a API esta funcionando
- Ambos os terminais sem erros

## Error handling

- Se `ng serve` falha: verificar se Angular CLI esta instalado globalmente
- Se `npm run start` falha: verificar se `npm run build` foi executado antes (pasta `dist/` deve existir)
- Se branch errada: `git checkout <branch-correta>` e reinstalar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
