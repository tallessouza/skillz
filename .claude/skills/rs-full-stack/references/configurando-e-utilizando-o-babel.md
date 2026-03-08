---
name: rs-full-stack-configurando-utilizando-babel
description: "Applies Babel configuration and execution workflow when setting up JavaScript transpilation. Use when user asks to 'configure Babel', 'setup transpiler', 'compile JavaScript', 'support older browsers', or 'add Babel to project'. Generates babel.config.js with presets and runs compilation via CLI. Make sure to use this skill whenever creating a new JS project that needs browser compatibility. Not for TypeScript compilation, Webpack config, or ESLint setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [babel, transpiler, javascript, build, es2015]
---

# Configurando e Utilizando o Babel

> Configure o Babel com presets e execute a compilacao para gerar codigo compativel com navegadores antigos.

## Prerequisites

- Node.js instalado
- `@babel/core`, `@babel/cli`, `@babel/preset-env` instalados como devDependencies
- Se nao instalados: `npm install --save-dev @babel/core @babel/cli @babel/preset-env`

## Steps

### Step 1: Criar arquivo de configuracao

Criar `babel.config.js` na raiz do projeto (nome exato obrigatorio — o Babel detecta automaticamente):

```javascript
const presets = [
  "@babel/preset-env"
];

module.exports = { presets };
```

`@babel/preset-env` transforma ECMAScript 2015+ em versao amplamente suportada pelos navegadores.

### Step 2: Executar o Babel via CLI

```bash
./node_modules/.bin/babel main.js --out-dir dist
```

- `main.js` — arquivo de entrada a compilar
- `--out-dir dist` — diretorio de saida (criado automaticamente se nao existir)
- Execucoes subsequentes sobrescrevem o conteudo da pasta de saida

### Step 3: Verificar resultado

Abrir `dist/main.js` e confirmar que o codigo foi transformado (classes viram funcoes, arrow functions viram function expressions, etc.).

## Output format

```
projeto/
├── babel.config.js          # Configuracao
├── main.js                  # Codigo fonte (ES2015+)
└── dist/
    └── main.js              # Codigo compilado (compativel)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Multiplos presets necessarios | Adicione ao array `presets` em `babel.config.js` |
| Projeto usa npm scripts | Adicione `"build": "babel src --out-dir dist"` ao package.json |
| Nao quer usar `./node_modules/.bin/` | Use `npx babel` como atalho |
| Pasta dist ja existe | O Babel sobrescreve automaticamente |

## Error handling

- Se o Babel nao encontra configuracao: verificar que o arquivo se chama exatamente `babel.config.js` na raiz
- Se o comando nao e encontrado: verificar que `@babel/cli` esta instalado
- Se o codigo nao e transformado: verificar que `@babel/preset-env` esta no array de presets

## Verification

- Arquivo `dist/main.js` existe apos execucao
- Codigo em `dist/main.js` nao contem sintaxe ES2015+ (classes, const/let, arrow functions foram convertidos)
- Terminal exibe mensagem de compilacao com sucesso


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Babel nao encontra configuracao | Arquivo nao se chama `babel.config.js` | Renomeie para exatamente `babel.config.js` na raiz do projeto |
| Comando babel nao encontrado | @babel/cli nao instalado | Execute `npm install --save-dev @babel/cli` |
| Codigo nao foi transformado | @babel/preset-env ausente nos presets | Adicione `@babel/preset-env` ao array de presets no babel.config.js |
| Erro de sintaxe na saida | Preset incompativel com o codigo fonte | Verifique a versao do preset e configure os targets adequadamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre presets, module.exports e o papel do compilador
- [code-examples.md](references/code-examples.md) — Exemplos de entrada/saida com classe User e variacoes