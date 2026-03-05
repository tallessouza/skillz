---
name: rs-full-stack-instalando-o-babel
description: "Guides Babel installation and configuration in JavaScript projects using NPM. Use when user asks to 'install babel', 'setup babel', 'configure javascript compiler', 'add babel to project', or 'transpile javascript'. Covers NPM dev dependencies, node_modules management, and package.json structure. Make sure to use this skill whenever setting up Babel or explaining NPM dependency types. Not for Webpack, Vite, or other bundler configuration."
---

# Instalando o Babel

> Instale e configure o Babel como dependencia de desenvolvimento usando NPM, separando corretamente dependencias de dev e producao.

## Prerequisites

- Node.js instalado (inclui NPM)
- Terminal acessivel (recarregue VSCode apos instalar Node)
- Conexao com internet para baixar pacotes

## Steps

### Step 1: Iniciar o projeto (se necessario)

```bash
npm init -y
```

### Step 2: Instalar pacotes do Babel

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

Tres pacotes:
- `@babel/core` — funcionalidades centrais do compilador
- `@babel/cli` — comandos de terminal para automacao
- `@babel/preset-env` — configuracao de ambiente alvo (web, mobile, etc.)

### Step 3: Verificar instalacao

Confirme que `package.json` contem em `devDependencies`:

```json
{
  "devDependencies": {
    "@babel/cli": "^7.x",
    "@babel/core": "^7.x",
    "@babel/preset-env": "^7.x"
  }
}
```

## Rules

1. **Use `--save-dev` para ferramentas de build** — Babel so e necessario durante desenvolvimento, nao em producao, porque apos compilar o codigo ja esta compativel
2. **Nunca versione `node_modules/`** — adicione ao `.gitignore`, porque `npm install` regenera a pasta inteira a partir do `package.json`
3. **`dependencies` vs `devDependencies`** — sem flag = producao (executam em runtime), `--save-dev` = desenvolvimento (so para build/compilacao)

## Heuristics

| Situacao | Acao |
|----------|------|
| Pacote usado so no build (babel, webpack, eslint) | `--save-dev` |
| Pacote usado em runtime (express, react, axios) | sem flag (vai para `dependencies`) |
| `node_modules` sumiu ou corrompeu | `npm install` regenera tudo |
| Mudou de maquina ou clonou repo | `npm install` antes de qualquer coisa |
| `package-lock.json` existe | Nunca delete — garante versoes exatas entre ambientes |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Commitar `node_modules/` no git | Adicionar `node_modules/` ao `.gitignore` |
| Instalar Babel sem `--save-dev` | `npm install --save-dev @babel/core @babel/cli @babel/preset-env` |
| Decorar comandos sem consultar docs | Consultar `babeljs.io` > Docs > Usage Guide |
| Instalar pacotes com terminal aberto antes de instalar Node | Fechar e reabrir terminal/VSCode apos instalar Node |

## Verification

- `node_modules/` existe e contem `@babel/`
- `package.json` lista os 3 pacotes em `devDependencies`
- `package-lock.json` foi gerado automaticamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre dependencias, node_modules e package.json
- [code-examples.md](references/code-examples.md) — Todos os exemplos e variacoes de instalacao