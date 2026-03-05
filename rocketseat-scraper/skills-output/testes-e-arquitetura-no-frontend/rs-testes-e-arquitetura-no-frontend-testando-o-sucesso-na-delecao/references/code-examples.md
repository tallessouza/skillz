# Code Examples: Testando Sucesso na Deleção

## Setup completo do mock de toast

```typescript
// No topo do arquivo de teste, antes de qualquer describe
import { toast } from 'sonner'

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
```

## Teste completo de deleção com confirmação

```typescript
it('should remove successfully and show toast', async () => {
  const { user } = makeSUT({ prompt })

  // Passo 1: Capturar e clicar no botão de deletar
  const deleteButton = screen.getByRole('button', { name: /deletar/i })
  await user.click(deleteButton)

  // Passo 2: O modal de confirmação aparece — clicar em confirmar
  const confirmButton = screen.getByRole('button', { name: /confirmar remoção/i })
  await user.click(confirmButton)

  // Passo 3: Verificar que o toast de sucesso foi chamado com a mensagem correta
  expect(toast.success).toHaveBeenCalledWith('Prompt removido com sucesso')
})
```

## Componente: adicionando o toast guiado pelo teste

```typescript
// No PromptCard component
import { toast } from 'sonner'

// Dentro do handler de confirmação de deleção:
const handleConfirmDelete = async () => {
  // Futuramente: await deletePromptAction(prompt.id)
  toast.success('Prompt removido com sucesso')
}
```

## Variação: testando que o dialog de confirmação aparece

```typescript
it('should show confirmation dialog when delete is clicked', async () => {
  const { user } = makeSUT({ prompt })

  const deleteButton = screen.getByRole('button', { name: /deletar/i })
  await user.click(deleteButton)

  expect(
    screen.getByRole('button', { name: /confirmar remoção/i })
  ).toBeInTheDocument()
})
```

## Variação: preparação para teste de erro (próxima aula)

```typescript
it('should show error toast when deletion fails', async () => {
  // Mock da action para falhar
  mockDeleteAction.mockRejectedValueOnce(new Error('Failed'))

  const { user } = makeSUT({ prompt })

  const deleteButton = screen.getByRole('button', { name: /deletar/i })
  await user.click(deleteButton)

  const confirmButton = screen.getByRole('button', { name: /confirmar remoção/i })
  await user.click(confirmButton)

  expect(toast.error).toHaveBeenCalledWith('Erro ao remover prompt')
})
```

## Padrão makeSUT usado na aula

```typescript
function makeSUT(props: { prompt: Prompt }) {
  const user = userEvent.setup()
  render(<PromptCard {...props} />)
  return { user }
}
```