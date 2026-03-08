# Code Examples: Criando Projeto React com Vite

## Exemplo 1: Fluxo completo no terminal

```bash
# Navegar ate a pasta de projetos
cd ~/aulas

# Criar o projeto
npm create vite@latest

# Respostas interativas:
# ? Project name: › react-router-study
# ? Select a framework: › React
# ? Select a variant: › TypeScript

# Entrar na pasta e instalar
cd react-router-study
npm install

# Abrir no VS Code
code .

# Iniciar servidor de desenvolvimento
npm run dev
```

## Exemplo 2: Criacao com argumentos inline (sem wizard)

```bash
# Pular o wizard passando todos os argumentos
npm create vite@latest react-router-study -- --template react-ts

cd react-router-study
npm install
npm run dev
```

O flag `--template react-ts` seleciona React + TypeScript diretamente, sem perguntas interativas.

## Exemplo 3: Estrutura inicial gerada

```
react-router-study/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.tsx            # Componente principal
│   ├── index.css           # Estilos globais
│   ├── main.tsx            # Entry point — renderiza <App />
│   └── vite-env.d.ts       # Tipos do Vite
├── .gitignore
├── index.html              # HTML base — Vite usa como entry
├── package.json
├── tsconfig.json            # Config TypeScript
├── tsconfig.node.json       # Config TS para o Node (vite.config)
└── vite.config.ts           # Configuracao do Vite
```

## Exemplo 4: package.json gerado

```json
{
  "name": "react-router-study",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}
```

## Exemplo 5: Proximo passo — adicionar React Router

```bash
# Apos criar o projeto, instalar React Router
npm install react-router-dom
```

```typescript
// src/main.tsx — configuracao basica com BrowserRouter
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```