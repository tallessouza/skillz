# Code Examples: Comunicacao IPC no Electron

## Exemplo 1: Comunicacao unidirecional (send/on)

O renderer envia dados para o main sem esperar resposta.

### Main (ipc.ts)
```typescript
import { ipcMain } from 'electron'

ipcMain.on('log-analytics', (_event, params) => {
  console.log('Analytics recebido:', params)
  // salvar em banco, arquivo, etc.
})
```

### Preload (index.ts)
```typescript
import { contextBridge, ipcRenderer } from 'electron'

const api = {
  logAnalytics: (params: { event: string; metadata?: Record<string, unknown> }) => {
    ipcRenderer.send('log-analytics', params)
  },
}

contextBridge.exposeInMainWorld('api', api)
```

### Renderer
```typescript
window.api.logAnalytics({ event: 'button-click', metadata: { buttonId: 'save' } })
// nenhum retorno — fire and forget
```

## Exemplo 2: Comunicacao bidirecional (invoke/handle)

O renderer envia e aguarda resposta do main.

### Main (ipc.ts)
```typescript
import { ipcMain } from 'electron'

ipcMain.handle('fetch-documents', async (_event, params: { filter?: string }) => {
  // simula busca em banco de dados
  const documents = [
    { id: '1', title: 'Document A' },
    { id: '2', title: 'Document B' },
  ]

  if (params.filter) {
    return documents.filter((doc) => doc.title.includes(params.filter!))
  }

  return documents
})
```

### Preload (index.ts)
```typescript
import { contextBridge, ipcRenderer } from 'electron'

const api = {
  fetchDocuments: (params: { filter?: string }) => {
    return ipcRenderer.invoke('fetch-documents', params)
  },
}

export type API = typeof api

contextBridge.exposeInMainWorld('api', api)

declare global {
  export interface Window {
    api: typeof api
  }
}
```

### Renderer (sidebar)
```typescript
// Com .then
window.api.fetchDocuments({ filter: 'A' }).then((documents) => {
  console.log(documents) // [{ id: '1', title: 'Document A' }]
})

// Com async/await
const documents = await window.api.fetchDocuments({})
console.log(documents)
```

## Exemplo 3: Importando ipc.ts no main

```typescript
// src/main/index.ts
import './ipc' // side-effect import, sem export necessario
```

O arquivo `ipc.ts` usa `ipcMain` diretamente, entao nao precisa exportar nada. A importacao garante que os handlers sejam registrados quando o app inicia.

## Exemplo 4: Configurando tsconfig para tipos

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/preload/index.d.ts"
  ]
}
```

Alternativa (preferida): em vez de arquivo `.d.ts` separado, declare os tipos inline no `preload/index.ts` como mostrado no Exemplo 2.

## Exemplo 5: Erro comum — pares misturados

```typescript
// ERRADO: on nao retorna valor para invoke
ipcMain.on('fetch-documents', (_event, params) => {
  return { data: 'hello' } // esse return e ignorado!
})

// No renderer:
const result = await window.api.fetchDocuments({})
// result === undefined
// Console: "Error invoking remote method 'fetch-documents': No handler registered"
```

```typescript
// CORRETO: handle + invoke
ipcMain.handle('fetch-documents', async (_event, params) => {
  return { data: 'hello' } // retorno enviado de volta ao renderer
})
```

## Exemplo 6: Alterando propriedades nativas do OS

```typescript
// main
ipcMain.on('set-window-title', (_event, params: { title: string }) => {
  const window = BrowserWindow.getFocusedWindow()
  if (window) {
    window.setTitle(params.title)
  }
})

// preload
const api = {
  setWindowTitle: (params: { title: string }) => {
    ipcRenderer.send('set-window-title', params)
  },
}

// renderer
window.api.setWindowTitle({ title: 'Meu Documento - Editor' })
```

Este e um caso de uso classico: o renderer nao tem acesso a `BrowserWindow`, mas via IPC pode pedir ao main para alterar titulo, icone do dock, ou qualquer propriedade nativa do OS.