---
name: rs-electron-busca-na-aplicacao
description: "Applies command palette search pattern using cmdk library in React/Electron apps. Use when user asks to 'add search', 'implement command palette', 'add command k', 'create search bar', or 'add quick search'. Covers cmdk setup, open/close state lifting, React Query cache sharing across components, navigation on select, and Tailwind scrollbar plugin. Make sure to use this skill whenever implementing search UI with keyboard shortcuts in React apps. Not for full-text search engines, server-side search, or database query optimization."
---

# Busca com Command Palette (cmdk)

> Implemente busca via command palette levantando estado de open/close para o componente pai e reutilizando queries com React Query cache sharing.

## Rules

1. **Levante o estado open/close para o pai** — o componente SearchBar recebe `open` e `onOpenChange` como props, porque outros componentes (botao, hotkey) precisam controlar a abertura
2. **Use cmdk para command palettes** — biblioteca `cmdk` cria menus estilo VS Code/Raycast com busca integrada, acessibilidade e keyboard navigation prontos
3. **Reutilize query keys do React Query** — se dois componentes usam `useQuery` com a mesma key, o React Query faz UMA chamada so e compartilha o resultado, porque evita chamadas HTTP duplicadas
4. **Feche a busca apos navegacao** — chame `onOpenChange(false)` depois de `navigate()`, porque o usuario espera que a busca feche ao selecionar um item
5. **Configure o plugin tailwind-scrollbar** — scrollbars customizadas com classes `scrollbar-thin` exigem o plugin `tailwind-scrollbar` instalado e registrado no config

## How to write

### SearchBar com estado externo

```tsx
interface SearchBarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchBar({ open, onOpenChange }: SearchBarProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange}>
      <Command.Input placeholder="Buscar documentos..." />
      <Command.List>
        {/* items here */}
      </Command.List>
    </Command.Dialog>
  )
}
```

### Componente pai controlando estado

```tsx
function Search() {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)

  function handleOpenChange(open: boolean) {
    setIsSearchBarOpen(open)
  }

  return (
    <>
      <button onClick={() => handleOpenChange(true)}>Busca rapida</button>
      <SearchBar open={isSearchBarOpen} onOpenChange={handleOpenChange} />
    </>
  )
}
```

### Lista com navegacao e fechamento

```tsx
const { data } = useQuery({ queryKey: ['documents'], queryFn: fetchDocuments })
const navigate = useNavigate()

function handleOpenDocument(id: string) {
  navigate(`/documents/${id}`)
  onOpenChange(false)
}

return (
  <Command.List className="scrollbar-thin scrollbar-thumb-rounded">
    {data?.map(doc => (
      <Command.Item key={doc.id} onSelect={() => handleOpenDocument(doc.id)}>
        {doc.title}
      </Command.Item>
    ))}
    <Command.Empty>Nenhum documento encontrado</Command.Empty>
  </Command.List>
)
```

## Example

**Before (estado interno, sem compartilhamento):**
```tsx
// SearchBar controla proprio estado — impossivel abrir de fora
function SearchBar() {
  const [open, setOpen] = useState(false)
  const { data } = useQuery({ queryKey: ['search-docs'], queryFn: fetchDocs })
  // ...
}

// Sidebar tambem busca docs — DUAS chamadas HTTP
function Sidebar() {
  const { data } = useQuery({ queryKey: ['sidebar-docs'], queryFn: fetchDocs })
}
```

**After (estado levantado, cache compartilhado):**
```tsx
// SearchBar recebe estado como props
function SearchBar({ open, onOpenChange }: SearchBarProps) {
  const { data } = useQuery({ queryKey: ['documents'], queryFn: fetchDocs })
  // ...
}

// Sidebar usa MESMA query key — UMA chamada HTTP apenas
function Sidebar() {
  const { data } = useQuery({ queryKey: ['documents'], queryFn: fetchDocs })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Multiplos componentes buscam mesmos dados | Use mesma query key no React Query — cache automatico |
| Botao E hotkey abrem a busca | Levante estado para o pai, passe como props |
| Usuario seleciona item na busca | Navegue E feche a busca na mesma acao |
| Scrollbar nao aparece com classes Tailwind | Instale e registre `tailwind-scrollbar` no config |
| `Command.Empty` nao aparece | Coloque fora do `.map()`, dentro de `Command.List` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `useState` de open dentro do SearchBar | Receba `open` e `onOpenChange` como props |
| Query keys diferentes para mesmos dados | Mesma key `['documents']` em todos os componentes |
| Navegar sem fechar a busca | `navigate()` seguido de `onOpenChange(false)` |
| `scrollbar-thin` sem plugin | Instale `tailwind-scrollbar` e adicione em `plugins` |
| `Command.Empty` dentro do `.map()` | `Command.Empty` como sibling direto em `Command.List` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
