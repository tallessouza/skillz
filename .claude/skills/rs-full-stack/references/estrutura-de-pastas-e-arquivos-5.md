---
name: rs-full-stack-estrutura-de-pastas-e-arquivos-5
description: "Applies React + Vite project structure conventions when scaffolding or cleaning up a new React project. Use when user asks to 'create a React project', 'clean up Vite boilerplate', 'setup React with Vite', 'organize project folders', or 'start React from scratch'. Guides folder structure (public/, src/, assets/), boilerplate removal, and node_modules setup. Make sure to use this skill whenever initializing or restructuring a React + Vite project. Not for Next.js projects, backend-only Node.js, or non-Vite bundlers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-fundamentals
  tags: [react, vite, project-setup, typescript, boilerplate]
---

# Estrutura de Pastas e Arquivos — React + Vite

> Ao iniciar um projeto React com Vite, limpe todo o boilerplate antes de escrever código, mantendo apenas a estrutura essencial.

## Estrutura padrão do projeto

```
projeto/
├── public/              # Arquivos públicos (favicon, imagens estáticas)
│   └── vite.svg
├── src/                 # Código-fonte da aplicação
│   ├── main.tsx         # Arquivo de ENTRADA (carrega o App)
│   └── App.tsx          # Primeiro componente renderizado
├── index.html           # HTML raiz
├── package.json         # Dependências e scripts
├── package-lock.json    # Lock de versões
├── tsconfig.json        # Config TypeScript geral
├── tsconfig.app.json    # Config TypeScript do app
├── tsconfig.node.json   # Config TypeScript do Node
├── vite.config.ts       # Configuração do Vite
└── .gitignore           # Arquivos ignorados pelo Git
```

## Rules

1. **`public/` é para arquivos estáticos públicos** — imagens, favicons, assets que não passam pelo bundler, porque são servidos diretamente pelo servidor
2. **`src/` é para código-fonte** — componentes, estilos, hooks, tudo que o Vite processa, porque o bundler só resolve imports dentro de `src/`
3. **`main.tsx` é o ponto de entrada** — ele monta o React no DOM, nunca coloque lógica de negócio aqui, porque é o bootstrap da aplicação
4. **`App.tsx` é o primeiro componente** — todo conteúdo renderizado começa aqui, porque é o root component da árvore React
5. **`node_modules/` não vem com o projeto** — execute `npm i` após clonar ou criar, porque o Vite cria o projeto sem instalar dependências para ser mais rápido
6. **Limpe o boilerplate antes de codar** — remova arquivos de exemplo para começar do zero, porque código morto gera confusão e imports quebrados

## Steps

### Step 1: Abrir o projeto no VS Code

Arraste a pasta do projeto para o VS Code ou use `code .` no terminal.

### Step 2: Limpar arquivos de exemplo

Remover estes arquivos/pastas gerados pelo template:

```bash
# Pasta de assets de exemplo
rm -rf src/assets/

# Estilos de exemplo
rm src/App.css
rm src/index.css

# Arquivo de documentação padrão
rm README.md

# Config do ESLint (se não for usar)
rm eslint.config.js
```

### Step 3: Limpar o App.tsx

```tsx
// App.tsx — deixar vazio para começar do zero
function App() {
  return <></>
}

export default App
```

### Step 4: Limpar o main.tsx

Remover import do `index.css` que foi deletado:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Step 5: Limpar dependências do ESLint no package.json

Remover do `devDependencies`:

```json
// REMOVER estas linhas:
"@eslint/js": "...",
"eslint": "...",
"eslint-plugin-react-hooks": "...",
"eslint-plugin-react-refresh": "..."
```

### Step 6: Instalar dependências

```bash
npm i
```

Isso gera a pasta `node_modules/` e resolve todos os alertas de imports no editor.

## Verification

- Nenhum sublinhado vermelho no `main.tsx` após `npm i`
- Pasta `node_modules/` presente no projeto
- `App.tsx` vazio e sem imports quebrados
- Nenhum arquivo `.css` de exemplo restante

## Heuristics

| Situação | Ação |
|----------|------|
| Editor mostra imports com erro após criar projeto | Execute `npm i` — falta `node_modules/` |
| Quer adicionar imagem estática (favicon, og:image) | Coloque em `public/` |
| Quer adicionar imagem usada em componente | Coloque em `src/assets/` e importe |
| Projeto tem ESLint config mas não vai usar | Delete `eslint.config.js` e remova deps do `package.json` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Codar sobre o boilerplate de exemplo | Limpar tudo e começar do zero |
| Deixar imports de arquivos deletados | Remover imports ao deletar arquivos |
| Commitar `node_modules/` | Verificar que está no `.gitignore` |
| Colocar código-fonte em `public/` | Usar `src/` para tudo que o bundler processa |
| Ignorar alertas do editor após setup | Executar `npm i` para resolver dependências |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Imports com sublinhado vermelho apos criar projeto | `node_modules/` nao existe | Executar `npm i` para instalar dependencias |
| Erro de import do `index.css` apos limpeza | Import ainda existe no `main.tsx` | Remover a linha `import './index.css'` do `main.tsx` |
| ESLint erros apos deletar config | Dependencias do ESLint ainda no `package.json` | Remover deps do ESLint e rodar `npm i` novamente |
| `App.tsx` com erro de JSX | TypeScript nao configurado para JSX | Verificar `tsconfig.json` tem `"jsx": "react-jsx"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada pasta, analogias e detalhes do Vite
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações