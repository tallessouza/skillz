# Code Examples: Testando Componente Logo

## Exemplo completo da aula

### Estrutura de arquivos

```
src/
  components/
    sidebar/
      logo/
        logo.tsx
        logo.spec.tsx    # <-- arquivo criado nesta aula
      actions/
        actions.spec.tsx  # <-- ja existia
```

### Componente Logo (sendo testado)

```typescript
// logo.tsx
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/">
      Prompts
    </Link>
  )
}
```

### Teste criado na aula

```typescript
// logo.spec.tsx
import { render, screen } from '@testing-library/react'
import { Logo } from './logo'

describe('Logo', () => {
  it('deveria renderizar o link para home', () => {
    render(<Logo />)

    const link = screen.getByRole('link', { name: /prompts/i })

    expect(link).toBeVisible()
    expect(link).toHaveAttribute('href', '/')
  })
})
```

### Comando para rodar

```bash
pnpm test --watch
pnpm test --coverage
```

## Variacoes e extensoes

### Se o Logo tivesse uma imagem

```typescript
it('deveria renderizar o link com imagem do logo', () => {
  render(<Logo />)

  const link = screen.getByRole('link', { name: /prompts/i })
  const image = screen.getByRole('img', { name: /logo/i })

  expect(link).toBeVisible()
  expect(link).toHaveAttribute('href', '/')
  expect(image).toBeVisible()
})
```

### Se precisasse testar com makeSut (multiplos testes)

```typescript
function makeSut() {
  render(<Logo />)

  return {
    link: screen.getByRole('link', { name: /prompts/i }),
  }
}

describe('Logo', () => {
  it('deveria estar visivel', () => {
    const { link } = makeSut()
    expect(link).toBeVisible()
  })

  it('deveria apontar para home', () => {
    const { link } = makeSut()
    expect(link).toHaveAttribute('href', '/')
  })
})
```

### Comparacao: toBeVisible vs toBeInTheDocument

```typescript
// Cenario: elemento com display:none
const { container } = render(<div style={{ display: 'none' }}>Hidden</div>)

const el = screen.getByText('Hidden')

expect(el).toBeInTheDocument() // PASSA - esta no DOM
expect(el).toBeVisible()       // FALHA - nao esta visivel
```