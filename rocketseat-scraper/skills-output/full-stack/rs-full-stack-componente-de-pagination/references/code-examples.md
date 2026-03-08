# Code Examples: Componente de Pagination

## Exemplo 1: Componente completo conforme a aula

```tsx
// src/components/pagination.tsx
import leftSvg from '../assets/left.svg'
import rightSvg from '../assets/right.svg'
import { Button } from './button'

type Props = {
  current: number
  total: number
}

export function Pagination({ current, total }: Props) {
  return (
    <div className="flex flex-1 justify-center items-center gap-4">
      <Button variant="icon-small">
        <img src={leftSvg} alt="Ícone de voltar" />
      </Button>

      <span className="text-sm text-gray-200">
        {current} / {total}
      </span>

      <Button variant="icon-small">
        <img src={rightSvg} alt="Ícone de avançar" />
      </Button>
    </div>
  )
}
```

## Exemplo 2: Uso no Dashboard

```tsx
// src/pages/dashboard.tsx
import { Pagination } from '../components/pagination'

export function Dashboard() {
  return (
    <div>
      {/* ... listagem de solicitacoes ... */}

      <Pagination current={1} total={10} />
    </div>
  )
}
```

## Exemplo 3: Variacao com callbacks de navegacao

```tsx
type Props = {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ current, total, onPrev, onNext }: Props) {
  return (
    <div className="flex flex-1 justify-center items-center gap-4">
      <Button variant="icon-small" onClick={onPrev} disabled={current <= 1}>
        <img src={leftSvg} alt="Ícone de voltar" />
      </Button>

      <span className="text-sm text-gray-200">
        {current} / {total}
      </span>

      <Button variant="icon-small" onClick={onNext} disabled={current >= total}>
        <img src={rightSvg} alt="Ícone de avançar" />
      </Button>
    </div>
  )
}
```

## Exemplo 4: Uso com estado

```tsx
import { useState } from 'react'
import { Pagination } from '../components/pagination'

export function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10

  return (
    <div>
      {/* ... listagem filtrada por currentPage ... */}

      <Pagination
        current={currentPage}
        total={totalPages}
        onPrev={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        onNext={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
      />
    </div>
  )
}
```

## Exemplo 5: Importacao de SVGs como assets

```tsx
// Vite/Webpack resolve o import como URL do asset
import leftSvg from '../assets/left.svg'   // retorna "/assets/left-abc123.svg"
import rightSvg from '../assets/right.svg' // retorna "/assets/right-def456.svg"

// Uso em <img>
<img src={leftSvg} alt="Voltar" />
<img src={rightSvg} alt="Avançar" />
```

## Exemplo 6: Classes Tailwind aplicadas

```tsx
// Container: distribui elementos horizontalmente com espacamento
<div className="flex flex-1 justify-center items-center gap-4">
  {/* flex      → display: flex */}
  {/* flex-1    → flex: 1 1 0% (ocupa espaco disponivel) */}
  {/* justify-center → centraliza horizontalmente */}
  {/* items-center   → centraliza verticalmente */}
  {/* gap-4          → 1rem de espaco entre filhos */}
</div>

// Texto: estilo secundario para informacao de paginacao
<span className="text-sm text-gray-200">
  {/* text-sm      → font-size: 0.875rem */}
  {/* text-gray-200 → cor cinza claro para hierarquia secundaria */}
</span>
```