---
name: rs-testes-arquitetura-fe-server-action-form
description: "Enforces test-first Server Action integration pattern in Next.js forms. Use when user asks to 'integrate server action', 'connect form to action', 'test server action', 'submit form in Next.js', or 'handle form errors'. Applies pattern: write action tests first, then integrate with form via handleSubmit, handle success/error states. Make sure to use this skill whenever wiring Next.js Server Actions to React Hook Form. Not for API routes, client-side fetching, or unit testing UI components."
---

# Integrando Server Action ao Formulário

> Teste o comportamento da Server Action antes de integrar ao formulário — a UI é a última camada, não a primeira.

## Rules

1. **Teste todos os cenários da Action antes de tocar no front** — sucesso, erro de validação, erro genérico, porque assim você garante que o comportamento funciona antes de conectar à UI
2. **Resete mocks antes de cada grupo de testes** — `vi.mocked(repository.create).mockReset()` no `beforeEach`, porque mocks de um teste vazam para o próximo
3. **Remova `.only` antes de commitar** — rode todos os testes juntos para garantir que não há interferência entre eles
4. **Organize testes em `describe` por domínio** — `Create Prompt Action`, `Search Prompt Action`, porque os logs ficam claros e diretos
5. **Trate erro antes do sucesso no submit** — `if (!result.success) return` antes de qualquer ação de sucesso, porque early return simplifica o fluxo
6. **Use `router.refresh()` após mutação bem-sucedida** — não `router.push`, porque refresh revalida os dados da página atual

## How to write

### Teste de erro genérico da Action

```typescript
it('deve retornar erro genérico quando criação falhar', async () => {
  // Mock do repository retornando erro
  vi.mocked(repository.create).mockRejectedValueOnce(new Error('DB error'))

  const data = { title: 'title', content: 'content' }
  const result = await createPromptAction(data)

  expect(result.success).toBe(false)
  expect(result.message).toBe('Falha ao criar o prompt')
})
```

### Integração do submit no formulário

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { createPromptAction } from '@/actions/create-prompt-action'
import { CreatePromptDto } from '@/dtos/create-prompt-dto'

// Dentro do componente do formulário:
const router = useRouter()

const submit = async (data: CreatePromptDto) => {
  const result = await createPromptAction(data)

  if (!result.success) {
    // Tratar erro (toast, setState, etc.)
    return
  }

  router.refresh()
}

// No JSX:
<form onSubmit={form.handleSubmit(submit)}>
```

### Reset de mocks no beforeEach

```typescript
beforeEach(() => {
  vi.mocked(repository.create).mockReset()
  vi.mocked(repository.findByTitle).mockReset()
})
```

## Example

**Before (sem testes, integração direta):**
```typescript
// Vai direto pro front sem testar a action
const submit = async (data: CreatePromptDto) => {
  await createPromptAction(data)
  router.push('/prompts')
}
```

**After (test-first, tratamento de erro):**
```typescript
// Action já testada: sucesso, validação, erro genérico
const submit = async (data: CreatePromptDto) => {
  const result = await createPromptAction(data)

  if (!result.success) {
    // Erro já mapeado nos testes
    return
  }

  router.refresh()
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova Server Action criada | Teste sucesso + todos os cenários de erro antes de integrar |
| Mock de repositório interfere entre testes | Adicione `mockReset()` no `beforeEach` |
| Projeto nem está rodando durante dev | Normal — rode só os testes até a Action estar sólida |
| Após mutação bem-sucedida | `router.refresh()` para revalidar dados |
| Múltiplos cenários de teste | Agrupe em `describe` por Action |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `form.handleSubmit(createPromptAction)` direto | `form.handleSubmit(submit)` com função intermediária |
| Testar só o cenário de sucesso | Testar sucesso + validação + erro genérico |
| `router.push('/prompts')` após criar | `router.refresh()` para revalidar a página |
| Mocks sem reset entre testes | `mockReset()` no `beforeEach` de cada describe |
| `.only` no commit | Remover antes de finalizar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
