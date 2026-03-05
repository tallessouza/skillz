# Deep Explanation: Estrutura do CRUD via IPC

## Por que tipar request e response separadamente

Diego explica que as interfaces de request representam os **parametros** que cada operacao precisa receber. Nem toda operacao precisa de parametros — criar um documento, por exemplo, nao recebe nada porque o titulo ja vem como "Untitled" e o conteudo vazio. Essa decisao de design vem da experiencia com o Notion: quando o usuario clica em "Novo Documento", a entidade ja deve ser criada imediatamente, sem pedir titulo via modal ou adiar a persistencia.

## Interface vs Type para extends

O instrutor mostra que `SaveDocumentRequest` pode usar `interface extends Document` ou `type SaveDocumentRequest = Document & { ... }`. Ambos funcionam. A interface e mais aberta para extensao futura, mas no TypeScript moderno a diferenca pratica e minima. O ponto importante e: quando uma request tem os mesmos campos de uma entidade existente, reutilize via extends/intersection ao inves de redeclarar.

## O bug silencioso de copiar canais

Diego destaca um erro que ele proprio ja cometeu: ao duplicar uma funcao IPC para criar outra, esquecer de trocar o nome do canal no `ipcRenderer.invoke`. O app continua funcionando sem erros, mas executa a operacao errada (ex: chama fetch quando deveria chamar create). Esse tipo de bug e dificil de encontrar porque nao gera excecao.

## IPC nao e para CRUD em producao

Insight importante: em aplicacoes Electron reais de producao, o IPC raramente e usado para CRUD. O padrao real e:
- **Dados remotos:** HTTP/GraphQL direto do renderer
- **Dados locais:** IndexedDB, localStorage, SQLite via biblioteca do renderer
- **IPC de verdade:** manipular APIs nativas do OS que so a camada main consegue acessar (filesystem, system tray, notifications, etc.)

O CRUD via IPC no curso e para demonstrar as possibilidades do IPC, nao como padrao de producao.

## Arquitetura — simplicidade proposital

Diego menciona que seria possivel aplicar Clean Architecture, SOLID, Ports and Adapters no preload — tratando a API do preload como entrada de dados, criando adapters, etc. Mas ele manteve simples propositalmente, justificando que a complexidade arquitetural so faz sentido quando o IPC e o core da comunicacao de dados, o que raramente acontece em producao.

## Campo content opcional

A decisao de tornar `content?: string` opcional no Document veio da necessidade de criar documentos com conteudo vazio. Quando o usuario clica em "Novo Documento", a entidade e criada imediatamente com titulo "Untitled" e sem conteudo. O usuario edita depois. Isso segue o padrao do Notion.