---
name: rs-full-stack-componente-refund-item
description: "Enforces React component creation patterns with TypeScript props, data objects, and Tailwind CSS styling. Use when user asks to 'create a component', 'build a list item', 'style a card component', 'make a reusable UI element', or 'display item details'. Applies patterns: typed props with export type, data object prop pattern, ComponentProps extension, Tailwind hover opacity shorthand, flex layout composition. Make sure to use this skill whenever building presentational components that display structured data. Not for form handling, state management, or API integration logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, components, typescript, tailwind, props]
---

# Componente Refund Item — Criação de Componentes Apresentacionais com Props Tipadas e Tailwind

> Componentes apresentacionais recebem dados via objeto tipado, estendem props nativas do elemento base, e usam composição de classes Tailwind para layout e interatividade.

## Rules

1. **Exporte o tipo de props separadamente** — `export type RefundItemProps = {...}` porque permite reutilização do tipo em outros arquivos sem importar o componente
2. **Agrupe dados de domínio em um objeto `data`** — separe props de dados das props nativas do elemento, porque mantém a interface limpa e extensível
3. **Estenda props nativas com `React.ComponentProps`** — `type Props = React.ComponentProps<typeof Link>` porque herda todas as props do elemento base (href, className, etc.)
4. **Use spread do rest para repassar props** — `{...rest}` no elemento raiz, porque garante que props nativas continuem funcionando
5. **Use o shorthand de opacidade do Tailwind** — `bg-green-100/50` para 50% de opacidade, porque evita classes extras e mantém a mesma cor base
6. **Estruture layout com flex + gap** — prefira `flex items-center gap-3` a margins individuais, porque gap é mais previsível e não causa colapso de margens

## How to write

### Tipagem e props do componente

```tsx
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
    <Link {...rest} className="flex items-center gap-3 ...">
      <img src={data.categoryImg} alt="Ícone da categoria" className="w-8 h-8" />
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

### Hover com opacidade via shorthand Tailwind

```tsx
// bg-green-100/50 = bg-green-100 com 50% de opacidade
// bg-green-100/5  = bg-green-100 com 5% de opacidade
// bg-green-100/100 = padrão (100% opaco)
<Link className="hover:bg-green-100/50 cursor-pointer rounded-md p-2">
```

### Uso do componente com dados de exemplo

```tsx
const refundExample: RefundItemProps = {
  id: "123",
  name: "Rodrigo",
  category: "Transporte",
  amount: "34,50",
  categoryImg: categories.transport.icon,
}

<RefundItem data={refundExample} to={`/refund/${refundExample.id}`} />
```

## Example

**Before (props soltas, sem tipagem, sem extensão):**
```tsx
function RefundItem({ id, name, category, amount, img, href }) {
  return (
    <a href={href} style={{ display: "flex", gap: 12 }}>
      <img src={img} />
      <div>
        <b>{name}</b>
        <p>{category}</p>
      </div>
      <span>R$ {amount}</span>
    </a>
  )
}
```

**After (com esta skill aplicada):**
```tsx
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
      <img src={data.categoryImg} alt="Ícone da categoria" className="w-8 h-8" />
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

## Heuristics

| Situação | Faça |
|----------|------|
| Componente exibe dados de uma entidade | Agrupe em `data: EntityProps` ao invés de props soltas |
| Componente wrapa um elemento nativo ou Link | Estenda com `React.ComponentProps<typeof Element>` |
| Precisa de hover com cor transparente | Use shorthand `bg-color/opacity` (ex: `bg-green-100/50`) |
| Layout com imagem + texto + valor lado a lado | Use `flex items-center gap-N` no container |
| Texto secundário precisa de tom diferente | Use variações de `text-gray-{100,200,300}` |
| Valor monetário com símbolo e número | Separe o símbolo em `<small>` com `font-normal` e `text-gray-200` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| Props soltas: `({ id, name, category, amount, img })` | Objeto agrupado: `({ data, ...rest }: Props)` |
| `style={{ display: "flex", gap: 12 }}` | `className="flex gap-3"` |
| `<a href={...}>` sem tipagem | `<Link {...rest}>` com `ComponentProps` |
| `bg-green-100 opacity-50` (duas classes) | `bg-green-100/50` (shorthand) |
| `<b>` e `<p>` para textos de lista | `<strong>` e `<span>` com classes Tailwind |
| Margins individuais: `ml-2 mr-2 mt-2` | `gap-3` no container flex ou `p-2` para padding uniforme |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| TypeScript erro em `React.ComponentProps<typeof Link>` | `Link` nao importado ou usando elemento HTML | Importe o `Link` do router ou use `ComponentProps<'a'>` |
| Opacidade shorthand nao funciona (`bg-green-100/50`) | Versao do Tailwind anterior a v3 | Atualize para Tailwind CSS v3+ que suporta opacity shorthand |
| Props nativas nao repassadas ao elemento | Faltou `{...rest}` no elemento raiz | Adicione spread do rest no componente raiz |
| Dados nao aparecem no componente | Acessando props diretamente em vez de `data.field` | Use `data.name`, `data.category` etc. conforme o tipo Props |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o padrão data object, ComponentProps, e shorthand de opacidade Tailwind
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações