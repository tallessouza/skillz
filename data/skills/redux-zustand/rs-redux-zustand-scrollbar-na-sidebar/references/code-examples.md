# Code Examples: Scrollbar na Sidebar

## Instalacao do tailwind-scrollbar

```bash
npm install tailwind-scrollbar
```

## Configuracao no tailwind.config.js

```js
module.exports = {
  // ... outras configs
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
```

## Estrutura HTML/JSX completa

### Container principal com position relative

```tsx
<main className="relative flex pr-80">
```

- `relative` — referencia para o position absolute da sidebar
- `flex` — layout flexbox para o player
- `pr-80` — compensa o espaco da sidebar (mesmo valor de w-80)

### Sidebar com position absolute e scrollbar

```tsx
<aside className="absolute top-0 bottom-0 right-0 w-80 overflow-y-auto
  scrollbar scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">
```

- `absolute top-0 bottom-0 right-0` — prende a sidebar nas bordas do container pai
- `w-80` — largura fixa da sidebar
- `overflow-y-auto` — habilita scroll vertical quando conteudo transborda
- `scrollbar` — ativa estilizacao customizada
- `scrollbar-thin` — scrollbar fina
- `scrollbar-track-zinc-950` — fundo da scrollbar (quase preto)
- `scrollbar-thumb-zinc-800` — parte movel (cinza escuro)

### Separacao entre modulos

```tsx
<div className="divide-y-2 divide-zinc-900">
  {/* Modulo 1 */}
  <div>{/* conteudo do modulo */}</div>
  
  {/* Modulo 2 */}
  <div>{/* conteudo do modulo */}</div>
  
  {/* Modulo 3 */}
  <div>{/* conteudo do modulo */}</div>
</div>
```

- `divide-y-2` — borda horizontal de 2px entre filhos
- `divide-zinc-900` — cor da borda separadora

## Variacao: cores de scrollbar para temas diferentes

```tsx
{/* Tema escuro (usado na aula) */}
<aside className="scrollbar scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">

{/* Tema claro */}
<aside className="scrollbar scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">

{/* Tema com cor de destaque */}
<aside className="scrollbar scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-emerald-600">
```

## Fluxo completo: antes e depois

### Antes (problema)

```tsx
// sidebar cresce infinitamente — scroll nao funciona
<main className="flex">
  <div className="flex-1">
    <video />  {/* player */}
  </div>
  <aside className="w-80 overflow-y-auto">
    <div>Modulo 1 com muitas aulas...</div>
    <div>Modulo 2 com muitas aulas...</div>
    <div>Modulo 3 com muitas aulas...</div>
  </aside>
</main>
```

### Depois (solucao)

```tsx
<main className="relative flex pr-80">
  <div className="flex-1">
    <video />  {/* player */}
  </div>
  <aside className="absolute top-0 bottom-0 right-0 w-80 overflow-y-auto
    scrollbar scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">
    <div className="divide-y-2 divide-zinc-900">
      <div>Modulo 1 com muitas aulas...</div>
      <div>Modulo 2 com muitas aulas...</div>
      <div>Modulo 3 com muitas aulas...</div>
    </div>
  </aside>
</main>
```