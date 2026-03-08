---
name: rs-nextjs-app-router-testes-pagina-home
description: "Applies Next.js e-commerce homepage layout patterns using CSS Grid, Next Image optimization, and Tailwind group-hover effects. Use when user asks to 'create a product grid', 'build an e-commerce homepage', 'layout products with grid', 'add hover zoom effect', or 'position price tags on product cards'. Make sure to use this skill whenever building product listing pages with Next.js and Tailwind. Not for API routes, data fetching, checkout flows, or backend logic."

metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, homepage, css-grid, next-image, tailwind, group-hover, e-commerce]
---

# Pagina Home — Layout de E-commerce com Next.js

> Construa layouts de produto usando CSS Grid com colunas assimétricas, Next Image otimizado, e efeitos hover via group do Tailwind.

## Rules

1. **Use grid com colunas assimétricas** — `grid-cols-9` com spans diferentes (6+3), porque permite produto destaque maior ao lado de produtos menores sem media queries complexas
2. **Limite a altura maxima do grid** — `max-h-[860px]`, porque layouts fullscreen sao dificeis de controlar em telas muito grandes
3. **Use Next Image com qualidade 100 para e-commerce** — `quality={100}`, porque a qualidade padrao (80) degrada imagens de produto visivelmente em tamanhos grandes
4. **Use group + group-hover para efeitos no filho** — coloque `group` no link pai e `group-hover:scale-105` na imagem, porque permite estilizar filhos com base no estado do pai
5. **Posicione precos com absolute dentro de relative** — o link pai recebe `relative`, a div de preco recebe `absolute`, porque permite sobrepor o preco na imagem sem quebrar o layout
6. **Use truncate em nomes de produto** — `truncate` com `max-w-[280px]`, porque nomes longos nao devem estourar o container de preco

## How to write

### Grid de produtos assimetrico

```tsx
<div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
  {/* Produto destaque: 6 colunas, 6 linhas */}
  <Link href="/" className="group relative col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end">
    <Image src="/product-main.png" width={920} height={920} quality={100} alt="" />
    {/* Tag de preco */}
  </Link>

  {/* Produto menor: 3 colunas, 3 linhas */}
  <Link href="/" className="group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end">
    <Image src="/product-2.png" width={920} height={920} quality={100} alt="" />
  </Link>

  <Link href="/" className="group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end">
    <Image src="/product-3.png" width={920} height={920} quality={100} alt="" />
  </Link>
</div>
```

### Efeito hover com group

```tsx
<Link className="group ...">
  <Image
    className="group-hover:scale-105 transition-transform duration-500"
    src="/product.png"
    width={920}
    height={920}
    quality={100}
    alt=""
  />
</Link>
```

### Tag de preco com posicionamento absoluto

```tsx
{/* Produto grande: bottom-28 right-28 */}
<div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
  <span className="text-sm truncate">Moletom AI Side</span>
  <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
    R$ 129
  </span>
</div>

{/* Produto menor: bottom-10 right-10 */}
<div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
  <span className="text-sm truncate">Camiseta Java</span>
  <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">
    R$ 79
  </span>
</div>
```

## Example

**Before (layout sem estrutura):**
```tsx
export default function Home() {
  return (
    <div>
      <div><img src="/product1.png" /><p>R$ 129</p></div>
      <div><img src="/product2.png" /><p>R$ 79</p></div>
      <div><img src="/product3.png" /><p>R$ 99</p></div>
    </div>
  )
}
```

**After (com este skill aplicado):**
```tsx
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
      <Link href="/" className="group relative col-span-6 row-span-6 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end">
        <Image className="group-hover:scale-105 transition-transform duration-500" src="/moletom-ai-side.png" width={920} height={920} quality={100} alt="" />
        <div className="absolute bottom-28 right-28 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Moletom AI Side</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">R$ 129</span>
        </div>
      </Link>
      <Link href="/" className="group relative col-span-3 row-span-3 rounded-lg bg-zinc-900 overflow-hidden flex justify-center items-end">
        <Image className="group-hover:scale-105 transition-transform duration-500" src="/moletom-java.png" width={920} height={920} quality={100} alt="" />
        <div className="absolute bottom-10 right-10 h-12 flex items-center gap-2 max-w-[280px] rounded-full border-2 border-zinc-500 bg-black/60 p-1 pl-5">
          <span className="text-sm truncate">Moletom Java</span>
          <span className="flex h-full items-center justify-center rounded-full bg-violet-500 px-4 font-semibold">R$ 79</span>
        </div>
      </Link>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Produto destaque (hero) | `col-span-6 row-span-6`, preco com `bottom-28 right-28` |
| Produto secundario | `col-span-3 row-span-3`, preco com `bottom-10 right-10` |
| Imagem de produto grande | `width` e `height` proximos ao tamanho real no layout (~920px) |
| E-commerce com imagens de qualidade | `quality={100}` no Next Image |
| Nome de produto pode ser longo | `truncate` + `max-w-[280px]` |
| Imagem pode ser maior que o container | `overflow-hidden` no pai |
| Efeito hover suave | `transition-transform duration-500` (padrao 150ms e muito rapido) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<img src="/product.png">` | `<Image src="/product.png" width={920} height={920} quality={100} alt="">` |
| `onMouseEnter` para zoom | `group-hover:scale-105` com Tailwind |
| `display: flex` com widths manuais | CSS Grid com `grid-cols-9` e `col-span-*` |
| Preco como texto abaixo da imagem | Preco com `absolute` sobreposto na imagem |
| `transition: all` | `transition-transform` (mais performatico, so anima o necessario) |

## Troubleshooting

### Componente nao renderiza ou renderiza vazio
**Symptom:** Componente importado corretamente mas nao aparece na tela
**Cause:** Falta de export default/named, ou props obrigatorias nao passadas
**Fix:** Verificar que o componente tem export correto (default ou named). Checar TypeScript props para garantir que todas as props obrigatorias estao sendo passadas

### Props nao atualizam o componente
**Symptom:** Componente mostra dados antigos mesmo quando props mudam
**Cause:** Componente nao re-renderiza por falta de key unica em listas, ou estado interno sobrescreve props
**Fix:** Adicionar `key` unica em elementos de lista. Se usando estado interno, sincronizar com props via useEffect ou derivar estado das props

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-pagina-home-2/references/deep-explanation.md) — O instrutor escolheu 9 colunas porque a divisao necessaria era 6+3 (proporção 2:1). Com 12 colunas (
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-pagina-home-2/references/code-examples.md) — Este e o codigo final da pagina Home conforme construido na aula:
