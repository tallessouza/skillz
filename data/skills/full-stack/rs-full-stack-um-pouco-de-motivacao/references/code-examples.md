# Code Examples: Entenda Antes de Automatizar

## O Que o Framework Traz Pronto vs Configuracao Manual

### Criando projeto com Vite (o que o framework faz por voce)

```bash
# Uma linha — tudo configurado
npm create vite@latest meu-projeto -- --template react-ts
cd meu-projeto
npm install
npm run dev
```

Resultado: projeto funcionando com compilador, bundler, dev server, HMR, TypeScript — tudo pronto.

### Os arquivos que "magicamente" aparecem

```
meu-projeto/
├── vite.config.ts        # Configuracao do bundler (Vite/Rollup)
├── tsconfig.json         # Configuracao do compilador TypeScript
├── tsconfig.node.json    # Config TS para arquivos de config
├── package.json          # Dependencias e scripts
├── index.html            # Entry point do Vite
└── src/
    ├── main.tsx          # Entry point da aplicacao
    └── App.tsx           # Componente raiz
```

Cada um desses arquivos existe por uma razao. O modulo vai ensinar o que cada um faz.

### Exemplo: vite.config.ts gerado automaticamente

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

Parece simples, mas por baixo:
- `@vitejs/plugin-react` configura Babel ou SWC para transformar JSX
- `defineConfig` tipifica as opcoes do Vite
- O Vite internamente usa esbuild para dev e Rollup para build

### Equivalente manual (o que voce vai aprender a fazer)

```bash
# Instalar compilador manualmente
npm install --save-dev @babel/core @babel/preset-env @babel/cli

# Instalar bundler manualmente
npm install --save-dev webpack webpack-cli webpack-dev-server

# Configurar cada um separadamente
touch babel.config.json
touch webpack.config.js
```

```json
// babel.config.json — configuracao manual do compilador
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead"
    }]
  ]
}
```

```javascript
// webpack.config.js — configuracao manual do bundler
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};
```

### A Diferenca Visual

**Com framework (1 comando):**
```bash
npm create vite@latest → projeto funcionando
```

**Sem framework (entendendo cada peca):**
```bash
mkdir meu-projeto && cd meu-projeto
npm init -y
npm install --save-dev @babel/core @babel/preset-env  # compilador
npm install --save-dev webpack webpack-cli              # bundler
# + criar babel.config.json
# + criar webpack.config.js
# + configurar scripts no package.json
# + configurar loaders
# + configurar dev server
```

O resultado final e equivalente. A diferenca e que na segunda abordagem voce sabe exatamente o que cada peca faz — e isso e o objetivo do modulo.