---
name: rs-testes-arq-frontend-responsividade
description: "Applies mobile-first responsive patterns when building React/Next.js layouts. Use when user asks to 'add responsive design', 'make it mobile friendly', 'add hamburger menu', 'implement sidebar toggle', or 'fix mobile layout'. Enforces hidden/visible breakpoint classes, translate-based sidebar toggling, accessibility attributes (aria-expanded, aria-label), and mobile state management. Make sure to use this skill whenever creating navigation, sidebars, or layouts that must work on mobile. Not for CSS animations, desktop-only dashboards, or backend API work."
---

# Implementando Responsividade

> Ao criar layouts responsivos, use estado para controlar visibilidade mobile e classes de breakpoint para alternar entre desktop e mobile.

## Rules

1. **Use estado booleano para controle mobile** — `isMobileOpen` com `useState(false)`, porque o estado do menu mobile e independente do estado de colapso desktop
2. **Esconda elementos desktop no mobile com classes de breakpoint** — `md:hidden` para mostrar so no mobile, porque evita JavaScript desnecessario para visibilidade
3. **Use translate para transicoes de sidebar** — `translate-x-0` / `-translate-x-full` em vez de `display: none`, porque permite animacoes suaves e mantem o elemento no DOM
4. **Sempre inclua atributos de acessibilidade** — `aria-label`, `aria-expanded`, e `title` em botoes de navegacao, porque leitores de tela e testes automatizados dependem deles
5. **Posicione o botao hamburger com fixed e z-index** — garanta que o botao fique sempre visivel sobre o conteudo no mobile
6. **Separe funcoes de open e close** — `openMobile` e `closeMobile` em vez de toggle unico, porque torna o codigo mais previsivel e testavel

## How to write

### Estado e funcoes de controle mobile

```typescript
const [isMobileOpen, setIsMobileOpen] = useState(false)

const openMobile = () => setIsMobileOpen(true)
const closeMobile = () => setIsMobileOpen(false)
```

### Botao hamburger (visivel apenas no mobile)

```tsx
<Button
  className="md:hidden fixed top-6 left-6 z-50"
  variant="secondary"
  onClick={openMobile}
  title="Abrir menu"
  aria-label="Abrir menu"
  aria-expanded={isMobileOpen}
>
  <Menu className="h-5 w-5 text-gray-100" />
</Button>
```

### Sidebar com transicao responsiva

```tsx
<aside
  className={cn(
    // Mobile: controlado por estado
    isMobileOpen ? "translate-x-0" : "-translate-x-full",
    // Desktop: sempre visivel
    "md:translate-x-0",
    // Base styles
    "fixed md:relative transition-transform"
  )}
>
  {/* Botao de fechar dentro da sidebar */}
  <button onClick={closeMobile}>Fechar</button>
  {/* Conteudo da sidebar */}
</aside>
```

## Example

**Before (nao responsivo):**
```tsx
<aside className={isCollapsed ? "w-16" : "w-64"}>
  <nav>{/* links */}</nav>
</aside>
```

**After (responsivo com menu hamburger):**
```tsx
<>
  <Button
    className="md:hidden fixed top-6 left-6 z-50"
    variant="secondary"
    onClick={openMobile}
    title="Abrir menu"
    aria-label="Abrir menu"
    aria-expanded={isMobileOpen}
  >
    <Menu className="h-5 w-5 text-gray-100" />
  </Button>

  <aside
    className={cn(
      isMobileOpen ? "translate-x-0" : "-translate-x-full",
      "md:translate-x-0",
      isCollapsed ? "md:w-16" : "md:w-64",
      "fixed md:relative transition-transform z-40"
    )}
  >
    <button onClick={closeMobile}>Fechar</button>
    <nav>{/* links */}</nav>
  </aside>
</>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Sidebar com estado de colapso desktop | Adicione estado mobile separado (`isMobileOpen`) |
| Botao so deve aparecer no mobile | Use `md:hidden` na classe |
| Sidebar deve sumir no mobile | Use `translate-x` controlado por estado + `md:translate-x-0` |
| Botao interativo de navegacao | Sempre adicione `aria-label`, `aria-expanded`, `title` |
| Elemento precisa ficar sobre todo conteudo | Use `fixed` + `z-50` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `display: none` para esconder sidebar mobile | `translate-x` com transicao |
| Toggle unico para mobile e desktop | Estados separados: `isCollapsed` (desktop) + `isMobileOpen` (mobile) |
| Botao sem `aria-label` | `aria-label="Abrir menu"` + `title="Abrir menu"` |
| Botao hamburger com `absolute` | `fixed` com `z-index` alto |
| Testar responsividade so manualmente | Criar testes E2E para comportamento mobile |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
