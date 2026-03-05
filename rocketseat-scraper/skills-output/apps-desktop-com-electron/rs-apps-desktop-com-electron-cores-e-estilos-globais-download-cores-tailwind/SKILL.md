---
name: rs-electron-cores-estilos-globais
description: "Applies global color and style configuration for Electron desktop apps with Tailwind CSS. Use when user asks to 'setup colors', 'configure Tailwind theme', 'fix white flash on resize', 'add color palette', or 'configure Electron background'. Ensures custom color palettes are added to Tailwind extend, global background/text applied via wrapper div, and native window backgroundColor set to prevent flash. Make sure to use this skill whenever setting up an Electron app's visual foundation. Not for component-level styling, animations, or CSS-in-JS solutions."
---

# Cores e Estilos Globais — Electron + Tailwind

> Configure a paleta de cores no Tailwind, aplique fundo/texto globais via wrapper div, e sincronize a cor de fundo da janela nativa do Electron para eliminar flash branco.

## Rules

1. **Cores customizadas vao em `theme.extend.colors`** — nunca sobrescreva o objeto `colors` raiz, porque isso remove as cores padrao do Tailwind
2. **Use wrapper div para fundo global** — `h-screen w-screen bg-{cor}-900 text-{cor}-100`, porque aplicar no `body` ou `:root` nao funciona bem com Tailwind e causa problemas de especificidade
3. **Sincronize `backgroundColor` no BrowserWindow** — copie o hexadecimal exato da cor de fundo do Tailwind para `backgroundColor` em `new BrowserWindow()`, porque a janela nativa do Electron tem fundo branco por padrao e causa flash branco ao redimensionar
4. **Gere paletas completas (50-900)** — use ferramentas como Foundation Color Generator no Figma para gerar tons consistentes, porque tons manuais ficam inconsistentes

## How to write

### tailwind.config.js — Paleta customizada

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        rotion: {
          50: '#eef0ff',
          100: '#e0e4ff',
          // ... tons intermediarios
          800: '#2b2d5e',
          900: '#171823',
        },
      },
    },
  },
}
```

### App wrapper — Fundo e texto globais

```tsx
function App() {
  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100">
      {/* conteudo da aplicacao */}
    </div>
  )
}
```

### main/index.ts — Background do BrowserWindow

```typescript
const mainWindow = new BrowserWindow({
  backgroundColor: '#171823', // mesmo hex do bg-rotion-900
  // ... outras opcoes
})
```

## Example

**Before (flash branco ao redimensionar):**
```typescript
// main/index.ts
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  // sem backgroundColor definido → fundo branco nativo
})
```
```tsx
// App.tsx — sem wrapper, cor no body via CSS
export function App() {
  return <p>Hello</p>
}
```

**After (sem flash, cores consistentes):**
```typescript
// main/index.ts
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  backgroundColor: '#171823',
})
```
```tsx
// App.tsx — wrapper com Tailwind
export function App() {
  return (
    <div className="h-screen w-screen bg-rotion-900 text-rotion-100">
      <p>Hello</p>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App Electron com Tailwind | Sempre defina `backgroundColor` no BrowserWindow igual ao bg principal |
| Paleta de cores do designer | Coloque em `theme.extend.colors` com nome semantico |
| Fundo escuro global | Use wrapper div com `h-screen w-screen`, nao CSS no body |
| Flash branco ao resize | Copie o hex exato para `backgroundColor` do BrowserWindow |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `theme: { colors: { ... } }` (sobrescreve tudo) | `theme: { extend: { colors: { ... } } }` |
| Cor de fundo no `body` via CSS global | Wrapper div com classes Tailwind |
| Ignorar `backgroundColor` no BrowserWindow | Sempre setar com o hex da cor de fundo principal |
| Tons de cor inventados manualmente | Gerar via Foundation Color Generator ou similar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
