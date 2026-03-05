---
name: rs-electron-esqueleto-app
description: "Applies Electron app skeleton patterns when building desktop applications with Electron, React, and Tailwind. Use when user asks to 'create an Electron app', 'setup desktop layout', 'configure macOS title bar', 'drag window', 'traffic lights position', or 'custom Tailwind utility'. Covers titleBarStyle, trafficLightPosition, WebKit App Region drag/no-drag, process.platform exposure via Vite define, and overflow control for fullscreen apps. Make sure to use this skill whenever setting up Electron window chrome or implementing window dragging. Not for web-only apps, mobile apps, or general React component styling."
---

# Esqueleto de Aplicacao Electron

> Configure a janela do Electron para macOS (title bar, traffic lights, drag) e estruture o layout com componentes React e Tailwind.

## Rules

1. **Use `titleBarStyle: 'hiddenInset'` no macOS** — esconde a title bar nativa mas mantem os traffic lights dentro da janela, porque permite UI customizada sem perder os controles do sistema
2. **Customize `trafficLightPosition`** — defina `{ x: 20, y: 20 }` para centralizar os botoes com a sidebar/header, porque a posicao padrao fica desalinhada com layouts customizados
3. **Exponha `process.platform` via Vite `define`** — use `JSON.stringify(process.platform)` no vite.config, porque `process` nao existe no renderer (browser)
4. **Use `overflow: hidden` no HTML de apps fullscreen** — controle barras de rolagem pontualmente em cada secao (sidebar, conteudo, TOC), porque apps desktop ocupam tela inteira e precisam de scroll controlado
5. **Crie Tailwind utilities para drag** — `region-drag` e `region-no-drag` via plugin `addUtilities`, porque escrever CSS puro no Tailwind nao e recomendado
6. **Aplique `region-no-drag` em elementos interativos** — textos, botoes e links dentro de areas draggable precisam de no-drag, porque senao o usuario arrasta a janela ao inves de interagir

## How to write

### BrowserWindow config (macOS)

```typescript
const mainWindow = new BrowserWindow({
  titleBarStyle: 'hiddenInset',
  trafficLightPosition: { x: 20, y: 20 },
  // ...outras opcoes
})
```

### Expor process.platform no Vite

```typescript
// vite.config.ts (renderer)
export default defineConfig({
  define: {
    'process.platform': JSON.stringify(process.platform),
  },
})
```

### Tailwind plugin para window drag

```typescript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.region-drag': {
          '-webkit-app-region': 'drag',
        },
        '.region-no-drag': {
          '-webkit-app-region': 'no-drag',
        },
      })
    }),
  ],
}
```

### Layout fullscreen com scroll controlado

```css
/* global.css */
html {
  overflow: hidden;
}
```

```tsx
<div className="flex h-screen">
  <Sidebar /> {/* scroll interno proprio */}
  <div className="flex-1 flex flex-col max-h-screen">
    <Header className="region-drag" />
    <main className="flex-1 overflow-auto">
      {/* conteudo com scroll */}
    </main>
  </div>
</div>
```

## Example

**Before (janela sem drag, title bar nativa):**
```typescript
const mainWindow = new BrowserWindow({
  width: 1120,
  height: 700,
})
// Usuario nao consegue arrastar a janela com header customizado
// Title bar nativa ocupa espaco visual
```

**After (com esta skill aplicada):**
```typescript
const mainWindow = new BrowserWindow({
  width: 1120,
  height: 700,
  titleBarStyle: 'hiddenInset',
  trafficLightPosition: { x: 20, y: 20 },
})
// Header com region-drag permite arrastar
// Textos com region-no-drag permitem selecao
// Traffic lights posicionados alinhados com sidebar
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App Electron para macOS | `titleBarStyle: 'hiddenInset'` + `trafficLightPosition` |
| Precisa de drag na janela | Crie utilities Tailwind `region-drag` / `region-no-drag` |
| Elemento interativo dentro de area drag | Adicione `region-no-drag` |
| Precisa de `process.platform` no frontend | Use `define` no vite.config com `JSON.stringify` |
| App fullscreen com multiplas secoes | `overflow: hidden` no HTML, scroll por secao |
| Muitas variaveis do backend no frontend | Use preload bridge (nao define) — abordado em aula futura |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `titleBarStyle: 'hidden'` (sem traffic lights) | `titleBarStyle: 'hiddenInset'` (mantem traffic lights) |
| CSS puro para `-webkit-app-region` | Plugin Tailwind com `addUtilities` |
| `process.platform` direto no renderer | `define: { 'process.platform': JSON.stringify(process.platform) }` |
| Drag em toda a area sem no-drag nos filhos | `region-drag` no container + `region-no-drag` nos interativos |
| Scroll no body inteiro | `overflow: hidden` no HTML + scroll pontual por secao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
