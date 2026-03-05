---
name: rs-testes-arquitetura-fe-feedback-usuario
description: "Enforces form validation feedback patterns with Zod and shadcn/ui in Next.js applications. Use when user asks to 'add form validation', 'show error messages', 'validate form fields', 'add user feedback', or 'test form errors'. Applies FormMessage component wiring, Zod schema error display, and testing validation messages with Vitest/Testing Library. Make sure to use this skill whenever implementing form validation UI or testing form error states in React/Next.js. Not for API validation, server-side error handling, or toast notifications."
---

# Feedback de Validacao para o Usuario

> Exiba mensagens de erro de validacao Zod usando FormMessage do shadcn/ui e teste que elas aparecem corretamente.

## Rules

1. **Use FormMessage dentro de FormItem** — o componente recebe automaticamente os erros do Zod via react-hook-form, porque isso elimina wiring manual entre schema e UI
2. **Nunca construa feedback de erro manualmente** — use os componentes do shadcn/ui (FormMessage, FormDescription), porque eles ja integram com o form context
3. **Teste mensagens de erro com submit vazio** — renderize o form, clique submit sem preencher, e valide que as mensagens do schema Zod aparecem em tela
4. **Valide que a action NAO foi chamada** — alem de checar mensagens, confirme que a server action nao executou quando validacao falha
5. **Busque dados no Server Component, passe via props** — logica de fetch fica no server component, client component recebe dados prontos
6. **Use repository pattern com orderBy** — ao buscar listas para sidebar, use o repository que ja tem ordenacao definida, porque garante ordem consistente

## How to write

### FormMessage no formulario

```tsx
import { FormMessage } from "@/components/ui/form"

<FormItem>
  <FormLabel>Titulo</FormLabel>
  <FormControl>
    <Input {...field} />
  </FormControl>
  <FormMessage /> {/* Exibe erro do Zod automaticamente */}
</FormItem>
```

### Teste de mensagens de erro

```tsx
it("deve exibir as mensagens de erro quando o formulario estiver vazio", async () => {
  render(<PromptForm />)

  const submitButton = screen.getByRole("button", { name: /salvar/i })
  await userEvent.click(submitButton)

  expect(screen.getByText("O título é obrigatório")).toBeVisible()
  expect(screen.getByText("O conteúdo é obrigatório")).toBeVisible()
  expect(createActionMock).not.toHaveBeenCalled()
})
```

### Server Component com repository

```tsx
// sidebar.tsx (Server Component)
export async function Sidebar() {
  const repository = new PrismaPromptRepository(prisma)
  let prompts: PromptSummary[] = []

  try {
    const result = await repository.findMany()
    prompts = result.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
    }))
  } catch {
    prompts = []
  }

  return <SidebarContent prompts={prompts} />
}
```

## Example

**Before (sem feedback):**
```tsx
<FormItem>
  <FormLabel>Titulo</FormLabel>
  <FormControl>
    <Input {...field} />
  </FormControl>
  {/* Usuario submete form vazio e nada acontece */}
</FormItem>
```

**After (com feedback):**
```tsx
<FormItem>
  <FormLabel>Titulo</FormLabel>
  <FormControl>
    <Input {...field} />
  </FormControl>
  <FormMessage /> {/* "O título é obrigatório" aparece automaticamente */}
</FormItem>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Form com Zod + shadcn/ui | Adicione `<FormMessage />` em cada FormItem |
| Teste de validacao | Submit vazio + verificar texto das mensagens do schema |
| Teste de validacao | Verificar que action/submit handler NAO foi chamado |
| Falso positivo em teste | Altere o texto esperado levemente para confirmar que quebra |
| Dados no sidebar/lista | Fetch no Server Component, props para Client Component |
| Erro no fetch de dados | try/catch retornando array vazio como fallback |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `{errors.title && <span>{errors.title}</span>}` | `<FormMessage />` dentro de FormItem |
| Teste so verificando mensagem sem checar action | `expect(action).not.toHaveBeenCalled()` junto |
| Fetch de dados no Client Component com useEffect | Fetch no Server Component, passe via props |
| `console.error(error)` no catch do server component | Retorne fallback silencioso (array vazio) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-melhorando-o-feedback-para-o-usuario/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-melhorando-o-feedback-para-o-usuario/references/code-examples.md)
