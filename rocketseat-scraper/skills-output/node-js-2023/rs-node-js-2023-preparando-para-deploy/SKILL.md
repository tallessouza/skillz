---
name: rs-node-js-2023-preparando-para-deploy
description: "Applies Node.js TypeScript deploy preparation workflow when user asks to 'prepare for deploy', 'build TypeScript project', 'configure tsup', 'setup production build', or 'prepare app for production'. Guides through tsup setup, build scripts, .eslintignore/.gitignore configuration, and GitHub upload. Make sure to use this skill whenever preparing a Node.js TypeScript API for deployment. Not for actual deployment to hosting services, Docker setup, or CI/CD pipeline configuration."
---

# Preparando para Deploy — Node.js TypeScript

> Antes de fazer deploy de uma aplicacao Node.js em TypeScript, converta para JavaScript com tsup, configure ignores e suba para o GitHub.

## Prerequisites

- Projeto Node.js com TypeScript configurado
- Codigo fonte na pasta `src/`
- Git instalado
- GitHub CLI (`gh`) instalado e autenticado (`gh auth login`)

## Steps

### Step 1: Instalar tsup como ferramenta de build

```bash
npm install tsup -D
```

Tsup usa ESBuild internamente — mesmo engine do TSX e Vitest. Muito mais rapido que `tsc` para builds, porque nao faz type-checking (so transpila).

### Step 2: Criar script de build no package.json

```json
{
  "scripts": {
    "build": "tsup src --out-dir build"
  }
}
```

| Flag | Funcao |
|------|--------|
| `src` | Diretorio de entrada |
| `--out-dir build` | Diretorio de saida (default seria `dist`) |

### Step 3: Executar e verificar a build

```bash
npm run build
node build/server.js
```

Verificar que o servidor roda com Node puro, sem TypeScript.

### Step 4: Configurar .eslintignore

```
node_modules
build
```

Porque o ESLint nao deve analisar codigo gerado pela build.

### Step 5: Atualizar .gitignore categorizado

```gitignore
# Dependencies
node_modules

# Database
db/*.db

# Environment
.env

# Build
build
```

Usar wildcard `db/*.db` para ignorar qualquer banco SQLite, independente do nome.

### Step 6: Subir para o GitHub

```bash
git init
git add .
git commit -m "initial commit"
gh repo create --source=. --private --push
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto TypeScript precisa ir pra producao | Usar tsup, nunca tsc direto |
| Arquivos .js apareceram fora de build/ | Provavelmente gerados por tsc acidental — apagar |
| ESLint dando erro em arquivos de build | Adicionar pasta build ao .eslintignore |
| Arquivo .db no repositorio | Adicionar `db/*.db` ao .gitignore |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Usar `tsc` para build de producao | Usar `tsup` (ESBuild, muito mais rapido) |
| Configurar `rootDir`/`outDir` no tsconfig para build | Usar tsup com `--out-dir` |
| Deixar pasta build no git | Adicionar `build` ao .gitignore |
| Deixar ESLint rodar em build/ | Criar .eslintignore com `build` |
| Subir arquivos .db no repositorio | Usar wildcard `db/*.db` no .gitignore |

## Verification

- `npm run build` executa sem erros
- `node build/server.js` inicia o servidor corretamente
- `git status` nao mostra arquivos de build, .db ou node_modules
- ESLint nao reporta erros em arquivos da pasta build

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
