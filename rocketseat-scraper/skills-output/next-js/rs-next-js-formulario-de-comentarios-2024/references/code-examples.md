# Code Examples: Formulario de Comentarios

## Exemplo completo da aula

O codigo construido pelo instrutor passo a passo:

```tsx
// Componente de formulario de comentarios
// Parte visual apenas — funcionalidade sera adicionada depois

import { MessageCirclePlus } from 'lucide-react'

export function CommentForm() {
  return (
    <form className="relative w-full">
      <input
        className="bg-nav-900 h-11 pr-24 w-full"
        placeholder="Leave a comment"
      />
      <button
        type="submit"
        className="flex items-center gap-2 text-indigo-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-indigo-300 cursor-pointer disabled:opacity-50"
      >
        Publish
        <MessageCirclePlus className="size-3" />
      </button>
    </form>
  )
}
```

## Decomposicao das classes Tailwind

### Container (form)
```
relative  → cria contexto de posicionamento para o botao absolute
w-full    → ocupa toda a largura disponivel
```

### Input
```
bg-nav-900  → cor de fundo escura (custom color do projeto)
h-11        → altura de 2.75rem
pr-24       → padding-right de 6rem (reserva espaco para o botao)
w-full      → largura total
```

### Botao
```
flex items-center gap-2    → layout horizontal com espacamento
text-indigo-400            → cor do texto
absolute right-3           → posicionamento absoluto, 0.75rem da direita
top-1/2 -translate-y-1/2   → centralizacao vertical perfeita
text-xs                    → tamanho de fonte pequeno
hover:text-indigo-300      → hover clareia a cor
cursor-pointer             → cursor de mao ao passar
disabled:opacity-50        → opacidade reduzida quando desabilitado
```

### Icone
```
size-3  → 0.75rem (12px) de largura e altura
```

## Variacao: com estado de loading

Embora nao implementado na aula, o padrao natural de evolucao seria:

```tsx
'use client'

import { MessageCirclePlus } from 'lucide-react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 text-indigo-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-indigo-300 cursor-pointer disabled:opacity-50"
    >
      Publish
      <MessageCirclePlus className="size-3" />
    </button>
  )
}
```

## Variacao: campo de busca com mesmo padrao

O mesmo padrao de botao inline funciona para campos de busca:

```tsx
import { Search } from 'lucide-react'

export function SearchInput() {
  return (
    <div className="relative w-full">
      <input
        className="bg-gray-900 h-11 pr-20 w-full rounded-lg px-4"
        placeholder="Search..."
      />
      <button
        type="button"
        className="flex items-center gap-2 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-gray-300 cursor-pointer"
      >
        <Search className="size-4" />
      </button>
    </div>
  )
}
```