---
name: rs-testes-e-implementando-a-barra-de-pesquisa
description: "Enforces TDD workflow and AAA pattern when implementing React search components with testing-library. Use when user asks to 'create a search bar', 'implement search input', 'write component tests', 'test a form field', or 'add TDD to a component'. Applies AAA (Arrange-Act-Assertion) test organization, controlled input patterns, and getByPlaceholderText queries. Make sure to use this skill whenever writing front-end component tests or implementing search/input features with TDD. Not for API testing, E2E tests, or backend search logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: geral
  tags: [testing, next-js, react, playwright, e2e, tdd, forms]
---

# Implementando Barra de Pesquisa com TDD

> Ao criar componentes de input, escreva o teste primeiro (TDD), organize com AAA (Arrange-Act-Assertion), e so entao implemente o componente minimo que faz o teste passar.

## Rules

1. **Teste primeiro, componente depois** — escreva o teste que descreve o comportamento esperado antes de criar o componente, porque o teste guia a implementacao minima necessaria
2. **Organize testes com AAA** — separe visualmente Arrange (setup), Act (acao do usuario), e Assertion (expect), porque facilita leitura para voce e para novos membros do time
3. **Use `getByPlaceholderText` para inputs de busca** — quando o input tem placeholder descritivo, use-o como query principal, porque reflete como o usuario identifica o campo
4. **Componente controlado pela sidebar** — o input de busca pertence ao componente pai (sidebar), que controla seu estado e visibilidade
5. **Testes sao documentacao viva** — descreva comportamentos reais, nao apenas cobertura, porque pessoas novas no time se orientam pelos testes

## How to write

### Teste com AAA pattern

```typescript
it('should update search field when typing', async () => {
  // Arrange
  const { user } = makeSut()
  const searchInput = screen.getByPlaceholderText('Buscar prompts...')
  const text = 'AI'

  // Act
  await user.type(searchInput, text)

  // Assertion
  expect(searchInput).toHaveValue(text)
})
```

### Componente de busca na sidebar

```tsx
{!isCollapsed && (
  <section style={{ marginBottom: '20px' }}>
    <form>
      <Input
        name="query"
        type="text"
        placeholder="Buscar prompts..."
        autoFocus
      />
    </form>
  </section>
)}
```

## Example

**Before (teste sem organizacao):**
```typescript
it('should work', async () => {
  const { user } = makeSut()
  const input = screen.getByPlaceholderText('Buscar prompts...')
  await user.type(input, 'AI')
  expect(input).toHaveValue('AI')
})
```

**After (com AAA explicito):**
```typescript
it('should update search field when typing', async () => {
  // Arrange
  const { user } = makeSut()
  const searchInput = screen.getByPlaceholderText('Buscar prompts...')
  const text = 'AI'

  // Act
  await user.type(searchInput, text)

  // Assertion
  expect(searchInput).toHaveValue(text)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Input so aparece condicionalmente | Teste o estado visivel, controle via prop do pai |
| Teste sem acao do usuario | Arrange + Assertion (sem Act), valido para checar presenca em tela |
| Escolher query do testing-library | `getByPlaceholderText` para inputs com placeholder, `getByRole` para botoes |
| Teste passou de primeira sem TDD | Suspeito — valide que nao e falso positivo rodando a app |
| Novo membro precisa entender componente | Testes bem escritos com AAA servem como documentacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `screen.getByRole('textbox')` (generico) | `screen.getByPlaceholderText('Buscar prompts...')` |
| Teste sem separacao visual AAA | Comentarios `// Arrange`, `// Act`, `// Assertion` |
| Criar componente antes do teste | Escrever teste primeiro, ver falhar, depois implementar |
| `it('should work', ...)` | `it('should update search field when typing', ...)` |
| Testar apenas coverage 100% | Testar comportamentos reais do usuario |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
