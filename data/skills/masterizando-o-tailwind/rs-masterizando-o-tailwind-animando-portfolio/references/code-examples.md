# Code Examples: AutoAnimate em Listas e Grids

## Instalacao

```bash
pnpm add @formkit/auto-animate
```

## Exemplo do projeto — FileList com AutoAnimate

### Antes (sem animacao)

O componente FileList renderiza itens de portfolio. Quando o usuario faz upload, os itens aparecem instantaneamente sem transicao:

```typescript
// src/components/Form/FileList.tsx
export function FileList({ files, onRemove }) {
  return (
    <div className="mt-4 space-y-3">
      {files.map((file) => (
        <FileItem key={file.name} file={file} onRemove={() => onRemove(file)} />
      ))}
    </div>
  )
}
```

### Depois (com AutoAnimate)

Unica mudanca: importar o hook e adicionar ref no elemento pai:

```typescript
// src/components/Form/FileList.tsx
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function FileList({ files, onRemove }) {
  const [parent] = useAutoAnimate()

  return (
    <div ref={parent} className="mt-4 space-y-3">
      {files.map((file) => (
        <FileItem key={file.name} file={file} onRemove={() => onRemove(file)} />
      ))}
    </div>
  )
}
```

## Variacao: com configuracao customizada

```typescript
const [parent] = useAutoAnimate({
  duration: 250,
  easing: 'ease-in-out',
})
```

## Variacao: grid de cards

```typescript
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function ProjectGrid({ projects }) {
  const [parent] = useAutoAnimate()

  return (
    <div ref={parent} className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

## Variacao: acordeao

```typescript
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function Accordion({ items }) {
  const [parent] = useAutoAnimate()
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div ref={parent}>
      {items.map((item) => (
        <div key={item.id}>
          <button onClick={() => setOpenId(openId === item.id ? null : item.id)}>
            {item.title}
          </button>
          {openId === item.id && (
            <div className="p-4">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}
```

## Variacao: mensagens de validacao

```typescript
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function FormField({ label, error, children }) {
  const [parent] = useAutoAnimate()

  return (
    <div ref={parent}>
      <label>{label}</label>
      {children}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}
```

## O que o hook retorna

```typescript
const [parent, enableAnimations] = useAutoAnimate()
// parent — ref para colocar no elemento pai
// enableAnimations — funcao para ligar/desligar animacoes programaticamente
```

O instrutor menciona que `enableAnimations` existe mas nao foi necessario no projeto — so o `parent` foi usado.