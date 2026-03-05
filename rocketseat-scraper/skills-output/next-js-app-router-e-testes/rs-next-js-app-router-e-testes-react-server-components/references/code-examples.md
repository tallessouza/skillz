# Code Examples: React Server Components

## Exemplo 1: console.log em Server Component

```typescript
// app/catalog/product/[...data]/page.tsx — Server Component (padrao)
export default function ProductPage({ params }: { params: { data: string[] } }) {
  console.log(params)
  // ↑ Este log aparece APENAS no terminal do Node (onde npm run dev roda)
  // NÃO aparece no Console do navegador

  return (
    <div>
      <h1>Produto</h1>
      <p>ID: {params.data[0]}, Tamanho: {params.data[1]}, Cor: {params.data[2]}</p>
    </div>
  )
}
```

**Resultado:**
- Terminal Node: `{ data: ['id-produto', 'tamanho', 'cor'] }`
- Console do navegador: (vazio)

## Exemplo 2: Erro ao usar event handler em Server Component

```typescript
// ERRO — event handler em Server Component
export default function ProductPage({ params }) {
  function addToCart() {
    console.log('adicionou ao carrinho')
  }

  return (
    <div>
      <h1>Produto</h1>
      <button onClick={addToCart}>Adicionar ao carrinho</button>
      {/* ↑ ERRO: "Event handlers cannot be passed to Client Component props" */}
    </div>
  )
}
```

**Mensagem de erro do Next.js:**
> Event handlers cannot be passed to Client Component props. If you need interactivity, consider converting part of this to a Client Component.

## Exemplo 3: Convertendo para Client Component

```typescript
'use client'
// ↑ Basta adicionar esta diretiva no topo do arquivo

export default function ProductPage({ params }) {
  console.log(params)
  // ↑ Agora aparece no terminal Node E no console do navegador
  // No Node: render inicial do servidor
  // No navegador: apos hidratacao (componente "recriado")

  function addToCart() {
    console.log('adicionou ao carrinho')
    // ↑ Este log aparece APENAS no navegador (disparado por evento do usuario)
  }

  return (
    <div>
      <h1>Produto</h1>
      <button onClick={addToCart}>Adicionar ao carrinho</button>
      {/* ↑ Agora funciona — Client Component suporta event handlers */}
    </div>
  )
}
```

**Resultado com JavaScript habilitado:**
- Terminal Node: `{ data: [...] }` (render inicial)
- Console navegador: `{ data: [...] }` (hidratacao) + `'adicionou ao carrinho'` (ao clicar)

**Resultado com JavaScript desabilitado:**
- Interface visivel (HTML veio do servidor)
- Botao nao funciona (evento depende de JS)
- Console navegador vazio

## Exemplo 4: Composicao ideal (padrao recomendado)

```typescript
// app/catalog/product/page.tsx — Server Component
import { AddToCartButton } from './components/add-to-cart-button'

export default function ProductPage({ params }) {
  // Tudo aqui executa apenas no servidor
  console.log(params) // apenas no terminal Node

  return (
    <div>
      <h1>Produto: {params.slug}</h1>
      <p>Descricao do produto — HTML puro, zero JS enviado</p>
      <span>Preco: R$ 99,90 — HTML puro, zero JS enviado</span>

      {/* Apenas este componente envia JS ao navegador */}
      <AddToCartButton productId={params.slug} />
    </div>
  )
}
```

```typescript
// app/catalog/product/components/add-to-cart-button.tsx — Client Component
'use client'

interface AddToCartButtonProps {
  productId: string
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  function handleAddToCart() {
    console.log(`adicionou ${productId} ao carrinho`)
  }

  return (
    <button onClick={handleAddToCart}>
      Adicionar ao carrinho
    </button>
  )
}
```

**Vantagem:** Apenas o JavaScript do botao e enviado ao navegador. Todo o resto da pagina (titulo, descricao, preco) e HTML puro sem JavaScript associado.