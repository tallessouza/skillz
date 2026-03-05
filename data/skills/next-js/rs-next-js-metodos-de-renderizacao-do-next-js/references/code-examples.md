# Code Examples: Métodos de Renderização do Next.js

## CSR — Client-Side Rendering

### Padrão básico com useEffect
```typescript
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) return <p>Carregando...</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

**Nota:** O usuário verá uma página em branco (ou loading state) até o JavaScript executar e os dados carregarem. Isso é o "tempo de load inicial" que o instrutor menciona como desvantagem.

## SSR — Server-Side Rendering

### Padrão com getServerSideProps
```typescript
import { GetServerSideProps } from 'next'

interface User {
  id: string
  name: string
  email: string
}

interface Props {
  users: User[]
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  // Chamada acontece no servidor — seguro usar API keys aqui
  const response = await fetch('https://api.example.com/users', {
    headers: { Authorization: `Bearer ${process.env.API_SECRET}` }
  })
  const users = await response.json()

  return { props: { users } }
}

export default function UsersPage({ users }: Props) {
  // HTML já vem pronto do servidor — SEO excelente
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Verificação de window/document (armadilha de iniciantes)
```typescript
// ERRADO — vai quebrar no servidor
export default function MyComponent() {
  const width = window.innerWidth // ReferenceError: window is not defined
  return <p>Largura: {width}</p>
}

// CORRETO — verificação antes de acessar
export default function MyComponent() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // useEffect só roda no client
    setWidth(window.innerWidth)
  }, [])

  return <p>Largura: {width}</p>
}

// CORRETO — verificação inline
function getStoredTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme')
  }
  return 'light'
}
```

## SSG — Static Site Generation

### Padrão com getStaticProps
```typescript
import { GetStaticProps } from 'next'

interface Post {
  id: string
  title: string
  content: string
}

interface Props {
  posts: Post[]
}

// Executado apenas no build — não roda em runtime
export const getStaticProps: GetStaticProps<Props> = async () => {
  const response = await fetch('https://api.example.com/posts')
  const posts = await response.json()

  return { props: { posts } }
}

export default function BlogPage({ posts }: Props) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  )
}
```

### SSG com rotas dinâmicas (getStaticPaths)
```typescript
import { GetStaticPaths, GetStaticProps } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('https://api.example.com/posts')
  const posts = await response.json()

  const paths = posts.map((post: { id: string }) => ({
    params: { id: post.id }
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`https://api.example.com/posts/${params?.id}`)
  const post = await response.json()

  return { props: { post } }
}

export default function PostPage({ post }: { post: Post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

## ISR — Incremental Static Regeneration

### Padrão com revalidate
```typescript
import { GetStaticProps } from 'next'

interface Product {
  id: string
  name: string
  price: number
}

interface Props {
  products: Product[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const response = await fetch('https://api.example.com/products')
  const products = await response.json()

  return {
    props: { products },
    revalidate: 60, // Re-renderiza esta página a cada 60 segundos
  }
}

export default function ProductsPage({ products }: Props) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} - R$ {(product.price / 100).toFixed(2)}
        </li>
      ))}
    </ul>
  )
}
```

### ISR com rotas dinâmicas e fallback
```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  // Gera apenas as 10 páginas mais acessadas no build
  const response = await fetch('https://api.example.com/products/top-10')
  const products = await response.json()

  const paths = products.map((product: { slug: string }) => ({
    params: { slug: product.slug }
  }))

  return {
    paths,
    fallback: 'blocking', // Novas páginas são geradas sob demanda
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(`https://api.example.com/products/${params?.slug}`)
  const product = await response.json()

  return {
    props: { product },
    revalidate: 300, // Revalida a cada 5 minutos
  }
}
```

## Comparação lado a lado: mesma página, 4 métodos

### Página de listagem de produtos

**CSR:**
```typescript
export default function Products() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])
  return <ProductList products={products} />
}
```

**SSR:**
```typescript
export const getServerSideProps = async () => {
  const products = await db.products.findMany()
  return { props: { products } }
}
export default function Products({ products }) {
  return <ProductList products={products} />
}
```

**SSG:**
```typescript
export const getStaticProps = async () => {
  const products = await db.products.findMany()
  return { props: { products } }
}
export default function Products({ products }) {
  return <ProductList products={products} />
}
```

**ISR:**
```typescript
export const getStaticProps = async () => {
  const products = await db.products.findMany()
  return { props: { products }, revalidate: 120 }
}
export default function Products({ products }) {
  return <ProductList products={products} />
}
```

A diferença entre SSG e ISR é literalmente uma linha: `revalidate`. A diferença entre SSG e SSR é o nome da função exportada (`getStaticProps` vs `getServerSideProps`). O poder do Next.js está nessa simplicidade de troca entre métodos.