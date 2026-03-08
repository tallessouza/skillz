# Code Examples: Criando Componente de Input com Tailwind CSS

## Componente completo — Input.tsx

```tsx
import React from "react"

type Props = React.ComponentProps<"input"> & {
  legend?: string
}

export function Input({ legend, ...rest }: Props) {
  return (
    <fieldset className="flex flex-1 max-h-20 focus-within:text-green-100">
      {legend && (
        <legend className="uppercase text-xs text-gray-200 mb-2 text-inherit">
          {legend}
        </legend>
      )}
      <input
        type="text"
        className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-100 bg-transparent outline-none focus:border-2 focus:border-green-100 placeholder:text-gray-300"
        {...rest}
      />
    </fieldset>
  )
}
```

## Pagina Sign-In usando o componente

```tsx
import { Input } from "../components/input"

export function SignIn() {
  return (
    <form className="w-full flex flex-col gap-4">
      <Input
        legend="E-mail"
        type="email"
        placeholder="seu@email.com"
        required
      />
      <Input
        legend="Senha"
        type="password"
        placeholder="123456"
        required
      />
    </form>
  )
}
```

## Variacao: Input sem legend

```tsx
<Input
  type="search"
  placeholder="Buscar..."
  className="w-full"
/>
```

Sem a prop `legend`, o fieldset ainda agrupa o input mas nenhum legend e renderizado (renderizacao condicional com `&&`).

## Variacao: Input com cores diferentes no foco

Para mudar a cor de foco de verde para azul:

```tsx
<fieldset className="flex flex-1 max-h-20 focus-within:text-blue-400">
  {legend && (
    <legend className="uppercase text-xs text-gray-200 mb-2 text-inherit">
      {legend}
    </legend>
  )}
  <input
    type="text"
    className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-100 bg-transparent outline-none focus:border-2 focus:border-blue-400 placeholder:text-gray-300"
    {...rest}
  />
</fieldset>
```

## Demonstracao de rounded direcional

```tsx
// Todos os lados arredondados
<input className="rounded-lg" />

// Apenas esquerdo
<input className="rounded-l-lg" />

// Apenas direito
<input className="rounded-r-lg" />

// Top esquerdo + top direito
<input className="rounded-t-lg" />

// Bottom esquerdo + bottom direito
<input className="rounded-b-lg" />
```

## Evolucao do estilo — passo a passo

### Passo 1: Fieldset base
```tsx
<fieldset className="flex flex-1 max-h-20">
```

### Passo 2: Adicionar focus-within para heranca de cor
```tsx
<fieldset className="flex flex-1 max-h-20 focus-within:text-green-100">
```

### Passo 3: Legend com text-inherit
```tsx
<legend className="uppercase text-xs text-gray-200 mb-2 text-inherit">
```

### Passo 4: Input base
```tsx
<input className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-100 bg-transparent" />
```

### Passo 5: Remover outline e adicionar foco customizado
```tsx
<input className="... outline-none focus:border-2 focus:border-green-100" />
```

### Passo 6: Estilizar placeholder
```tsx
<input className="... placeholder:text-gray-300" />
```

## Layout do formulario

```tsx
// Container com flex column e gap uniforme
<form className="w-full flex flex-col gap-4">
  {/* Inputs empilhados com espacamento automatico */}
  <Input legend="E-mail" type="email" placeholder="seu@email.com" required />
  <Input legend="Senha" type="password" placeholder="123456" required />
</form>
```

## Contexto: Layout pai com outlet

O sign-in nao contem o logo ou imagem de fundo — esses vem do layout pai via `<Outlet />` do React Router:

```tsx
// layout.tsx (pai)
export function AuthLayout() {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <Outlet /> {/* sign-in renderiza aqui */}
    </div>
  )
}
```