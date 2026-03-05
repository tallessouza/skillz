# Code Examples: Configurando o Electron Store

## 1. Instalacao

```bash
npm install electron-store
```

## 2. Configuracao minima

```typescript
// src/main/store.ts
import Store from 'electron-store'

export const store = new Store()

// Debug: ver onde o arquivo JSON e salvo
console.log(store.path)
// macOS: ~/Library/Application Support/{app}/config.json
// Windows: %APPDATA%/{app}/config.json
// Linux: ~/.config/{app}/config.json
```

## 3. Configuracao com tipagem completa

```typescript
// src/main/store.ts
import Store from 'electron-store'

interface StoreType {
  documents: Record<string, { title: string; content: string }>
}

export const store = new Store<StoreType>({
  defaults: {
    documents: {},
  },
})
```

Resultado no `config.json` apos primeira execucao:
```json
{
  "documents": {}
}
```

## 4. Importar no entry point

```typescript
// src/main/index.ts
import './store'
// ou
import { store } from './store'
```

## 5. Operacoes CRUD

```typescript
import { store } from './store'

// CREATE — adicionar documento
store.set('documents', {
  ...store.get('documents'),
  ['doc-1']: { title: 'Meu Doc', content: 'Conteudo aqui' },
})

// READ — buscar todos
const allDocs = store.get('documents')

// READ — verificar existencia
const exists = store.has('documents.doc-1')

// UPDATE — atualizar documento
store.set('documents.doc-1.title', 'Titulo Atualizado')

// DELETE — remover documento
store.delete('documents.doc-1')
```

## 6. Exemplo de Store para preferencias (caso de uso real)

```typescript
interface PreferencesStore {
  theme: 'dark' | 'light'
  fontSize: number
  sidebarOpen: boolean
  lastOpenedFile: string | null
}

export const preferencesStore = new Store<PreferencesStore>({
  defaults: {
    theme: 'light',
    fontSize: 14,
    sidebarOpen: true,
    lastOpenedFile: null,
  },
})

// Uso
preferencesStore.set('theme', 'dark')
preferencesStore.set('sidebarOpen', false)
const theme = preferencesStore.get('theme') // tipo inferido: 'dark' | 'light'
```

## 7. Alternativas mencionadas na aula

### IndexedDB via Dexie.js (client-side, gratuito)
```typescript
// Roda no renderer process, sem IPC necessario
import Dexie from 'dexie'

const db = new Dexie('MyDatabase')
db.version(1).stores({
  documents: '++id, title, createdAt',
})
```

### SQLite (main process, file-based)
```typescript
// Roda no main process
import Database from 'better-sqlite3'

const db = new Database('myapp.db')
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT
  )
`)
```