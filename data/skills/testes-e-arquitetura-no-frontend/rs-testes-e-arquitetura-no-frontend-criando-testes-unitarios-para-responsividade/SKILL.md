---
name: rs-testes-arquitetura-fe-testes-responsividade
description: "Enforces patterns for unit testing responsive/mobile UI behavior in React/Next.js components. Use when user asks to 'test mobile menu', 'test responsive sidebar', 'test toggle classes', 'test mobile navigation', or 'write unit tests for responsive components'. Applies class toggling assertions, role-based queries, and user interaction simulation for mobile UI states. Make sure to use this skill whenever testing responsive behavior at the unit level. Not for E2E viewport testing, visual regression testing, or CSS media query validation."
---

# Testes Unitarios para Responsividade

> Teste a alternancia de classes CSS que controlam visibilidade mobile via interacao do usuario, nao via viewport.

## Rules

1. **Teste o estado default primeiro** — verifique a classe inicial antes de qualquer interacao, porque garante que o componente renderiza no estado correto sem dependencias externas
2. **Use getByRole para localizar elementos** — `getByRole('complementary')` para aside, `getByRole('button', { name })` para botoes, porque queries semanticas sao resilientes a mudancas de markup
3. **Verifique classes com toContain** — use `element.className` com `toContain()` em vez de match exato, porque classes utilitarias (Tailwind) adicionam classes extras que voce nao quer acoplar
4. **Simule o ciclo completo** — teste abrir E fechar, nao apenas um estado, porque a alternancia e o comportamento real do usuario
5. **Limite testes unitarios ao que controlam** — testes unitarios verificam alternancia de classes, nao viewport. Viewport e responsabilidade do E2E, porque `window.innerWidth` nao e confiavel em JSDOM

## How to write

### Teste de alternancia mobile

```typescript
describe('SidebarContent Mobile', () => {
  it('deve abrir e fechar o menu mobile', async () => {
    const { user } = makeSut()

    const aside = screen.getByRole('complementary')

    // Estado default: menu fechado
    expect(aside.className).toContain('-translate-x-full')

    // Abrir menu
    const openButton = screen.getByRole('button', { name: /abrir menu/i })
    await user.click(openButton)
    expect(aside.className).toContain('translate-x-0')

    // Fechar menu
    const closeButton = screen.getByRole('button', { name: /fechar menu/i })
    await user.click(closeButton)
    expect(aside.className).toContain('-translate-x-full')
  })
})
```

## Example

**Before (teste incompleto — so verifica abertura):**
```typescript
it('abre o menu', async () => {
  const { user } = makeSut()
  const btn = screen.getByRole('button', { name: /abrir menu/i })
  await user.click(btn)
  // Nao verifica estado inicial nem fechamento
  expect(screen.getByRole('complementary')).toBeTruthy()
})
```

**After (ciclo completo de alternancia):**
```typescript
it('deve abrir e fechar o menu mobile', async () => {
  const { user } = makeSut()
  const aside = screen.getByRole('complementary')

  expect(aside.className).toContain('-translate-x-full')

  await user.click(screen.getByRole('button', { name: /abrir menu/i }))
  expect(aside.className).toContain('translate-x-0')

  await user.click(screen.getByRole('button', { name: /fechar menu/i }))
  expect(aside.className).toContain('-translate-x-full')
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente usa classes CSS para mostrar/esconder | Teste unitario com `className.toContain()` |
| Comportamento depende de tamanho de tela | Teste E2E com controle de viewport |
| Botao so aparece em mobile | E2E — JSDOM nao tem viewport real |
| Toggle entre dois estados visuais | Teste o ciclo completo: default → acao → estado → acao inversa → default |
| Coverage mostra linhas nao cobertas | Verifique se sao branches de estado mobile |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `expect(aside).toHaveClass('-translate-x-full')` sem checar default | Verifique o estado default ANTES da interacao |
| `getByTestId('sidebar')` | `getByRole('complementary')` |
| `fireEvent.click(button)` | `await user.click(button)` (userEvent simula comportamento real) |
| Teste que so abre sem fechar | Teste o ciclo completo de alternancia |
| `window.innerWidth = 375` em teste unitario | Use E2E para testar viewport |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
