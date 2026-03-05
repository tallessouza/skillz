# Code Examples: Testando Comportamentos da Sidebar Content

## Setup completo do arquivo de teste

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarContent } from './sidebar-content'

describe('SidebarContent', () => {
  const user = userEvent.setup()

  function makeSUT() {
    return render(<SidebarContent />)
  }

  describe('Colapsar/Expandir', () => {
    it('deveria iniciar expandida e exibir o botao minimizar', () => {
      makeSUT()

      const aside = screen.getByRole('complementary')
      expect(aside).toBeVisible()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })
      expect(collapseButton).toBeVisible()

      const expandButton = screen.queryByRole('button', {
        name: /expand sidebar/i,
      })
      expect(expandButton).not.toBeInTheDocument()
    })

    it('deveria contrair e mostrar o botao de expandir', async () => {
      makeSUT()

      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      })

      await user.click(collapseButton)

      const expandButton = screen.getByRole('button', {
        name: /expand sidebar/i,
      })
      expect(expandButton).toBeInTheDocument()

      const collapsedButton = screen.queryByRole('button', {
        name: /minimizar sidebar/i,
      })
      expect(collapsedButton).not.toBeInTheDocument()
    })
  })
})
```

## Componente com acessibilidade corrigida

O botao de colapsar precisou de `title` e `aria-label` para ser encontrado pelo teste:

```tsx
// ANTES — botao sem identificacao acessivel
<button onClick={toggleSidebar}>
  <ChevronLeft />
</button>

// DEPOIS — com title e aria-label
<button
  onClick={toggleSidebar}
  title="Minimizar sidebar"
  aria-label="Minimizar sidebar"
>
  <ChevronLeft />
</button>
```

## Regex no name do getByRole

```typescript
// Case insensitive — encontra "Minimizar", "minimizar", "MINIMIZAR"
screen.getByRole('button', { name: /minimizar/i })

// Case sensitive — encontra apenas "Minimizar sidebar" exato
screen.getByRole('button', { name: 'Minimizar sidebar' })

// Parcial com regex — encontra qualquer botao que contenha "minimizar"
screen.getByRole('button', { name: /minimizar/i })
```

## Variacao: makeSUT com props customizaveis

```typescript
interface MakeSUTOptions {
  initialCollapsed?: boolean
}

function makeSUT(options: MakeSUTOptions = {}) {
  const { initialCollapsed = false } = options
  return render(<SidebarContent initialCollapsed={initialCollapsed} />)
}

// Uso nos testes
it('deveria iniciar colapsada quando configurado', () => {
  makeSUT({ initialCollapsed: true })

  const expandButton = screen.getByRole('button', {
    name: /expand sidebar/i,
  })
  expect(expandButton).toBeVisible()
})
```

## Demonstracao de regressao

```typescript
// Se alguem remover o onClick do botao de colapsar:
<button title="Minimizar sidebar" aria-label="Minimizar sidebar">
  <ChevronLeft />
</button>

// O teste "deveria contrair e mostrar o botao de expandir" FALHA
// porque o click nao produz efeito e o expandButton nunca aparece
```

## Roles comuns do HTML semantico

| Tag HTML | Role | Uso no getByRole |
|----------|------|------------------|
| `<aside>` | complementary | `getByRole('complementary')` |
| `<button>` | button | `getByRole('button', { name: /texto/i })` |
| `<header>` | banner | `getByRole('banner')` |
| `<nav>` | navigation | `getByRole('navigation')` |
| `<main>` | main | `getByRole('main')` |
| `<footer>` | contentinfo | `getByRole('contentinfo')` |
| `<section>` | region | `getByRole('region', { name: /titulo/i })` |