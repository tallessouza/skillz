# Code Examples: Componente RefundItem

## Exemplo 1: Definição do tipo e componente completo

```tsx
// components/RefundItem.tsx
import { Link } from "react-router-dom"

export type RefundItemProps = {
  id: string
  name: string
  category: string
  amount: string
  categoryImg: string
}

type Props = React.ComponentProps<typeof Link> & {
  data: RefundItemProps
}

export function RefundItem({ data, ...rest }: Props) {
  return (
    <Link
      {...rest}
      className="flex items-center gap-3 hover:bg-green-100/50 cursor-pointer rounded-md p-2"
    >
      <img
        src={data.categoryImg}
        alt="Ícone da categoria"
        className="w-8 h-8"
      />

      <div className="flex flex-col flex-1">
        <strong className="text-sm text-gray-100">{data.name}</strong>
        <span className="text-xs text-gray-200">{data.category}</span>
      </div>

      <span className="text-sm text-gray-100 font-semibold">
        <small className="font-normal text-gray-200">R$ </small>
        {data.amount}
      </span>
    </Link>
  )
}
```

## Exemplo 2: Uso no Dashboard com dados de exemplo

```tsx
// pages/Dashboard.tsx
import { RefundItem, RefundItemProps } from "../components/RefundItem"
import { categories } from "../utils/categories"

export function Dashboard() {
  const refundExample: RefundItemProps = {
    id: "123",
    name: "Rodrigo",
    category: "Transporte",
    amount: "34,50",
    categoryImg: categories.transport.icon,
  }

  return (
    <div>
      {/* Formulário acima */}
      <form>{/* ... */}</form>

      {/* Lista de refunds */}
      <div>
        <RefundItem data={refundExample} to={`/refund/${refundExample.id}`} />
      </div>
    </div>
  )
}
```

## Exemplo 3: Variação — Lista de itens com map

```tsx
// Quando você tem múltiplos itens vindos de uma API
const refunds: RefundItemProps[] = [
  {
    id: "1",
    name: "Rodrigo",
    category: "Transporte",
    amount: "34,50",
    categoryImg: categories.transport.icon,
  },
  {
    id: "2",
    name: "Maria",
    category: "Alimentação",
    amount: "85,00",
    categoryImg: categories.food.icon,
  },
]

<div className="flex flex-col gap-1">
  {refunds.map((refund) => (
    <RefundItem
      key={refund.id}
      data={refund}
      to={`/refund/${refund.id}`}
    />
  ))}
</div>
```

## Exemplo 4: Shorthand de opacidade — Comparação

```tsx
// ❌ opacity afeta TODO o elemento (texto fica transparente também)
<div className="bg-green-100 opacity-50">
  <span>Este texto também fica transparente!</span>
</div>

// ✅ Shorthand afeta APENAS o background
<div className="bg-green-100/50">
  <span>Este texto permanece 100% opaco!</span>
</div>

// Valores comuns:
// bg-green-100/5   → 5% (quase invisível, bom para hover sutil)
// bg-green-100/10  → 10%
// bg-green-100/25  → 25%
// bg-green-100/50  → 50%
// bg-green-100/75  → 75%
// bg-green-100/100 → 100% (padrão)
```

## Exemplo 5: Variação — Componente com elemento diferente (div ao invés de Link)

```tsx
// Se o componente não precisa ser clicável/navegável
type Props = React.ComponentProps<"div"> & {
  data: RefundItemProps
}

export function RefundItemStatic({ data, ...rest }: Props) {
  return (
    <div
      {...rest}
      className="flex items-center gap-3 rounded-md p-2"
    >
      <img src={data.categoryImg} alt="Ícone da categoria" className="w-8 h-8" />
      <div className="flex flex-col flex-1">
        <strong className="text-sm text-gray-100">{data.name}</strong>
        <span className="text-xs text-gray-200">{data.category}</span>
      </div>
      <span className="text-sm text-gray-100 font-semibold">
        <small className="font-normal text-gray-200">R$ </small>
        {data.amount}
      </span>
    </div>
  )
}
```

## Exemplo 6: Hierarquia visual com variações de cinza e peso de fonte

```tsx
// Padrão de hierarquia visual usado no componente:

// Nível 1 — Primário (nome, valor): mais claro + mais pesado
<strong className="text-sm text-gray-100">{data.name}</strong>
<span className="text-sm text-gray-100 font-semibold">{data.amount}</span>

// Nível 2 — Secundário (categoria, símbolo): mais escuro + mais leve
<span className="text-xs text-gray-200">{data.category}</span>
<small className="font-normal text-gray-200">R$ </small>

// A combinação de cor (gray-100 vs gray-200), tamanho (sm vs xs),
// e peso (semibold vs normal) cria 3 camadas de hierarquia visual
// sem precisar de cores diferentes ou tamanhos muito discrepantes.
```