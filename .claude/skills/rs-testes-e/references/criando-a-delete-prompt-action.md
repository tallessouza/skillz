---
name: rs-testes-e-criando-a-delete-prompt-action
description: "Enforces server action structure and test mocking patterns when creating delete/remove actions in Next.js. Use when user asks to 'create a delete action', 'write a server action', 'mock an action in tests', or 'test before implementing'. Applies FormState return pattern, soft error handling, and jest.mock for action isolation. Make sure to use this skill whenever building CRUD actions with test coverage in Next.js. Not for API routes, database queries, or use case implementation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: server-actions
  tags: [testing, next-js, react, jest, mock, server-actions, use-case, clean-architecture, forms]
---

# Criando Delete Actions com Testes Isolados

> Estruture server actions com retorno padronizado FormState e teste o comportamento do componente antes de completar a implementação.

## Rules

1. **Retorne FormState, nunca lance exceções** — `{ success: boolean, message: string }`, porque o componente precisa de um contrato previsível para exibir toasts
2. **Valide inputs com soft return** — `if (!id) return { success: false, message: "ID obrigatório" }`, porque throw quebra o fluxo sem feedback ao usuário
3. **Delegue erros específicos via casting** — `(error as Error).message` com comparação contra mensagens conhecidas, porque permite diferenciar "não encontrado" de "falha genérica"
4. **Mocke a action inteira no teste do componente** — `jest.mock("@/app/actions/prompt-actions")` com `mockResolvedValue`, porque o teste do componente valida comportamento de UI, não lógica de negócio
5. **Teste o comportamento antes da implementação existir** — escreva o teste com mock antes de completar a action/use case, porque garante o contrato sem depender de implementação
6. **Organize actions por prioridade** — CRUD actions primeiro, search por último, porque facilita navegação no arquivo

## How to write

### Server Action com FormState

```typescript
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

### Componente consumindo a action

```typescript
const handleDelete = async () => {
  const result = await deletePromptAction(prompt.id)

  if (!result.success) {
    toast.error(result.message)
  } else {
    toast.success(result.message)
  }
}
```

### Mock da action no teste

```typescript
const deleteMock = jest.fn()

jest.mock("@/app/actions/prompt-actions", () => ({
  deletePromptAction: (id: string) => deleteMock(id),
}))

it("should remove prompt successfully", async () => {
  deleteMock.mockResolvedValue({
    success: true,
    message: "Prompt removido com sucesso",
  })

  // render, click delete, assert toast
})
```

## Example

**Before (sem mock, teste acoplado à implementação):**
```typescript
// Teste quebra porque a action real chama use case que não existe ainda
it("should delete", async () => {
  render(<PromptCard prompt={mockPrompt} />)
  await userEvent.click(screen.getByText("Delete"))
  // ❌ Falha: use case não implementado
})
```

**After (mock isolando o componente):**
```typescript
const deleteMock = jest.fn()
jest.mock("@/app/actions/prompt-actions", () => ({
  deletePromptAction: (id: string) => deleteMock(id),
}))

it("should delete and show success toast", async () => {
  deleteMock.mockResolvedValue({ success: true, message: "Removido com sucesso" })
  render(<PromptCard prompt={mockPrompt} />)
  await userEvent.click(screen.getByText("Delete"))
  // ✅ Passa: componente testado independente da action
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Action ainda não tem use case | Mock no teste do componente, teste o contrato |
| Erro conhecido (not found) | Compare `error.message` e retorne message específica |
| Erro desconhecido | Retorne message genérica "Falha ao..." |
| Validação de input | Soft return antes do try/catch |
| Verificar falso positivo | Troque a message no mock e confirme que quebra |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `throw new Error("ID obrigatório")` | `return { success: false, message: "ID obrigatório" }` |
| Teste sem mock que depende de infra | `jest.mock` da action com `mockResolvedValue` |
| `toast.error("Erro")` genérico | `toast.error(result.message)` vindo da action |
| Esperar implementação completa para testar | Testar com mock antes da implementação existir |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
