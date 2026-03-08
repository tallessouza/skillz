---
name: rs-full-stack-criando-o-projeto-4
description: "Generates Node.js API project scaffolding when user asks to 'create a new project', 'init a node project', 'start an API', 'setup express project', or 'scaffold a backend'. Applies conventions: descriptive package.json, clean defaults, proper folder naming with kebab-case. Make sure to use this skill whenever initializing a new Node.js/Express API project from scratch. Not for frontend projects, monorepo setup, or Docker/infrastructure configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: nodejs-setup
  tags: [nodejs, npm-init, project-setup, api, package-json]
---

# Criando Projeto Node.js API

> Ao iniciar um projeto Node.js, configure o package.json com metadados descritivos e remova campos desnecessarios antes de adicionar dependencias.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no terminal
- VSCode ou editor de preferencia

## Steps

### Step 1: Criar pasta do projeto

```bash
mkdir api-restaurant
cd api-restaurant
```

Usar kebab-case no nome da pasta, prefixando com o tipo (`api-`, `app-`, `web-`), porque facilita identificacao em listagens de diretorio.

### Step 2: Inicializar package.json

```bash
npm init -y
```

O flag `-y` aceita todos os defaults, porque vamos editar manualmente os campos relevantes.

### Step 3: Limpar e configurar package.json

```json
{
  "name": "api-restaurant",
  "version": "1.0.0",
  "description": "API para gerenciar pedidos das mesas de um restaurante",
  "main": "index.js",
  "scripts": {},
  "author": "Seu Nome",
  "license": "ISC"
}
```

Remover campos desnecessarios:
- `scripts.test` (placeholder inutil do npm init)
- `keywords` (irrelevante para projeto privado)

Adicionar descricao real, porque `description: ""` dificulta identificacao do projeto no futuro.

## Output format

```
api-restaurant/
└── package.json    # Limpo, com descricao e autor preenchidos
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto privado/interno | Remover `keywords`, manter `license: ISC` |
| Nome do projeto | kebab-case, prefixo indica tipo (`api-`, `app-`) |
| `description` | Descrever O QUE a API faz, nao como |
| `scripts.test` placeholder | Remover ate ter testes reais |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deixar `description: ""` | Escrever descricao do proposito do projeto |
| Manter `"test": "echo \"Error: no test specified\""` | Remover ate configurar test runner real |
| Nome com espacos ou camelCase na pasta | Usar kebab-case: `api-restaurant` |
| Iniciar instalando dependencias sem package.json limpo | Limpar package.json primeiro, instalar depois |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre convencoes de setup
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de configuracao

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm init -y` gera campos indesejados | Comportamento default do npm | Edite manualmente removendo `keywords`, `test` script placeholder |
| Nome da pasta tem espacos ou caracteres especiais | Nao seguiu convencao kebab-case | Renomeie a pasta para kebab-case: `api-restaurant` |
| `description` vazio no package.json | Deixou o default do `npm init` | Edite com descricao do proposito do projeto |
| `scripts.test` contem placeholder inutl | Default do `npm init -y` | Remova ate configurar um test runner real |
| `npm init` abre modo interativo | Faltou flag `-y` | Use `npm init -y` para aceitar defaults automaticamente |