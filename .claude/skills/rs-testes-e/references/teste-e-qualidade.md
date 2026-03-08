---
name: rs-testes-e-teste-e-qualidade
description: "Enforces test quality principles and testing strategy when writing frontend tests. Use when user asks to 'write tests', 'add test coverage', 'create unit tests', 'setup testing', or 'implement TDD'. Applies AAA pattern (Arrange/Act/Assert), test pyramid strategy, black-box approach, and guards against false positives and coverage-only metrics. Make sure to use this skill whenever writing or reviewing tests in React/Next.js projects. Not for CI/CD configuration, deployment, or non-test code review."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: unit-testing
  tags: [testing, next-js, react, tdd, ci]
---

# Teste e Qualidade no Frontend

> Testes contam uma historia coesa sobre um problema de negocio — nao sao apenas codigo que verifica codigo.

## Rules

1. **Siga o padrao AAA** — Arrange (preparar), Act (agir), Assert (verificar), porque essa estrutura torna o teste legivel e previsivel
2. **Prefira black-box testing** — teste dado input, valide output, porque isso foca na funcionalidade e resiste a refatoracoes internas
3. **Nao confie apenas em coverage** — 100% coverage significa que todas as linhas foram executadas, nao que foram validadas; coverage sem assertions e ilusao
4. **Componentes React sao testes de integracao** — componentes com fetch, forms ou interacoes precisam de Testing Library e se encaixam como integracao, nao unidade
5. **Comece por onde da mais valor** — projeto novo: comece por testes unitarios; projeto legado sem testes: comece por end-to-end nos fluxos criticos
6. **Teste bom tem baixa manutencao** — se o teste te atrasa mais do que te protege, ele e um teste ruim; refatore testes como refatora codigo de producao

## How to write

### Padrao AAA (Arrange, Act, Assert)

```typescript
// Arrange: preparar o cenario
const input = { email: "user@example.com", password: "123456" }

// Act: executar a acao
const result = validateLogin(input)

// Assert: verificar o resultado
expect(result.isValid).toBe(true)
```

### Teste de componente (integracao com Testing Library)

```typescript
// Arrange
render(<LoginForm onSubmit={mockSubmit} />)

// Act
await userEvent.type(screen.getByLabelText("Email"), "user@test.com")
await userEvent.click(screen.getByRole("button", { name: "Enviar" }))

// Assert
expect(mockSubmit).toHaveBeenCalledWith({ email: "user@test.com" })
```

### TDD: Red → Green → Refactor

```typescript
// 1. RED: escreva o teste antes do codigo (vai falhar)
test("calcula desconto de 10% para compras acima de 100", () => {
  const total = calculateDiscount(150)
  expect(total).toBe(135)
})

// 2. GREEN: faca passar do jeito mais simples possivel
function calculateDiscount(amount: number) {
  return amount > 100 ? amount * 0.9 : amount
}

// 3. REFACTOR: melhore o codigo mantendo testes verdes
```

## Example

**Before (teste ruim — sem valor):**
```typescript
test("renders component", () => {
  render(<UserList />)
  // Nenhum assert — coverage sobe mas nao valida nada
})
```

**After (teste bom — conta uma historia de negocio):**
```typescript
test("exibe apenas usuarios ativos quando filtro esta ativo", async () => {
  const users = [
    { name: "Ana", active: true },
    { name: "Bob", active: false },
  ]
  render(<UserList users={users} filterActive={true} />)

  expect(screen.getByText("Ana")).toBeInTheDocument()
  expect(screen.queryByText("Bob")).not.toBeInTheDocument()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao utilitaria pura | Teste unitario |
| Componente React com interacao | Teste de integracao com Testing Library |
| Fluxo critico completo (login, checkout) | Teste end-to-end com Playwright |
| Projeto legado sem testes | Comece por E2E nos fluxos criticos |
| Bug reportado | Crie o caso de teste primeiro, depois corrija |
| Coverage 100% mas sem assertions | Teste ruim — adicione validacoes reais |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Teste sem assert (so renderiza) | Assert no comportamento esperado |
| Confiar em coverage como metrica unica | Avaliar qualidade dos asserts |
| Selecionar elementos por classe CSS | Selecionar por role, label ou test-id |
| Testar detalhes de implementacao | Testar comportamento (input → output) |
| Ignorar falso positivo recorrente | Investigar e corrigir o teste fragil |
| Pular testes em codigo legado | Comecar com E2E no fluxo mais critico |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
