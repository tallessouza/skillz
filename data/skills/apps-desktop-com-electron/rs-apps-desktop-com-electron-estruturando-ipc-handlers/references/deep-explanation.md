# Deep Explanation: Estruturando IPC Handlers

## Por que padronizar IPC?

O problema central que o instrutor identifica: strings literais duplicadas entre processos. No Electron, a comunicacao IPC usa "canais" identificados por strings. O preload usa `ipcRenderer.invoke('fetchDocuments')` e o main usa `ipcMain.handle('fetchDocuments')`. Se voce renomeia em um lugar e esquece no outro, o app quebra silenciosamente em runtime — sem erro de compilacao.

A solucao: extrair essas strings para constantes em uma pasta `shared/`, que e importada por ambos os processos. Isso transforma um erro de runtime em erro de compilacao.

## Arquitetura shared/

O instrutor cria a pasta `src/shared/` com duas subpastas:

1. **`constants/ipc.ts`** — objeto `ipc` que funciona como enum categorizado por entidade
2. **`types/ipc.ts`** — interfaces para Document, Requests e Responses

A chave e que `shared/` nao pertence a nenhum processo especifico. Ela e importada pelo main, preload E renderer. Por isso o nome "shared".

## Categorizacao por entidade

O instrutor organiza as constantes por entidade de dominio (documents), nao por acao (fetch, create). Isso escala melhor: quando voce adiciona uma nova entidade (ex: tags, users), cria um novo grupo no objeto. O valor da constante (`'documents:fetchAll'`) serve para logs e debugging — voce ve exatamente qual canal foi chamado.

## O problema do path alias com Vite

Quando se usa `@shared/...` nos imports (configurado no `tsconfig.json` com `paths`), o TypeScript entende, mas o Vite nao. O electron-vite usa Vite internamente para fazer build de cada processo (main, preload, renderer), e o Vite ignora os paths do tsconfig por padrao.

A solucao: instalar `vite-tsconfig-paths` como dependencia de desenvolvimento e configurar como plugin nos tres processos dentro do `electron.vite.config.ts`. O plugin le o `tsconfig.json` e resolve os aliases automaticamente.

## Wrapper `{ data: T }` no response

O instrutor muda de retornar o array direto (`return documents`) para retornar dentro de um objeto (`return { data: documents }`). Isso causa um breaking change temporario no renderer (que esperava o array direto), mas o beneficio e extensibilidade: no futuro voce pode adicionar `{ data, pagination, error }` sem quebrar o contrato.

No renderer, o consumo muda de `docs.map(...)` para `response.data.map(...)`.

## Tipagem como contrato

O insight mais importante: ao definir `FetchAllDocumentsResponse` em shared e usar tanto no preload quanto no main, voce cria um contrato. Se o main nao retorna `content` (campo obrigatorio na interface Document), o TypeScript da erro no main. Se o renderer tenta acessar um campo que nao existe, da erro no renderer. Erros de runtime viram erros de compilacao.