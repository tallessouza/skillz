# Code Examples: Pagina de Detalhe do Produto

## Exemplo completo da pagina

```tsx
// app/store/product/[slug]/page.tsx
import Image from 'next/image'

export default function Product() {
  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      {/* Area da imagem - 2 colunas */}
      <div className="col-span-2 overflow-hidden">
        <Image
          src="/moletom-never-stop-learning.png"
          alt=""
          width={1000}
          height={1000}
          quality={100}
        />
      </div>

      {/* Area de informacoes - 1 coluna */}
      <div className="flex flex-col justify-center px-12">
        {/* Titulo */}
        <h1 className="text-3xl font-bold leading-tight">
          Moletom Never Stop Learning
        </h1>

        {/* Descricao */}
        <p className="mt-2 leading-relaxed text-zinc-400">
          Moletom fabricado com mass algodão, proporcionando conforto
          e durabilidade no dia a dia.
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
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              P
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              M
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              G
            </button>
            <button
              type="button"
              className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold"
            >
              GG
            </button>
          </div>
        </div>

        {/* Botao adicionar ao carrinho */}
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

## Estrutura de pastas

```
app/
└── store/
    └── product/
        └── [slug]/
            └── page.tsx    ← rota dinamica: /store/product/:slug
```

## Evolucao: de estatico para dinamico

### Passo 1 — Componente minimo (verificar que rota funciona)

```tsx
export default function Product() {
  return <p>Product</p>
}
```

### Passo 2 — Layout com dados estaticos (validar visual)

```tsx
export default function Product() {
  return (
    <div className="relative grid max-h-[860px] grid-cols-3">
      <div className="col-span-2 overflow-hidden">
        <Image src="/moletom.png" alt="" width={1000} height={1000} quality={100} />
      </div>
      <div className="flex flex-col justify-center px-12">
        <h1 className="text-3xl font-bold leading-tight">Produto</h1>
        {/* ... resto do conteudo estatico */}
      </div>
    </div>
  )
}
```

### Passo 3 — Integrar dados dinamicos (aula futura)

```tsx
// Receber slug dos params e buscar dados da API
export default async function Product({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  // ... usar product.title, product.price, etc.
}
```

## Padrao de botoes com tamanho fixo

```tsx
// Quando conteudo textual varia mas botoes devem ter tamanho uniforme:
// h-9 = 36px de altura fixa
// w-14 = 56px de largura fixa
<button className="flex h-9 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold">
  GG
</button>
```

## Badge de preco com fundo colorido

```tsx
// inline-block + rounded-full + bg-color = badge pill
<span className="inline-block rounded-full bg-violet-500 px-5 py-2.5 font-semibold">
  R$ 129
</span>
```