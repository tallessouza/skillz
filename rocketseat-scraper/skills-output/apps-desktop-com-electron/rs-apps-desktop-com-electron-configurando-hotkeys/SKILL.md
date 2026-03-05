---
name: rs-electron-configurando-hotkeys
description: "Applies Electron global shortcut patterns when writing desktop app hotkey/shortcut code. Use when user asks to 'add a hotkey', 'register shortcut', 'keyboard shortcut in Electron', 'global shortcut', or 'keybinding in desktop app'. Enforces CommandOrControl for cross-OS compatibility, window-scoped registration via focus/blur events, and proper shortcut cleanup. Make sure to use this skill whenever implementing keyboard shortcuts in Electron apps. Not for React-only hotkeys, browser keyboard events, or menu accelerators."
---

# Configurando Hotkeys no Electron

> Registre shortcuts globais com `globalShortcut.register`, mas controle o escopo via eventos de foco para evitar capturar teclas quando a app nao esta ativa.

## Rules

1. **Sempre use `CommandOrControl`** — nunca `Control` ou `Command` isolado, porque `CommandOrControl` escolhe automaticamente entre Command (Mac) e Control (Windows/Linux), garantindo compatibilidade cross-OS
2. **Registre no foco, desregistre no blur** — shortcuts globais capturam teclas em QUALQUER app do sistema; registrar apenas quando a janela tem foco evita conflitos com outros programas
3. **Separe shortcuts em arquivo dedicado** — crie `src/main/shortcuts.ts` com funcao `createShortcuts(window)`, porque shortcuts precisam comunicar com a janela principal via `webContents.send`
4. **Use `globalShortcut.unregisterAll()` no blur** — limpa todas as hotkeys de uma vez quando a janela perde foco
5. **Shortcuts do main process quando precisam do main** — se a hotkey precisa acessar APIs do processo main (filesystem, tray, etc), registre via `globalShortcut`; se e puramente UI, considere libs React como `react-hotkeys-hook`

## How to write

### Arquivo de shortcuts

```typescript
// src/main/shortcuts.ts
import { app, globalShortcut, BrowserWindow } from 'electron'

export function createShortcuts(window: BrowserWindow) {
  app.on('browser-window-focus', () => {
    globalShortcut.register('CommandOrControl+N', () => {
      window.webContents.send('new-document')
    })
  })

  app.on('browser-window-blur', () => {
    globalShortcut.unregisterAll()
  })
}
```

### Registro no main/index

```typescript
import { createShortcuts } from './shortcuts'

// Apos criar a mainWindow:
createShortcuts(mainWindow)
```

## Example

**Before (shortcut global sem controle de escopo):**
```typescript
globalShortcut.register('CommandOrControl+N', () => {
  mainWindow.webContents.send('new-document')
})
// Problema: Command+N dispara mesmo quando outra app esta focada
```

**After (shortcut com escopo de foco):**
```typescript
app.on('browser-window-focus', () => {
  globalShortcut.register('CommandOrControl+N', () => {
    mainWindow.webContents.send('new-document')
  })
})

app.on('browser-window-blur', () => {
  globalShortcut.unregisterAll()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Hotkey precisa acessar APIs do main process | Use `globalShortcut` com foco/blur |
| Hotkey e puramente de UI (toggle sidebar, etc) | Considere `react-hotkeys-hook` no renderer |
| Multiplas hotkeys com modificadores | `CommandOrControl+Shift+N` — sempre CommandOrControl primeiro |
| App tem tray e roda em background | Cuidado: blur pode nao disparar se janela foi escondida vs minimizada |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `globalShortcut.register('Control+N', ...)` | `globalShortcut.register('CommandOrControl+N', ...)` |
| Registrar shortcut global sem controle de foco | Registrar no `browser-window-focus`, limpar no `blur` |
| Shortcuts inline no `main/index.ts` | Arquivo separado `shortcuts.ts` com `createShortcuts(window)` |
| `globalShortcut.unregister('CommandOrControl+N')` uma a uma | `globalShortcut.unregisterAll()` no blur |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
