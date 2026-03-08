---
name: rs-testes-e-criando-o-prompt-list-e-prompt-card
description: "Enforces clean architecture patterns for list/card component pairs in Next.js when creating listing components with centralized domain types. Use when user asks to 'create a list component', 'build a card component', 'centralize types', 'create domain entities', or 'refactor shared types'. Applies rules: single source of truth for types via core/domain, Pick/Omit for derived types, single-responsibility list components, barrel exports. Make sure to use this skill whenever building list+card UI patterns or structuring domain entities in frontend projects. Not for backend APIs, database schemas, or test implementation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: ui-components
  tags: [testing, next-js, react]
---

# PromptList e PromptCard — Componentes de Listagem com Arquitetura Limpa

> Componentes de listagem seguem responsabilidade unica: o list renderiza, o card apresenta, e os tipos vivem no dominio.

## Rules

1. **Centralize tipos no dominio** — `src/core/domain/{entity}/entity.ts`, porque copiar tipos entre componentes elimina a fonte unica da verdade
2. **Derive tipos com Pick/Omit** — `type PromptSummary = Pick<Prompt, 'id' | 'title' | 'content'>`, porque mudancas na entidade base propagam automaticamente
3. **List so renderiza** — o componente list recebe dados via props e faz map, nunca busca dados, porque quem busca e o pai (sidebar, page)
4. **Card encapsula funcionalidades** — link, delete, actions ficam no card, nao no list, porque cada card e uma unidade independente de interacao
5. **Barrel exports por feature** — `components/prompt/index.ts` exporta tudo, porque simplifica imports no consumidor
6. **Rode testes apos refatorar** — mover tipos e extrair componentes deve manter testes passando, porque testes dao confianca para refatorar

## How to write

### Entidade de dominio

```typescript
// src/core/domain/prompts/prompt-entity.ts
export type Prompt = {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type PromptSummary = Pick<Prompt, 'id' | 'title' | 'content'>
```

### List component (responsabilidade unica)

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

### Card component (com funcionalidades)

```typescript
// src/components/prompt/prompt-card.tsx
import Link from 'next/link'
import { PromptSummary } from '@/core/domain/prompts/prompt-entity'

type PromptCardProps = {
  prompt: PromptSummary
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  return (
    <li>
      <Link href={`/${prompt.id}`} prefetch>
        <header>
          <h3>{prompt.title}</h3>
          <p>{prompt.content}</p>
        </header>
      </Link>
    </li>
  )
}
```

### Barrel export

```typescript
// src/components/prompt/index.ts
export { PromptList } from './prompt-list'
export { PromptCard } from './prompt-card'
```

## Example

**Before (tipos duplicados em cada componente):**
```typescript
// sidebar.tsx
type Prompt = { id: string; title: string; content: string }
const prompts: Prompt[] = [...]

// prompt-list.tsx
type Prompt = { id: string; title: string; content: string } // duplicado!
```

**After (tipo centralizado no dominio):**
```typescript
// core/domain/prompts/prompt-entity.ts
export type Prompt = { id: string; title: string; content: string; createdAt: Date; updatedAt: Date }
export type PromptSummary = Pick<Prompt, 'id' | 'title' | 'content'>

// sidebar.tsx
import { PromptSummary } from '@/core/domain/prompts/prompt-entity'

// prompt-list.tsx
import { PromptSummary } from '@/core/domain/prompts/prompt-entity'
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mesmo tipo usado em 2+ componentes | Extrair para core/domain |
| Componente so precisa de alguns campos | Usar Pick sobre a entidade completa |
| List component | Recebe dados via props, nunca faz fetch |
| Card tem interacoes (link, delete) | Encapsular no card, nao no list |
| Extraiu componente de outro | Rodar testes imediatamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `type Prompt = {...}` em cada arquivo | `import { Prompt } from '@/core/domain/...'` |
| List que faz fetch interno | List que recebe `prompts` via props |
| `prompts.map(...)` direto no parent | `<PromptList prompts={prompts} />` |
| Tipo inline nas props `{ prompts: {id: string}[] }` | Tipo derivado `{ prompts: PromptSummary[] }` |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
