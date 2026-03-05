---
name: rs-testes-arquitetura-renderizacao-lista
description: "Applies TDD cycle (Red-Green-Refactor) when building React/Next.js component rendering lists. Use when user asks to 'test a list component', 'write tests for rendering items', 'implement TDD for components', 'test component behavior', or 'create component with tests first'. Enforces behavior-over-appearance testing, makeSUT pattern with default props, and incremental test-driven implementation. Make sure to use this skill whenever writing tests for components that render lists or collections. Not for visual/CSS testing, E2E tests, or API endpoint testing."
---

# TDD para Renderizacao de Listas em Componentes

> Escreva o teste primeiro, faca passar com o minimo de codigo, depois refatore com seguranca.

## Rules

1. **Siga o ciclo Red-Green-Refactor** — escreva o teste que falha, faca o minimo para passar, depois refatore, porque a refatoracao so e segura quando o comportamento ja esta coberto
2. **Teste comportamento, nunca visual** — verifique que itens aparecem em tela, nao como eles sao estilizados, porque trocar um `<p>` por um `<Card>` nao deve quebrar testes
3. **Use makeSUT com props default** — crie uma factory que aceita overrides parciais, porque isso elimina duplicacao e permite inputs customizados por teste
4. **Valide quantidade de itens renderizados** — use `getAllByRole` com `.toHaveLength(input.length)`, porque garante que nao ha itens extras ou faltando
5. **Use `only` e `skip` durante o ciclo TDD** — isole o teste atual com `.only` enquanto desenvolve, porque evita ruido de outros testes
6. **Rode testes em watch mode** — use script `test:watch` durante TDD, porque o feedback imediato acelera o ciclo

## How to write

### makeSUT com props default e overrides

```typescript
const initialPrompts = [
  { id: '1', title: 'Title 01', content: 'Content 01' },
]

function makeSUT(props?: Partial<SidebarContentProps>) {
  return render(<SidebarContent prompts={initialPrompts} {...props} />)
}
```

### Teste de renderizacao de item por texto

```typescript
it('should render the prompts list', () => {
  makeSUT()

  expect(screen.getByText(initialPrompts[0].title)).toBeInTheDocument()
})
```

### Teste de quantidade de itens com input customizado

```typescript
it('should render the prompts list', () => {
  const input = {
    prompts: [
      { id: '1', title: 'Example 01', content: 'Content 01' },
      { id: '2', title: 'Example 02', content: 'Content 02' },
    ],
  }
  makeSUT(input)

  expect(screen.getAllByRole('paragraph')).toHaveLength(input.prompts.length)
  expect(screen.getByText(input.prompts[0].title)).toBeInTheDocument()
})
```

### Implementacao minima para passar o teste

```typescript
// Minimo de codigo — sem componente visual elaborado
export function SidebarContent({ prompts }: SidebarContentProps) {
  return (
    <div>
      {prompts.map((prompt) => (
        <p key={prompt.id}>{prompt.title}</p>
      ))}
    </div>
  )
}
```

## Example

**Before (teste sem asserção — falso positivo):**
```typescript
it('should render the prompts list', () => {
  makeSUT()
  // coverage marca como coberto, mas nao testa NADA
})
```

**After (teste com comportamento verificado):**
```typescript
it('should render the prompts list', () => {
  makeSUT()

  expect(screen.getByText(initialPrompts[0].title)).toBeInTheDocument()
  expect(screen.getAllByRole('paragraph')).toHaveLength(initialPrompts.length)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente recebe array via props | Teste quantidade com `getAllByRole` + `.toHaveLength` |
| Precisa verificar item especifico | Use `getByText` com valor do input de teste |
| Coverage alto mas poucos expects | Adicione assercoes — coverage alto nao garante qualidade |
| Vai trocar `<p>` por componente estilizado | Rode os testes — devem continuar passando sem mudanca |
| Desenvolvendo feature nova | Ative watch mode e use `.only` no teste atual |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Teste sem `expect` | Pelo menos um `expect` com asserção de comportamento |
| `expect(container.innerHTML).toContain(...)` | `expect(screen.getByText(...)).toBeInTheDocument()` |
| Hardcoded length: `.toHaveLength(2)` | Dinamico: `.toHaveLength(input.prompts.length)` |
| Implementar componente visual antes do teste | Escrever teste primeiro, `<p>` minimo, refatorar depois |
| Testar classe CSS ou estilo | Testar presenca de texto ou role semantica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-implementando-a-renderizacao-da-lista/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-implementando-a-renderizacao-da-lista/references/code-examples.md)
