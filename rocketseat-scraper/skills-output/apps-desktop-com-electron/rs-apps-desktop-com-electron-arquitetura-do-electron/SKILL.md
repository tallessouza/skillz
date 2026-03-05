---
name: rs-electron-arquitetura-do-electron
description: "Enforces Electron process isolation and IPC communication patterns when building desktop apps with Electron. Use when user asks to 'create an Electron app', 'add IPC communication', 'setup Electron project', 'connect renderer to main process', or 'access Node APIs from frontend'. Ensures correct separation between Renderer, Main, and Preload processes. Make sure to use this skill whenever writing Electron code or reviewing Electron architecture. Not for generic web frontend/backend patterns, browser extensions, or Tauri apps."
---

# Arquitetura do Electron

> Separe codigo em tres processos — Renderer (client-side), Main (server-side), Preload (ponte) — e nunca exponha APIs sensiveis no Renderer.

## Rules

1. **Renderer e igual a browser** — so tem acesso a APIs do browser (DOM, fetch, localStorage), porque tudo nessa camada e visivel e interceptavel pelo usuario final
2. **Nunca acesse banco de dados no Renderer** — conexoes a DB, tokens secretos, APIs de pagamento vao exclusivamente no processo Main, porque o Renderer e client-side exposto
3. **Nunca habilite nodeIntegration no Renderer** — `nodeIntegration: true` e uma ma pratica legada que expoe APIs do Node no frontend, mesmo que tutoriais antigos ensinem isso
4. **Use IPC para comunicacao** — Renderer e Main se comunicam via Inter-Process Communication (ipcRenderer/ipcMain), nunca por acesso direto
5. **Preload e a ponte** — o script preload executa no contexto do Renderer mas tem acesso a APIs do Node, use-o para expor funcoes seguras via `contextBridge`
6. **IPC e bidirecional** — diferente de REST, o Main pode enviar mensagens para o Renderer sem o Renderer ter solicitado (push, nao so request-response)

## Arquitetura dos processos

```
┌─────────────┐     IPC      ┌─────────────┐
│  Renderer   │◄────────────►│    Main      │
│ (client)    │              │  (server)    │
│ HTML/CSS/JS │              │  Node.js     │
│ Browser APIs│              │  DB, Auth    │
└──────┬──────┘              │  APIs sens.  │
       │                     └─────────────┘
       │ executa no mesmo contexto
┌──────┴──────┐
│  Preload    │
│ contextBridge│
│ Node APIs   │
└─────────────┘
```

## How to write

### BrowserWindow com contexto isolado

```typescript
// main/index.ts — processo Main
const mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, '../preload/index.js'),
    contextIsolation: true,   // OBRIGATORIO
    nodeIntegration: false,   // NUNCA true
  },
})
```

### Preload expondo funcoes seguras

```typescript
// preload/index.ts — ponte entre Main e Renderer
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  // Renderer → Main (request-response)
  fetchUsers: () => ipcRenderer.invoke('fetch-users'),

  // Main → Renderer (listener)
  onNotification: (callback: (data: string) => void) =>
    ipcRenderer.on('notification', (_event, data) => callback(data)),
})
```

### Main respondendo IPC

```typescript
// main/index.ts
import { ipcMain } from 'electron'

// Renderer pediu → Main responde
ipcMain.handle('fetch-users', async () => {
  const users = await database.getUsers()
  return users
})

// Main envia sem Renderer pedir (push)
mainWindow.webContents.send('notification', 'Novo dado disponivel')
```

### Renderer consumindo via preload

```typescript
// renderer (React/Vue/vanilla)
const users = await window.api.fetchUsers()

window.api.onNotification((data) => {
  console.log('Main enviou:', data)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa acessar filesystem, DB, ou credenciais | Coloque no processo Main |
| Precisa mostrar UI ou reagir a eventos visuais | Coloque no Renderer |
| Precisa expor funcao do Main para o Renderer | Use Preload + contextBridge |
| Main precisa notificar Renderer | Use `webContents.send()` |
| Renderer precisa pedir dado ao Main | Use `ipcRenderer.invoke()` |
| Comunicacao Renderer ↔ Renderer | Evite; roteie pelo Main |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `nodeIntegration: true` | `contextIsolation: true` + preload |
| `require('fs')` no Renderer | `ipcRenderer.invoke('read-file', path)` |
| Query SQL no componente React | IPC → Main → DB → resposta via IPC |
| Token de API hardcoded no Renderer | Token no Main, Renderer pede via IPC |
| `contextIsolation: false` | Sempre `true`, exponha apenas o necessario |
| Logica de negocio no Preload | Preload so faz bridge, logica vai no Main |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
