# Code Examples: Arquitetura do Electron

## Exemplo 1: Setup completo de BrowserWindow segura

```typescript
// main/index.ts
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Preload script — ponte entre Main e Renderer
      preload: path.join(__dirname, '../preload/index.js'),
      // OBRIGATORIO: isola o contexto do Renderer
      contextIsolation: true,
      // NUNCA habilite — ma pratica legada
      nodeIntegration: false,
    },
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(createWindow)
```

## Exemplo 2: Preload com contextBridge

```typescript
// preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'

// Expoe funcoes seguras no objeto window.api
contextBridge.exposeInMainWorld('api', {
  // Pattern 1: Renderer → Main (request-response)
  getUsers: () => ipcRenderer.invoke('get-users'),
  saveUser: (user: { name: string; email: string }) =>
    ipcRenderer.invoke('save-user', user),

  // Pattern 2: Main → Renderer (listener/push)
  onUserCreated: (callback: (user: any) => void) => {
    ipcRenderer.on('user-created', (_event, user) => callback(user))
  },

  // Pattern 3: Renderer → Main (one-way, sem resposta)
  logAction: (action: string) =>
    ipcRenderer.send('log-action', action),
})
```

## Exemplo 3: Main handlers para IPC

```typescript
// main/ipc-handlers.ts
import { ipcMain, BrowserWindow } from 'electron'
import { database } from './database'

// Pattern 1: Renderer pede → Main responde
ipcMain.handle('get-users', async () => {
  const users = await database.query('SELECT * FROM users')
  return users
})

ipcMain.handle('save-user', async (_event, user) => {
  const created = await database.insert('users', user)

  // Pattern 2: Main envia push para TODOS os Renderers
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('user-created', created)
  })

  return created
})

// Pattern 3: Renderer envia one-way
ipcMain.on('log-action', (_event, action) => {
  console.log(`[User Action] ${action}`)
})
```

## Exemplo 4: Renderer consumindo a API exposta

```typescript
// renderer/app.ts (ou dentro de componente React/Vue)

// Buscar dados (Renderer → Main → resposta)
async function loadUsers() {
  const users = await window.api.getUsers()
  renderUserList(users)
}

// Salvar dados (Renderer → Main → resposta)
async function handleSubmit(name: string, email: string) {
  const newUser = await window.api.saveUser({ name, email })
  console.log('Criado:', newUser)
}

// Ouvir push do Main (Main → Renderer)
window.api.onUserCreated((user) => {
  console.log('Main notificou novo usuario:', user)
  appendUserToList(user)
})

// Enviar log sem esperar resposta (one-way)
window.api.logAction('pagina-usuarios-aberta')
```

## Exemplo 5: Tipagem para o preload (TypeScript)

```typescript
// preload/types.d.ts
interface ElectronAPI {
  getUsers: () => Promise<User[]>
  saveUser: (user: CreateUserInput) => Promise<User>
  onUserCreated: (callback: (user: User) => void) => void
  logAction: (action: string) => void
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
```

## Anti-exemplo: o que NAO fazer (pratica legada)

```typescript
// ❌ ERRADO — nodeIntegration habilitada
const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,      // NUNCA
    contextIsolation: false,    // NUNCA
  },
})

// ❌ ERRADO — acesso direto a DB no Renderer
// Isso so funciona com nodeIntegration: true
// renderer/app.ts
const sqlite3 = require('sqlite3')  // Node API no browser!
const db = new sqlite3.Database('./app.db')
db.all('SELECT * FROM users', (err, rows) => {
  // Isso funciona mas e INSEGURO
  // Usuario pode ver/modificar queries pelo DevTools
})
```

## Estrutura de pastas tipica

```
src/
├── main/
│   ├── index.ts          # Entry point do processo Main
│   ├── ipc-handlers.ts   # Handlers IPC (handle/on)
│   └── database.ts       # Conexao DB (so acessivel aqui)
├── preload/
│   ├── index.ts          # contextBridge.exposeInMainWorld
│   └── types.d.ts        # Tipagem do window.api
└── renderer/
    ├── index.html        # HTML da aplicacao
    ├── app.ts            # Logica do frontend
    └── styles.css        # Estilos
```