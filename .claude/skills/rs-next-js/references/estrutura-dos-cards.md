---
name: rs-next-js-estrutura-dos-cards
description: "Applies compound component pattern when building card UI components in React/Next.js. Use when user asks to 'create a card component', 'build a board UI', 'implement task cards', 'create kanban cards', or any card-based layout. Enforces subcomponent architecture (Root, Header, Title, Number, Footer) with proper composition. Make sure to use this skill whenever generating card components for project management, kanban, or board UIs. Not for form components, modals, or navigation elements."
---

# Estrutura de Cards com Compound Components

> Construa cards usando subcomponentes compostos (Root, Header, Title, Number, Footer) para manter flexibilidade e consistencia visual.

## Rules

1. **Use compound component pattern** — `Card.Root`, `Card.Header`, `Card.Title`, `Card.Number`, `Card.Footer`, porque permite reordenar e omitir partes sem quebrar o layout
2. **Root e um link clicavel** — use `<a>` ou `<Link>` no Root, nao `<div>`, porque cards de board navegam para a pagina de detalhe
3. **Number usa prefixo de projeto** — formato `PRJ-001` (3 letras + hifen + numero incremental), porque e mais facil para usuarios referenciarem tasks do que usar IDs do banco
4. **Footer contem acoes interativas** — botoes de like, comentarios e outras interacoes ficam no Footer, separados do conteudo informativo
5. **Cada subcomponente exporta individualmente** — exporte como `CardRoot`, `CardHeader`, etc. e re-exporte agrupado, porque facilita tree-shaking e imports seletivos
6. **Estilizacao com Tailwind segue hierarquia visual** — Root tem bg/border/padding/rounded, Header e flex com gap, Title e text-sm/font-medium, Number e text-xs com cor mais sutil

## How to write

### Estrutura do compound component

```typescript
// components/card.tsx
function CardRoot({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} className="bg-navy-700 border border-navy-600 p-3 space-y-4 rounded-lg block">
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

### Uso na pagina

```tsx
<Card.Root href={`/cards/${card.id}`}>
  <Card.Header>
    <Card.Number>ECO-001</Card.Number>
    <Card.Title>Implementar cartao de credito</Card.Title>
  </Card.Header>
  <Card.Footer>
    <button type="button" className="text-navy-100 flex items-center gap-2 rounded-lg px-2.5 py-1 bg-navy-600 cursor-pointer">
      <ThumbsUpIcon className="size-3" />
      <span className="text-xs">12</span>
    </button>
    <button type="button" className="text-navy-100 flex items-center gap-2 rounded-lg px-2.5 py-1 bg-navy-600 cursor-pointer">
      <MessageCircleIcon className="size-3" />
      <span className="text-xs">3</span>
    </button>
  </Card.Footer>
</Card.Root>
```

## Example

**Before (componente monolitico):**
```tsx
function Card({ title, number, likes, comments, href }) {
  return (
    <div className="card">
      <span>{number}</span>
      <h3>{title}</h3>
      <div>
        <span>{likes} likes</span>
        <span>{comments} comments</span>
      </div>
    </div>
  )
}
```

**After (compound components):**
```tsx
<Card.Root href="/cards/1">
  <Card.Header>
    <Card.Number>ECO-001</Card.Number>
    <Card.Title>Implementar cartao de credito</Card.Title>
  </Card.Header>
  <Card.Footer>
    <LikeButton count={12} />
    <CommentButton count={3} />
  </Card.Footer>
</Card.Root>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Card sera clicavel | Use `<a>` ou `<Link>` no Root, adicione `block` para ocupar largura total |
| Precisa de ID visivel | Use Card.Number com prefixo de 3 letras do projeto |
| Acoes no card (like, comment) | Coloque botoes no Footer com icones pequenos (size-3) |
| Reutilizar pattern em outros componentes | Copie a estrutura compound (Root/Header/Title/Footer) e renomeie |
| Bordas sutis em dark theme | Use `border` com cor levemente mais clara que o bg (ex: bg-navy-700 + border-navy-600) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<Card title="..." likes={12} />` (props monoliticas) | `<Card.Root><Card.Title>...</Card.Title></Card.Root>` (composicao) |
| `<div onClick={...}>` para card clicavel | `<a href={...}>` ou `<Link href={...}>` (semantica correta) |
| ID do banco como identificador visual | Prefixo de projeto + numero incremental (`ECO-001`) |
| Botoes de acao misturados com titulo | Footer separado para acoes, Header para informacoes |
| `className="card"` com CSS global | Tailwind classes inline no componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-estrutura-dos-cards/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-estrutura-dos-cards/references/code-examples.md)
