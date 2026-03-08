# Code Examples: Estrutura de Pastas e Arquivos — React + Vite

## Estrutura completa antes da limpeza

```
projeto/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg          # ← DELETAR
│   ├── App.css                 # ← DELETAR
│   ├── App.tsx                 # ← LIMPAR conteúdo
│   ├── index.css               # ← DELETAR
│   ├── main.tsx                # ← REMOVER import do index.css
│   └── vite-env.d.ts          # ← MANTER (tipos do Vite)
├── .gitignore                  # ← MANTER
├── eslint.config.js            # ← DELETAR
├── index.html                  # ← MANTER
├── package.json                # ← LIMPAR deps do ESLint
├── package-lock.json           # ← MANTER
├── README.md                   # ← DELETAR
├── tsconfig.json               # ← MANTER
├── tsconfig.app.json           # ← MANTER
├── tsconfig.node.json          # ← MANTER
└── vite.config.ts              # ← MANTER
```

## Estrutura após a limpeza

```
projeto/
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx                 # Vazio, pronto para criar do zero
│   ├── main.tsx                # Sem import do index.css
│   └── vite-env.d.ts          # Tipos do Vite
├── .gitignore
├── index.html
├── package.json                # Sem deps do ESLint
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## main.tsx — Antes (com boilerplate)

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'           // ← Este import será removido
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## main.tsx — Depois (limpo)

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

## App.tsx — Antes (com boilerplate)

```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```

## App.tsx — Depois (limpo para começar do zero)

```tsx
function App() {
  return <></>
}

export default App
```

## package.json — Antes

```json
{
  "name": "meu-projeto",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "typescript": "~5.6.2",
    "typescript-eslint": "^8.18.2",
    "vite": "^6.0.5"
  }
}
```

## package.json — Depois (sem deps do ESLint)

```json
{
  "name": "meu-projeto",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.5"
  }
}
```

Note que o script `"lint": "eslint ."` também foi removido dos scripts.

## Comandos de limpeza completos (script bash)

```bash
#!/bin/bash
# Limpeza de boilerplate React + Vite

# Deletar arquivos de exemplo
rm -rf src/assets/
rm -f src/App.css
rm -f src/index.css
rm -f eslint.config.js
rm -f README.md

# Limpar App.tsx
cat > src/App.tsx << 'EOF'
function App() {
  return <></>
}

export default App
EOF

# Limpar main.tsx (remover import do index.css)
sed -i "/import '\.\/index\.css'/d" src/main.tsx

# Instalar dependências
npm i

echo "Projeto limpo e pronto para desenvolver do zero!"
```

## Variação: limpeza mantendo ESLint

Se quiser manter o ESLint (recomendado para projetos profissionais), pule a remoção do `eslint.config.js` e das dependências no `package.json`:

```bash
# Limpeza parcial — mantém ESLint
rm -rf src/assets/
rm -f src/App.css
rm -f src/index.css
rm -f README.md

# Manter eslint.config.js e suas deps no package.json
npm i
```

## Verificação pós-limpeza

```bash
# Verificar que não há imports quebrados
npx tsc --noEmit

# Verificar que o dev server roda
npm run dev
# Deve abrir em http://localhost:5173 com página em branco
```