---
name: rs-full-stack-como-incluir-o-babel
description: "Configures Babel with Webpack for browser compatibility. Use when user asks to 'add Babel to Webpack', 'setup transpiling', 'configure browser compatibility', 'add babel-loader', or 'support older browsers with Webpack'. Make sure to use this skill whenever integrating Babel into a Webpack build pipeline. Not for standalone Babel CLI usage, Vite, or other bundlers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [babel, webpack, transpiling, browser-compatibility, babel-loader, build]
---

# Como Incluir o Babel no Webpack

> Configure o Babel como loader do Webpack para garantir compatibilidade com navegadores.

## Prerequisites

- Webpack ja configurado com `webpack.config.js`
- Node.js e npm instalados

## Steps

### Step 1: Instalar dependencias

```bash
npm install @babel/core @babel/preset-env babel-loader --save-dev
```

Tres pacotes necessarios:
- `@babel/core` — motor do Babel
- `@babel/preset-env` — preset que converte JS moderno para versoes compativeis
- `babel-loader` — ponte entre Webpack e Babel

### Step 2: Adicionar rule no webpack.config.js

Adicionar um novo objeto no array `rules`, depois das rules existentes (CSS, HTML):

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        ['@babel/preset-env', {
          targets: 'defaults'
        }]
      ]
    }
  }
}
```

### Step 3: Verificar

```bash
npm run build
```

Se a configuracao estiver correta, Webpack completa sem erros.

## Output format

A rule do Babel fica dentro de `module.rules` no `webpack.config.js`, junto com as rules de CSS e HTML.

## Error handling

- Se o build falhar, verificar se os tres pacotes foram instalados corretamente
- Se houver erro de preset, verificar a sintaxe do array aninhado em `presets`
- Consultar documentacao do Webpack em "Babel Loader" para exemplos atualizados

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto ja usa Webpack sem Babel | Adicionar a rule de JS conforme Step 2 |
| Precisa suportar navegadores especificos | Trocar `'defaults'` por query do browserslist |
| Arquivo `.babelrc` ja existe | Remover `options` da rule e deixar o `.babelrc` gerenciar |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Incluir `node_modules` no test do Babel | Usar `exclude: /node_modules/` porque transpilar node_modules e desnecessario e lento |
| Passar `use` como string simples quando precisa de options | Usar objeto com `loader` e `options` |
| Esquecer o array aninhado em presets | Usar `[['@babel/preset-env', { targets }]]` — array dentro de array |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Module not found: babel-loader` | Pacote nao instalado | `npm install babel-loader @babel/core @babel/preset-env -D` |
| Build falha com erro de preset | Sintaxe errada no array `presets` | Use array aninhado: `[['@babel/preset-env', { targets }]]` |
| Transpilacao muito lenta | `node_modules` nao excluido da rule | Adicione `exclude: /node_modules/` na rule de JS |
| Codigo nao transpilado para ES5 | Targets muito permissivos | Ajuste o valor de `targets` no preset-env |
| Conflito entre `.babelrc` e options na rule | Duas fontes de configuracao | Use apenas uma: ou `.babelrc` ou `options` na rule do Webpack |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre compatibilidade e papel do Babel no pipeline
- [code-examples.md](references/code-examples.md) — Configuracao completa do webpack.config.js com todas as rules