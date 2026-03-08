---
name: rs-full-stack-criando-o-projeto-7
description: "Applies Node.js project initialization best practices when setting up new projects with npm. Use when user asks to 'create a node project', 'initialize npm', 'setup package.json', 'start a new project', or 'npm init'. Enforces clean package.json structure by removing unnecessary fields and preparing for dependency management. Make sure to use this skill whenever bootstrapping a Node.js project from scratch. Not for frontend-only projects, monorepo setup, or framework-specific scaffolding like create-next-app."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: node-fundamentals
  tags: [nodejs, npm-init, package-json, project-setup]
---

# Criando um Projeto Node.js

> Ao iniciar um projeto Node.js, crie o package.json com `npm init -y` e limpe campos desnecessarios antes de instalar dependencias.

## Rules

1. **Sempre use `npm init -y`** — gera o package.json com valores padrao sem perguntas interativas, porque acelera o bootstrap e os valores podem ser ajustados depois
2. **Remova campos desnecessarios do package.json** — retire `keywords`, `author`, `description` vazios e virgulas pendentes, porque campos vazios sao ruido e podem causar warnings em ferramentas de lint
3. **Mantenha scripts mesmo que vazio** — o campo `"scripts"` deve existir desde o inicio, porque sera populado conforme o projeto cresce
4. **Navegue ate a pasta antes de inicializar** — use `cd` para entrar na pasta do projeto antes de rodar `npm init`, porque o package.json deve ser criado na raiz do projeto

## Steps

### Step 1: Criar a pasta do projeto
```bash
mkdir project
cd project
```

### Step 2: Inicializar o package.json
```bash
npm init -y
```

### Step 3: Limpar o package.json

Remover campos desnecessarios, mantendo apenas o essencial:

```json
{
  "name": "project",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {}
}
```

### Step 4: Abrir no editor e instalar dependencias
```bash
code .
```

## Example

**Before (package.json gerado pelo npm init -y):**
```json
{
  "name": "project",
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

**After (limpo e pronto para dependencias):**
```json
{
  "name": "project",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {},
  "license": "MIT"
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo do zero | `mkdir nome && cd nome && npm init -y` |
| Pasta ja existe | `cd pasta && npm init -y` |
| Precisa de valores especificos (author, license) | Edite o package.json depois do init |
| Script de test padrao inutil | Remova ou substitua pelo test runner real |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Rodar `npm init -y` fora da pasta do projeto | `cd project && npm init -y` |
| Deixar `"description": ""` e `"keywords": []` vazios | Remova campos sem conteudo |
| Deixar virgula pendente no JSON | Valide o JSON apos editar |
| Criar package.json manualmente do zero | Use `npm init -y` e ajuste |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm init -y` cria package.json na pasta errada | Terminal nao esta na pasta do projeto | `cd nome-do-projeto` antes de rodar `npm init -y` |
| JSON invalido apos editar package.json | Virgula pendente ou campo mal formatado | Valide com `node -e "require('./package.json')"` |
| Warning sobre campos vazios no npm | `keywords`, `description` ou `author` vazios | Remova os campos vazios do package.json |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre inicializacao de projetos e gerenciamento de dependencias
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes