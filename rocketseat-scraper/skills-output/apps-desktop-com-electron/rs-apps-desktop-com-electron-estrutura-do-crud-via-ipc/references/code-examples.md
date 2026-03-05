# Code Examples: Estrutura do CRUD via IPC

## Tipagens completas (shared/types/ipc.ts)

```typescript
import { Document } from './document'

// === RESPONSE TYPES ===

export interface FetchAllDocumentsResponse {
  documents: Document[]
}

export interface FetchDocumentResponse {
  document: Document
}

export interface CreateDocumentResponse {
  document: Document
}

// === REQUEST TYPES ===
// So para operacoes que precisam de parametros

export interface FetchDocumentRequest {
  id: string
}

export interface DeleteDocumentRequest {
  id: string
}

// Duas formas equivalentes de reutilizar campos:

// Opcao 1: interface extends
export interface SaveDocumentRequest extends Document {}

// Opcao 2: type intersection
export type SaveDocumentRequest = Document & {}
```

## Entidade Document com content opcional

```typescript
// shared/types/document.ts
export interface Document {
  id: string
  title: string
  content?: string  // opcional — documento novo nao tem conteudo
}
```

## Preload completo com todas as operacoes

```typescript
// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import {
  FetchAllDocumentsResponse,
  FetchDocumentRequest,
  FetchDocumentResponse,
  CreateDocumentResponse,
  SaveDocumentRequest,
  DeleteDocumentRequest,
} from '@shared/types/ipc'

const api = {
  fetchDocuments(): Promise<FetchAllDocumentsResponse> {
    return ipcRenderer.invoke('ipc.documents.fetchAll')
  },

  fetchDocument(req: FetchDocumentRequest): Promise<FetchDocumentResponse> {
    return ipcRenderer.invoke('ipc.documents.fetch', req)
  },

  createDocument(): Promise<CreateDocumentResponse> {
    return ipcRenderer.invoke('ipc.documents.create')
  },

  saveDocument(req: SaveDocumentRequest): Promise<void> {
    return ipcRenderer.invoke('ipc.documents.save', req)
  },

  deleteDocument(req: DeleteDocumentRequest): Promise<void> {
    return ipcRenderer.invoke('ipc.documents.delete', req)
  },
}

contextBridge.exposeInMainWorld('api', api)
```

## Padrao de canal IPC

```
ipc.{dominio}.{operacao}

Exemplos:
ipc.documents.fetchAll
ipc.documents.fetch
ipc.documents.create
ipc.documents.save
ipc.documents.delete
```

## Correspondencia main handler (proximo passo)

```typescript
// src/main/ipc.ts — estrutura que sera implementada nas proximas aulas
import { ipcMain } from 'electron'

ipcMain.handle('ipc.documents.fetchAll', async () => {
  // buscar todos os documentos do banco
})

ipcMain.handle('ipc.documents.fetch', async (_, req: FetchDocumentRequest) => {
  // buscar documento por id
})

ipcMain.handle('ipc.documents.create', async () => {
  // criar documento com titulo "Untitled" e conteudo vazio
})

ipcMain.handle('ipc.documents.save', async (_, req: SaveDocumentRequest) => {
  // atualizar documento existente
})

ipcMain.handle('ipc.documents.delete', async (_, req: DeleteDocumentRequest) => {
  // remover documento por id
})
```