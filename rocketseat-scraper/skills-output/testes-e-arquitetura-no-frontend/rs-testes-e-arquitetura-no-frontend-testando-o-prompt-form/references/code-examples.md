# Code Examples: Testando o Prompt Form

## Estrutura completa do arquivo de teste

```typescript
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/lib/test-utils'
import { toast } from 'sonner'
import { PromptForm } from './prompt-form'

// Mock do useRouter do Next.js
const refreshMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}))

// Mock da server action
const createActionMock = jest.fn()
jest.mock('@/app/actions/create-prompt', () => ({
  createPromptAction: (...args: unknown[]) => createActionMock(...args),
}))

// Mock do toast (sonner)
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Setup do userEvent
const user = userEvent.setup()

// System Under Test
function makeSUT() {
  return render(<PromptForm />)
}

describe('PromptForm', () => {
  beforeEach(() => {
    createActionMock.mockReset()
    refreshMock.mockReset()
    ;(toast.success as jest.Mock).mockReset()
    ;(toast.error as jest.Mock).mockReset()
  })

  it('deve criar um novo prompt com sucesso', async () => {
    const successMessage = 'Prompt criado com sucesso'
    createActionMock.mockResolvedValueOnce({
      success: true,
      message: successMessage,
    })

    makeSUT()

    const titleInput = screen.getByPlaceholderText('Digite o titulo do prompt...')
    const contentInput = screen.getByPlaceholderText('Digite o conteudo do prompt...')
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    await user.type(titleInput, 'title')
    await user.type(contentInput, 'content')
    await user.click(submitButton)

    expect(createActionMock).toHaveBeenCalledWith('title', 'content')
    expect(toast.success).toHaveBeenCalledWith(successMessage)
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })

  it('deve exibir um erro quando a action de criacao falhar', async () => {
    const errorMessage = 'Erro ao criar prompt'
    createActionMock.mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    })

    makeSUT()

    const titleInput = screen.getByPlaceholderText('Digite o titulo do prompt...')
    const contentInput = screen.getByPlaceholderText('Digite o conteudo do prompt...')
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    await user.type(titleInput, 'title')
    await user.type(contentInput, 'content')
    await user.click(submitButton)

    expect(toast.error).toHaveBeenCalledWith(errorMessage)
    expect(refreshMock).not.toHaveBeenCalled()
  })
})
```

## Variacao: Componente com usePathname

```typescript
const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: jest.fn() }),
  usePathname: () => '/prompts',
}))
```

## Variacao: Mock de action que rejeita (throw)

```typescript
it('deve lidar com erro inesperado da action', async () => {
  createActionMock.mockRejectedValueOnce(new Error('Network error'))

  makeSUT()

  await user.type(screen.getByPlaceholderText('Digite o titulo do prompt...'), 'title')
  await user.type(screen.getByPlaceholderText('Digite o conteudo do prompt...'), 'content')
  await user.click(screen.getByRole('button', { name: /salvar/i }))

  // Validar tratamento de erro inesperado
  expect(refreshMock).not.toHaveBeenCalled()
})
```

## Usando debug() para inspecao

```typescript
it('debug example', () => {
  const { debug } = render(<PromptForm />)
  debug() // Imprime toda a arvore HTML no console
})
```

## Queries alternativas para capturar elementos

```typescript
// Por placeholder
screen.getByPlaceholderText('Digite o titulo...')

// Por role
screen.getByRole('button', { name: /salvar/i })
screen.getByRole('textbox', { name: /titulo/i })

// Por test-id (quando nenhuma query semantica funciona)
screen.getByTestId('prompt-form')

// Por texto visivel
screen.getByText('Salvar')
```