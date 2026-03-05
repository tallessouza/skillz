# Code Examples: Teste e Qualidade no Frontend

## Padrao AAA completo

```typescript
// === ARRANGE ===
// Preparar dados, mocks, estado inicial
const users = [
  { id: 1, name: "Ana", active: true },
  { id: 2, name: "Bob", active: false },
]
const mockFetch = vi.fn().mockResolvedValue(users)

// === ACT ===
// Executar a acao que esta sendo testada
const activeUsers = filterActiveUsers(users)

// === ASSERT ===
// Verificar o resultado esperado
expect(activeUsers).toHaveLength(1)
expect(activeUsers[0].name).toBe("Ana")
```

## Teste unitario: funcao utilitaria

```typescript
// utils/format-price.ts
function formatPriceInCents(priceInCents: number): string {
  return `R$ ${(priceInCents / 100).toFixed(2)}`
}

// utils/format-price.test.ts
describe("formatPriceInCents", () => {
  test("formata centavos para reais", () => {
    expect(formatPriceInCents(1500)).toBe("R$ 15.00")
  })

  test("formata zero corretamente", () => {
    expect(formatPriceInCents(0)).toBe("R$ 0.00")
  })

  test("formata valores com centavos", () => {
    expect(formatPriceInCents(1999)).toBe("R$ 19.99")
  })
})
```

## Teste de integracao: componente React com form

```typescript
// components/create-prompt-form.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { CreatePromptForm } from "./create-prompt-form"

describe("CreatePromptForm", () => {
  test("submete formulario com dados preenchidos", async () => {
    const handleSubmit = vi.fn()
    render(<CreatePromptForm onSubmit={handleSubmit} />)

    // Arrange: preencher campos
    await userEvent.type(
      screen.getByLabelText("Titulo"),
      "Meu novo prompt"
    )
    await userEvent.type(
      screen.getByLabelText("Conteudo"),
      "Conteudo do prompt aqui"
    )

    // Act: submeter
    await userEvent.click(screen.getByRole("button", { name: "Criar" }))

    // Assert: verificar chamada
    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Meu novo prompt",
      content: "Conteudo do prompt aqui",
    })
  })

  test("exibe erro quando titulo esta vazio", async () => {
    render(<CreatePromptForm onSubmit={vi.fn()} />)

    await userEvent.click(screen.getByRole("button", { name: "Criar" }))

    expect(screen.getByText("Titulo e obrigatorio")).toBeInTheDocument()
  })
})
```

## Teste de integracao: componente com fetch

```typescript
// components/user-list.test.tsx
import { render, screen, waitFor } from "@testing-library/react"
import { UserList } from "./user-list"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"

describe("UserList", () => {
  test("exibe lista de usuarios ativos apos carregamento", async () => {
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json([
          { id: 1, name: "Ana", active: true },
          { id: 2, name: "Bob", active: false },
        ])
      })
    )

    render(<UserList filterActive={true} />)

    // Aguarda carregamento
    await waitFor(() => {
      expect(screen.getByText("Ana")).toBeInTheDocument()
    })

    expect(screen.queryByText("Bob")).not.toBeInTheDocument()
  })
})
```

## TDD na pratica: criando uma pagina do zero

```typescript
// PASSO 1 — RED: teste antes do codigo
// pages/new-prompt.test.tsx
import { render, screen } from "@testing-library/react"
import { NewPromptPage } from "./new-prompt"

test("renderiza formulario de criacao de prompt", () => {
  render(<NewPromptPage />)
  
  expect(screen.getByLabelText("Titulo")).toBeInTheDocument()
  expect(screen.getByLabelText("Conteudo")).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument()
})
// ❌ FALHA — NewPromptPage nem existe ainda

// PASSO 2 — GREEN: minimo para passar
// pages/new-prompt.tsx
export function NewPromptPage() {
  return (
    <form>
      <label htmlFor="title">Titulo</label>
      <input id="title" />
      <label htmlFor="content">Conteudo</label>
      <textarea id="content" />
      <button type="submit">Criar</button>
    </form>
  )
}
// ✅ PASSA

// PASSO 3 — REFACTOR: melhorar mantendo verde
// Extrair componentes, adicionar validacao, estilizar
// Rodar testes a cada mudanca para garantir que continuam passando
```

## Teste end-to-end com Playwright

```typescript
// e2e/create-prompt.spec.ts
import { test, expect } from "@playwright/test"

test("usuario cria um novo prompt com sucesso", async ({ page }) => {
  // Navegar ate a pagina
  await page.goto("/prompts/new")

  // Preencher formulario
  await page.getByLabel("Titulo").fill("Prompt de teste")
  await page.getByLabel("Conteudo").fill("Conteudo do meu prompt")

  // Submeter
  await page.getByRole("button", { name: "Criar" }).click()

  // Verificar redirecionamento e mensagem de sucesso
  await expect(page).toHaveURL("/prompts")
  await expect(page.getByText("Prompt criado com sucesso")).toBeVisible()
})
```

## Coverage: exemplo de teste que engana

```typescript
// ❌ Teste que da 100% coverage mas nao valida nada
test("executa calculateDiscount", () => {
  calculateDiscount(100)
  calculateDiscount(50)
  calculateDiscount(200)
  // Nenhum expect! Coverage 100% mas zero garantia
})

// ✅ Teste que realmente valida
test("aplica 10% de desconto acima de 100", () => {
  expect(calculateDiscount(200)).toBe(180)
  expect(calculateDiscount(100)).toBe(100) // limite: sem desconto
  expect(calculateDiscount(50)).toBe(50)   // abaixo: sem desconto
})
```

## Bug como caso de teste (mentalidade correta)

```typescript
// Bug reportado: usuario consegue submeter formulario vazio
// ANTES de corrigir, crie o teste:

test("nao permite submissao com campos vazios", async () => {
  const handleSubmit = vi.fn()
  render(<CreatePromptForm onSubmit={handleSubmit} />)

  await userEvent.click(screen.getByRole("button", { name: "Criar" }))

  expect(handleSubmit).not.toHaveBeenCalled()
  expect(screen.getByText("Titulo e obrigatorio")).toBeInTheDocument()
})

// Agora sim, implemente a correcao
// O teste garante que esse bug nunca mais volta
```