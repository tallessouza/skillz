---
name: rs-redux-zustand-configurando-autoplay
description: "Applies automatic lesson progression patterns when building video players with Redux/Zustand state. Use when user asks to 'implement autoplay', 'play next video automatically', 'auto advance playlist', 'next lesson logic', or 'sequential content navigation'. Enforces boundary-safe reducer logic for navigating modules and lessons. Make sure to use this skill whenever implementing playlist progression or sequential content navigation in React. Not for video encoding, streaming infrastructure, or media upload features."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: redux-zustand
  module: configurando-autoplay
  tags: [autoplay, playlist, next-video, boundary-check, reducer, ReactPlayer]
---

# Configurando Autoplay com Redux

> Trate todas as fronteiras de navegacao (proxima aula, proximo modulo, fim do curso) dentro do reducer.

## Rules

1. **Action `next` sem payload** — o reducer ja conhece currentModuleIndex e currentLessonIndex
2. **Verifique existencia antes de avancar** — acesso a indice inexistente retorna undefined
3. **Trate fronteira de modulo** — sem proxima lesson, verifique proximo modulo e resete lessonIndex
4. **`playing={true}` no ReactPlayer** — sem isso o video nao inicia automaticamente
5. **`onEnded` dispara o next** — ReactPlayer chama quando video termina

## How to write

```typescript
next: (state) => {
  const nextLessonIndex = state.currentLessonIndex + 1
  const nextLesson = state.course.modules[state.currentModuleIndex].lessons[nextLessonIndex]
  if (nextLesson) {
    state.currentLessonIndex = nextLessonIndex
  } else {
    const nextModuleIndex = state.currentModuleIndex + 1
    const nextModule = state.course.modules[nextModuleIndex]
    if (nextModule) {
      state.currentModuleIndex = nextModuleIndex
      state.currentLessonIndex = 0
    }
  }
},
```

## Example

**Before:** `state.currentLessonIndex += 1` — quebra no fim do modulo
**After:** Verifica existencia da lesson, depois do modulo, depois nao faz nada (fim)

## Heuristics

| Situation | Do |
|-----------|-----|
| Proxima lesson existe | Incrementa currentLessonIndex |
| Ultima lesson do modulo | Incrementa currentModuleIndex, reseta lessonIndex = 0 |
| Ultima lesson do ultimo modulo | Nao faz nada (fim do curso) |

## Troubleshooting

### Video nao inicia automaticamente apos navegacao
**Symptom:** URL muda mas video nao comeca.
**Cause:** Faltou `playing={true}` no ReactPlayer.
**Fix:** Adicione `<ReactPlayer playing={true} onEnded={handlePlayNext} />`.

## Deep reference library

- [deep-explanation.md](../../../data/skills/redux-zustand/rs-redux-zustand-configurando-autoplay/references/deep-explanation.md) — Next sem payload, logica de fronteira, PayloadAction, defaultOpen
- [code-examples.md](../../../data/skills/redux-zustand/rs-redux-zustand-configurando-autoplay/references/code-examples.md) — Slice com play e next, Video completo, Module com defaultOpen
