# Code Examples: Integrando Carrinho com Frontend

## Modulo de API completo

```typescript
// api/cart.ts
import type { Cart } from './types'

export async function getCart(): Promise<Cart> {
  const response = await fetch('/api/cart')
  return response.json()
}

export async function addToCart(productId: string, quantity: number) {
  const response = await fetch('/api/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity })
  })
  return response.json() // retorna { id: string }
}

export async function updateCartItem(
  cartId: string,
  productId: string,
  quantity: number
) {
  await fetch(`/api/cart/${cartId}/items/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  })
}

export async function removeFromCart(cartId: string, productId: string) {
  await fetch(`/api/cart/${cartId}/items/${productId}`, {
    method: 'DELETE'
  })
}
```

## Tipagem do Cart

```typescript
export interface Cart {
  id: string
  store: {
    id: string
    name: string
  }
  items: CartItem[]
  total: number
}

export interface CartItem {
  productId: string
  name: string
  price: number // em centavos
  quantity: number
}
```

## Pagina do carrinho completa

```typescript
'use client'

import { useSWR } from 'swr'
import { getCart, updateCartItem, removeFromCart } from '@/api/cart'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
  const { data: cart, mutate } = useSWR('cart', getCart)

  async function handleUpdateQuantity(productId: string, newQuantity: number) {
    if (!cart) return

    if (newQuantity < 1) {
      await mutate(
        removeFromCart(cart.id, productId),
        {
          optimisticData: {
            ...cart,
            items: cart.items.filter(item => item.productId !== productId)
          }
        }
      )
      return
    }

    await mutate(
      updateCartItem(cart.id, productId, newQuantity),
      {
        optimisticData: {
          ...cart,
          items: cart.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        }
      }
    )
  }

  async function handleRemove(productId: string) {
    if (!cart) return
    await mutate(
      removeFromCart(cart.id, productId),
      {
        optimisticData: {
          ...cart,
          items: cart.items.filter(item => item.productId !== productId)
        }
      }
    )
  }

  if (!cart) return <p>Carregando...</p>

  const total = cart.items?.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  ) ?? 0

  return (
    <div>
      <h1>Carrinho - {cart.store?.name}</h1>

      {cart.items.length === 0 ? (
        <p>Carrinho vazio</p>
      ) : (
        <ul>
          {cart.items.map(item => (
            <li key={item.productId} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  size="sm"
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(item.productId)}
                >
                  <Trash2 />
                </Button>
              </div>
              <span>R$ {(item.price * item.quantity / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      <p>Total: R$ {(total / 100).toFixed(2)}</p>
    </div>
  )
}
```

## Adicionar ao carrinho na pagina de produtos

```typescript
'use client'

import { addToCart } from '@/api/cart'
import { toast } from 'sonner'

function ProductCard({ product }) {
  async function handleAddToCart() {
    await addToCart(product.id, 1)
    toast.success('Produto adicionado ao carrinho')
  }

  return (
    <div>
      <h3>{product.name}</h3>
      <p>R$ {(product.price / 100).toFixed(2)}</p>
      <Button onClick={handleAddToCart}>Adicionar ao carrinho</Button>
    </div>
  )
}
```

## Backend: query com JOIN para nome da loja

```sql
SELECT
  carts.*,
  json_build_object('name', stores.name, 'id', stores.id) as store
FROM carts
JOIN stores ON stores.id = carts.store_id
WHERE carts.id = $1
GROUP BY carts.id, stores.id, stores.name
```

O `GROUP BY` precisa incluir `stores.id` e `stores.name` porque estao fora de funcoes de agregacao — mesmo que logicamente so exista uma loja por carrinho, o PostgreSQL exige isso sintaticamente.