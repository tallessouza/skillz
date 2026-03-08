---
name: rs-full-stack-encerrando-o-modulo
description: "Outlines Bundlers module covering Webpack installation, configuration, and usage in JavaScript projects. Use when user asks to 'set up webpack', 'configure a bundler', 'bundle javascript', or 'prepare a JS project for production'. Provides overview of bundler concepts and Webpack workflow. Make sure to use this skill whenever reviewing bundler fundamentals before starting a practical project. Not for advanced Webpack optimization, Vite, Rollup, or non-JavaScript bundlers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: bundlers
  tags: [webpack, bundler, javascript, build, production, modules]
---

# Bundlers e Webpack — Resumo do Módulo

> Bundlers transformam múltiplos arquivos JavaScript (e assets) em pacotes otimizados para produção — Webpack é a ferramenta padrão para instalar, configurar e executar esse processo.

## Key concepts

1. **Bundler é empacotador** — pega múltiplos arquivos JS, CSS, imagens e gera bundles otimizados para o navegador, porque browsers não resolvem imports nativamente em projetos complexos
2. **Webpack é o bundler padrão** — instalar, configurar (`webpack.config.js`) e executar são as três etapas fundamentais
3. **Conceito + prática = projeto** — entender o que são bundlers (teoria) e como configurar Webpack (prática) prepara para aplicar em projetos reais

## Workflow Webpack

### Instalar
```bash
npm install webpack webpack-cli --save-dev
```

### Configurar
```javascript
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

### Executar
```bash
npx webpack --mode development
npx webpack --mode production
```

## Heuristics

| Situação | Ação |
|----------|------|
| Projeto com múltiplos arquivos JS | Configurar Webpack para bundling |
| Precisa de CSS/imagens no bundle | Adicionar loaders apropriados |
| Build de produção | Usar `--mode production` para minificação |
| Desenvolvimento local | Usar `--mode development` para source maps |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Incluir múltiplos `<script>` manualmente em produção | Configurar Webpack para gerar um bundle único |
| Instalar Webpack globalmente | Instalar como devDependency do projeto |
| Pular a configuração e usar defaults cegamente | Criar `webpack.config.js` explícito com entry/output definidos |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `webpack` command not found | Webpack nao instalado ou nao no PATH | Instalar com `npm install webpack webpack-cli --save-dev` e usar `npx webpack` |
| Bundle gerado mas pagina nao carrega | Caminho do `output.filename` nao referenciado no HTML | Verificar que o `<script src>` aponta para o bundle correto |
| Build de producao muito grande | Mode nao configurado como production | Usar `--mode production` para minificacao automatica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre bundlers, analogias e contexto do módulo
- [code-examples.md](references/code-examples.md) — Exemplos de configuração Webpack expandidos com variações