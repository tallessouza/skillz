# Code Examples: Cobrindo Cenarios no Prompt Card

## Exemplo completo do teste de erro controlado

```typescript
it('should display error when action fails', async () => {
  const errorMessage = 'Erro ao remover prompt'

  deleteMock.mockResolvedValue({
    success: false,
    message: errorMessage,
  })

  render(<PromptCard prompt={mockPrompt} />)

  // Clica no botao remover
  const removeButton = screen.getByRole('button', { name: /remover/i })
  await userEvent.click(removeButton)

  // Confirma no modal
  const confirmButton = screen.getByRole('button', { name: /confirmar/i })
  await userEvent.click(confirmButton)

  // Verifica toast de erro
  expect(toast.error).toHaveBeenCalledWith(errorMessage)
})
```

## Exemplo completo do teste de excecao

```typescript
it('should display error when action throws exception', async () => {
  const errorMessage = 'Unexpected error'

  deleteMock.mockRejectedValueOnce(new Error(errorMessage))

  render(<PromptCard prompt={mockPrompt} />)

  const removeButton = screen.getByRole('button', { name: /remover/i })
  await userEvent.click(removeButton)

  const confirmButton = screen.getByRole('button', { name: /confirmar/i })
  await userEvent.click(confirmButton)

  expect(toast.error).toHaveBeenCalledWith(errorMessage)
})
```

## Handler do componente — versao com try/catch (instrutor prefere)

```typescript
async function handleDelete() {
  try {
    setIsDeleting(true)
    const result = await deletePromptAction(prompt.id)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  } catch (error) {
    toast.error('Erro inesperado ao remover prompt')
  } finally {
    setIsDeleting(false)
  }
}
```

## Handler refatorado — versao simplificada (sem try/catch)

```typescript
async function handleDelete() {
  setIsDeleting(true)
  const result = await deletePromptAction(prompt.id)

  if (result.success) {
    toast.success(result.message)
  } else {
    toast.error(result.message)
  }
  setIsDeleting(false)
}
```

## Usando ternario para eliminar if/else

```typescript
// Alternativa mostrada pelo instrutor
const result = await deletePromptAction(prompt.id)
toast[result.success ? 'success' : 'error'](result.message)
```

## A action que o componente consome

```typescript
// deletePromptAction — trata erros internamente
export async function deletePromptAction(id: string) {
  try {
    await deletePromptUseCase(id)
    return { success: true, message: 'Prompt removido com sucesso' }
  } catch (error) {
    return { success: false, message: 'Erro ao remover prompt' }
  }
}
```

## Rodando coverage para descobrir branches

```bash
# Rodar coverage focado no componente
npx vitest --coverage --watch prompt-card

# Output mostra linhas nao cobertas:
# PromptCard.tsx | 85% | Uncovered lines: 40-41
```

## Padrao de mock setup reutilizavel

```typescript
// No topo do describe
const deleteMock = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

// Cada teste configura o mock para seu cenario
// Sucesso:
deleteMock.mockResolvedValue({ success: true, message: 'OK' })
// Falha controlada:
deleteMock.mockResolvedValue({ success: false, message: 'Erro' })
// Excecao:
deleteMock.mockRejectedValueOnce(new Error('Erro'))
```