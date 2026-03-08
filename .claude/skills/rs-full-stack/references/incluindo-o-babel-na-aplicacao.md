---
name: rs-full-stack-babel-webpack-setup
description: "Applies Babel configuration within Webpack projects for browser compatibility. Use when user asks to 'setup Babel', 'configure Webpack loaders', 'add browser compatibility', 'transpile JavaScript', or 'configure preset-env'. Follows correct loader hierarchy, preset naming, and exclusion patterns. Make sure to use this skill whenever setting up Babel in a Webpack project or debugging Babel loader errors. Not for Vite, esbuild, SWC, or non-Webpack bundlers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tooling-webpack
  tags: [babel, webpack, transpilation, preset-env, loaders]
---

# Configuracao do Babel no Webpack

> Configure o Babel como loader do Webpack seguindo a hierarquia correta: test → exclude → use → loader → options → presets.

## Prerequisites

- Webpack ja configurado no projeto
- Node.js 18+

## Steps

### Step 1: Instalar dependencias

```bash
npm install --save-dev babel-loader@9.1.3 @babel/core@7.23.7 @babel/preset-env@7.23.7
```

Tres pacotes obrigatorios:
- `babel-loader` — ponte entre Webpack e Babel
- `@babel/core` — motor de transpilacao
- `@babel/preset-env` — conjunto de plugins para compatibilidade com navegadores

### Step 2: Adicionar rule no webpack.config.js

```javascript
// webpack.config.js — dentro de module.rules[]
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"],
    },
  },
}
```

### Step 3: Verificar com build

```bash
npm run build
```

Build sem erros confirma que a configuracao esta correta.

## Hierarquia da rule

```
rule {
  test      → regex para arquivos .js
  exclude   → ignora node_modules (nunca transpile dependencias)
  use {
    loader  → babel-loader
    options {
      presets → [@babel/preset-env]
    }
  }
}
```

`options` fica DENTRO de `use`, nao no mesmo nivel. Errar essa hierarquia causa falha silenciosa.

## Error handling

- **"Cannot find package @babel/presets-env"** → nome errado. E `preset-env` (singular), nao `presets-env`
- **"Cannot find module babel-loader"** → pacote nao instalado. Verificar `package.json` devDependencies
- **Build lento** → confirmar que `exclude: /node_modules/` esta presente, porque sem isso o Babel transpila todas as dependencias

## Heuristics

| Situacao | Acao |
|----------|------|
| Erro "Cannot find package" | Verificar se o nome do pacote esta correto no config E se esta instalado |
| Porta ja em uso ao rodar dev server | Outro processo ja usa a porta — verificar terminais abertos |
| Precisa suportar browsers especificos | Adicionar `browserslist` no `package.json` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `presets: ["@babel/presets-env"]` (plural) | `presets: ["@babel/preset-env"]` (singular) |
| `options` no mesmo nivel de `use` | `options` DENTRO de `use` |
| Omitir `exclude: /node_modules/` | Sempre excluir `node_modules` da transpilacao |
| Instalar sem `--save-dev` | Babel e ferramenta de build, sempre devDependency |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| "Cannot find package @babel/presets-env" | Nome do preset com plural errado | Use `@babel/preset-env` (singular), nao `@babel/presets-env` |
| "Cannot find module babel-loader" | Pacote nao instalado como devDependency | Execute `npm install --save-dev babel-loader @babel/core @babel/preset-env` |
| Build extremamente lento | `exclude: /node_modules/` ausente na rule | Adicione `exclude: /node_modules/` para nao transpilar dependencias |
| Options nao sao aplicadas | `options` no mesmo nivel de `use` em vez de dentro | Mova `options` para dentro de `use: { loader, options }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre hierarquia de loaders e leitura de erros
- [code-examples.md](references/code-examples.md) — Configuracao completa do webpack.config.js com Babel