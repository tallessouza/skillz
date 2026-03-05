# Code Examples: Estrutura dos Cards

## Exemplo completo do componente Card

```typescript
// components/card.tsx

function CardRoot({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="bg-navy-700 border border-navy-600 p-3 space-y-4 rounded-lg block"
    >
      {children}
    </a>
  )
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium">{children}</span>
}

function CardNumber({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-navy-200">{children}</span>
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Number: CardNumber,
  Footer: CardFooter,
}
```

## Uso na pagina principal

```tsx
import { Card } from "@/components/card"
import { ThumbsUpIcon, MessageCircleIcon } from "lucide-react"

export default function BoardPage() {
  return (
    <Card.Root href="/">
      <Card.Header>
        <Card.Number>ECO-001</Card.Number>
        <Card.Title>Implementar cartao de credito</Card.Title>
      </Card.Header>
      <Card.Footer>
        <button
          type="button"
          className="text-navy-100 flex items-center gap-2 rounded-lg px-2.5 py-1 bg-navy-600 cursor-pointer"
        >
          <ThumbsUpIcon className="size-3" />
          <span className="text-xs">12</span>
        </button>
        <button
          type="button"
          className="text-navy-100 flex items-center gap-2 rounded-lg px-2.5 py-1 bg-navy-600 cursor-pointer"
        >
          <MessageCircleIcon className="size-3" />
          <span className="text-xs">3</span>
        </button>
      </Card.Footer>
    </Card.Root>
  )
}
```

## Comparacao: Section vs Card (mesmo padrao)

O projeto usa o mesmo padrao compound component para ambos:

```typescript
// Section (ja existia)
export const Section = {
  Root: SectionRoot,
  Header: SectionHeader,
  Title: SectionTitle,
  IssueCount: SectionIssueCount,
  Content: SectionContent,
}

// Card (novo, mesmo padrao)
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Number: CardNumber,    // equivale a IssueCount
  Footer: CardFooter,    // equivale a Content
}
```

## Variacao: Card com Next.js Link

Quando integrar com roteamento do Next.js:

```tsx
import Link from "next/link"

function CardRoot({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="bg-navy-700 border border-navy-600 p-3 space-y-4 rounded-lg block"
    >
      {children}
    </Link>
  )
}
```

## Variacao: Botao de acao extraido como componente

```tsx
function CardActionButton({
  icon: Icon,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>
  count: number
}) {
  return (
    <button
      type="button"
      className="text-navy-100 flex items-center gap-2 rounded-lg px-2.5 py-1 bg-navy-600 cursor-pointer"
    >
      <Icon className="size-3" />
      <span className="text-xs">{count}</span>
    </button>
  )
}

// Uso:
<Card.Footer>
  <CardActionButton icon={ThumbsUpIcon} count={12} />
  <CardActionButton icon={MessageCircleIcon} count={3} />
</Card.Footer>
```

## Tokens de estilo utilizados

| Token | Valor | Uso |
|-------|-------|-----|
| `bg-navy-700` | Background escuro | Card root |
| `border-navy-600` | Borda sutil (mais clara que bg) | Card root |
| `text-navy-200` | Texto sutil | Card number |
| `text-navy-100` | Texto botoes | Footer buttons |
| `bg-navy-600` | Background botoes | Footer buttons |
| `p-3` | Padding 12px | Card root |
| `space-y-4` | Espacamento vertical entre filhos | Card root |
| `rounded-lg` | Bordas arredondadas | Card root, botoes |
| `text-sm` | Texto pequeno | Card title |
| `text-xs` | Texto extra pequeno | Card number, contadores |
| `size-3` | 12px | Icones nos botoes |