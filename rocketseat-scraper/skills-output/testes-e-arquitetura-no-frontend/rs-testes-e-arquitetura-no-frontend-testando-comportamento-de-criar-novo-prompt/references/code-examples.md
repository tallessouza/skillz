# Code Examples: Testando Navegacao com Push Mock

## Exemplo completo do teste da aula

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './Sidebar'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const user = userEvent.setup()

function makeSUT() {
  render(<Sidebar />)
}

describe('Sidebar', () => {
  describe('colapsar', () => {
    it('deveria colapsar a sidebar ao clicar no botao', async () => {
      makeSUT()
      const button = screen.getByRole('button', { name: /colapsar/i })
      await user.click(button)
      // verificacoes de colapso...
    })
  })

  describe('novoPrompt', () => {
    it('deveria navegar o usuario para a pagina de novo prompt', async () => {
      makeSUT()

      const newButton = screen.getByRole('button', { name: /novo prompt/i })
      await user.click(newButton)

      expect(pushMock).toHaveBeenCalledWith('/nu')
    })
  })
})
```

## Variacao: verificar numero de chamadas

```typescript
it('deveria navegar apenas uma vez ao clicar', async () => {
  makeSUT()

  const newButton = screen.getByRole('button', { name: /novo prompt/i })
  await user.click(newButton)

  expect(pushMock).toHaveBeenCalledTimes(1)
  expect(pushMock).toHaveBeenCalledWith('/nu')
})
```

## Variacao: limpar mock entre testes

```typescript
describe('novoPrompt', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('deveria navegar para /nu', async () => {
    makeSUT()
    const btn = screen.getByRole('button', { name: /novo prompt/i })
    await user.click(btn)
    expect(pushMock).toHaveBeenCalledWith('/nu')
  })

  it('nao deveria navegar sem click', () => {
    makeSUT()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
```

## Exemplo com next-router-mock (cenario complexo)

```typescript
import mockRouter from 'next-router-mock'

jest.mock('next/router', () => require('next-router-mock'))

it('deveria iniciar na pagina correta e navegar', async () => {
  mockRouter.push('/dashboard')
  makeSUT()

  const btn = screen.getByRole('button', { name: /novo prompt/i })
  await user.click(btn)

  expect(mockRouter).toMatchObject({
    pathname: '/nu',
  })
})
```

## Teste de prova de falha (como o instrutor demonstrou)

```typescript
// Mude o argumento esperado para provar que o teste quebra
it('deveria falhar quando a rota esta errada', async () => {
  makeSUT()
  const btn = screen.getByRole('button', { name: /novo prompt/i })
  await user.click(btn)

  // Isso VAI falhar — proposital para validar o mock
  // expect(pushMock).toHaveBeenCalledWith('/edit')

  // Correto:
  expect(pushMock).toHaveBeenCalledWith('/nu')
})
```