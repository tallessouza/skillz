# Code Examples: Estrutura do Cabecalho

## Exemplo completo do Header

### Layout usando o Header colocado

```tsx
// app/(dashboard)/layout.tsx
import { Header } from "./header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <section className="overflow-y-auto">
        {children}
      </section>
    </>
  )
}
```

### Header completo

```tsx
// app/(dashboard)/header.tsx
import { LogIn, Search } from "lucide-react"
import { Input } from "@/components/input"

export function Header() {
  return (
    <header className="max-w-[900px] mx-auto w-full flex items-center justify-between">
      {/* Branding */}
      <div className="space-y-1">
        <h1 className="font-semibold text-xl">ProductRoadmap</h1>
        <p className="text-sm text-navy-100">
          Follow the development progress of our entire platform
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search with icon inside */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for..."
            className="w-[270px] pl-8"
          />
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-navy-200 pointer-events-none"
          />
        </div>

        {/* Login avatar button */}
        <button className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center hover:bg-navy-600 transition-colors duration-150 cursor-pointer">
          <LogIn className="size-3.5 text-navy-200" />
        </button>
      </div>
    </header>
  )
}
```

## Componente Input base

```tsx
// components/input.tsx
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={twMerge(
        "bg-navy-900 border-[0.5px] border-navy-500 h-10 flex items-center placeholder:text-navy-200 px-3 rounded-lg text-sm focus:border-navy-400 transition-colors duration-150",
        className
      )}
      {...props}
    />
  )
}
```

**Por que twMerge?** Permite que o consumidor passe classes que sobrescrevem as classes base sem conflito. Exemplo: `className="w-[270px] pl-8"` sobrescreve corretamente o padding default.

## Componente Button (ja existia na aplicacao)

```tsx
// components/button.tsx — referencia, ja existia antes
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function Button({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      className={twMerge(
        "bg-navy-700 border border-navy-500 flex items-center justify-center hover:bg-navy-600 transition-colors duration-150 cursor-pointer rounded-lg h-10 px-4 text-sm",
        className
      )}
      {...props}
    />
  )
}
```

O instrutor optou por NAO usar o componente Button para o botao de login porque "vai ser so um avatar, so uma bolinha" — o visual e muito diferente do Button padrao.

## Padrao: Icone dentro de Input (passo a passo)

### Passo 1: Div relative envolvendo

```tsx
<div className="relative">
  <Input ... />
</div>
```

### Passo 2: Icone posicionado absolutamente

```tsx
<div className="relative">
  <Input ... />
  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-navy-200" />
</div>
```

O `top-1/2` coloca o topo do icone no meio vertical. O `-translate-y-1/2` puxa o icone para cima pela metade do seu proprio tamanho, centralizando perfeitamente.

### Passo 3: pointer-events-none para cliques passarem

```tsx
<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-navy-200 pointer-events-none" />
```

Sem isso, clicar no icone nao foca o input. Com `pointer-events-none`, e como se o icone nao existisse para eventos de mouse.

### Passo 4: Padding left no input para nao sobrepor texto

```tsx
<Input className="w-[270px] pl-8" />
```

O `pl-8` (32px) garante que o texto digitado comeca depois do icone (que esta em `left-2.5` com `size-4` = 16px).