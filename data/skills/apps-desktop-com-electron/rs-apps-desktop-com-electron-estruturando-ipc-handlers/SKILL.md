---
name: rs-electron-estruturando-ipc-handlers
description: "Enforces structured IPC communication patterns when building Electron apps. Use when user asks to 'create IPC handlers', 'setup electron communication', 'structure preload bridge', 'organize main/renderer messaging', or any Electron IPC task. Applies rules: shared constants for channel names, typed requests/responses, entity-based channel categorization, vite-tsconfig-paths for alias imports. Make sure to use this skill whenever writing Electron IPC code or refactoring existing IPC channels. Not for general Node.js IPC, WebSocket communication, or HTTP API design."
---

# Estruturando IPC Handlers no Electron

> Canais IPC usam constantes compartilhadas e tipagem completa entre main, preload e renderer — nunca strings soltas.

## Rules

1. **Nunca use strings literais como nomes de canal** — crie constantes em `src/shared/constants/ipc.ts`, porque renomear um canal exige mudar em main, preload e renderer simultaneamente
2. **Categorize canais por entidade** — agrupe operações CRUD sob a entidade (`ipc.documents.fetchAll`), porque facilita descoberta e evita colisoes de nomes
3. **Tipagem compartilhada para requests e responses** — defina interfaces em `src/shared/types/ipc.ts`, porque o mesmo tipo garante contrato entre main e preload
4. **Use alias `@shared` com vite-tsconfig-paths** — imports com `@shared/...` em vez de caminhos relativos, porque paths relativos entre main/preload/renderer sao frageis
5. **Separe tipos em Request e Response** — cada operacao IPC tem sua interface de entrada e saida, porque o handler no main e o invoke no preload precisam do mesmo contrato
6. **Retorne dados dentro de um objeto wrapper** — `{ data: T }` em vez de retornar o array direto, porque permite adicionar metadata (paginacao, erros) sem breaking change

## How to write

### Constantes IPC (shared)

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

### Tipos compartilhados

```typescript
// src/shared/types/ipc.ts
export interface Document {
  id: string
  title: string
  content: string
}

// Responses
export interface FetchAllDocumentsResponse {
  data: Document[]
}

// Requests
export interface CreateDocumentRequest {
  title: string
}
```

### Preload com constantes e tipos

```typescript
// src/preload/index.ts
import { ipc } from '@shared/constants/ipc'
import type { FetchAllDocumentsResponse } from '@shared/types/ipc'

contextBridge.exposeInMainWorld('api', {
  fetchDocuments: (): Promise<FetchAllDocumentsResponse> =>
    ipcRenderer.invoke(ipc.documents.fetchAll),
})
```

### Main handler com tipos

```typescript
// src/main/ipc.ts
import { ipc } from '@shared/constants/ipc'
import type { FetchAllDocumentsResponse } from '@shared/types/ipc'

ipcMain.handle(
  ipc.documents.fetchAll,
  async (): Promise<FetchAllDocumentsResponse> => {
    return {
      data: [
        { id: '1', title: 'Doc 1', content: 'Conteudo...' },
      ],
    }
  },
)
```

### Configuracao vite-tsconfig-paths

```typescript
// electron.vite.config.ts
import tsconfigPathsPlugin from 'vite-tsconfig-paths'
import path from 'node:path'

const tsconfigPaths = tsconfigPathsPlugin({
  projects: [path.resolve('tsconfig.json')],
})

export default defineConfig({
  main: { plugins: [tsconfigPaths] },
  preload: { plugins: [tsconfigPaths] },
  renderer: { plugins: [tsconfigPaths] },
})
```

## Example

**Before (strings soltas, sem tipos):**
```typescript
// preload
ipcRenderer.invoke('fetchDocuments')

// main
ipcMain.handle('fetchDocuments', async () => {
  return [{ id: '1', title: 'Doc' }]
})

// renderer
const docs = await window.api.fetchDocuments()
docs.map(d => d.title) // sem tipo, qualquer coisa passa
```

**After (constantes + tipos):**
```typescript
// preload
ipcRenderer.invoke(ipc.documents.fetchAll)

// main
ipcMain.handle(ipc.documents.fetchAll, async (): Promise<FetchAllDocumentsResponse> => {
  return { data: [{ id: '1', title: 'Doc', content: '...' }] }
})

// renderer
const response = await window.api.fetchDocuments()
response.data.map(doc => doc.title) // tipado, erro se campo faltando
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova entidade no app (ex: tags, users) | Adicione novo grupo em `ipc` constants e tipos Request/Response correspondentes |
| Canal IPC recebe parametros | Crie interface `{Operation}Request` em shared/types |
| Canal IPC retorna dados | Crie interface `{Operation}Response` com wrapper `{ data: T }` |
| Electron + Vite com path aliases | Instale `vite-tsconfig-paths` e configure nos 3 processos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `ipcRenderer.invoke('fetchDocuments')` | `ipcRenderer.invoke(ipc.documents.fetchAll)` |
| `return documents` (array direto) | `return { data: documents }` |
| `import from '../../shared/...'` | `import from '@shared/...'` |
| Handler sem tipo de retorno | `async (): Promise<FetchAllDocumentsResponse>` |
| Tipos definidos inline no preload | Tipos em `src/shared/types/ipc.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
