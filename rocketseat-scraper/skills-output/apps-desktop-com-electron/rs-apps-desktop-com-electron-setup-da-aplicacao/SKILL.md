---
name: rs-electron-setup-da-aplicacao
description: "Guides Electron application setup using Electron Vite with React and TypeScript. Use when user asks to 'create an Electron app', 'setup desktop application', 'start Electron project', 'configure Electron Vite', or 'scaffold desktop app'. Covers project scaffolding, main/renderer/preload process structure, development workflow, and build configuration. Make sure to use this skill whenever setting up a new Electron project or explaining Electron architecture. Not for Electron IPC communication, packaging/distribution, or auto-update implementation."
---

# Setup de Aplicacao Electron com Electron Vite

> Ao criar uma aplicacao Electron, use o Electron Vite como base para ter TypeScript, React e Hot Reloading prontos desde o inicio.

## Rules

1. **Use Electron Vite como template base** — `npm create @quick-start/electron`, porque o template padrao do Electron vem sem TypeScript, sem bundler e sem framework
2. **Respeite os 3 processos** — `main` (backend/Node), `renderer` (frontend/React), `preload` (ponte de comunicacao), porque cada um tem escopo e permissoes diferentes
3. **Use named exports nos componentes React** — `export function App()` nao `export default function App()`, porque facilita refactoring e busca no codebase
4. **Adicione --watch ao script dev** — `electron-vite dev --watch`, porque sem isso mudancas no processo main nao recarregam automaticamente
5. **Build por plataforma requer a plataforma nativa** — nao tente fazer build de Mac no Windows ou vice-versa, porque depende de bibliotecas nativas do SO
6. **Use CI para builds multiplataforma** — GitHub Actions, CircleCI ou similares, porque so la voce tem acesso a todos os SOs

## How to write

### Scaffolding do projeto

```bash
npm create @quick-start/electron@latest my-app
# Selecione: React, TypeScript
# Electron Updater: nao (requer certificado digital pago)
cd my-app && npm install
npm run dev
```

### Estrutura de pastas

```
src/
├── main/           # Processo main (Node.js, cria janelas)
│   └── index.ts
├── renderer/       # Processo renderer (React, interface visual)
│   ├── index.html
│   └── src/
│       └── App.tsx
└── preload/        # Ponte entre main e renderer
    └── index.ts
```

### Processo main basico

```typescript
import { app, BrowserWindow } from 'electron'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  mainWindow.on('ready-to-show', () => mainWindow.show())

  // Dev: carrega localhost / Prod: carrega arquivo HTML
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(createWindow)

// Mac: recria janela ao clicar no dock quando nenhuma janela aberta
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Windows/Linux: fecha app quando todas as janelas fecham
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```

### Componente React limpo

```typescript
// src/renderer/src/App.tsx
export function App() {
  return <h1>Hello World</h1>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro projeto Electron | Use Electron Vite (menos opiniao, mais aprendizado) |
| Segundo+ projeto Electron | Considere Electron App (mais opiniao, mais produtividade) |
| Precisa de auto-update | Electron Updater requer certificado digital pago (anual, por plataforma) |
| Sem certificado digital | Verifique versao via API do GitHub e redirecione usuario para download |
| Build para multiplas plataformas | Use GitHub Actions, nao tente build cross-platform local |
| Mudancas no main nao refletem | Adicione `--watch` ao script dev no package.json |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Configurar React/Vite do zero no Electron | Use `npm create @quick-start/electron` |
| Build de Mac no Windows | Use CI com runners nativos |
| `export default function App()` | `export function App()` |
| `mainWindow.loadURL(url)` sem checar ambiente | Verifique `process.env.ELECTRON_RENDERER_URL` para dev vs prod |
| Ignorar comportamento por plataforma (Mac vs Win) | Trate `window-all-closed` e `activate` separadamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
