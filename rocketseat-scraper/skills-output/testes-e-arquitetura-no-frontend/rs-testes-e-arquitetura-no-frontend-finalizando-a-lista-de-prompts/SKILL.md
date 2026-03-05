---
name: rs-testes-arquitetura-finalizando-lista-prompts
description: "Enforces sidebar UI patterns with collapse behavior, scroll containment, and semantic HTML testing in Next.js/React. Use when user asks to 'build a sidebar', 'add collapsible navigation', 'test component visibility', 'fix scroll overflow', or 'write testing-library tests for show/hide'. Applies query vs get selection, false positive verification, and semantic nav roles. Make sure to use this skill whenever implementing collapsible sidebars or testing conditional rendering. Not for backend logic, API routes, or non-UI testing."
---

# Finalizando Lista com Sidebar Colapsavel e Testes

> Sidebar colapsavel exige scroll contido, elementos visiveis no estado minimizado, e testes que verificam presenca E ausencia de elementos.

## Rules

1. **Contenha o scroll na sidebar** — use `overflow-auto` na nav/container da lista, porque scroll na pagina inteira com sidebar e UX ruim
2. **Mantenha acoes criticas visiveis quando colapsado** — botoes como "adicionar" devem aparecer mesmo com sidebar minimizada, porque o usuario precisa de acesso rapido
3. **Esconda a listagem quando colapsado** — renderize a lista condicionalmente dentro do bloco `!isCollapsed`, porque conteudo vazando da sidebar minimizada e bug visual
4. **Use tags semanticas como nav** — `<nav aria-label="lista de prompts">` em vez de `<div role="navigation">`, porque tags semanticas ja carregam a role implicitamente
5. **Use `queryByRole` para verificar ausencia** — `getByRole` lanca erro se nao encontrar; `queryByRole` retorna null, porque testar ausencia exige query
6. **Verifique falsos positivos** — remova temporariamente o codigo que causa o comportamento e confirme que o teste quebra, porque teste que nunca falha nao testa nada

## How to write

### Sidebar colapsada com botao visivel
```tsx
{isCollapsed && (
  <div className="flex flex-col items-center space-y-4">
    <button
      onClick={handleNewPrompt}
      aria-label="novo prompt"
      title="novo prompt"
    >
      <AddIcon width={20} height={20} />
    </button>
  </div>
)}
```

### Lista condicional com scroll contido
```tsx
{!isCollapsed && (
  <nav
    className="flex-1 overflow-auto py-6 pb-6"
    aria-label="lista de prompts"
  >
    <PromptList />
  </nav>
)}
```

### Teste de visibilidade no estado colapsado
```tsx
it('deveria exibir o botao de criar novo prompt na sidebar minimizada', async () => {
  render(<SidebarContent />, { wrapper: MockProvider })

  const collapseButton = screen.getByRole('button', { name: /minimizar/i })
  await user.click(collapseButton)

  const newPromptButton = screen.getByRole('button', { name: /novo prompt/i })
  expect(newPromptButton).toBeVisible()
})
```

### Teste de ausencia com queryByRole
```tsx
it('nao deveria exibir a lista de prompts na sidebar minimizada', async () => {
  render(<SidebarContent />, { wrapper: MockProvider })

  const collapseButton = screen.getByRole('button', { name: /minimizar/i })
  await user.click(collapseButton)

  const nav = screen.queryByRole('navigation', { name: /lista de prompts/i })
  expect(nav).not.toBeInTheDocument()
})
```

## Example

**Before (scroll na pagina, lista vazando quando colapsado):**
```tsx
<aside>
  <Header />
  <PromptList />
  <CollapseButton />
</aside>
```

**After (scroll contido, comportamento condicional):**
```tsx
<aside>
  <Header />
  {isCollapsed && (
    <div className="flex flex-col items-center space-y-4">
      <button onClick={handleNewPrompt} aria-label="novo prompt" title="novo prompt">
        <AddIcon width={20} height={20} />
      </button>
    </div>
  )}
  {!isCollapsed && (
    <nav className="flex-1 overflow-auto py-6 pb-6" aria-label="lista de prompts">
      <PromptList />
    </nav>
  )}
  <CollapseButton />
</aside>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento deve existir | `getByRole` — lanca erro claro se ausente |
| Elemento NAO deve existir | `queryByRole` + `not.toBeInTheDocument()` |
| Elemento aparece async | `findByRole` — espera ate timeout |
| Teste passou de primeira | Remova o codigo e confirme que quebra (falso positivo check) |
| Sidebar tem lista longa | `overflow-auto` no container, nunca na pagina |
| Tag semantica existe (nav, section) | Use a tag, nao `div` + `role` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div role="navigation">` | `<nav aria-label="...">` |
| `getByRole` para testar ausencia | `queryByRole` + `not.toBeInTheDocument()` |
| Scroll na pagina inteira com sidebar | `overflow-auto` no container da sidebar |
| Lista visivel quando sidebar colapsada | Renderizacao condicional `{!isCollapsed && ...}` |
| Teste sem verificacao de falso positivo | Remova codigo, confirme que quebra, restaure |
| Wrapper `<section>` desnecessario | Estilizacao direto no elemento pai (evita hydration issues) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
