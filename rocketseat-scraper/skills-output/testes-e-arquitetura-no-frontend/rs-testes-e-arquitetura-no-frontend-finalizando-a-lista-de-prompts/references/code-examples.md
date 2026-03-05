# Code Examples: Finalizando Lista com Sidebar Colapsavel

## Estrutura completa do SidebarContent

```tsx
// sidebar-content.tsx
export function SidebarContent() {
  const { isCollapsed, toggleCollapse } = useSidebar()
  const router = useRouter()

  function handleNewPrompt() {
    router.push('/prompts/new')
  }

  return (
    <aside className="flex flex-col h-full">
      <Header />

      {/* Botao visivel mesmo quando colapsado */}
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

      {/* Lista so aparece quando expandida, com scroll contido */}
      {!isCollapsed && (
        <nav
          className="flex-1 overflow-auto py-6 pb-6"
          aria-label="lista de prompts"
        >
          <PromptList />
        </nav>
      )}

      <button
        onClick={toggleCollapse}
        aria-label={isCollapsed ? 'expandir sidebar' : 'minimizar sidebar'}
      >
        <CollapseIcon />
      </button>
    </aside>
  )
}
```

## Testes completos

```tsx
// sidebar-content.spec.tsx
describe('SidebarContent - colapsar e expandir', () => {
  it('deveria exibir o botao de criar novo prompt na sidebar minimizada', async () => {
    render(<SidebarContent />, { wrapper: MockProvider })

    // Captura o botao de minimizar
    const collapseButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    })

    // Clica para minimizar
    await user.click(collapseButton)

    // Verifica que o botao de novo prompt esta visivel
    const newPromptButton = screen.getByRole('button', {
      name: /novo prompt/i,
    })
    expect(newPromptButton).toBeVisible()
  })

  it('nao deveria exibir a lista de prompts na sidebar minimizada', async () => {
    render(<SidebarContent />, { wrapper: MockProvider })

    // Captura e clica no botao de minimizar
    const collapseButton = screen.getByRole('button', {
      name: /minimizar sidebar/i,
    })
    await user.click(collapseButton)

    // Usa queryByRole (nao getByRole!) para verificar ausencia
    const nav = screen.queryByRole('navigation', {
      name: /lista de prompts/i,
    })
    expect(nav).not.toBeInTheDocument()
  })
})
```

## Verificacao de falso positivo — passo a passo

```tsx
// PASSO 1: Teste passa
it('deveria exibir o botao...', async () => {
  // ... setup e click ...
  const btn = screen.getByRole('button', { name: /novo prompt/i })
  expect(btn).toBeVisible() // ✅ PASSA
})

// PASSO 2: Remova o botao do codigo-fonte temporariamente
// No sidebar-content.tsx, comente o bloco {isCollapsed && <button>...}
// O teste DEVE quebrar. Se nao quebrar, seu seletor esta errado.

// PASSO 3: Restaure o codigo. Teste volta a passar. Confirmado: nao e falso positivo.
```

## Removendo wrapper desnecessario

```tsx
// ANTES: section wrapper extra (pode causar hydration issues)
<section className="flex min-h-screen">
  <body>
    {children}
  </body>
</section>

// DEPOIS: estilizacao direto no body
<body className="flex min-h-screen">
  {children}
</body>
```

## Tabela de roles implicitas em tags semanticas

| Tag HTML | Role implicita | Seletor no teste |
|----------|---------------|------------------|
| `<nav>` | `navigation` | `getByRole('navigation')` |
| `<main>` | `main` | `getByRole('main')` |
| `<aside>` | `complementary` | `getByRole('complementary')` |
| `<header>` | `banner` | `getByRole('banner')` |
| `<footer>` | `contentinfo` | `getByRole('contentinfo')` |
| `<button>` | `button` | `getByRole('button')` |
| `<a href>` | `link` | `getByRole('link')` |