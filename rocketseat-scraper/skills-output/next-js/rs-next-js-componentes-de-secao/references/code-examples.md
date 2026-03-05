# Code Examples: Compound Components (Composition Pattern)

## Exemplo completo do componente Section

Este e o componente construido durante a aula, representando uma coluna de um board/kanban:

```typescript
// src/components/section.tsx
import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface SectionRootProps extends ComponentProps<'div'> {}

function SectionRoot({ className, ...props }: SectionRootProps) {
  return (
    <div
      className={twMerge(
        'bg-zinc-800 rounded-lg p-4 flex flex-col gap-4',
        className
      )}
      {...props}
    />
  )
}

interface SectionHeaderProps extends ComponentProps<'div'> {}

function SectionHeader({ className, ...props }: SectionHeaderProps) {
  return (
    <div
      className={twMerge('flex items-center justify-between', className)}
      {...props}
    />
  )
}

interface SectionTitleProps extends ComponentProps<'span'> {}

function SectionTitle({ className, ...props }: SectionTitleProps) {
  return (
    <span
      className={twMerge('text-sm font-medium text-zinc-100', className)}
      {...props}
    />
  )
}

interface SectionIssueCountProps extends ComponentProps<'span'> {}

function SectionIssueCount({ className, ...props }: SectionIssueCountProps) {
  return (
    <span
      className={twMerge('text-xs text-zinc-400', className)}
      {...props}
    />
  )
}

interface SectionContentProps extends ComponentProps<'div'> {}

function SectionContent({ className, ...props }: SectionContentProps) {
  return (
    <div
      className={twMerge('flex flex-col gap-3', className)}
      {...props}
    />
  )
}

export const Section = {
  root: SectionRoot,
  header: SectionHeader,
  title: SectionTitle,
  issueCount: SectionIssueCount,
  content: SectionContent,
}
```

## Uso na page

```tsx
// src/app/page.tsx
import { Section } from '@/components/section'

export default function Home() {
  return (
    <div className="flex gap-6 p-8">
      <Section.root>
        <Section.header>
          <Section.title>Em progresso</Section.title>
          <Section.issueCount>32</Section.issueCount>
        </Section.header>
        <Section.content>
          {/* Cards aqui */}
        </Section.content>
      </Section.root>

      {/* Customizacao pontual com className */}
      <Section.root className="bg-nave-300">
        <Section.header>
          <Section.title>Concluido</Section.title>
          <Section.issueCount>15</Section.issueCount>
        </Section.header>
        <Section.content>
          {/* Cards aqui */}
        </Section.content>
      </Section.root>
    </div>
  )
}
```

## O problema do className sem twMerge

```tsx
// SEM twMerge — className do usuario SUBSTITUI o default
function SectionRoot({ className, ...props }: SectionRootProps) {
  return (
    // Se usuario passa className="bg-red-500", PERDE todas as classes default
    <div className="bg-zinc-800 rounded-lg p-4" {...props} />
    // O {...props} inclui className="bg-red-500" que substitui tudo
  )
}

// COM twMerge — merge inteligente
function SectionRoot({ className, ...props }: SectionRootProps) {
  return (
    <div
      className={twMerge('bg-zinc-800 rounded-lg p-4', className)}
      {...props}
    />
    // Se usuario passa "bg-red-500", resultado: "rounded-lg p-4 bg-red-500"
    // twMerge remove bg-zinc-800 porque bg-red-500 e conflitante
  )
}
```

## Variacao: compartilhando estado via Context

```tsx
import { createContext, useContext, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type Variant = 'default' | 'highlight' | 'dimmed'

const SectionContext = createContext<{ variant: Variant }>({ variant: 'default' })

interface SectionRootProps extends ComponentProps<'div'> {
  variant?: Variant
}

function SectionRoot({ variant = 'default', className, ...props }: SectionRootProps) {
  return (
    <SectionContext.Provider value={{ variant }}>
      <div
        className={twMerge('bg-zinc-800 rounded-lg p-4', className)}
        {...props}
      />
    </SectionContext.Provider>
  )
}

function SectionTitle({ className, ...props }: ComponentProps<'span'>) {
  const { variant } = useContext(SectionContext)

  return (
    <span
      className={twMerge(
        'text-sm font-medium',
        variant === 'highlight' && 'text-yellow-300',
        variant === 'dimmed' && 'text-zinc-500',
        className
      )}
      {...props}
    />
  )
}

// Uso:
<Section.root variant="highlight">
  <Section.title>Este titulo fica amarelo automaticamente</Section.title>
</Section.root>
```

## Aplicando o mesmo pattern para Card

```typescript
// src/components/card.tsx
import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardRootProps extends ComponentProps<'div'> {}

function CardRoot({ className, ...props }: CardRootProps) {
  return (
    <div
      className={twMerge('bg-zinc-700 rounded-md p-3', className)}
      {...props}
    />
  )
}

interface CardTitleProps extends ComponentProps<'span'> {}

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <span
      className={twMerge('text-sm text-zinc-100', className)}
      {...props}
    />
  )
}

interface CardDescriptionProps extends ComponentProps<'p'> {}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={twMerge('text-xs text-zinc-400', className)}
      {...props}
    />
  )
}

export const Card = {
  root: CardRoot,
  title: CardTitle,
  description: CardDescription,
}
```