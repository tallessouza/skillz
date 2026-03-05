---
name: rs-testes-arquitetura-fe-prompt-list-card
description: "Enforces testing patterns for React list and card components using Testing Library. Use when user asks to 'test a list component', 'test a card component', 'write component tests', 'test links', or 'test rendering with props'. Applies makeSut pattern, role-based queries, get vs query distinction, and toHaveAttribute for link validation. Make sure to use this skill whenever writing tests for components that render lists, cards, or links in Next.js/React. Not for E2E tests, API tests, or testing business logic outside components."
---

# Testando Componentes de Lista e Card

> Teste componentes de lista e card validando renderizacao, estados vazios e atributos de links — sem mockar comportamento interno de navegacao.

## Rules

1. **Use makeSut para reaproveitamento** — extraia a montagem do componente para uma funcao `makeSut` quando o describe tem mais de um caso de teste, porque evita duplicacao e centraliza mudancas de props
2. **Use `getByRole` para elementos semanticos** — `getByRole('list')`, `getByRole('link')`, porque valida acessibilidade junto com a funcionalidade
3. **Use `getAllByRole` + `toHaveLength` para contagem** — `getAllByRole('listitem')` com `toHaveLength(n)`, porque valida quantidade sem depender de texto
4. **Use `queryByRole` para ausencia** — quando o elemento NAO deve existir, use `query` em vez de `get`, porque `get` lanca erro quando nao encontra
5. **Use `toHaveAttribute` para validar href** — `toHaveAttribute('href', '/expected')`, porque valida o atributo diretamente sem depender de navegacao
6. **Evite mockar navegacao do framework** — nao substitua `next/link` por tag `<a>` nativa so para testar redirecionamento, porque acopla o teste a detalhes de implementacao e exige mocks excessivos

## How to write

### makeSut para componentes com props

```typescript
const makeSut = (prompts: PromptListProps['prompts']) => {
  render(<PromptList prompts={prompts} />)
}
```

### Teste de lista com itens

```typescript
it('should render list with prompts', () => {
  const prompts = [
    { id: '1', title: 'a', content: 'x' },
    { id: '2', title: 'b', content: 'y' },
  ]
  makeSut(prompts)

  expect(screen.getByRole('list')).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(2)
  expect(screen.getByText('a')).toBeInTheDocument()
  expect(screen.getByText('b')).toBeInTheDocument()
})
```

### Teste de lista vazia (query, nao get)

```typescript
it('should not render list when there are no prompts', () => {
  makeSut([] as PromptListProps['prompts'])

  expect(screen.queryByRole('list')).not.toBeInTheDocument()
  expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})
```

### Teste de link com href correto

```typescript
it('should render link with correct href', () => {
  const prompt = { id: '1', title: 'title01', content: 'content01' }
  render(<PromptCard prompt={prompt} />)

  const link = screen.getByRole('link')
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', `/${prompt.id}`)
})
```

## Example

**Before (teste fragil com mock de navegacao):**
```typescript
jest.mock('next/link', ({ children, href }) => (
  <a href={href} onClick={() => pushMock(href)}>{children}</a>
))

it('should redirect on click', async () => {
  const user = userEvent.setup()
  render(<PromptCard prompt={prompt} />)
  await user.click(screen.getByRole('link'))
  expect(pushMock).toHaveBeenCalledWith(`/${prompt.id}`)
})
```

**After (teste limpo validando atributo):**
```typescript
it('should render link with correct href', () => {
  render(<PromptCard prompt={prompt} />)
  const link = screen.getByRole('link')
  expect(link).toHaveAttribute('href', `/${prompt.id}`)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente renderiza lista semantica (`ul`/`ol`) | Use `getByRole('list')` + `getAllByRole('listitem')` |
| Testando estado vazio (array vazio) | Use `queryByRole` / `queryAllByRole` (nunca `get`) |
| Link aponta para rota interna | Valide `toHaveAttribute('href', path)`, nao mock navegacao |
| Componente tem texto visivel unico | Use `getByText` para confirmar renderizacao |
| `getByRole('link')` nao encontra pelo name | Verifique se o link tem texto composto (title + content) — remova o filtro name |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `screen.getByRole('listitem')` para ausencia | `screen.queryByRole('listitem')` |
| `expect(element).toBeTruthy()` | `expect(element).toBeInTheDocument()` |
| Mock de `next/link` para testar href | `toHaveAttribute('href', expected)` |
| `screen.getByTestId('link-1')` | `screen.getByRole('link', { name: 'visible text' })` |
| Repetir `render(<Component .../>)` em cada teste | `makeSut(props)` reutilizavel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-prompt-list-e-prompt-card/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-testando-prompt-list-e-prompt-card/references/code-examples.md)
