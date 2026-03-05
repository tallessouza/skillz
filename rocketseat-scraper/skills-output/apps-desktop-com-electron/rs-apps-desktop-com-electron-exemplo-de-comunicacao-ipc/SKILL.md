---
name: rs-electron-exemplo-comunicacao-ipc
description: "Enforces correct IPC communication patterns when building Electron apps. Use when user asks to 'communicate between processes', 'send data from renderer to main', 'create IPC handler', 'expose API via preload', or 'use contextBridge'. Applies rules: preload as bridge, send/on for one-way, invoke/handle for two-way, contextBridge for exposing APIs, typed window declarations. Make sure to use this skill whenever writing Electron IPC code or setting up renderer-main communication. Not for general Node.js event emitters, HTTP APIs, or WebSocket implementations."
---

# Comunicacao IPC no Electron

> Toda comunicacao entre renderer e main passa pelo preload como ponte segura, usando os pares corretos de metodos conforme a direcao do fluxo.

## Rules

1. **Preload e a unica ponte** — toda API exposta ao renderer deve ser declarada no preload via `contextBridge.exposeInMainWorld`, porque o renderer nao deve ter acesso direto a APIs server-side
2. **Unidirecional: `send`/`on`** — use `ipcRenderer.send` + `ipcMain.on` quando o renderer envia dados sem esperar resposta, porque send e fire-and-forget
3. **Bidirecional: `invoke`/`handle`** — use `ipcRenderer.invoke` + `ipcMain.handle` quando o renderer precisa de retorno, porque invoke retorna uma Promise com o resultado
4. **Nunca misture os pares** — `send` com `handle` ou `invoke` com `on` causa erros silenciosos como "no handler registered", porque cada par tem protocolo interno diferente
5. **Parametros sempre em objeto** — envie `{ title, id }` e nao argumentos posicionais, porque facilita adicionar campos sem quebrar codigo existente
6. **Declare tipos no preload** — use `declare global` com `typeof api` para que o TypeScript reconheca `window.api`, porque `window.api` nao existe nos tipos padrao

## How to write

### Estrutura de arquivos IPC

```typescript
// src/main/ipc.ts — handlers do processo main (como "rotas" do backend)
import { ipcMain } from 'electron'

// Bidirecional: handle retorna valor
ipcMain.handle('fetch-documents', async (_event, params) => {
  const documents = await getDocumentsFromDB()
  return documents
})

// Unidirecional: on apenas recebe
ipcMain.on('log-analytics', (_event, params) => {
  saveAnalytics(params)
})
```

```typescript
// src/preload/index.ts — ponte que expoe APIs ao renderer
import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Bidirecional: invoke retorna Promise
  fetchDocuments: (params: { filter?: string }) => {
    return ipcRenderer.invoke('fetch-documents', params)
  },
  // Unidirecional: send sem retorno
  logAnalytics: (params: { event: string }) => {
    ipcRenderer.send('log-analytics', params)
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

```typescript
// src/renderer — chamando a API
window.api.fetchDocuments({ filter: 'recent' }).then((documents) => {
  console.log(documents)
})

window.api.logAnalytics({ event: 'page-view' })
```

### Importar ipc.ts no main

```typescript
// src/main/index.ts
import './ipc' // importar na raiz, nao precisa de export
```

## Example

**Before (pares misturados, sem tipo, args posicionais):**
```typescript
// main
ipcMain.on('fetch-documents', (_event, title) => {
  return { title }
})

// preload
fetchDocuments: (title: string) => ipcRenderer.invoke('fetch-documents', title)

// renderer — retorna undefined porque on nao retorna valor para invoke
const result = await window.api.fetchDocuments('teste')
```

**After (pares corretos, tipado, objeto):**
```typescript
// main
ipcMain.handle('fetch-documents', async (_event, params: { title: string }) => {
  return { title: params.title }
})

// preload
fetchDocuments: (params: { title: string }) => {
  return ipcRenderer.invoke('fetch-documents', params)
}

// renderer — recebe o valor corretamente
const result = await window.api.fetchDocuments({ title: 'teste' })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Renderer quer dados do main | `invoke`/`handle` (bidirecional) |
| Renderer envia evento sem esperar resposta | `send`/`on` (unidirecional) |
| Main quer notificar renderer espontaneamente | `webContents.send` no main + `ipcRenderer.on` no preload |
| Novo metodo IPC | Adicione no preload E no main, nunca so em um |
| TypeScript nao reconhece `window.api` | Adicione `declare global` no preload com `typeof api` |
| Arquivo `.d.ts` separado nao funciona | Verifique `include` no tsconfig ou declare inline no preload |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `ipcMain.on` + `ipcRenderer.invoke` | `ipcMain.handle` + `ipcRenderer.invoke` |
| `ipcMain.handle` + `ipcRenderer.send` | `ipcMain.on` + `ipcRenderer.send` |
| `fetchDocuments(title, id, filter)` args posicionais | `fetchDocuments({ title, id, filter })` objeto |
| Acessar Node APIs direto no renderer sem context isolation | Usar preload + `contextBridge` sempre |
| `window.api` sem declaracao de tipo | `declare global { interface Window { api: typeof api } }` |
| Exportar algo do ipc.ts | Apenas importar com side-effect: `import './ipc'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
