---
name: rs-testes-arquitetura-frontend-sidebar-behavior
description: "Enforces Testing Library best practices for testing UI toggle behaviors like sidebar collapse/expand. Use when user asks to 'test a sidebar', 'test collapse behavior', 'test toggle component', 'write component tests', or 'test UI interactions'. Applies makeSUT pattern, getByRole for accessibility, queryBy for absent elements, and userEvent for async clicks. Make sure to use this skill whenever writing tests for show/hide or toggle UI behaviors. Not for API testing, E2E tests, or unit tests without DOM interaction."
---

# Testando Comportamentos de Toggle (Sidebar Collapse/Expand)

> Teste comportamentos de UI validando presenca e ausencia de elementos apos interacoes do usuario, usando queries semanticas e o padrao makeSUT.

## Rules

1. **Use o padrao makeSUT** — encapsule o `render()` em uma funcao `makeSUT()` que retorna o resultado, porque facilita customizar props por teste e elimina duplicacao
2. **Prefira getByRole sempre que possivel** — `getByRole('button', { name: /minimizar/i })` em vez de `getByTestId`, porque forca acessibilidade e tags semanticas
3. **Use queryBy para verificar ausencia** — `getByRole` lanca erro quando o elemento nao existe; `queryByRole` retorna null, permitindo `expect(el).not.toBeInTheDocument()`
4. **Interacoes de usuario sao assincronas** — `await user.click(button)` com `userEvent.setup()`, porque cliques nao sao instantaneos
5. **Adicione title e aria-label em botoes sem texto** — botoes com apenas icone precisam de identificadores acessiveis para serem encontrados por `getByRole`
6. **Teste o estado inverso tambem** — ao verificar que o botao de expandir aparece, verifique que o de colapsar desapareceu, porque garante a exclusividade dos estados

## How to write

### Padrao makeSUT

```typescript
function makeSUT() {
  return render(<SidebarContent />)
}
```

### Verificar elemento presente (getByRole)

```typescript
const collapseButton = screen.getByRole('button', { name: /minimizar sidebar/i })
expect(collapseButton).toBeVisible()
```

### Verificar elemento ausente (queryByRole)

```typescript
const expandButton = screen.queryByRole('button', { name: /expand sidebar/i })
expect(expandButton).not.toBeInTheDocument()
```

### Simular interacao com userEvent

```typescript
const user = userEvent.setup()
await user.click(collapseButton)
```

## Example

**Before (teste fragil e incompleto):**
```typescript
it('should collapse', () => {
  render(<SidebarContent />)
  const btn = screen.getByTestId('collapse-btn')
  fireEvent.click(btn)
  expect(screen.getByTestId('expand-btn')).toBeTruthy()
})
```

**After (com este skill aplicado):**
```typescript
describe('Colapsar/Expandir', () => {
  const user = userEvent.setup()

  function makeSUT() {
    return render(<SidebarContent />)
  }

  it('deveria iniciar expandida e exibir o botao minimizar', () => {
    makeSUT()
    const aside = screen.getByRole('complementary')
    expect(aside).toBeVisible()

    const collapseButton = screen.getByRole('button', { name: /minimizar sidebar/i })
    expect(collapseButton).toBeVisible()

    const expandButton = screen.queryByRole('button', { name: /expand sidebar/i })
    expect(expandButton).not.toBeInTheDocument()
  })

  it('deveria contrair e mostrar o botao de expandir', async () => {
    makeSUT()
    const collapseButton = screen.getByRole('button', { name: /minimizar sidebar/i })

    await user.click(collapseButton)

    const expandButton = screen.getByRole('button', { name: /expand sidebar/i })
    expect(expandButton).toBeInTheDocument()

    const collapsedButton = screen.queryByRole('button', { name: /minimizar sidebar/i })
    expect(collapsedButton).not.toBeInTheDocument()
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento nao existe no DOM (renderizacao condicional) | `queryByRole` + `not.toBeInTheDocument()` |
| Elemento existe mas pode estar oculto via CSS | `getByRole` + `not.toBeVisible()` |
| Botao sem texto, apenas icone | Adicione `title` e `aria-label` no componente |
| Interacao do usuario (click, type) | `userEvent.setup()` + `await user.click()` |
| Multiplos testes com mesmo render | Extraia `makeSUT()` |
| Regex no name do getByRole | Use flag `i` para case insensitive: `/minimizar/i` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `getByTestId('collapse-btn')` | `getByRole('button', { name: /minimizar/i })` |
| `fireEvent.click(btn)` | `await user.click(btn)` |
| `getByRole` para verificar ausencia | `queryByRole` para verificar ausencia |
| `render(<Component />)` repetido em cada teste | `makeSUT()` centralizado |
| `expect(el).toBeTruthy()` | `expect(el).toBeVisible()` ou `toBeInTheDocument()` |
| Testar apenas o estado positivo do toggle | Testar ambos os estados (presente E ausente) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
