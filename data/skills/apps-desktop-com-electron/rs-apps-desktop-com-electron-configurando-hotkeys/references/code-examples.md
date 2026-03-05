# Code Examples: Configurando Hotkeys no Electron

## Exemplo 1: Estrutura basica do arquivo de shortcuts

```typescript
// src/main/shortcuts.ts
import { app, globalShortcut, BrowserWindow } from 'electron'

export function createShortcuts(window: BrowserWindow) {
  // Registra shortcuts quando a janela ganha foco
  app.on('browser-window-focus', () => {
    globalShortcut.register('CommandOrControl+N', () => {
      window.webContents.send('new-document')
    })
  })

  // Remove todas as shortcuts quando perde foco
  app.on('browser-window-blur', () => {
    globalShortcut.unregisterAll()
  })
}
```

## Exemplo 2: Registro no main/index.ts

```typescript
import { createShortcuts } from './shortcuts'

// Dentro do app.whenReady() ou equivalente, apos criar a janela:
const mainWindow = new BrowserWindow({ /* ... */ })
createShortcuts(mainWindow)
```

## Exemplo 3: Shortcut global SEM controle de escopo (problema)

```typescript
// PROBLEMA: esta hotkey dispara mesmo quando outra app esta em foco
import { globalShortcut } from 'electron'

globalShortcut.register('CommandOrControl+N', () => {
  mainWindow.webContents.send('new-document')
})

// Se o usuario esta no Finder/Explorer e aperta Ctrl+N,
// o Electron intercepta e cria documento — comportamento indesejado
```

## Exemplo 4: Multiplas shortcuts com modificadores

```typescript
export function createShortcuts(window: BrowserWindow) {
  app.on('browser-window-focus', () => {
    // Novo documento
    globalShortcut.register('CommandOrControl+N', () => {
      window.webContents.send('new-document')
    })

    // Novo documento com Shift (variacao)
    globalShortcut.register('CommandOrControl+Shift+N', () => {
      window.webContents.send('new-document-from-template')
    })

    // Salvar
    globalShortcut.register('CommandOrControl+S', () => {
      window.webContents.send('save-document')
    })
  })

  app.on('browser-window-blur', () => {
    globalShortcut.unregisterAll()
  })
}
```

## Exemplo 5: Recebendo no renderer (React)

```typescript
// No renderer process (React component)
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    window.api.onNewDocument(() => {
      // Logica para criar novo documento
      createNewDocument()
    })
  }, [])
}
```

```typescript
// No preload.ts (bridge)
import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('api', {
  onNewDocument: (callback: () => void) => {
    ipcRenderer.on('new-document', callback)
  }
})
```

## Exemplo 6: Alternativa com React hotkeys (renderer-only)

```typescript
// Quando a hotkey NAO precisa do main process
import { useHotkeys } from 'react-hotkeys-hook'

function Editor() {
  useHotkeys('ctrl+b', () => {
    toggleBold()
  })

  useHotkeys('ctrl+i', () => {
    toggleItalic()
  })
}
```