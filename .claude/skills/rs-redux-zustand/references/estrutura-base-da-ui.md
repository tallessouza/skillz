---
name: rs-redux-zustand-estrutura-base-da-ui
description: "Applies Tailwind CSS setup with Vite and dark theme UI structure patterns when scaffolding React player interfaces. Use when user asks to 'setup tailwind with vite', 'create a player layout', 'scaffold video player UI', 'configure postcss with tailwind', or 'dark theme layout'. Enforces correct tailwindcss init -p flag, dark theme zinc scale, and semantic HTML. Make sure to use this skill whenever setting up Tailwind in a Vite project or building media player interfaces. Not for responsive design (use rs-masterizando), state management, or video playback logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: estrutura-base
  tags: [tailwind, vite, dark-theme, layout, player, postcss, react]
---

# Estrutura Base da UI — Tailwind + Vite + Player Layout

> Configure Tailwind CSS com Vite usando o flag -p obrigatorio e construa layouts com dark theme zinc scale.

## Rules

1. **`tailwindcss init -p` com Vite** — o flag `-p` cria `postcss.config.js`, porque sem ele Tailwind nao processa
2. **Content paths** — `"./src/**/*.tsx"` no tailwind.config
3. **Tags semanticas** — `header`, `main`, `aside`
4. **Zinc scale para dark theme** — 950 fundo, 900 cards, 800 bordas, 400 texto secundario, 50 texto principal
5. **Anti-alias** — `-webkit-font-smoothing: antialiased` no body

## Steps

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p  # -p OBRIGATORIO com Vite
```

## Example

**Before:** `npx tailwindcss init` (sem -p) — classes nao funcionam
**After:** `npx tailwindcss init -p` — cria tailwind.config.js E postcss.config.js

## Troubleshooting

### Tailwind classes nao aplicam no Vite
**Symptom:** Classes como `bg-zinc-950` sem efeito.
**Cause:** Faltou `postcss.config.js`.
**Fix:** Execute `npx tailwindcss init -p` e verifique que `postcss.config.js` existe na raiz.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-estrutura-base-da-ui/references/deep-explanation.md) — Por que -p, decisoes de design, font smoothing
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-estrutura-base-da-ui/references/code-examples.md) — Instalacao completa, configs, Player estatico
