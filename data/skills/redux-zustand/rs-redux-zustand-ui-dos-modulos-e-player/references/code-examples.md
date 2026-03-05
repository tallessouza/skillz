# Code Examples: UI de Modulos e Player

## Estrutura completa do layout

```tsx
import ReactPlayer from 'react-player'
import { ChevronDown, Video } from 'lucide-react'

function Player() {
  return (
    <div className="flex h-screen">
      {/* Area do Player */}
      <div className="flex-1">
        <div className="w-full bg-zinc-950 aspect-video">
          <ReactPlayer
            width="100%"
            height="100%"
            controls
            url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
        </div>
      </div>

      {/* Sidebar de Modulos */}
      <aside className="w-80 border-l border-zinc-800 bg-zinc-900 overflow-y-scroll">
        {/* Modulo 1 */}
        <div>
          <button className="flex w-full items-center gap-3 bg-zinc-800 p-4">
            <span className="flex h-10 w-10 rounded-full items-center justify-center bg-zinc-950 text-xs">
              1
            </span>
            <div className="flex flex-col gap-1 text-left">
              <strong>Desvendando o Redux</strong>
              <span className="text-xs text-zinc-400">12 aulas</span>
            </div>
            <ChevronDown className="w-5 h-5 ml-auto text-zinc-400" />
          </button>

          <nav className="relative flex flex-col gap-4 p-6">
            <button className="flex items-center gap-3 text-sm text-zinc-400">
              <Video className="w-4 h-4 text-zinc-500" />
              <span>Fundamentos do Redux</span>
              <span className="ml-auto font-mono text-xs text-zinc-500">09:13</span>
            </button>

            <button className="flex items-center gap-3 text-sm text-zinc-400">
              <Video className="w-4 h-4 text-zinc-500" />
              <span>Configurando a store</span>
              <span className="ml-auto font-mono text-xs text-zinc-500">07:45</span>
            </button>

            <button className="flex items-center gap-3 text-sm text-zinc-400">
              <Video className="w-4 h-4 text-zinc-500" />
              <span>Reducers e Actions</span>
              <span className="ml-auto font-mono text-xs text-zinc-500">11:02</span>
            </button>
          </nav>
        </div>
      </aside>
    </div>
  )
}
```

## Badge circular do numero do modulo

```tsx
{/* Padrao: circulo com numero centralizado */}
<span className="flex h-10 w-10 rounded-full items-center justify-center bg-zinc-950 text-xs">
  {moduleIndex + 1}
</span>
```

Breakdown das classes:
- `flex items-center justify-center` — centraliza o numero
- `h-10 w-10` — 40x40px (quadrado)
- `rounded-full` — transforma em circulo
- `bg-zinc-950` — fundo escuro
- `text-xs` — texto pequeno para caber no circulo

## Item de aula com duracao alinhada

```tsx
<button className="flex items-center gap-3 text-sm text-zinc-400">
  <Video className="w-4 h-4 text-zinc-500" />
  <span>Titulo da Aula</span>
  <span className="ml-auto font-mono text-xs text-zinc-500">09:13</span>
</button>
```

O `ml-auto` no span de duracao empurra ele para a direita. O `font-mono` garante que `09:13` e `11:02` ocupem a mesma largura visual.

## Container de video responsivo

```tsx
{/* Container controla aspect ratio, player preenche */}
<div className="w-full bg-zinc-950 aspect-video">
  <ReactPlayer
    width="100%"
    height="100%"
    controls
    url={currentVideoUrl}
  />
</div>
```

Sem `aspect-video`, o container colapsaria a altura zero (nao tem conteudo intrinseco). Com a classe, Tailwind aplica `aspect-ratio: 16/9` e o container se dimensiona proporcionalmente a largura.

## Instalacao do ReactPlayer

```bash
npm install react-player
```

Import:
```tsx
import ReactPlayer from 'react-player'
```

O ReactPlayer aceita URLs de YouTube, Vimeo, SoundCloud, Twitch, e outros providers automaticamente.