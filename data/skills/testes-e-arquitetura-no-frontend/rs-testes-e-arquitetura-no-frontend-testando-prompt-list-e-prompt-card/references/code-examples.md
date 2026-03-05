# Code Examples: Testando PromptList e PromptCard

## PromptList.spec.tsx — Completo

```typescript
import { render, screen } from '@testing-library/react'
import { PromptList, type PromptListProps } from './PromptList'

const makeSut = (prompts: PromptListProps['prompts']) => {
  render(<PromptList prompts={prompts} />)
}

describe('PromptList', () => {
  it('should render list with prompts', () => {
    const prompts = [
      { id: '1', title: 'a', content: 'x' },
      { id: '2', title: 'b', content: 'y' },
    ]
    makeSut(prompts)

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('x')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
    expect(screen.getByText('y')).toBeInTheDocument()
  })

  it('should not render list when there are no prompts', () => {
    makeSut([] as PromptListProps['prompts'])

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
```

## PromptCard.spec.tsx — Teste recomendado (sem mock de navegacao)

```typescript
import { render, screen } from '@testing-library/react'
import { PromptCard, type PromptCardProps } from './PromptCard'

const makeSut = (prompt: PromptCardProps['prompt']) => {
  render(<PromptCard prompt={prompt} />)
}

describe('PromptCard', () => {
  const prompt = { id: '1', title: 'title01', content: 'content01' }

  it('should render link with correct href', () => {
    makeSut(prompt)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/${prompt.id}`)
  })
})
```

## PromptCard.spec.tsx — Teste com mock de navegacao (NAO recomendado)

O instrutor mostrou esta abordagem mas explicitamente desaconselhou. Incluido aqui apenas como referencia.

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptCard, type PromptCardProps } from './PromptCard'

const pushMock = jest.fn()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prefetch = jest.fn()

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault()
          pushMock(href)
        }}
      >
        {children}
      </a>
    )
  }
})

const makeSut = (prompt: PromptCardProps['prompt']) => {
  render(<PromptCard prompt={prompt} />)
}

describe('PromptCard', () => {
  const prompt = { id: '1', title: 'title01', content: 'content01' }

  it('should render link with correct href', () => {
    makeSut(prompt)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/${prompt.id}`)
  })

  it('should redirect user when clicking card content', async () => {
    const user = userEvent.setup()
    makeSut(prompt)

    const link = screen.getByRole('link')
    await user.click(link)

    expect(pushMock).toHaveBeenCalledWith(`/${prompt.id}`)
  })
})
```

## Padroes de query — Referencia rapida

```typescript
// EXISTE — use get (lanca erro se nao encontrar)
screen.getByRole('list')
screen.getByRole('link')
screen.getByText('titulo')
screen.getAllByRole('listitem')

// NAO EXISTE — use query (retorna null)
screen.queryByRole('list')
screen.queryAllByRole('listitem')

// VAI EXISTIR (async) — use find
await screen.findByText('loaded')
```

## toHaveAttribute — Validando atributos HTML

```typescript
// Validar href de link
expect(link).toHaveAttribute('href', '/prompts/1')

// Validar target de link externo
expect(link).toHaveAttribute('target', '_blank')

// Validar type de input
expect(input).toHaveAttribute('type', 'email')

// Validar disabled
expect(button).toHaveAttribute('disabled')
```