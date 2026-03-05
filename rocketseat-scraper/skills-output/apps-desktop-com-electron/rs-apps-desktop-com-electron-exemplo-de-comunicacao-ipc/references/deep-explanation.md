# Deep Explanation: Comunicacao IPC no Electron

## Modelo mental: tres processos

O Electron divide a aplicacao em tres contextos:

- **Main** — processo server-side, acessa filesystem, banco de dados, APIs do OS (titulo da janela, icone do dock, etc.)
- **Renderer** — processo client-side, e basicamente um navegador Chrome, executa React/HTML/CSS
- **Preload** — script que roda DENTRO do renderer mas tem acesso a APIs especificas do main. E a ponte segura.

### Analogia do instrutor
O preload funciona como server-side rendering em frameworks como Next.js ou Remix: codigo que faz parte do frontend mas executa no contexto do servidor. Voce tem acesso a funcionalidades server-side, porem o codigo e executado no client-side.

## IPC como protocolo

O IPC (Inter-Process Communication) nao e HTTP. E mais comparavel a WebSocket: comunicacao de via dupla. O renderer pode enviar mensagens para o main, e o main pode enviar mensagens espontaneas para o renderer.

### Tres patterns de comunicacao

1. **Renderer → Main (unidirecional)** — `send`/`on`. Fire-and-forget. O renderer envia e nao espera resposta.
2. **Renderer → Main → Renderer (bidirecional)** — `invoke`/`handle`. O renderer envia e aguarda uma Promise com o retorno.
3. **Main → Renderer (push)** — O main envia evento espontaneo para o renderer (ex: nova mensagem de chat, cron job completou). Usa `webContents.send`.

## Context Isolation

Antigamente, o Electron permitia acessar APIs do Node.js diretamente no renderer. Isso era inseguro. Com `contextIsolation: true` (padrao atual), cada contexto (main, renderer, preload) tem seu escopo isolado. O preload e o unico ponto onde APIs server-side sao expostas ao renderer, e apenas atraves do `contextBridge`.

O `contextBridge.exposeInMainWorld('api', api)` faz com que tudo declarado no objeto `api` fique disponivel em `window.api` no renderer.

## Por que pares importam

O erro mais comum e misturar os pares:
- `ipcMain.on` apenas ESCUTA. Nao retorna valor. Se o renderer usar `invoke` (que espera retorno), recebe "no handler registered".
- `ipcMain.handle` ESCUTA e RETORNA. Funciona com `invoke`.
- `ipcRenderer.send` ENVIA sem esperar. Funciona com `on`.
- `ipcRenderer.invoke` ENVIA e ESPERA retorno (Promise). Funciona com `handle`.

### Insight do instrutor
"Tem alguns nomezinhos que a gente nao vai decorar, porque depois a gente vai usar bibliotecas para automatizar isso." — O codigo IPC cru e como criar uma API Node sem framework. Na pratica, bibliotecas como `electron-trpc` ou `@electron-toolkit/utils` abstraem esses detalhes.

## Parametros como objeto

O instrutor enfatiza: mesmo quando ha um unico parametro, envie como objeto (`{ title }` em vez de `title`). Razao: quando voce precisa adicionar um segundo parametro no futuro, nao quebra a assinatura da funcao nem todos os call sites.

## Tipagem do window.api

O TypeScript nao sabe que `window.api` existe. Duas abordagens:
1. Arquivo `.d.ts` separado — precisa estar no `include` do tsconfig
2. `declare global` inline no preload — mais simples, funciona sem configuracao extra

O instrutor tentou a abordagem 1 e teve problemas com o tsconfig nao carregando o `.d.ts`. A solucao que funcionou foi declarar inline no proprio `preload/index.ts` com `export interface Window { api: typeof api }`.