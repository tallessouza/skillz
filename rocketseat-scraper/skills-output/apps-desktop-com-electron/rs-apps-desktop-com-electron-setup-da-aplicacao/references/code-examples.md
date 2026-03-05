# Code Examples: Setup de Aplicacao Electron

## 1. Criacao do projeto com Electron Vite

```bash
# Scaffold do projeto
npm create @quick-start/electron@latest

# Perguntas interativas:
# - Nome do projeto: rotion
# - Framework: React
# - TypeScript: sim
# - Electron Updater: nao (requer certificado)
# - Download Mirror Proxy: nao

# Instalar dependencias
cd rotion
npm install

# Rodar em desenvolvimento
npm run dev
```

## 2. Estrutura gerada pelo Electron Vite

```
rotion/
├── src/
│   ├── main/           # Processo main (backend Node.js)
│   │   └── index.ts
│   ├── renderer/       # Processo renderer (frontend React)
│   │   ├── index.html
│   │   └── src/
│   │       └── App.tsx
│   └── preload/        # Ponte main <-> renderer
│       └── index.ts
├── package.json
├── electron.vite.config.ts
└── tsconfig.json
```

## 3. Processo main completo (index.ts)

```typescript
import { app, BrowserWindow } from 'electron'
import { join } from 'path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false, // Nao mostra ate estar pronta
    autoHideMenuBar: true,
    // Icone especifico para Linux
    ...(process.platform === 'linux' ? { icon: 'path/to/icon.png' } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  // Mostra janela quando estiver pronta
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Dev: carrega URL do Vite dev server
  // Prod: carrega arquivo HTML da build
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Equivalente ao document.onload — app pronto para exibir
app.whenReady().then(createWindow)

// macOS: recria janela ao clicar no dock
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Windows/Linux: fecha app quando todas as janelas fecham
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

## 4. Componente App limpo

```typescript
// src/renderer/src/App.tsx
export function App() {
  return <h1>Hello World</h1>
}
```

```typescript
// src/renderer/src/main.tsx
import { App } from './App'

// Sem importacao de CSS global no inicio
// Sem importacao de assets
```

## 5. Demonstracao: qualquer URL na BrowserWindow

```typescript
// Isso demonstra que Electron e apenas um browser com acesso nativo
// Qualquer URL pode ser carregada dentro da janela
mainWindow.loadURL('https://rocketseat.com.br')
```

## 6. Script dev com watch para hot reload no main

```json
{
  "scripts": {
    "dev": "electron-vite dev --watch",
    "build": "electron-vite build",
    "build:win": "electron-vite build --win",
    "build:mac": "electron-vite build --mac",
    "build:linux": "electron-vite build --linux"
  }
}
```

## 7. Multiplas janelas (conceito mencionado)

```typescript
// Electron suporta multiplas BrowserWindow
// Exemplo: janela de preferencias
function createPreferencesWindow() {
  const prefsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    parent: mainWindow, // Vincula a janela principal
    modal: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  prefsWindow.loadFile(join(__dirname, '../renderer/preferences.html'))
}
```

## 8. Alternativa ao Electron Updater (sem certificado)

```typescript
// Conceito mencionado pelo instrutor como alternativa
// Ao iniciar o app, verificar versao no GitHub
async function checkForUpdates() {
  const response = await fetch(
    'https://api.github.com/repos/user/repo/releases/latest'
  )
  const release = await response.json()
  const latestVersion = release.tag_name

  if (latestVersion !== app.getVersion()) {
    // Notificar usuario que ha nova versao disponivel
    // Redirecionar para pagina de download
  }
}
```