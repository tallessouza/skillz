# Code Examples: Insights sobre Armazenamento no Electron

## Exemplo 1: Armazenamento Local via IPC

Este e o padrao que o curso utiliza — comunicacao entre renderer e main process para operacoes locais.

```typescript
// main/ipc.ts — Main Process
import { ipcMain } from 'electron'
import { database } from './database'

// Salvar documento localmente
ipcMain.handle('save-document', async (_event, document) => {
  const savedDocument = await database.documents.save(document)
  return { document: savedDocument }
})

// Buscar documentos localmente
ipcMain.handle('fetch-documents', async () => {
  const documents = await database.documents.findAll()
  return { documents }
})

// Buscar documento por ID
ipcMain.handle('fetch-document', async (_event, documentId: string) => {
  const document = await database.documents.findById(documentId)
  return { document }
})
```

```typescript
// renderer/hooks/useDocuments.ts — Renderer Process
async function saveDocument(document: Document) {
  // Comunicacao via IPC com o main process
  const result = await window.api.saveDocument(document)
  return result.document
}

async function fetchDocuments() {
  const result = await window.api.fetchDocuments()
  return result.documents
}
```

```typescript
// preload/index.ts — Bridge entre renderer e main
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  saveDocument: (document: Document) =>
    ipcRenderer.invoke('save-document', document),
  fetchDocuments: () =>
    ipcRenderer.invoke('fetch-documents'),
  fetchDocument: (id: string) =>
    ipcRenderer.invoke('fetch-document', id),
})
```

## Exemplo 2: Comunicacao com API Externa (Alternativa Online)

Se a aplicacao precisasse de dados online/compartilhados, o codigo ficaria assim — **sem usar IPC para dados**, apenas comunicacao HTTP direta do renderer.

```typescript
// renderer/services/api.ts — Renderer Process (comunicacao direta)
const API_BASE = 'https://api.rotion.app'

async function saveDocument(document: Document) {
  // Requisicao HTTP direta, como em qualquer app web
  const response = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(document),
  })
  return response.json()
}

async function fetchDocuments() {
  const response = await fetch(`${API_BASE}/documents`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  })
  return response.json()
}
```

Note a diferenca: **nenhum IPC envolvido para dados**. O renderer faz fetch direto para a API, exatamente como faria em uma SPA React rodando no navegador.

## Exemplo 3: Comparacao lado a lado

```typescript
// ❌ ERRADO: Usar main process como proxy para API externa
// main/ipc.ts
ipcMain.handle('fetch-documents', async () => {
  // Nao faz sentido rotear pelo main process
  const response = await fetch('https://api.rotion.app/documents')
  return response.json()
})

// ✅ CORRETO para dados online: Fetch direto do renderer
// renderer/services/api.ts
async function fetchDocuments() {
  const response = await fetch('https://api.rotion.app/documents')
  return response.json()
}

// ✅ CORRETO para dados offline: IPC com banco local
// main/ipc.ts
ipcMain.handle('fetch-documents', async () => {
  return database.documents.findAll() // banco local, nao API
})
```

## Exemplo 4: Quando o main process FAZ sentido

O main process e o lugar certo para operacoes que precisam de acesso ao sistema operacional:

```typescript
// main/ipc.ts — Operacoes que DEVEM estar no main process
import { ipcMain, dialog, app, shell } from 'electron'
import path from 'node:path'
import fs from 'node:fs/promises'

// Exportar documento como arquivo (acesso ao filesystem)
ipcMain.handle('export-document', async (_event, document) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: path.join(app.getPath('documents'), `${document.title}.md`),
    filters: [{ name: 'Markdown', extensions: ['md'] }],
  })

  if (filePath) {
    await fs.writeFile(filePath, document.content, 'utf-8')
    return { success: true, filePath }
  }
  return { success: false }
})

// Abrir arquivo no app padrao do sistema
ipcMain.handle('open-external', async (_event, url: string) => {
  await shell.openExternal(url)
})

// Obter caminho de dados do app
ipcMain.handle('get-user-data-path', async () => {
  return app.getPath('userData')
})
```