# Code Examples: Pattern de Composição

## Exemplo completo do input (como na aula)

### Arquivo `input.tsx` — estilo namespace

```typescript
import { ComponentProps } from 'react'

type RootProps = ComponentProps<'div'>

export function Root(props: RootProps) {
  return (
    <div
      className="mx-1 flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100"
      {...props}
    />
  )
}

type PrefixProps = ComponentProps<'div'>

export function Prefix(props: PrefixProps) {
  return <div {...props} />
}

type ControlProps = ComponentProps<'input'>

export function Control(props: ControlProps) {
  return (
    <input
      className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none"
      {...props}
    />
  )
}
```

### Uso na Sidebar

```typescript
import * as Input from '../components/input'
import { Search } from 'lucide-react'

export function Sidebar() {
  return (
    <aside>
      <Input.Root>
        <Input.Prefix>
          <Search className="h-5 w-5 text-zinc-500" />
        </Input.Prefix>
        <Input.Control placeholder="Search" />
      </Input.Root>
    </aside>
  )
}
```

## Variacoes de uso

### Input sem icone
```typescript
<Input.Root>
  <Input.Control placeholder="Digite seu email" />
</Input.Root>
```

### Input com icone na direita
```typescript
<Input.Root>
  <Input.Control placeholder="Search" />
  <Input.Prefix>
    <Search className="h-5 w-5 text-zinc-500" />
  </Input.Prefix>
</Input.Root>
```

### Input com imagem ao inves de icone
```typescript
<Input.Root>
  <Input.Prefix>
    <img src="/avatar.png" className="h-5 w-5 rounded-full" alt="" />
  </Input.Prefix>
  <Input.Control placeholder="Digite uma mensagem" />
</Input.Root>
```

### Input com sufixo adicional (extensao do pattern)
```typescript
// Se precisar de um sufixo, crie um Suffix component
export function Suffix(props: ComponentProps<'div'>) {
  return <div {...props} />
}

// Uso:
<Input.Root>
  <Input.Prefix>
    <DollarSign className="h-5 w-5 text-zinc-500" />
  </Input.Prefix>
  <Input.Control placeholder="0.00" />
  <Input.Suffix>
    <span className="text-sm text-zinc-500">BRL</span>
  </Input.Suffix>
</Input.Root>
```

## Estilo alternativo: nomes completos (shadcn/ui)

```typescript
// input.tsx
import { ComponentProps } from 'react'

type InputRootProps = ComponentProps<'div'>

export function InputRoot(props: InputRootProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2"
      {...props}
    />
  )
}

type InputPrefixProps = ComponentProps<'div'>

export function InputPrefix(props: InputPrefixProps) {
  return <div {...props} />
}

type InputControlProps = ComponentProps<'input'>

export function InputControl(props: InputControlProps) {
  return (
    <input
      className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none"
      {...props}
    />
  )
}
```

```typescript
// uso
import { InputRoot, InputPrefix, InputControl } from '../components/input'

<InputRoot>
  <InputPrefix>
    <Search className="h-5 w-5 text-zinc-500" />
  </InputPrefix>
  <InputControl placeholder="Search" />
</InputRoot>
```

## Commit de referencia

[Pattern de Composição — Skillz Ignite Tailwind](https://github.com/skillz-education/ignite-tailwind/commit/af1a6a84a35b2f10e6d37e856ef8773bcb535b64)