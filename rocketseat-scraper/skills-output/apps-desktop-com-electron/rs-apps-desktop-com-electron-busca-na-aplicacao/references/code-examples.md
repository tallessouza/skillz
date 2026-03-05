# Code Examples: Busca com Command Palette (cmdk)

## Exemplo completo: SearchBar com cmdk

```tsx
import { Command } from 'cmdk'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchBar({ open, onOpenChange }: SearchBarProps) {
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      // mesma funcao usada na sidebar
      const response = await window.api.fetchDocuments()
      return response
    },
  })

  function handleOpenDocument(id: string) {
    navigate(`/documents/${id}`)
    onOpenChange(false)
  }

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
      <Command.List className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-zinc-700">
        {data && data.length > 0 && data.map((document) => (
          <Command.Item
            key={document.id}
            onSelect={() => handleOpenDocument(document.id)}
          >
            {document.title}
          </Command.Item>
        ))}
        <Command.Empty>Nenhum documento encontrado</Command.Empty>
      </Command.List>
    </Command.Dialog>
  )
}
```

## Exemplo completo: Componente pai (Search/Sidebar)

```tsx
import { useState } from 'react'
import { SearchBar } from './SearchBar'

export function SidebarSearch() {
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false)

  function handleOpenChange(open: boolean) {
    setIsSearchBarOpen(open)
  }

  return (
    <>
      <button onClick={() => handleOpenChange(true)}>
        Busca rapida
      </button>
      <SearchBar
        open={isSearchBarOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  )
}
```

## Configuracao do plugin tailwind-scrollbar

```bash
npm install tailwind-scrollbar
```

```js
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    // outros plugins...
    require('tailwind-scrollbar'),
  ],
}
```

## React Query cache sharing — demonstracao

```tsx
// Sidebar.tsx — busca documentos para listar na sidebar
function Sidebar() {
  const { data: documents } = useQuery({
    queryKey: ['documents'],  // <-- MESMA KEY
    queryFn: fetchDocuments,
  })
  return <nav>{documents?.map(doc => <SidebarItem key={doc.id} doc={doc} />)}</nav>
}

// SearchBar.tsx — busca documentos para mostrar na busca
function SearchBar({ open, onOpenChange }: SearchBarProps) {
  const { data: documents } = useQuery({
    queryKey: ['documents'],  // <-- MESMA KEY = UMA CHAMADA SO
    queryFn: fetchDocuments,
  })
  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange}>
      {/* ... */}
    </Command.Dialog>
  )
}

// React Query faz UMA UNICA chamada e compartilha o resultado
// entre Sidebar e SearchBar automaticamente
```

## Variacao: toggle function extraida

```tsx
// Se precisar exportar o toggle para uso externo
export function useSearchBar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, toggle, open, close, setIsOpen }
}
```