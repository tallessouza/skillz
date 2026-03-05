# Code Examples: PromptList e PromptCard

## Entidade completa do dominio

```typescript
// src/core/domain/prompts/prompt-entity.ts
export type Prompt = {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// Tipo derivado para listagens — so campos necessarios
export type PromptSummary = Pick<Prompt, 'id' | 'title' | 'content'>
```

## PromptList completo

```typescript
// src/components/prompt/prompt-list.tsx
import { PromptSummary } from '@/core/domain/prompts/prompt-entity'
import { PromptCard } from './prompt-card'

type PromptListProps = {
  prompts: PromptSummary[]
}

export const PromptList = ({ prompts }: PromptListProps) => {
  return (
    <ul className="space-y-2">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </ul>
  )
}
```

## PromptCard completo

```typescript
// src/components/prompt/prompt-card.tsx
import Link from 'next/link'
import { PromptSummary } from '@/core/domain/prompts/prompt-entity'

type PromptCardProps = {
  prompt: PromptSummary
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  return (
    <li className="...">
      <Link href={`/${prompt.id}`} prefetch className="...">
        <header className="...">
          <h3 className="...">{prompt.title}</h3>
          <p className="...">{prompt.content}</p>
        </header>
      </Link>
    </li>
  )
}
```

## Barrel export

```typescript
// src/components/prompt/index.ts
export { PromptList } from './prompt-list'
export { PromptCard } from './prompt-card'
```

## Uso na Sidebar (consumidor)

```typescript
// Antes: tipo local + map inline
const Sidebar = ({ prompts }: { prompts: { id: string; title: string; content: string }[] }) => {
  return (
    <ul>
      {prompts.map((prompt) => (
        <li key={prompt.id}>
          <p>{prompt.title}</p>
        </li>
      ))}
    </ul>
  )
}

// Depois: tipo centralizado + componente extraido
import { PromptList } from '@/components/prompt'
import { PromptSummary } from '@/core/domain/prompts/prompt-entity'

const Sidebar = ({ prompts }: { prompts: PromptSummary[] }) => {
  return <PromptList prompts={prompts} />
}
```

## Alternativa com Omit

```typescript
// Se a entidade tem muitos campos e voce quer quase todos:
export type PromptSummary = Omit<Prompt, 'createdAt' | 'updatedAt'>

// Resultado identico: { id: string; title: string; content: string }
```

## Verificacao pos-refatoracao

```bash
# Rodar testes da sidebar apos extrair PromptList
npm test -- sidebar

# Todos devem passar sem alteracao nos testes
# Se quebraram, a refatoracao mudou comportamento (bug)
```