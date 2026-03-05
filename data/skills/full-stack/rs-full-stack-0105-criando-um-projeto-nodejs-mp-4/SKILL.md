---
name: rs-full-stack-criando-projeto-nodejs
description: "Generates Node.js project scaffolding when user asks to 'create a node project', 'initialize a project', 'start a new node app', 'npm init', or 'setup a backend project'. Applies correct npm init workflow, package.json configuration, and project folder structure. Make sure to use this skill whenever bootstrapping a new Node.js project from scratch. Not for frontend-only projects, Deno, Bun, or existing project configuration changes."
---

# Criando um Projeto Node.js

> Inicialize projetos Node.js com `npm init -y` e configure o package.json com metadados corretos desde o inicio.

## Prerequisites

- Node.js 18+ instalado (valide com `node -v`)
- npm disponivel no terminal (instalado junto com Node.js)
- Se nao encontrado: orientar instalacao via https://nodejs.org

## Steps

### Step 1: Criar estrutura de pastas

```bash
mkdir -p nome-do-projeto
cd nome-do-projeto
```

Organizar projetos dentro de uma pasta raiz dedicada a estudos/projetos Node.js.

### Step 2: Inicializar o projeto

```bash
npm init -y
```

Usar `-y` (yes) para aceitar todos os valores padrao automaticamente, porque responder cada pergunta manualmente (`npm init` sem flag) e desnecessario — tudo pode ser editado depois no package.json.

### Step 3: Configurar o package.json

Apos gerar, ajustar os campos relevantes:

```json
{
  "name": "api",
  "version": "1.0.0",
  "description": "Descricao do projeto",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Seu Nome",
  "license": "ISC"
}
```

Remover campos desnecessarios como `keywords` se vazio.

## Output format

```
nome-do-projeto/
└── package.json    # Unico arquivo gerado pelo npm init
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto de estudo/aprendizado | `npm init -y` e suficiente |
| Projeto open source | Preencher description, keywords, license, author |
| Projeto privado/interno | Adicionar `"private": true` no package.json |
| Nome da pasta tem espacos ou maiusculas | npm normaliza para lowercase no campo name |

## Campos do package.json

| Campo | Funcao | Valor padrao |
|-------|--------|-------------|
| `name` | Nome do pacote/projeto | Nome da pasta |
| `version` | Versionamento semantico | `1.0.0` |
| `description` | Descricao do projeto | Vazio |
| `main` | Arquivo de entrada principal | `index.js` |
| `scripts` | Comandos customizados executaveis com `npm run` | Script test placeholder |
| `author` | Nome do autor | Vazio |
| `license` | Tipo de licenca (ISC, MIT, etc.) | `ISC` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `npm init` respondendo manualmente cada pergunta | `npm init -y` e editar package.json depois |
| Criar package.json manualmente do zero | Usar `npm init -y` como base |
| Deixar `description` e `author` vazios em projetos reais | Preencher com informacoes do projeto |
| Inicializar na pasta errada | Confirmar com `pwd` antes de rodar `npm init` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre npm, package.json e licencas
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de configuracao e variantes