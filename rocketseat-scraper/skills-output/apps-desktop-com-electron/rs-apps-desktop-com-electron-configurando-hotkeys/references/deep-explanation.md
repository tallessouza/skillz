# Deep Explanation: Configurando Hotkeys no Electron

## Por que GlobalShortcut e "global" de verdade

O instrutor Diego demonstra ao vivo o problema central: ao registrar `globalShortcut.register('CommandOrControl+N', ...)`, a hotkey captura a tecla **em qualquer aplicacao do sistema operacional**. Ele mostra isso alternando para o Finder no Mac e pressionando Command+N — o Electron intercepta a tecla e cria um documento, mesmo com o Finder em foco.

Isso acontece porque `globalShortcut` registra a hotkey no nivel do sistema operacional, nao no nivel da aplicacao. E um atalho de teclado do OS, nao da janela.

## A solucao: escopo via eventos de foco

A abordagem do Diego e elegante na simplicidade:

1. **`browser-window-focus`** — quando qualquer janela da app ganha foco, registra as shortcuts
2. **`browser-window-blur`** — quando perde foco, desregistra tudo com `unregisterAll()`

Isso cria um "escopo virtual" — as shortcuts so existem enquanto a app esta ativa.

## CommandOrControl: a convencao cross-OS

Diego enfatiza: **sempre use `CommandOrControl`**, nunca `Control` ou `Command` isolado. A razao e simples:
- Usuarios Mac usam Command como modificador principal
- Usuarios Windows/Linux usam Control
- `CommandOrControl` resolve automaticamente para o correto baseado no OS

Isso e uma convencao do Electron, nao do Node.js ou do Chromium.

## Quando usar globalShortcut vs React hotkeys

Diego menciona uma alternativa: usar libs React como `react-hotkeys-hook` para hotkeys puramente de UI. A regra de decisao:

- **Se a hotkey precisa acessar o processo main** (filesystem, tray, dialogs nativos, etc) → `globalShortcut` no main process
- **Se a hotkey e puramente de interface** (toggle sidebar, navegar entre tabs, etc) → lib React no renderer

A vantagem do main process e que voce ja tem acesso a todas as APIs nativas. A vantagem do renderer e que nao precisa do IPC e o escopo ja e naturalmente limitado a janela.

## Padrao de organizacao: arquivo separado

Diego segue o mesmo padrao usado para o tray: criar um arquivo dedicado (`shortcuts.ts`) que exporta uma funcao `createShortcuts(window)`. Isso:
- Mantem o `main/index.ts` limpo
- Agrupa toda logica de shortcuts em um lugar
- Recebe a `BrowserWindow` como dependencia para comunicar via `webContents.send`

## Comunicacao shortcut → renderer

O fluxo completo:
1. Usuario pressiona `CommandOrControl+N`
2. `globalShortcut` callback dispara no main process
3. `window.webContents.send('new-document')` envia evento IPC para o renderer
4. Renderer escuta com `ipcRenderer.on('new-document', ...)` e reage

E o mesmo padrao de comunicacao usado no tray menu — consistencia arquitetural.