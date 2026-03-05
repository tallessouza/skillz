# Code Examples: Conectando IPC Main com Electron Store

## Setup completo dos handlers

```typescript
import { ipcMain } from 'electron'
import { randomUUID } from 'node:crypto'
import { store } from './store'
import {
  FetchDocumentRequest,
  FetchDocumentResponse,
  CreateDocumentResponse,
  SaveDocumentRequest,
  DeleteDocumentRequest,
  Document,
} from '@shared/types/ipc'

// FETCH ALL — lista todos os documentos
ipcMain.handle('fetch-all', (): Document[] => {
  return Object.values(store.get('documents'))
})

// FETCH — busca documento por ID
ipcMain.handle('fetch', (_, { id }: FetchDocumentRequest): FetchDocumentResponse => {
  return store.get<Document>(`documents.${id}`)
})

// CREATE — cria novo documento com UUID
ipcMain.handle('create', (): CreateDocumentResponse => {
  const id = randomUUID()
  const document: Document = {
    id,
    title: 'Untitled',
  }
  store.set(`documents.${id}`, document)
  return document
})

// SAVE — atualiza documento existente
ipcMain.handle('save', (_, { id, title, content }: SaveDocumentRequest): void => {
  store.set(`documents.${id}`, { id, title, content })
})

// DELETE — remove documento
ipcMain.handle('delete', (_, { id }: DeleteDocumentRequest): void => {
  // @ts-ignore (electron-store delete typing issue)
  store.delete(`documents.${id}`)
})
```

## Testando manualmente com o JSON

Para testar sem a UI conectada, edite o arquivo JSON do store diretamente:

```json
{
  "documents": {
    "1": {
      "id": "1",
      "title": "Ignite",
      "content": ""
    }
  }
}
```

O caminho do arquivo e logado no console quando o store e inicializado. Apos salvar o JSON e recarregar o Electron, os dados aparecem na aplicacao.

## Estrutura das types usadas

```typescript
// @shared/types/ipc.ts
export interface Document {
  id: string
  title: string
  content?: string
}

export interface FetchDocumentRequest {
  id: string
}

export type FetchDocumentResponse = Document

export type CreateDocumentResponse = Document

export interface SaveDocumentRequest {
  id: string
  title: string
  content: string
}

export interface DeleteDocumentRequest {
  id: string
}
```

## Correspondencia entre handlers, preload e constantes

```
Constantes:    fetch-all | fetch | create | save | delete
Preload:       fetchAll  | fetch | create | save | delete
IPC Main:      fetch-all | fetch | create | save | delete
```

Todos os cinco metodos devem estar presentes e consistentes nos tres arquivos (constantes, preload, ipc main handlers).