---
name: rs-acessibilidade-react-conhecendo-radix-ui
description: "Applies Radix UI primitives for accessible React components when building dialogs, selects, tooltips, toasts, or dropdowns. Use when user asks to 'create a modal', 'build a select', 'add a dropdown', 'make component accessible', or 'implement focus trap'. Ensures correct usage of Radix primitives with portal, focus trap, keyboard navigation, and ARIA attributes. Make sure to use this skill whenever creating interactive UI components that need accessibility. Not for styling, CSS frameworks, or non-interactive layout components."
---

# Radix UI para Componentes Acessiveis

> Use Radix UI primitives como base para qualquer componente interativo — eles resolvem focus trap, navegacao por teclado e anuncios para leitores de tela automaticamente.

## Rules

1. **Use Radix primitives em vez de implementar acessibilidade manualmente** — `Dialog`, `Select`, `DropdownMenu`, `Toast`, `Tooltip`, porque reimplementar focus trap, keyboard navigation e collision detection corretamente consome tempo enorme e e propenso a bugs
2. **Sempre use Portal para modais e overlays** — renderize fora da arvore DOM principal (direto no body), porque isso evita problemas de z-index, overflow hidden e separacao logica de conteudo
3. **Garanta focus trap em modais** — o foco NUNCA deve escapar do modal enquanto aberto, porque usuarios navegando por teclado ficam perdidos se o foco pula para elementos atras do overlay
4. **Anuncie conteudo dinamico para leitores de tela** — toasts, mensagens de erro e modais devem ser anunciados, porque usuarios com deficiencia visual nao percebem mudancas visuais na tela
5. **Implemente keyboard interactions completas** — Enter/Space para ativar, Arrow keys para navegar, ESC para fechar, porque muitos usuarios dependem exclusivamente do teclado
6. **Use tabIndex corretamente** — foque nos elementos internos do modal, nao no container, porque o foco no container nao permite interacao direta com o conteudo

## How to write

### Dialog (Modal) com Radix

```typescript
import * as Dialog from '@radix-ui/react-dialog'

// Radix ja implementa: portal, focus trap, ESC para fechar,
// role="dialog", aria-describedby, aria-controls
function AccessibleModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Abrir modal</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="content">
          <Dialog.Title>Titulo do modal</Dialog.Title>
          <Dialog.Description>Descricao acessivel</Dialog.Description>
          {/* Conteudo com foco automatico */}
          <input placeholder="Foco vai aqui automaticamente" />
          <Dialog.Close asChild>
            <button>Fechar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

### Select com keyboard navigation e Type Ahead

```typescript
import * as Select from '@radix-ui/react-select'

// Radix Select ja implementa: Space/Enter para abrir,
// Arrow keys para navegar, ESC para fechar, Type Ahead
function AccessibleSelect() {
  return (
    <Select.Root>
      <Select.Trigger>
        <Select.Value placeholder="Selecione uma fruta" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Viewport>
            <Select.Item value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Item value="banana">
              <Select.ItemText>Banana</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
```

## Example

**Before (modal manual sem acessibilidade completa):**
```typescript
function Modal({ isOpen, children }) {
  if (!isOpen) return null
  return (
    <div className="overlay">
      <div className="modal">
        {children}
        {/* Sem focus trap, sem ESC, sem portal, sem ARIA */}
      </div>
    </div>
  )
}
```

**After (com Radix Dialog):**
```typescript
function Modal({ children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Abrir</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="modal">
          <Dialog.Title>Titulo</Dialog.Title>
          {children}
          <Dialog.Close asChild>
            <button>Fechar</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de modal/dialog | Use `@radix-ui/react-dialog` |
| Precisa de select customizado | Use `@radix-ui/react-select` (tem Type Ahead built-in) |
| Precisa de dropdown menu | Use `@radix-ui/react-dropdown-menu` (collision detection inclusa) |
| Precisa de toast/notificacao | Use `@radix-ui/react-toast` (anuncia para screen readers) |
| Precisa de tooltip | Use `@radix-ui/react-tooltip` |
| Quer estilizar os componentes | Radix e unstyled — aplique seu proprio CSS/Tailwind |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Modal sem focus trap | `Dialog.Content` do Radix (focus trap automatico) |
| Select com `<div onClick>` customizado | `Select.Root` do Radix (keyboard nav + type ahead) |
| Toast que so aparece visualmente | `Toast.Root` do Radix (anunciado para screen readers) |
| Modal renderizado inline na arvore DOM | `Dialog.Portal` (renderiza no body) |
| `<div role="dialog">` manual sem aria-controls | Radix Dialog (ARIA attributes automaticos) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
