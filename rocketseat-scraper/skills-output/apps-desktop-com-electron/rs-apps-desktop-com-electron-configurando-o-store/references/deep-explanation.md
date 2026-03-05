# Deep Explanation: Configurando o Electron Store

## Por que o Electron suporta bancos de dados Node

O Electron e um wrapper em torno do Node.js. Tudo que o Node suporta, o Electron suporta. Isso inclui SQLite, bancos file-based, e qualquer outro banco compativel com Node.

## A restricao fundamental: comunicacao renderer → main

Quando o renderer precisa comunicar com o main para salvar dados (via IPC), a aplicacao precisa de bancos **file-based** ou **locais**. Bancos remotos (MySQL, Postgres em servidor) nao fazem sentido nesse fluxo — se voce vai comunicar com servidor, comunique direto do renderer via API.

## Opcoes de persistencia avaliadas pelo instrutor

### SQLite
- Banco SQL relacional, funciona com arquivo local
- Opcao mais tradicional e robusta para dados locais
- Suporta queries complexas, paginacao, ordenacao

### RxDB
- Banco muito usado no ecossistema Electron
- Tem adapters para SQLite, IndexedDB, localStorage, in-memory
- **Problema:** o adapter SQLite faz parte do RxDB Premium (pago)
- O adapter gratuito (Dexie.js/IndexedDB) funciona bem para dados client-side

### Electron Store
- Biblioteca de persistencia baseada em JSON
- **Nao e um banco de dados** — le todos os dados de uma vez
- Sem paginacao, sem ordenacao nativa, sem queries
- Ideal para: preferencias, app state, cache
- Arquivo salvo em: `~/Library/Application Support/{app}/config.json` (macOS)

## Os dois caminhos reais em producao

O instrutor (Diego) foi explicito sobre isso:

1. **App offline/local** → Salve dados no client-side usando IndexedDB (Dexie.js). Nao precisa comunicar com o main process. Mais simples, menos codigo Electron.

2. **App online** → Comunique o frontend direto com uma API REST/GraphQL. Tambem nao precisa de IPC com o main process.

Em ambos os casos, voce usa **menos funcionalidades do Electron**. O curso usa Electron Store para documentos especificamente por motivos didaticos — para ensinar IPC, comunicacao renderer↔main, e o proprio Electron Store.

## Como o Electron Store funciona internamente

- Cria um arquivo JSON no diretorio de dados do app
- Path tipico (macOS): `~/Library/Application Support/{app-name}/config.json`
- O nome padrao do arquivo e `config.json` — reforça que e pensado para configuracao, nao dados
- Toda operacao (set, get, delete) modifica esse arquivo JSON
- API similar a um Map do JavaScript: `set()`, `get()`, `has()`, `delete()`

## A analogia do Record

`Record<string, T>` no TypeScript significa "um objeto onde as chaves sao strings e os valores sao do tipo T". Para o Electron Store, isso e perfeito para colecoes indexadas por ID, porque reflete exatamente a estrutura do JSON:

```json
{
  "documents": {
    "abc-123": { "title": "Doc 1", "content": "..." },
    "def-456": { "title": "Doc 2", "content": "..." }
  }
}
```