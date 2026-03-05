# Code Examples: Testando Copy Button

## Estrutura completa do arquivo de teste

```typescript
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyButton, type CopyButtonProps } from '@/components/button-actions/copy-button'
import { toast } from 'sonner'

jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}))

const writeTextMock = jest.fn()

const makeSut = (props?: Partial<CopyButtonProps>) => {
  return render(<CopyButton content="" {...props} />)
}

describe('CopyButton', () => {
  beforeEach(() => {
    writeTextMock.mockReset()
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    })
    jest.useFakeTimers()
  })

  it('deve desabilitar o botão quando o conteúdo estiver vazio', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    makeSut({ content: '' })

    const button = screen.getByRole('button', { name: 'copiar' })
    expect(button).toBeDisabled()

    await user.click(button)
    expect(writeTextMock).not.toHaveBeenCalled()
  })

  it('deve copiar, alterar label para copiado e voltar para copiar', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    writeTextMock.mockResolvedValueOnce(undefined)

    makeSut({ content: 'text' })
    const button = screen.getByRole('button', { name: 'copiar' })

    await user.click(button)

    const copiedButton = await screen.findByRole('button', { name: 'copiado' })
    expect(copiedButton).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    const resetButton = await screen.findByRole('button', { name: 'copiar' })
    expect(resetButton).toBeVisible()
  })

  it('deve exibir toast de erro quando o copiar falhar', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const errorMessage = 'erro ao copiar o texto'
    const error = new Error(errorMessage)

    jest.spyOn(global.navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(error)

    makeSut({ content: 'text' })
    const button = screen.getByRole('button', { name: 'copiar' })

    await user.click(button)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })

    expect(screen.getByRole('button', { name: 'copiar' })).toBeVisible()
  })

  it('deve limpar o timer anterior antes de copiar novamente', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    writeTextMock.mockResolvedValueOnce(undefined)

    const clearSpy = jest.spyOn(window, 'clearTimeout')

    makeSut({ content: 'text' })
    const button = screen.getByRole('button', { name: 'copiar' })

    await user.click(button)

    const copiedButton = await screen.findByRole('button', { name: 'copiado' })
    expect(copiedButton).toBeInTheDocument()

    await user.click(copiedButton)

    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })
})
```

## Variacao: testando com diferentes conteudos

```typescript
it('deve copiar o conteudo correto para o clipboard', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  const content = 'console.log("hello world")'
  writeTextMock.mockResolvedValueOnce(undefined)

  makeSut({ content })
  const button = screen.getByRole('button', { name: 'copiar' })

  await user.click(button)

  expect(writeTextMock).toHaveBeenCalledWith(content)
})
```

## Variacao: verificando que writeText recebe o texto exato

```typescript
it('deve passar o conteudo exato para clipboard.writeText', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  const multiLineContent = `function hello() {
  return 'world'
}`
  writeTextMock.mockResolvedValueOnce(undefined)

  makeSut({ content: multiLineContent })
  await user.click(screen.getByRole('button', { name: 'copiar' }))

  expect(writeTextMock).toHaveBeenCalledTimes(1)
  expect(writeTextMock).toHaveBeenCalledWith(multiLineContent)
})
```

## Pattern: makeSut com defaults

```typescript
// Exportar o type do componente para usar no makeSut
export type CopyButtonProps = {
  content: string
}

// No teste, defaults evitam repetir props em cada teste
const makeSut = (props?: Partial<CopyButtonProps>) => {
  return render(<CopyButton content="" {...props} />)
}
```