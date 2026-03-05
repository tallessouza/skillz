# Deep Explanation: Conectando IPC Main com Electron Store

## Por que Object.values?

A estrutura do Electron Store armazena documentos como um "map" dentro do JSON — cada documento e indexado pelo seu ID como chave. Isso facilita busca por ID (O(1) com dot-prop), mas quando queremos listar todos, precisamos ignorar as chaves e retornar apenas os valores. `Object.values()` faz exatamente isso.

Estrutura interna:
```json
{
  "documents": {
    "abc-123": { "id": "abc-123", "title": "Doc 1", "content": "..." },
    "def-456": { "id": "def-456", "title": "Doc 2", "content": "..." }
  }
}
```

`Object.values(store.get('documents'))` retorna `[{ id: "abc-123", ... }, { id: "def-456", ... }]`.

## Como dot-prop funciona no Electron Store

O Electron Store usa internamente a biblioteca `dot-prop`. Essa biblioteca permite acessar propriedades aninhadas de objetos usando strings com pontos como separadores.

Exemplo conceitual:
```javascript
const obj = { foo: { bar: 'unicorn' } }
// dot-prop: get(obj, 'foo.bar') → 'unicorn'
```

No contexto do store:
- `store.get('documents.uuid-1')` → retorna o documento com ID `uuid-1`
- `store.get('documents.uuid-1.title')` → retorna apenas o titulo
- Funciona tambem com arrays: `foo.0.bar`

Isso e poderoso porque permite acessar valores profundos no JSON sem precisar carregar o objeto inteiro em memoria e navegar manualmente.

## Por que randomUUID e nao outra abordagem?

Como o Electron Store nao e um banco de dados tradicional (sem auto-increment, sem sequences), a responsabilidade de gerar IDs unicos fica no codigo da aplicacao. O `crypto.randomUUID()` do Node.js gera UUIDs v4 que sao universalmente unicos, sem necessidade de dependencias externas.

## O problema de tipagem do store.delete

No momento da gravacao da aula, existe uma issue aberta no repositorio do electron-store onde o metodo `delete` nao consegue inferir corretamente que dentro de uma colecao (como `documents`) podem existir chaves dinamicas. O TypeScript reclama porque a tipagem do delete espera chaves conhecidas estaticamente.

A solucao temporaria e usar `// @ts-ignore` com referencia a issue, para que futuros desenvolvedores possam verificar se ja foi corrigido. Alternativas incluem:
- Type assertion no argumento
- Wrapper function com tipagem mais flexivel
- Contribuir com fix na propria biblioteca

## O parametro event nos handlers

Todo `ipcMain.handle` recebe como primeiro argumento um `IpcMainInvokeEvent`. Na maioria dos casos de CRUD simples, esse evento nao e utilizado. A convencao e usar `_` como nome do parametro para indicar que e intencionalmente ignorado. Sem isso, o TypeScript reclama que os argumentos nao batem com a assinatura esperada.

## Tipagem do store.get

O `store.get` retorna `unknown` quando o path e uma string dinamica (template literal), porque o TypeScript nao consegue inferir o tipo do valor naquele path. Duas solucoes:
1. Generic: `store.get<Document>(\`documents.${id}\`)`
2. Type assertion: `store.get(...) as Document`

O instrutor preferiu a abordagem com generic por ser mais limpa e declarativa.