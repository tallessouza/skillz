---
name: rs-redux-zustand-ui-dos-modulos-e-player
description: "Generates module list and video player UI components using Tailwind CSS and ReactPlayer in React. Use when user asks to 'create a course player', 'build module accordion UI', 'video player layout with sidebar', 'lesson list interface', or 'embed video with aspect ratio'. Applies collapsible module pattern, responsive video embed using aspect-video, and ml-auto alignment. Make sure to use this skill whenever building educational platform interfaces or video player layouts. Not for state management (use criando-store-do-redux), API integration, or backend logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: ui-modulos-player
  tags: [react-player, tailwind, aspect-video, sidebar, accordion, ui]
---

# UI de Modulos e Player

> Construir interfaces de player de curso com sidebar de modulos e video responsivo usando aspect-video.

## Rules

1. **aspect-video para o player** — mantem ratio 16:9 automaticamente
2. **ReactPlayer com width/height 100%** — preenche o container pai
3. **ml-auto para alinhar a direita** — em flex, empurra elemento para o final
4. **font-mono para duracoes** — alinhamento uniforme de numeros

## How to write

```tsx
<div className="w-full bg-zinc-950 aspect-video">
  <ReactPlayer width="100%" height="100%" controls url={videoUrl} />
</div>
```

## Example

**Before:** `<div><video src="video.mp4" /></div>`
**After:** Container com `aspect-video` + ReactPlayer 100%/100% + sidebar `w-80`

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `<iframe>` direto para YouTube | `ReactPlayer` |
| Player sem aspect ratio | Container com `aspect-video` |

## Troubleshooting

### Video distorcido
**Symptom:** Video esticado ou comprimido.
**Cause:** Container sem aspect ratio.
**Fix:** Adicione `aspect-video` ao container pai do ReactPlayer.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-ui-dos-modulos-e-player/references/deep-explanation.md) — aspect-video no container, evolucao sidebar, ml-auto, ReactPlayer
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-ui-dos-modulos-e-player/references/code-examples.md) — Layout completo, badge circular, item de aula
