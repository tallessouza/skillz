---
name: rs-electron-conectando-com-store
description: "Applies Electron Store CRUD patterns when building desktop apps with Electron and IPC. Use when user asks to 'connect IPC handlers', 'use electron-store', 'create CRUD in Electron', 'persist data in desktop app', or 'implement IPC main handlers'. Covers store.get with dot-prop notation, store.set, store.delete, Object.values for listing, and UUID generation. Make sure to use this skill whenever implementing data persistence in Electron apps. Not for web APIs, SQL databases, or browser localStorage."
---

# Conectando IPC Main com Electron Store

> Cada handler IPC Main conecta diretamente ao Electron Store usando get/set/delete com dot-prop notation para acessar documentos por ID.

## Rules

1. **Use Object.values para listagem** — `Object.values(store.get('documents'))` retorna apenas os documentos sem as chaves de ID, porque a estrutura interna e um map de ID→documento
2. **Use dot-prop notation no get** — `store.get(\`documents.${id}\`)` acessa um documento especifico dentro do JSON, porque o Electron Store usa a biblioteca dot-prop internamente
3. **Use store.set para criar e atualizar** — `store.set(\`documents.${id}\`, document)` funciona tanto para create quanto save, porque set sobrescreve o valor naquele path
4. **Use store.delete para remover** — `store.delete(\`documents.${id}\`)` remove a entrada do JSON
5. **Gere IDs com crypto.randomUUID** — importe de `node:crypto`, porque sem banco de dados tradicional a responsabilidade de gerar ID fica no codigo
6. **Ignore o primeiro parametro do handler** — o IPC Main handler recebe `(event, args)`, use `_` para o event quando nao precisar dele

## How to write

### Estrutura do Store (JSON)

```typescript
// O store armazena documentos como map: ID → Document
{
  "documents": {
    "uuid-1": { "id": "uuid-1", "title": "Ignite", "content": "" },
    "uuid-2": { "id": "uuid-2", "title": "Outro", "content": "..." }
  }
}
```

### FetchAll — listar todos

```typescript
ipcMain.handle('fetch-all', () => {
  return Object.values(store.get('documents'))
})
```

### Fetch — buscar por ID

```typescript
ipcMain.handle('fetch', (_, { id }: FetchDocumentRequest) => {
  return store.get<Document>(`documents.${id}`)
})
```

### Create — criar novo documento

```typescript
import { randomUUID } from 'node:crypto'

ipcMain.handle('create', (): CreateDocumentResponse => {
  const id = randomUUID()
  const document: Document = { id, title: 'Untitled' }
  store.set(`documents.${id}`, document)
  return document
})
```

### Save — atualizar documento

```typescript
ipcMain.handle('save', (_, { id, title, content }: SaveDocumentRequest) => {
  store.set(`documents.${id}`, { id, title, content })
})
```

### Delete — remover documento

```typescript
ipcMain.handle('delete', (_, { id }: DeleteDocumentRequest) => {
  // @ts-ignore (https://github.com/sindresorhus/electron-store/issues/XXX)
  store.delete(`documents.${id}`)
})
```

## Example

**Before (handlers vazios):**
```typescript
ipcMain.handle('fetch-all', () => {
  // TODO: conectar com store
})
ipcMain.handle('create', () => {
  return { id: '???', title: '' }
})
```

**After (conectados ao Electron Store):**
```typescript
ipcMain.handle('fetch-all', () => {
  return Object.values(store.get('documents'))
})
ipcMain.handle('create', (): CreateDocumentResponse => {
  const id = randomUUID()
  const document: Document = { id, title: 'Untitled' }
  store.set(`documents.${id}`, document)
  return document
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Listar todos os itens do store | `Object.values(store.get('collection'))` |
| Buscar item por ID | `store.get<Type>(\`collection.${id}\`)` |
| Criar ou atualizar item | `store.set(\`collection.${id}\`, data)` |
| Remover item | `store.delete(\`collection.${id}\`)` com `@ts-ignore` se necessario |
| Precisa de ID unico | `randomUUID()` de `node:crypto` |
| store.get retorna unknown | Use generic `store.get<Type>()` ou `as Type` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `store.get('documents')[id]` | `store.get(\`documents.${id}\`)` |
| `Math.random().toString()` para IDs | `randomUUID()` de `node:crypto` |
| `store.set('documents', {...all, [id]: doc})` | `store.set(\`documents.${id}\`, doc)` |
| Ignorar o event sem `_` | `(_, { id }) => ...` |
| `any` para tipar retorno do get | `store.get<Document>(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
