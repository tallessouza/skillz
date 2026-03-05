---
name: rs-redux-zustand-ui-modulos-player
description: "Generates module list and video player UI components using Tailwind CSS and ReactPlayer in React applications. Use when user asks to 'create a course player', 'build module accordion', 'video player layout', 'lesson list UI', or 'course interface with sidebar'. Applies collapsible module pattern with lesson lists and responsive video embed. Make sure to use this skill whenever building educational platform interfaces or video player layouts with sidebars. Not for state management, API integration, or backend logic."
---

# UI de Modulos e Player

> Construir interfaces de player de curso com sidebar de modulos collapsiveis e player de video responsivo usando Tailwind CSS e ReactPlayer.

## Rules

1. **Use aspect-video para o player** — `aspect-video` mantem o ratio 16:9 automaticamente ao redimensionar, porque evita distorcao do video em qualquer resolucao
2. **Modulos sao acordeoes** — cada modulo e um botao clicavel que expande/colapsa a lista de aulas, porque facilita navegacao em cursos com muitos modulos
3. **Sidebar sem altura fixa** — a altura da sidebar e definida pelo conteudo do player, porque altura fixa causa overflow ou espaco vazio
4. **ReactPlayer com width/height 100%** — preenche o container pai que controla o aspect ratio, porque separar dimensionamento do player do container permite responsividade
5. **ml-auto para alinhar elementos a direita** — use `ml-auto` em icones e duracoes para empurrar ao final do flex container, porque e mais flexivel que justify-between

## How to write

### Container do Player

```tsx
<div className="w-full bg-zinc-950 aspect-video">
  <ReactPlayer
    width="100%"
    height="100%"
    controls
    url="https://www.youtube.com/watch?v=VIDEO_ID"
  />
</div>
```

### Modulo (Acordeao)

```tsx
<div>
  <button className="flex w-full items-center gap-3 bg-zinc-800 p-4">
    <span className="flex h-10 w-10 rounded-full items-center justify-center bg-zinc-950 text-xs">
      1
    </span>
    <div className="flex flex-col gap-1 text-left">
      <strong>Nome do Modulo</strong>
      <span className="text-xs text-zinc-400">12 aulas</span>
    </div>
    <ChevronDown className="w-5 h-5 ml-auto text-zinc-400" />
  </button>

  <nav className="relative flex flex-col gap-4 p-6">
    {/* Aulas aqui */}
  </nav>
</div>
```

### Item de Aula

```tsx
<button className="flex items-center gap-3 text-sm text-zinc-400">
  <Video className="w-4 h-4 text-zinc-500" />
  <span>Fundamentos do Redux</span>
  <span className="ml-auto font-mono text-xs text-zinc-500">09:13</span>
</button>
```

## Example

**Before (sem estrutura):**
```tsx
<div>
  <video src="video.mp4" />
  <ul>
    <li>Aula 1</li>
    <li>Aula 2</li>
  </ul>
</div>
```

**After (com este skill):**
```tsx
<div className="flex">
  <div className="flex-1">
    <div className="w-full bg-zinc-950 aspect-video">
      <ReactPlayer width="100%" height="100%" controls url={videoUrl} />
    </div>
  </div>
  <aside className="w-80 border-l border-zinc-800 bg-zinc-900 overflow-y-scroll">
    {/* Modulos com acordeao + lista de aulas */}
  </aside>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Video de fonte externa (YouTube, Vimeo) | Use ReactPlayer com controls |
| Lista de itens com info na direita | `ml-auto` no ultimo elemento do flex |
| Numero circular (badge) | `flex h-10 w-10 rounded-full items-center justify-center` |
| Sidebar com scroll independente | `overflow-y-scroll` na aside, sem altura fixa |
| Duracao de video/aula | `font-mono text-xs` para alinhamento uniforme |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Altura fixa na sidebar (`h-[600px]`) | Sidebar segue altura do player |
| `<iframe>` direto para YouTube | `ReactPlayer` com width/height 100% |
| `justify-between` para 1 elemento na direita | `ml-auto` no elemento |
| Texto de duracao sem font-mono | `font-mono` para alinhamento numerico |
| Player sem aspect ratio | Container com `aspect-video` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
