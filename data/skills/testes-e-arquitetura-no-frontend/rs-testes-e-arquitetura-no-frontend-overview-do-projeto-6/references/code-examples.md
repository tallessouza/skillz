# Code Examples: Overview do Projeto — Testes e Arquitetura no Frontend

## Nota

Esta aula e uma overview introdutoria sem codigo demonstrado. Os exemplos abaixo ilustram os patterns mencionados pelo instrutor para referencia rapida.

## Estrutura de projeto sugerida (Clean Architecture adaptada)

```
src/
├── app/                    # Next.js App Router (infraestrutura)
│   ├── page.tsx            # React Server Component
│   └── prompts/
│       ├── page.tsx        # Server Component — lista prompts
│       ├── new/
│       │   └── page.tsx    # Client Component — formulario
│       └── [id]/
│           └── edit/
│               └── page.tsx
├── domain/                 # Regras de negocio (puro, sem dependencia de framework)
│   ├── entities/
│   │   └── prompt.ts
│   └── repositories/
│       └── prompt-repository.ts  # Interface (contrato)
├── infra/                  # Implementacoes concretas
│   └── repositories/
│       └── api-prompt-repository.ts  # Implementacao da interface
└── components/             # UI components
    └── prompt-form.tsx     # Client Component com React Hook Form
```

## React Server Component vs Client Component

```tsx
// Server Component (padrao no App Router) — sem "use client"
// Pode fazer fetch direto, acessar banco, etc.
export default async function PromptsPage() {
  const prompts = await getPrompts()  // chamada no servidor
  return <PromptList prompts={prompts} />
}
```

```tsx
// Client Component — necessario para interatividade
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { promptSchema } from "@/domain/entities/prompt"

export function PromptForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(promptSchema),
  })
  // ...
}
```

## Repository Pattern no frontend

```typescript
// domain/repositories/prompt-repository.ts — Interface (contrato)
export interface PromptRepository {
  findAll(): Promise<Prompt[]>
  findById(id: string): Promise<Prompt | null>
  create(prompt: CreatePromptInput): Promise<Prompt>
  update(id: string, prompt: UpdatePromptInput): Promise<Prompt>
  delete(id: string): Promise<void>
}
```

```typescript
// infra/repositories/api-prompt-repository.ts — Implementacao
export class ApiPromptRepository implements PromptRepository {
  async findAll(): Promise<Prompt[]> {
    const response = await fetch("/api/prompts")
    return response.json()
  }
  // ...
}
```

## Piramide de testes — exemplo de cada nivel

```typescript
// Teste UNITARIO — testa uma funcao/entidade isolada
describe("Prompt entity", () => {
  it("should validate prompt title is not empty", () => {
    const result = promptSchema.safeParse({ title: "", content: "test" })
    expect(result.success).toBe(false)
  })
})
```

```typescript
// Teste de INTEGRACAO — testa componente com suas dependencias
describe("PromptForm", () => {
  it("should show validation errors on empty submit", async () => {
    render(<PromptForm onSubmit={vi.fn()} />)
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }))
    expect(screen.getByText(/titulo obrigatorio/i)).toBeInTheDocument()
  })
})
```

```typescript
// Teste E2E — testa fluxo completo no navegador
test("user can create a new prompt", async ({ page }) => {
  await page.goto("/prompts/new")
  await page.fill('[name="title"]', "Meu Prompt")
  await page.fill('[name="content"]', "Conteudo do prompt")
  await page.click('button:has-text("Salvar")')
  await expect(page.locator("text=Meu Prompt")).toBeVisible()
})
```