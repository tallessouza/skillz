---
name: rs-next-js-componentes-de-secao
description: "Enforces the compound component (composition) pattern when building React/Next.js UI components. Use when user asks to 'create a component', 'build a section', 'make a card', 'split into subcomponents', or any component creation task. Applies rules: composition over props, always extend ComponentProps, use twMerge for className merging, export as object with dot notation. Make sure to use this skill whenever creating reusable React components with multiple slots or sections. Not for single-purpose utility functions, hooks, or server-side logic."
---

# Compound Components (Composition Pattern)

> Divida componentes grandes em subcomponentes isolados exportados como objeto, nunca acumule propriedades num componente unico.

## Rules

1. **Use composicao, nunca props em excesso** — `<Section.Title>` nao `<Section title="..." icon="..." count={3}>`, porque cada slot vira independente, testavel e reutilizavel
2. **Exporte como objeto com dot notation** — `export const Section = { root: SectionRoot, header: SectionHeader }`, porque permite `<Section.root>` e agrupa subcomponentes sob um namespace
3. **Sempre estenda ComponentProps do elemento HTML** — `interface SectionRootProps extends ComponentProps<'div'>`, porque permite repassar qualquer prop nativa (aria, data-, event handlers)
4. **Desestruture className e use twMerge** — `twMerge(defaultClasses, className)` em todo componente, porque className passado via spread substitui o default ao inves de somar
5. **Use rest operator para repassar props** — `const { className, ...props } = myProps`, porque garante que props futuras funcionam sem alteracao no componente
6. **Compartilhe estado via Context** — se o root recebe uma prop que subcomponentes precisam, crie um Context no root e use `useContext` nos filhos, porque evita prop drilling entre subcomponentes

## How to write

### Estrutura do arquivo de componente

```typescript
import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface SectionRootProps extends ComponentProps<'div'> {}

function SectionRoot({ className, ...props }: SectionRootProps) {
  return <div className={twMerge('default-classes', className)} {...props} />
}

interface SectionHeaderProps extends ComponentProps<'div'> {}

function SectionHeader({ className, ...props }: SectionHeaderProps) {
  return <div className={twMerge('flex items-center gap-2', className)} {...props} />
}

interface SectionTitleProps extends ComponentProps<'span'> {}

function SectionTitle({ className, ...props }: SectionTitleProps) {
  return <span className={twMerge('text-sm font-medium', className)} {...props} />
}

interface SectionContentProps extends ComponentProps<'div'> {}

function SectionContent({ className, ...props }: SectionContentProps) {
  return <div className={twMerge('flex flex-col gap-3', className)} {...props} />
}

export const Section = {
  root: SectionRoot,
  header: SectionHeader,
  title: SectionTitle,
  content: SectionContent,
}
```

### Uso com dot notation

```tsx
import { Section } from '@/components/section'

<Section.root>
  <Section.header>
    <Section.title>Em progresso</Section.title>
    <Section.issueCount>32</Section.issueCount>
  </Section.header>
  <Section.content>
    {/* cards aqui */}
  </Section.content>
</Section.root>
```

## Example

**Before (props acumuladas):**
```tsx
<Section
  title="Em progresso"
  icon={<Clock />}
  count={32}
  cardData={cards}
  headerClassName="bg-blue-100"
/>
```

**After (composition pattern):**
```tsx
<Section.root>
  <Section.header className="bg-blue-100">
    <Clock />
    <Section.title>Em progresso</Section.title>
    <Section.issueCount>32</Section.issueCount>
  </Section.header>
  <Section.content>
    {cards.map(card => <Card key={card.id} {...card} />)}
  </Section.content>
</Section.root>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente com 3+ slots de conteudo | Usar composition pattern |
| Componente simples (botao, badge) | Um unico componente basta |
| Subcomponente precisa de dado do root | Criar Context no root, useContext no filho |
| Customizacao de estilo pontual | Passar className — twMerge garante merge correto |
| Elemento HTML varia (div, span, section) | Estender ComponentProps do elemento correto |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<Section title="X" count={3} icon={...}>` | `<Section.root><Section.title>X</Section.title>...</Section.root>` |
| `className={props.className}` sem merge | `className={twMerge('defaults', className)}` |
| `{...props}` antes do className | `className={twMerge(...)} {...props}` com className desestruturado |
| `export function SectionRoot` (individual) | `export const Section = { root: SectionRoot }` (agrupado) |
| `interface Props { children: ReactNode }` | `interface Props extends ComponentProps<'div'> {}` (herda tudo) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
