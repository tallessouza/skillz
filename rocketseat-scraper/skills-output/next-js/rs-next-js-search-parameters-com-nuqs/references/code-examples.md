# Code Examples: URL State com nuqs no Next.js

## 1. Instalacao

```bash
npm install nuqs
```

## 2. Setup do NuqsAdapter

O adapter deve envolver toda a aplicacao no layout raiz:

```typescript
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
```

**Nota:** Para Pages Router, importar de `nuqs/adapters/next/pages`. Para React puro, existe adapter proprio.

## 3. useQueryState basico (sem debounce)

```typescript
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export function SearchHeader() {
  const [search, setSearch] = useQueryState(
    'q',  // nome do parametro na URL
    parseAsString.withDefault('')  // parser + valor default
  )

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  )
}
```

**Resultado na URL:** `?q=implementar`

**Sem withDefault:** o tipo de search seria `string | null` em vez de `string`.

## 4. useQueryState com debounce condicional

```typescript
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export function SearchHeader() {
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  function handleSearchUpdate(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value, {
      limitURLUpdates: event.target.value !== ''
        ? { debounce: 500 }  // digitando: espera 500ms
        : undefined           // apagando tudo: instantaneo
    })
  }

  return (
    <input
      value={search}
      onChange={handleSearchUpdate}
    />
  )
}
```

**Comportamento:**
- Usuario digita "implementar" → URL atualiza 500ms apos parar de digitar
- Usuario apaga tudo → URL limpa instantaneamente

## 5. Acessar searchParams em server component (page)

```typescript
// app/board/page.tsx
interface BoardProps {
  searchParams: Promise<{ q?: string }>
}

export default async function Board({ searchParams }: BoardProps) {
  const { q } = await searchParams

  console.log(q) // "implementar" ou undefined

  // Usar q para filtrar dados no server-side
  return <div>{/* conteudo filtrado */}</div>
}
```

**Nota importante:** searchParams e uma Promise no App Router. E necessario `await` e a funcao do componente deve ser `async`.

## 6. Variacao: multiplos parametros de URL (e-commerce)

```typescript
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export function ProductFilters() {
  const [size, setSize] = useQueryState(
    'tamanho',
    parseAsString.withDefault('S')
  )
  const [color, setColor] = useQueryState(
    'cor',
    parseAsString.withDefault('preto')
  )

  return (
    <div>
      <div>
        {['S', 'M', 'G'].map(s => (
          <button
            key={s}
            onClick={() => setSize(s)}
            data-active={size === s}
          >
            {s}
          </button>
        ))}
      </div>
      <div>
        {['preto', 'branco', 'azul'].map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            data-active={color === c}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**URL resultante:** `/product/camiseta?tamanho=G&cor=azul`

## 7. Variacao: parser numerico

```typescript
const [page, setPage] = useQueryState(
  'page',
  parseAsInteger.withDefault(1)
)
// page e number, nao string
```

## 8. Tipagem do evento onChange

Para descobrir o tipo correto do evento, passe o mouse sobre o parametro `e` no onChange do input. O tipo e:

```typescript
React.ChangeEvent<HTMLInputElement>
```