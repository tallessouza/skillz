---
name: rs-full-stack-criando-o-projeto
description: "Applies Node.js project scaffolding conventions when setting up a new backend project. Use when user asks to 'create a node project', 'initialize an API', 'setup a new backend', 'scaffold a server', or 'start a new express/node app'. Enforces src/ structure, ESModules config, node --watch dev script, and proper package.json fields. Make sure to use this skill whenever bootstrapping any Node.js API project from scratch. Not for frontend projects, monorepo setup, or Docker/deployment configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [nodejs, project-setup, esmodules, package-json, scaffolding, npm]
---

# Criando Projeto Node.js

> Ao criar um projeto Node.js, siga uma estrutura padronizada com ESModules, pasta src/, e dev script com watch mode.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no PATH
- Editor de codigo (VSCode recomendado)

## Steps

### Step 1: Criar pasta e inicializar

```bash
mkdir support-tickets
cd support-tickets
npm init -y
```

### Step 2: Configurar package.json

```json
{
  "name": "support-tickets",
  "version": "1.0.0",
  "description": "API de gerenciamento de tickets de suporte",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js"
  },
  "author": "Seu Nome",
  "license": "ISC"
}
```

Campos obrigatorios:
1. **`main`** — aponta para `src/server.js`, porque o entry point fica dentro de src/
2. **`type: "module"`** — habilita ESModules (import/export), porque e o padrao moderno do Node
3. **`scripts.dev`** — usa `node --watch` para reiniciar automaticamente ao salvar, porque evita reiniciar manualmente a cada mudanca

### Step 3: Criar estrutura de pastas

```bash
mkdir src
touch src/server.js
```

### Step 4: Remover campos desnecessarios do package.json

Remover `keywords` (array vazio nao agrega valor) e ajustar `description` com contexto real do projeto.

## Output format

```
project-name/
├── package.json      # Configurado com type: module, main: src/server.js
└── src/
    └── server.js     # Entry point da aplicacao
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto API Node.js | Sempre criar pasta `src/` separada |
| Import/export de modulos | Usar `"type": "module"` no package.json |
| Dev script | Usar `node --watch` (nativo Node 18+) em vez de nodemon |
| Entry point | Sempre `src/server.js`, nunca `index.js` na raiz |
| Description no package.json | Descrever o que a API faz, nunca deixar vazio |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `server.js` na raiz do projeto | `src/server.js` dentro de pasta src/ |
| `"main": "index.js"` | `"main": "src/server.js"` |
| Usar `require()` em projeto novo | Usar `import/export` com `"type": "module"` |
| Instalar nodemon para watch | Usar `node --watch` nativo do Node 18+ |
| Deixar `"test": "echo \"Error\"` | Remover ou configurar test real |
| `"keywords": []` vazio | Remover o campo |

## Verification

- `node src/server.js` executa sem erro
- `npm run dev` inicia com watch mode
- `cat package.json | grep type` retorna `"module"`

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `SyntaxError: Cannot use import statement` | Faltou `"type": "module"` no package.json | Adicionar `"type": "module"` ao package.json |
| `node --watch` nao reconhecido | Node.js versao menor que 18 | Atualizar Node.js para versao 18+ |
| `Error: Cannot find module 'src/server.js'` | Path incorreto no `main` ou no script | Verificar que `src/server.js` existe e o path esta correto |
| `npm run dev` nao reinicia ao salvar | Script usando `node` em vez de `node --watch` | Alterar script para `"dev": "node --watch src/server.js"` |
| `require is not defined` | Usando CommonJS em projeto ESModules | Substituir `require()` por `import` e `module.exports` por `export` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada decisao de configuracao
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de package.json e estrutura