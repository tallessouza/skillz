---
name: rs-testes-e-cobrindo-cenarios-no-prompt-card
description: "Enforces comprehensive test scenario coverage for React card components with conditional rendering and user interactions. Use when user asks to 'test card component', 'cover edge cases in tests', 'test conditional rendering', 'test truncated text', or 'write tests for interactive cards'. Applies patterns: test visible content, test truncation behavior, test click handlers, verify accessibility attributes. Make sure to use this skill whenever testing React components that display data with conditional UI states. Not for E2E tests, API testing, or form validation testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: component-testing
  tags: [testing, react, component, card, conditional-rendering, jest, rtl]
---

# Cobrindo Cenarios no Prompt Card

> Cada estado visual do componente (texto truncado, acoes visiveis, dados formatados) precisa de teste dedicado.

## Rules

1. **Teste cada estado visual** — texto completo vs truncado, com/sem acoes, porque o componente pode renderizar diferente conforme os dados
2. **Verifique truncamento com toHaveClass ou CSS** — nao confie apenas no texto visivel, porque truncamento CSS nao altera o DOM text
3. **Teste handlers de click** — verifique que callbacks sao chamados com argumentos corretos via `toHaveBeenCalledWith`
4. **Use `makeSut` para 3+ testes** — factory centraliza props e permite override por cenario

## How to write

```typescript
function makeSut(overrides?: Partial<PromptCardProps>) {
  const defaultProps: PromptCardProps = {
    id: '1', title: 'Test Prompt', content: 'Content here',
    ...overrides
  }
  return render(<PromptCard {...defaultProps} />)
}

it('deve exibir titulo visivel', () => {
  makeSut()
  expect(screen.getByText('Test Prompt')).toBeVisible()
})

it('deve exibir conteudo truncado', () => {
  makeSut({ content: 'A'.repeat(200) })
  expect(screen.getByText(/A{200}/)).toBeVisible()
})
```

## Troubleshooting

### Teste passa mas componente esta visualmente errado
**Symptom:** `toBeInTheDocument` passa mas elemento nao aparece na tela
**Cause:** Elemento esta no DOM mas com display:none ou opacity:0
**Fix:** Usar `toBeVisible()` ao inves de `toBeInTheDocument()`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
