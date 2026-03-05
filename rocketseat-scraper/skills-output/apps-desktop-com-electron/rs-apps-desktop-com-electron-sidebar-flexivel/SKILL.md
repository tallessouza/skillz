---
name: rs-electron-sidebar-flexivel
description: "Applies Radix UI Collapsible pattern to build retractable sidebars in Electron/React apps. Use when user asks to 'create a collapsible sidebar', 'add sidebar toggle', 'retractable panel', 'collapsible layout', or 'sidebar animation'. Covers Collapsible.Root placement, state sharing between header and sidebar, CSS keyframe animations with Radix CSS variables. Make sure to use this skill whenever building desktop app layouts with toggleable panels. Not for accordion lists, dropdown menus, or modal dialogs."
---

# Sidebar Flexível com Radix UI Collapsible

> Envolva sidebar e header no mesmo Collapsible.Root para que ambos compartilhem o contexto de abrir/fechar.

## Rules

1. **Collapsible.Root envolve todos os consumidores** — sidebar E header ficam dentro do mesmo Root, porque ambos precisam enxergar o contexto de aberto/fechado
2. **Use Collapsible.Trigger para botões de toggle** — tanto o botão na sidebar quanto no header devem ser Collapsible.Trigger, porque é o componente que alterna o estado
3. **Use Collapsible.Content no conteúdo retrátil** — substitua o `<aside>` por Collapsible.Content, porque é ele que aparece/desaparece
4. **defaultOpen para estado inicial aberto** — passe `defaultOpen` no Root, porque o padrão do Radix é fechado
5. **Compartilhe estado via onOpenChange** — anote o estado com `onOpenChange` + `useState` e passe como prop para componentes que precisam reagir (ex: header mostra botão quando fechado)
6. **Anime com CSS variables do Radix** — use `--radix-collapsible-content-width` nos keyframes, porque o Radix expõe automaticamente a largura do conteúdo collapsible

## How to write

### Estrutura do Layout (Collapsible.Root)

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <Collapsible.Root defaultOpen onOpenChange={setIsSidebarOpen}>
      <Header isSidebarOpen={isSidebarOpen} />
      <Sidebar />
    </Collapsible.Root>
  )
}
```

### Sidebar com Trigger e Content

```tsx
function Sidebar() {
  return (
    <div>
      <Collapsible.Trigger asChild>
        <button>{/* ícone fechar */}</button>
      </Collapsible.Trigger>

      <Collapsible.Content className="data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut">
        {/* conteúdo da sidebar */}
      </Collapsible.Content>
    </div>
  )
}
```

### Header com Trigger condicional

```tsx
function Header({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <header>
      {!isSidebarOpen && (
        <Collapsible.Trigger asChild>
          <button>{/* ícone abrir */}</button>
        </Collapsible.Trigger>
      )}
    </header>
  )
}
```

### Animações no Tailwind (tailwind.config)

```js
keyframes: {
  slideIn: {
    from: { width: '0' },
    to: { width: 'var(--radix-collapsible-content-width)' },
  },
  slideOut: {
    from: { width: 'var(--radix-collapsible-content-width)' },
    to: { width: '0' },
  },
},
animation: {
  slideIn: 'slideIn 0.25s ease',
  slideOut: 'slideOut 0.25s ease',
},
```

## Example

**Before (botão manual sem Radix):**
```tsx
<div>
  <aside style={{ display: isOpen ? 'block' : 'none' }}>
    <button onClick={() => setIsOpen(false)}>Fechar</button>
    {/* sidebar content */}
  </aside>
  <header>
    <button onClick={() => setIsOpen(true)}>Abrir</button>
  </header>
</div>
```

**After (com Radix Collapsible):**
```tsx
<Collapsible.Root defaultOpen onOpenChange={setIsSidebarOpen}>
  <Collapsible.Content className="data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut">
    <Collapsible.Trigger asChild>
      <button>Fechar</button>
    </Collapsible.Trigger>
    {/* sidebar content */}
  </Collapsible.Content>
  <header>
    {!isSidebarOpen && (
      <Collapsible.Trigger asChild>
        <button>Abrir</button>
      </Collapsible.Trigger>
    )}
  </header>
</Collapsible.Root>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Sidebar e header precisam compartilhar toggle | Envolva ambos no mesmo Collapsible.Root |
| Precisa saber se está aberto fora do Radix | Use `onOpenChange` + `useState` |
| Quer animação suave | Use `data-[state=open/closed]` + keyframes com `--radix-collapsible-content-width` |
| Botão deve abrir E fechar | Use Collapsible.Trigger (alterna automaticamente) |
| Precisa mostrar elemento só quando fechado | Controle via estado compartilhado (`isSidebarOpen`) |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `display: none/block` para toggle | Collapsible.Content (gerencia acessibilidade) |
| Botão com `onClick` manual para toggle | Collapsible.Trigger (gerencia estado interno) |
| Largura fixa nos keyframes (`width: 240px`) | `var(--radix-collapsible-content-width)` (dinâmico) |
| Collapsible.Root só na sidebar | Root envolvendo todos que precisam do contexto |
| Estado duplicado no header e sidebar | Estado único no layout, passado via props |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
