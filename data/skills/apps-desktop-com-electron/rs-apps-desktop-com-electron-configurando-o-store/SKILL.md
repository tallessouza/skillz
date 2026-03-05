---
name: rs-electron-configurando-o-store
description: "Applies Electron Store configuration patterns when building desktop apps with Electron. Use when user asks to 'persist data in Electron', 'save user preferences', 'configure electron-store', 'setup local storage in desktop app', or 'store app state'. Covers TypeScript typing, defaults, and storage strategy decisions. Make sure to use this skill whenever working with data persistence in Electron apps. Not for database design, SQL queries, or web-only localStorage."
---

# Configurando o Electron Store

> Escolha a estrategia de persistencia baseada no caso de uso real, e configure o Electron Store com tipagem TypeScript e defaults explicitos.

## Rules

1. **Electron Store e para preferencias e app state, nao para banco de dados** — use para tema, tamanho de fonte, estado de sidebar, cache, porque ele le o JSON inteiro na memoria e nao suporta paginacao ou ordenacao
2. **Sempre tipar o store com generics** — crie uma interface `StoreType` e passe como generic `new Store<StoreType>()`, porque isso garante autocomplete e type safety nos gets/sets
3. **Sempre definir defaults** — passe a chave `defaults` com valores iniciais para cada propriedade, porque o Electron Store cria o arquivo JSON com esses valores na primeira execucao
4. **Use Record para colecoes chave-valor** — `Record<string, T>` para mapas onde a chave e o ID, porque reflete a estrutura real do JSON e facilita lookups
5. **Arquivo store.ts fica em src/main/** — porque o Electron Store roda no processo main (Node), nao no renderer
6. **Importe o store no main/index** — para garantir que o modulo e carregado na inicializacao do app

## How to write

### Configuracao basica com tipagem

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

### Importar no main

```typescript
// src/main/index.ts
import './store'
```

### Operacoes basicas

```typescript
// Set — salvar informacao
store.set('documents', { ...store.get('documents'), [id]: doc })

// Get — buscar informacao
const documents = store.get('documents')

// Has — verificar existencia
if (store.has(`documents.${id}`)) { /* ... */ }

// Delete — remover
store.delete(`documents.${id}`)
```

## Decision framework

| Cenario | Solucao recomendada |
|---------|---------------------|
| Dados 100% locais, offline, com queries complexas | IndexedDB (via Dexie.js) ou SQLite |
| Dados em servidor remoto | API REST/GraphQL direto do renderer |
| Preferencias do usuario (tema, fonte, layout) | Electron Store |
| App state (sidebar aberta/fechada, ultima aba) | Electron Store |
| Cache local | Electron Store |
| Documentos em producao | SQLite ou IndexedDB, nao Electron Store |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `new Store()` sem generic | `new Store<StoreType>()` |
| `new Store()` sem defaults | `new Store<StoreType>({ defaults: { ... } })` |
| Usar Electron Store como banco relacional | Usar SQLite para queries complexas |
| Criar store.ts no renderer | Criar em src/main/store.ts |
| Ler store.path em producao | Usar apenas para debug durante desenvolvimento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
