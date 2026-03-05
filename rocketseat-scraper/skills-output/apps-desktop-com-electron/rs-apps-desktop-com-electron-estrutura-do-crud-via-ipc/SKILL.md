---
name: rs-electron-estrutura-crud-ipc
description: "Enforces IPC CRUD structuring patterns when building Electron apps with inter-process communication. Use when user asks to 'create IPC handlers', 'add Electron CRUD', 'setup preload bridge', 'structure IPC calls', or 'communicate between main and renderer'. Applies typed request/response pairs, ipcRenderer.invoke pattern, and channel naming conventions. Make sure to use this skill whenever scaffolding Electron IPC operations. Not for HTTP APIs, REST endpoints, or browser-only IndexedDB/localStorage code."
---

# Estrutura do CRUD via IPC no Electron

> Defina tipagens de request/response para cada operacao IPC e exponha chamadas tipadas via preload, mantendo canais nomeados de forma consistente.

## Rules

1. **Crie interfaces separadas de Request e Response para cada operacao** — `FetchDocumentRequest`, `FetchDocumentResponse`, porque tipagem explicita previne erros silenciosos na comunicacao entre processos
2. **Request so existe quando ha parametros** — create sem parametros nao precisa de request type, porque interfaces vazias adicionam ruido sem valor
3. **Use `ipcRenderer.invoke` no preload** — nunca `send`/`on` para CRUD, porque invoke retorna Promise e permite await no renderer
4. **Nomeie canais com namespace consistente** — `ipc.documents.fetch`, `ipc.documents.create`, porque evita colisao e facilita debug
5. **Confira o nome do canal ao duplicar codigo** — erro comum: copiar fetch e esquecer de trocar para create no invoke, porque o app funciona mas executa a operacao errada (bug silencioso)
6. **Permita campos opcionais quando o dominio exige** — `content?: string` para documentos novos criados com conteudo vazio, porque a entidade precisa existir antes do usuario editar

## How to write

### Tipagens de Request/Response

```typescript
// shared/types/ipc.ts

// Response types — o que cada operacao retorna
interface FetchAllDocumentsResponse {
  documents: Document[]
}

interface FetchDocumentResponse {
  document: Document
}

interface CreateDocumentResponse {
  document: Document
}

// Request types — so para operacoes que recebem parametros
interface FetchDocumentRequest {
  id: string
}

interface DeleteDocumentRequest {
  id: string
}

interface SaveDocumentRequest extends Document {
  // herda id, title, content do Document
}
```

### Preload bridge

```typescript
// src/preload/index.ts
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
```

## Example

**Before (sem tipagem, canais inconsistentes):**
```typescript
const api = {
  fetchDocs: () => ipcRenderer.invoke('get-docs'),
  fetchDoc: (id) => ipcRenderer.invoke('get-docs', id),
  create: () => ipcRenderer.invoke('get-docs'), // bug: canal errado copiado
  save: (data) => ipcRenderer.invoke('save', data),
  delete: (id) => ipcRenderer.invoke('del', id),
}
```

**After (tipado, canais com namespace):**
```typescript
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
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Operacao sem parametros (create com titulo padrao) | Nao crie request type, retorne apenas response |
| Operacao sem retorno (save, delete) | Use `Promise<void>` |
| Reutilizar campos de outra interface | Use `extends` ou intersection type `&` |
| Documento novo precisa de titulo | Crie com titulo "Untitled" e conteudo vazio no handler da main |
| App em producao com dados remotos | Use HTTP/GraphQL direto do renderer, IPC so para APIs nativas do OS |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `ipcRenderer.send('action')` para CRUD | `ipcRenderer.invoke('ipc.domain.action')` |
| Canal sem namespace: `'fetch'` | Canal com namespace: `'ipc.documents.fetch'` |
| Request type vazio `interface CreateReq {}` | Omita o request type, funcao sem parametro |
| Copiar invoke e nao trocar canal | Sempre confira o segundo argumento do invoke |
| `content: string` obrigatorio para doc novo | `content?: string` permitindo vazio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
