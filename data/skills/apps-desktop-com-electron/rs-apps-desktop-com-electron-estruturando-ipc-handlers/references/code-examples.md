# Code Examples: Estruturando IPC Handlers

## Estrutura de pastas completa

```
src/
├── main/
│   └── ipc.ts              # Handlers com constantes e tipos
├── preload/
│   └── index.ts            # Bridge com constantes e tipos
├── renderer/
│   └── components/
│       └── Sidebar.tsx      # Consome response.data
└── shared/
    ├── constants/
    │   └── ipc.ts           # Constantes de canais
    └── types/
        └── ipc.ts           # Interfaces Request/Response
```

## Constantes IPC completas (CRUD)

```typescript
// src/shared/constants/ipc.ts
export const ipc = {
  documents: {
    fetchAll: 'documents:fetchAll',
    fetch: 'documents:fetch',
    create: 'documents:create',
    save: 'documents:save',
    delete: 'documents:delete',
  },
} as const
```

Adicionando nova entidade:

```typescript
export const ipc = {
  documents: {
    fetchAll: 'documents:fetchAll',
    fetch: 'documents:fetch',
    create: 'documents:create',
    save: 'documents:save',
    delete: 'documents:delete',
  },
  tags: {
    fetchAll: 'tags:fetchAll',
    create: 'tags:create',
    delete: 'tags:delete',
  },
} as const
```

## Tipos compartilhados completos

```typescript
// src/shared/types/ipc.ts

// Entidade base
export interface Document {
  id: string
  title: string
  content: string
}

// === Responses ===

export interface FetchAllDocumentsResponse {
  data: Document[]
}

export interface FetchDocumentResponse {
  data: Document
}

export interface CreateDocumentResponse {
  data: Document
}

export interface SaveDocumentResponse {
  data: Document
}

export interface DeleteDocumentResponse {
  data: { id: string }
}

// === Requests ===

export interface CreateDocumentRequest {
  title: string
}

export interface SaveDocumentRequest {
  id: string
  title: string
  content: string
}

export interface FetchDocumentRequest {
  id: string
}

export interface DeleteDocumentRequest {
  id: string
}
```

## Preload completo

```typescript
// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import { ipc } from '@shared/constants/ipc'
import type {
  FetchAllDocumentsResponse,
  CreateDocumentRequest,
  CreateDocumentResponse,
} from '@shared/types/ipc'

contextBridge.exposeInMainWorld('api', {
  fetchDocuments: (): Promise<FetchAllDocumentsResponse> =>
    ipcRenderer.invoke(ipc.documents.fetchAll),

  createDocument: (req: CreateDocumentRequest): Promise<CreateDocumentResponse> =>
    ipcRenderer.invoke(ipc.documents.create, req),
})
```

## Main handler completo

```typescript
// src/main/ipc.ts
import { ipcMain } from 'electron'
import { ipc } from '@shared/constants/ipc'
import type {
  FetchAllDocumentsResponse,
  CreateDocumentRequest,
  CreateDocumentResponse,
} from '@shared/types/ipc'

ipcMain.handle(
  ipc.documents.fetchAll,
  async (): Promise<FetchAllDocumentsResponse> => {
    const documents = await db.documents.findMany()
    return { data: documents }
  },
)

ipcMain.handle(
  ipc.documents.create,
  async (_event, req: CreateDocumentRequest): Promise<CreateDocumentResponse> => {
    const document = await db.documents.create({
      title: req.title,
      content: '',
    })
    return { data: document }
  },
)
```

## Renderer consumindo o response tipado

```tsx
// src/renderer/components/Sidebar.tsx
async function loadDocuments() {
  const response = await window.api.fetchDocuments()
  // response.data e Document[] — tipado!
  setDocuments(response.data)
}
```

## Configuracao vite-tsconfig-paths

Instalacao:

```bash
npm install -D vite-tsconfig-paths
```

Configuracao:

```typescript
// electron.vite.config.ts
import { defineConfig } from 'electron-vite'
import tsconfigPathsPlugin from 'vite-tsconfig-paths'
import path from 'node:path'

const tsconfigPaths = tsconfigPathsPlugin({
  projects: [path.resolve('tsconfig.json')],
})

export default defineConfig({
  main: {
    plugins: [tsconfigPaths],
  },
  preload: {
    plugins: [tsconfigPaths],
  },
  renderer: {
    plugins: [tsconfigPaths],
  },
})
```

tsconfig.json precisa ter:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```