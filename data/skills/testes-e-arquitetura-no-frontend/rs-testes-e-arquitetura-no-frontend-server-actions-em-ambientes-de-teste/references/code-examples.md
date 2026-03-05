# Code Examples: Server Actions em Ambientes de Teste

## Componente sob teste: SidebarContent

O componente tem uma ref para o form e dispara submit automaticamente quando ha query params:

```typescript
// components/sidebar/sidebar-content.tsx
'use client'

import { useRef } from 'react'

export function SidebarContent({ prompts }) {
  const formRef = useRef<HTMLFormElement>(null)

  // Dispara submit automaticamente se houver query de busca
  useEffect(() => {
    if (searchQuery) {
      formRef.current?.requestSubmit()
    }
  }, [searchQuery])

  return (
    <form ref={formRef} action={searchPrompt}>
      {/* search input e lista de prompts */}
    </form>
  )
}
```

## Componente pai: Sidebar (React Server Component)

```typescript
// components/sidebar/sidebar.tsx
import { Suspense } from 'react'
import { Spinner } from '@/components/spinner'
import { SidebarContent } from './sidebar-content'

export async function Sidebar() {
  const prompts = await getPrompts()

  return (
    <Suspense fallback={<Spinner />}>
      <SidebarContent prompts={prompts} />
    </Suspense>
  )
}
```

## Teste ANTES da correcao (com console error)

```typescript
// components/sidebar/__tests__/sidebar-content.test.tsx
import { render, screen } from '@testing-library/react'
import { SidebarContent } from '../sidebar-content'

describe('SidebarContent', () => {
  it('deve iniciar o campo de busca com search params', () => {
    // Este teste PASSA mas gera console error:
    // "A suspended resource finished loading inside a test,
    //  but the event was not wrapped in act(...)"
    render(<SidebarContent prompts={mockPrompts} />)
    expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()
  })
})
```

## Correcao com waitFor (preferida)

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { SidebarContent } from '../sidebar-content'

describe('SidebarContent', () => {
  it('deve iniciar o campo de busca com search params', async () => {
    render(<SidebarContent prompts={mockPrompts} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()
    })
  })
})
```

## Correcao com spyOn no requestSubmit

```typescript
import { render, screen } from '@testing-library/react'
import { SidebarContent } from '../sidebar-content'

describe('SidebarContent', () => {
  it('deve iniciar o campo de busca com search params', () => {
    // Intercepta o requestSubmit para evitar o ciclo assincrono
    const submitMock = jest.spyOn(
      HTMLFormElement.prototype,
      'requestSubmit'
    ).mockImplementation(() => undefined)

    render(<SidebarContent prompts={mockPrompts} />)

    expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()

    // OBRIGATORIO: restaurar o mock para nao contaminar outros testes
    submitMock.mockRestore()
  })
})
```

## Tecnica de diagnostico: isolando o teste problematico

```typescript
describe('SidebarContent', () => {
  it('teste A', () => { /* ... */ })
  it('teste B', () => { /* ... */ })

  // Usar .skip para isolar qual teste gera o console error
  it.skip('deve iniciar o campo de busca com search params', () => {
    // Se o erro sumiu ao skipar este teste, encontramos o culpado
    render(<SidebarContent prompts={mockPrompts} />)
    expect(screen.getByDisplayValue('search-term')).toBeInTheDocument()
  })
})
```

## Rodando testes com coverage para verificar

```bash
# Rodar com coverage para ver console errors E metricas
npx jest --coverage

# Rodar apenas um arquivo de teste
npx jest sidebar-content.test.tsx

# Rodar apenas um teste especifico
npx jest -t "deve iniciar o campo de busca"
```

## Demonstracao: coverage 100% nao garante qualidade

```bash
# Com o teste skipado:
npx jest --coverage
# Output:
# sidebar-content.tsx | 100% | 100% | 100% | 100%
# ^^^ AINDA 100% mesmo sem testar o cenario de search params!

# Sem skip:
npx jest --coverage
# Output:
# sidebar-content.tsx | 100% | 100% | 100% | 100%
# Console error: "A suspended resource finished loading..."
# ^^^ Coverage identica, mas agora com erro visivel
```