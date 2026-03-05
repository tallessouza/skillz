---
name: rs-nextjs-app-router-product-detail-page
description: "Generates product detail page structure in Next.js App Router with dynamic routes, CSS Grid layout, and next/image. Use when user asks to 'create product page', 'build product detail', 'make PDP', 'product detail layout', or 'dynamic route page in Next.js'. Applies patterns: dynamic route folders with brackets, 3-column grid with image spanning 2 cols, max-height container, next/image with quality 100 for large images. Make sure to use this skill whenever building e-commerce product pages or detail pages with image + info layout in Next.js. Not for listing pages, cart logic, or checkout flows."
---

# Pagina de Detalhe do Produto (Next.js App Router)

> Estruturar paginas de detalhe com rotas dinamicas, grid de 3 colunas (imagem 2/3, info 1/3) e altura maxima fixa para telas grandes.

## Rules

1. **Rotas dinamicas usam pasta com colchetes** — `app/store/product/[slug]/page.tsx`, porque o App Router identifica parametros pela convencao de pasta
2. **Altura maxima fixa no container** — `max-h-[860px]`, porque em telas muito grandes a imagem ocuparia tudo e o conteudo textual ficaria desproporcional
3. **Grid 3 colunas: imagem col-span-2** — a imagem ocupa 2/3 e os detalhes 1/3, porque equilibra visual e informacao
4. **overflow-hidden na area da imagem** — porque a imagem pode crescer alem do container e nao queremos barra de rolagem, apenas cortar bordas
5. **next/image com quality 100 para imagens grandes** — porque o padrao 80 causa perda visivel de qualidade em imagens grandes de produto
6. **Dados estaticos primeiro, dinamicos depois** — comece com dados hardcoded e substitua por dados da API depois, porque valida o layout antes de integrar

## How to write

### Estrutura de pastas (rota dinamica)

```
app/store/product/[slug]/page.tsx
```

### Layout da pagina

```tsx
export default function Product() {
  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      {/* Imagem: 2 colunas */}
      <div className="col-span-2 overflow-hidden">
        <Image
          src="/product-image.png"
          alt=""
          width={1000}
          height={1000}
          quality={100}
        />
      </div>

      {/* Detalhes: 1 coluna */}
      <div className="flex flex-col justify-center px-12">
        <h1 className="text-3xl font-bold leading-tight">Nome do Produto</h1>

        <p className="mt-2 leading-relaxed text-zinc-400">
          Descricao do produto aqui.
        </p>

        {/* Preco */}
        <div className="mt-8 flex items-center gap-3">
          <span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
            R$ 129
          </span>
          <span className="text-sm text-zinc-400">
            Em 12x sem juros de R$ 10,75
          </span>
        </div>

        {/* Tamanhos */}
        <div className="mt-8 space-y-4">
          <span className="block font-semibold">Tamanhos</span>
          <div className="flex gap-2">
            {['P', 'M', 'G', 'GG'].map((size) => (
              <button
                key={size}
                type="button"
                className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="mt-8 flex h-12 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  )
}
```

## Example

**Before (sem estrutura):**
```tsx
export default function Product() {
  return <p>Product</p>
}
```

**After (com layout completo):**
```tsx
// app/store/product/[slug]/page.tsx
export default function Product() {
  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image src="/product.png" alt="" width={1000} height={1000} quality={100} />
      </div>
      <div className="flex flex-col justify-center px-12">
        {/* titulo, descricao, preco, tamanhos, botao */}
      </div>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tela pode ser muito grande | Defina max-h no container principal |
| Imagem pode estourar container | Use overflow-hidden na div da imagem |
| Imagem de produto grande | Use quality={100} no next/image |
| Botoes de tamanho com texto variavel | Fixe width e height (w-14 h-9) |
| Layout imagem + info | Grid 3 colunas, imagem col-span-2 |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Deixar imagem sem max-height em fullscreen | `max-h-[860px]` no container |
| quality padrao (80) para imagens grandes | `quality={100}` |
| Botoes de tamanho sem dimensao fixa | `h-9 w-14` fixos |
| Rota dinamica sem colchetes na pasta | `[slug]/page.tsx` |
| Integrar API antes de validar layout | Dados estaticos primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-pagina-detalhe-do-produto/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-pagina-detalhe-do-produto/references/code-examples.md)
