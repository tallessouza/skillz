# Code Examples: Pagina Home — Layout de E-commerce

## Exemplo completo da pagina

Este e o codigo final da pagina Home conforme construido na aula:

```tsx
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
      {/* Produto destaque — 6 colunas, 6 linhas */}
      <Link
        href="/"
        className="group relative col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
      >
        <Image
          className="group-hover:scale-105 transition-transform duration-500"
          src="/moletom-ai-side.png"
          width={920}
          height={920}
          quality={100}
          alt=""
        />

        <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Moletom AI Side</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
            R$ 129
          </span>
        </div>
      </Link>

      {/* Produto menor 1 — 3 colunas, 3 linhas */}
      <Link
        href="/"
        className="group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
      >
        <Image
          className="group-hover:scale-105 transition-transform duration-500"
          src="/moletom-java.png"
          width={920}
          height={920}
          quality={100}
          alt=""
        />

        <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Moletom Java</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
            R$ 79
          </span>
        </div>
      </Link>

      {/* Produto menor 2 — 3 colunas, 3 linhas */}
      <Link
        href="/"
        className="group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
      >
        <Image
          className="group-hover:scale-105 transition-transform duration-500"
          src="/moletom-never-stop-learning.png"
          width={920}
          height={920}
          quality={100}
          alt=""
        />

        <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Moletom Never Stop Learning</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
            R$ 99
          </span>
        </div>
      </Link>
    </div>
  )
}
```

## Construcao passo a passo

### Passo 1: Grid container

```tsx
<div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
  {/* produtos aqui */}
</div>
```

Estabelece a grade 9x6 com gap de 24px e altura maxima.

### Passo 2: Link como card de produto

```tsx
<Link
  href="/"
  className="col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end"
>
  {/* conteudo */}
</Link>
```

`items-end` empurra a imagem para baixo. `overflow-hidden` impede que a imagem vaze no hover.

### Passo 3: Next Image otimizado

```tsx
<Image
  src="/moletom-ai-side.png"
  width={920}
  height={920}
  quality={100}
  alt=""
/>
```

`width`/`height` definem o tamanho de carregamento, nao o tamanho visual. `quality={100}` para e-commerce.

### Passo 4: Adicionar group hover

```tsx
{/* No Link, adicionar: */}
className="group ..."

{/* Na Image, adicionar: */}
className="group-hover:scale-105 transition-transform duration-500"
```

### Passo 5: Tag de preco (produto grande)

```tsx
{/* Adicionar relative no Link */}
className="group relative ..."

{/* Dentro do Link, apos a Image: */}
<div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
  <span className="text-sm truncate">Moletom AI Side</span>
  <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
    R$ 129
  </span>
</div>
```

### Passo 6: Tag de preco (produtos menores)

Mesma estrutura, mas com `bottom-10 right-10` em vez de `bottom-28 right-28`.

## Variacoes uteis

### Grid com 4 produtos (2+2)

```tsx
<div className="grid grid-cols-6 grid-rows-6 gap-6">
  <Link className="col-span-3 row-span-6 ...">...</Link>
  <Link className="col-span-3 row-span-3 ...">...</Link>
  <Link className="col-span-3 row-span-3 ...">...</Link>
</div>
```

### Hover com rotacao leve em vez de zoom

```tsx
<Image className="group-hover:scale-105 group-hover:rotate-1 transition-transform duration-500" ... />
```

### Tag de preco sem fundo transparente

```tsx
<div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 rounded-full bg-zinc-900 p-1 pl-5">
```