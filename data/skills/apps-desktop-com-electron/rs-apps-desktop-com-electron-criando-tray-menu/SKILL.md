---
name: rs-electron-criando-tray-menu
description: "Applies Electron tray menu creation patterns when building desktop apps with system tray icons. Use when user asks to 'create a tray menu', 'add system tray icon', 'build tray', 'electron tray', or 'notification area icon'. Covers icon setup (Template naming, adaptive colors, 1x/2x/3x sizes), menu items (labels, separators, checkboxes, enabled state), and NativeImage usage. Make sure to use this skill whenever generating Electron tray-related code. Not for browser window menus, application menus, or context menus inside renderer."
---

# Criando Tray Menu no Electron

> Crie tray menus com icones adaptativos e itens estruturados, separando a logica do tray em arquivo dedicado.

## Rules

1. **Separe o tray em arquivo proprio** — crie `tray.ts` e importe no main, porque mantem o main limpo e o tray isolado
2. **Crie o tray somente apos app.whenReady()** — o tray nao pode ser instanciado antes do app estar pronto, causa crash silencioso
3. **Icone obrigatorio no construtor do Tray** — passe o path da imagem como primeiro parametro, Electron exige icone para exibir o tray
4. **Nomeie icones com sufixo Template (T maiusculo)** — `RotionTemplate.png`, porque o Electron adapta automaticamente a cor (branco em temas escuros, preto em temas claros)
5. **Icone deve ser preto com fundo transparente** — essa e a regra para icones adaptativos no Electron, a cor final e calculada pelo sistema
6. **Exporte 3 tamanhos: 1x (16px), 2x (32px), 3x (48px)** — garante nitidez em diferentes densidades de tela (retina/hidpi)
7. **Use Menu.buildFromTemplate() para itens** — cada posicao do array e um item com label, type, enabled e outras propriedades

## How to write

### Estrutura basica do tray

```typescript
// tray.ts — arquivo dedicado
import { app, Tray, Menu } from 'electron'
import path from 'node:path'

app.whenReady().then(() => {
  const tray = new Tray(path.resolve(__dirname, 'RotionTemplate.png'))

  const menu = Menu.buildFromTemplate([
    { label: 'Meu App' },
    { type: 'separator' },
    { label: 'Item desabilitado', enabled: false },
    { label: 'Modo dark', type: 'checkbox' },
  ])

  tray.setContextMenu(menu)
})
```

### Importar no main

```typescript
// main.ts
import './tray'
```

### Icones — convencao de nomes

```
resources/
├── RotionTemplate.png      # 16px (1x)
├── RotionTemplate@2x.png   # 32px (2x)
└── RotionTemplate@3x.png   # 48px (3x)
```

## Example

**Before (erro comum — sem icone):**
```typescript
const tray = new Tray('')  // funciona mas sem icone visivel
```

**After (com icone adaptativo):**
```typescript
const tray = new Tray(path.resolve(__dirname, 'RotionTemplate.png'))
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de icone no system tray | Crie arquivo `tray.ts` separado, importe no main |
| Icone nao aparece ou cor errada | Verifique: nome termina com `Template` (T maiusculo), imagem preta com fundo transparente |
| Item do menu precisa ficar inativo | Use `enabled: false` no item |
| Precisa de linha divisoria | Use `{ type: 'separator' }` sem label |
| Precisa de toggle on/off | Use `{ type: 'checkbox', label: '...' }` |
| Path do icone nao resolve | Use `path.resolve(__dirname, 'NomeTemplate.png')` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new Tray()` sem argumento | `new Tray(path.resolve(__dirname, 'IconTemplate.png'))` |
| Criar tray fora de `app.whenReady()` | Sempre dentro de `app.whenReady().then(...)` |
| Icone nomeado `icon.png` | Icone nomeado `AppNameTemplate.png` |
| Icone colorido para tray | Icone preto com fundo transparente |
| Exportar apenas 1 tamanho | Exportar 1x (16px), 2x (32px), 3x (48px) |
| Codigo do tray direto no main.ts | Arquivo `tray.ts` separado, importado no main |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
