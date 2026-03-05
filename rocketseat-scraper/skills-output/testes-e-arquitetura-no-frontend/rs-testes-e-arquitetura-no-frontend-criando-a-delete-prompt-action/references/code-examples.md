# Code Examples: Criando a Delete Prompt Action

## 1. Estrutura completa da action

```typescript
// app/actions/prompt-actions.ts

export async function deletePromptAction(id: string): Promise<FormState> {
  if (!id) {
    return { success: false, message: "ID do prompt é obrigatório" }
  }

  try {
    const repository = new PrismaRepository(prisma)
    const useCase = new DeletePromptUseCase(repository)
    await useCase.execute(id)

    return { success: true, message: "Prompt removido com sucesso" }
  } catch (error) {
    if ((error as Error).message === "promptNotFound") {
      return { success: false, message: "Prompt não encontrado" }
    }
    return { success: false, message: "Falha ao remover o prompt" }
  }
}
```

## 2. Componente PromptCard consumindo a action

```typescript
// components/PromptCard.tsx

const handleDelete = async () => {
  setIsDeleting(true)

  try {
    const result = await deletePromptAction(prompt.id)

    if (!result.success) {
      toast.error(result.message)
    } else {
      toast.success(result.message)
    }
  } catch (error) {
    toast.error((error as Error).message)
  } finally {
    setIsDeleting(false)
  }
}
```

## 3. Setup completo do mock no teste

```typescript
// components/__tests__/PromptCard.test.tsx

const deleteMock = jest.fn()

jest.mock("@/app/actions/prompt-actions", () => ({
  deletePromptAction: (id: string) => deleteMock(id),
}))

describe("PromptCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should show success toast when prompt is deleted", async () => {
    deleteMock.mockResolvedValue({
      success: true,
      message: "Prompt removido com sucesso",
    })

    render(<PromptCard prompt={mockPrompt} />)

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    await userEvent.click(deleteButton)

    expect(deleteMock).toHaveBeenCalledWith(mockPrompt.id)
    expect(await screen.findByText("Prompt removido com sucesso")).toBeInTheDocument()
  })

  it("should show error toast when deletion fails", async () => {
    deleteMock.mockResolvedValue({
      success: false,
      message: "Falha ao remover o prompt",
    })

    render(<PromptCard prompt={mockPrompt} />)

    const deleteButton = screen.getByRole("button", { name: /delete/i })
    await userEvent.click(deleteButton)

    expect(await screen.findByText("Falha ao remover o prompt")).toBeInTheDocument()
  })
})
```

## 4. Verificação de falso positivo

```typescript
// Para verificar que o teste não é falso positivo:
// 1. Troque a message no mockResolvedValue
deleteMock.mockResolvedValue({
  success: true,
  message: "Mensagem diferente", // ← deve fazer o teste quebrar
})

// 2. Rode o teste — se quebrar, o teste é legítimo
// 3. Restaure a message original
```

## 5. Padrão FormState (type)

```typescript
// types/form-state.ts
export type FormState = {
  success: boolean
  message: string
}
```

## 6. Tratamento de erros com mensagens conhecidas

```typescript
// Padrão para múltiplos erros conhecidos na action
try {
  await useCase.execute(id)
  return { success: true, message: "Operação realizada com sucesso" }
} catch (error) {
  const errorMessage = (error as Error).message

  // Erros conhecidos — mensagens amigáveis
  const knownErrors: Record<string, string> = {
    promptNotFound: "Prompt não encontrado",
    unauthorized: "Sem permissão para esta ação",
    databaseError: "Erro no banco de dados",
  }

  const friendlyMessage = knownErrors[errorMessage]

  if (friendlyMessage) {
    return { success: false, message: friendlyMessage }
  }

  // Erro genérico
  return { success: false, message: "Falha ao remover o prompt" }
}
```