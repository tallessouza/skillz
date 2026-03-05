# Code Examples: Implementando Responsividade

## Exemplo completo do componente

### Estado e funcoes

```typescript
// Estado para controle de visibilidade mobile
const [isMobileOpen, setIsMobileOpen] = useState(false)

// Funcoes separadas para abrir e fechar
const openMobile = () => setIsMobileOpen(true)
const closeMobile = () => setIsMobileOpen(false)
```

### Botao hamburger

```tsx
<>
  {/* Botao visivel apenas no mobile (abaixo de md breakpoint) */}
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

  {/* Sidebar com responsividade */}
  <aside
    className={cn(
      // Controle mobile via estado
      isMobileOpen ? "translate-x-0" : "-translate-x-full",
      // Desktop: sempre visivel
      "md:translate-x-0",
      // Transicao suave
      "transition-transform duration-300",
      // Posicionamento
      "fixed md:relative z-40"
    )}
  >
    {/* Botao fechar — tambem so aparece no mobile */}
    <button
      className="md:hidden"
      onClick={closeMobile}
      aria-label="Fechar menu"
    >
      Fechar
    </button>

    {/* Conteudo da sidebar */}
    <nav>
      {/* Links de navegacao */}
    </nav>
  </aside>
</>
```

## Variacao: Sidebar com overlay no mobile

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

  {/* Overlay escuro atras da sidebar no mobile */}
  {isMobileOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-30 md:hidden"
      onClick={closeMobile}
      aria-hidden="true"
    />
  )}

  <aside
    className={cn(
      isMobileOpen ? "translate-x-0" : "-translate-x-full",
      "md:translate-x-0",
      "fixed md:relative z-40 transition-transform"
    )}
  >
    <button onClick={closeMobile} className="md:hidden">
      Fechar
    </button>
    <nav>{/* conteudo */}</nav>
  </aside>
</>
```

## Variacao: Combinando colapso desktop + mobile

```tsx
const [isCollapsed, setIsCollapsed] = useState(false)
const [isMobileOpen, setIsMobileOpen] = useState(false)

const openMobile = () => setIsMobileOpen(true)
const closeMobile = () => setIsMobileOpen(false)
const toggleCollapse = () => setIsCollapsed(prev => !prev)

// Na sidebar:
<aside
  className={cn(
    // Mobile
    isMobileOpen ? "translate-x-0" : "-translate-x-full",
    // Desktop
    "md:translate-x-0",
    isCollapsed ? "md:w-16" : "md:w-64",
    // Base
    "fixed md:relative z-40 transition-all"
  )}
>
  {/* Botao colapsar — so desktop */}
  <button onClick={toggleCollapse} className="hidden md:block">
    {isCollapsed ? "Expandir" : "Colapsar"}
  </button>

  {/* Botao fechar — so mobile */}
  <button onClick={closeMobile} className="md:hidden">
    Fechar
  </button>
</aside>
```

## Import necessario para o icone

```typescript
import { Menu } from "lucide-react"
```