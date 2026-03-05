# Code Examples: Grupos e Rotas Dinamicas

## 1. Route Group — Passo a Passo

### Estrutura inicial (sem grupo):

```
app/
├── auth/
│   ├── layout.tsx
│   ├── sign-in/
│   │   └── page.tsx
│   └── sign-up/
│       └── page.tsx
```

URLs geradas: `/auth/sign-in` e `/auth/sign-up`

### Estrutura com route group:

```
app/
├── (auth)/
│   ├── layout.tsx
│   ├── sign-in/
│   │   └── page.tsx
│   └── sign-up/
│       └── page.tsx
```

URLs geradas: `/sign-in` e `/sign-up` (sem `/auth`)

### Layout compartilhado do grupo:

```tsx
// app/(auth)/layout.tsx
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1 className="text-xl font-bold">Logo do App</h1>
      {children}
    </div>
  )
}
```

### Paginas simples do grupo:

```tsx
// app/(auth)/sign-in/page.tsx
export default function SignIn() {
  return <h1>Sign In</h1>
}
```

```tsx
// app/(auth)/sign-up/page.tsx
export default function SignUp() {
  return <h1>Sign Up</h1>
}
```

## 2. Rota Dinamica com Parametro Unico

### Estrutura de pastas:

```
app/
├── catalog/
│   └── product/
│       └── [id]/
│           └── page.tsx
```

### Componente sem tipagem (demonstracao com JSON.stringify):

```tsx
// Demonstracao do instrutor para visualizar props
export default async function Product(props: any) {
  return <h1>{JSON.stringify(props)}</h1>
}
// Output: {"params":{"id":"1"}}
```

### Componente com tipagem correta:

```tsx
// app/catalog/product/[id]/page.tsx
interface ProductProps {
  params: Promise<{ id: string }>
}

export default async function Product({ params }: ProductProps) {
  const { id } = await params
  return <h1>Product: {id}</h1>
}
```

URLs validas:
- `/catalog/product/1` → id = "1"
- `/catalog/product/2` → id = "2"
- `/catalog/product/abc` → id = "abc"

## 3. Catch-All Route com Multiplos Parametros

### Estrutura de pastas:

```
app/
├── catalog/
│   └── product/
│       └── [...data]/
│           └── page.tsx
```

### Componente com desestruturacao do array:

```tsx
// app/catalog/product/[...data]/page.tsx
interface ProductProps {
  params: Promise<{ data: string[] }>
}

export default async function Product({ params }: ProductProps) {
  const { data } = await params
  const [productId, size, color] = data

  return (
    <div>
      <p>Product: {productId}</p>
      <p>Size: {size}</p>
      <p>Color: {color}</p>
    </div>
  )
}
```

URL: `/catalog/product/3/s/blue`
- `data[0]` = "3" (productId)
- `data[1]` = "s" (size)
- `data[2]` = "blue" (color)

### O que acontece se voce usa `[id]` com multiplos segmentos:

URL `/catalog/product/3/s/blue` com pasta `[id]` → **404 Not Found**

O Next.js so aceita exatamente 1 segmento para `[id]`. Para multiplos, e necessario `[...data]`.

## 4. Combinando Tudo — Estrutura Completa

```
app/
├── (auth)/                    # Grupo: sem segmento na URL
│   ├── layout.tsx             # Layout compartilhado sign-in/sign-up
│   ├── sign-in/
│   │   └── page.tsx           # /sign-in
│   └── sign-up/
│       └── page.tsx           # /sign-up
├── admin/
│   ├── layout.tsx             # Layout do admin
│   └── page.tsx               # /admin
├── catalog/
│   └── product/
│       └── [id]/              # Parametro dinamico
│           └── page.tsx       # /catalog/product/:id
└── layout.tsx                 # Layout raiz
```