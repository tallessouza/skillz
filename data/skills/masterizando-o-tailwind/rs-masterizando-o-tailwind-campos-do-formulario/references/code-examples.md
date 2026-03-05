# Code Examples: Campos do Formulário

## Configuração do Grid Template customizado

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      gridTemplateColumns: {
        form: 'minmax(7.5rem, 17.5rem) minmax(25rem, 1fr) minmax(0, 15rem)',
      },
    },
  },
} satisfies Config
```

## Estrutura completa do formulário

```tsx
import * as Input from '@/components/Input'
import { Mail } from 'lucide-react'

export function SettingsForm() {
  return (
    <form
      id="settings"
      className="mt-6 flex flex-col gap-5 divide-y divide-zinc-200"
    >
      {/* Name - dois inputs lado a lado */}
      <div className="grid grid-cols-form gap-3">
        <label
          htmlFor="firstName"
          className="text-sm font-medium text-zinc-700"
        >
          Name
        </label>
        <div className="grid grid-cols-2 gap-6">
          <Input.Root>
            <Input.Control id="firstName" defaultValue="Diego" />
          </Input.Root>
          <Input.Root>
            <Input.Control defaultValue="Fernandes" />
          </Input.Root>
        </div>
      </div>

      {/* Email - input único com ícone */}
      <div className="grid grid-cols-form gap-3 pt-5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700"
        >
          Email Address
        </label>
        <Input.Root>
          <Input.Prefix>
            <Mail className="h-5 w-5 text-zinc-500" />
          </Input.Prefix>
          <Input.Control
            id="email"
            type="email"
            defaultValue="jagor@kitcid.com.br"
          />
        </Input.Root>
      </div>

      {/* Your photo - label com descrição, input placeholder */}
      <div className="grid grid-cols-form gap-3 pt-5">
        <label
          htmlFor="photo"
          className="text-sm font-medium text-zinc-700"
        >
          Your photo
          <span className="mt-0.5 block text-sm font-normal text-zinc-500">
            This will be displayed on your profile.
          </span>
        </label>
        {/* Upload component será adicionado depois */}
      </div>

      {/* Role - input simples */}
      <div className="grid grid-cols-form gap-3 pt-5">
        <label
          htmlFor="role"
          className="text-sm font-medium text-zinc-700"
        >
          Role
        </label>
        <Input.Root>
          <Input.Control id="role" defaultValue="CTO" />
        </Input.Root>
      </div>

      {/* Country - placeholder para select */}
      <div className="grid grid-cols-form gap-3 pt-5">
        <label
          htmlFor="country"
          className="text-sm font-medium text-zinc-700"
        >
          Country
        </label>
        {/* Select component será adicionado depois */}
      </div>

      {/* Timezone - placeholder para select */}
      <div className="grid grid-cols-form gap-3 pt-5">
        <label
          htmlFor="timezone"
          className="text-sm font-medium text-zinc-700"
        >
          Timezone
        </label>
        {/* Select component será adicionado depois */}
      </div>

      {/* Bio - label com descrição */}
      <div className="grid grid-cols-form gap-3 pt-5">
        <label
          htmlFor="bio"
          className="text-sm font-medium text-zinc-700"
        >
          Bio
          <span className="mt-0.5 block text-sm font-normal text-zinc-500">
            Write a short introduction.
          </span>
        </label>
        {/* Textarea/editor component será adicionado depois */}
      </div>

      {/* Portfolio Projects - label com descrição */}
      <div className="grid grid-cols-form gap-3 pt-5">
        <label
          htmlFor="projects"
          className="text-sm font-medium text-zinc-700"
        >
          Portfolio Projects
          <span className="mt-0.5 block text-sm font-normal text-zinc-500">
            Share a few snippets of your work.
          </span>
        </label>
        {/* File upload component será adicionado depois */}
      </div>

      {/* Botões de ação alinhados à direita */}
      <div className="flex items-center justify-end gap-2 pt-5">
        <button
          type="button"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          Save
        </button>
      </div>
    </form>
  )
}
```

## Evolução: de div separadora para divide-y

### Passo 1 — Abordagem verbosa (funciona mas não ideal)

```tsx
<form className="flex flex-col gap-5">
  <div className="grid grid-cols-form gap-3">
    {/* campo name */}
  </div>

  {/* Div manual como separador */}
  <div className="h-px w-full bg-zinc-300" />

  <div className="grid grid-cols-form gap-3">
    {/* campo email */}
  </div>
</form>
```

### Passo 2 — Refatorado com divide-y

```tsx
<form className="flex flex-col gap-5 divide-y divide-zinc-200">
  <div className="grid grid-cols-form gap-3">
    {/* campo name - sem pt-5 (é o primeiro) */}
  </div>

  <div className="grid grid-cols-form gap-3 pt-5">
    {/* campo email - com pt-5 para distanciar da linha */}
  </div>
</form>
```

## Padrão: dois inputs na mesma linha

```tsx
{/* Quando precisa de 2 inputs lado a lado (ex: first name / last name) */}
<div className="grid grid-cols-2 gap-6">
  <Input.Root>
    <Input.Control id="firstName" defaultValue="Diego" />
  </Input.Root>
  <Input.Root>
    <Input.Control defaultValue="Fernandes" />
  </Input.Root>
</div>
```

## Padrão: input com ícone prefix

```tsx
<Input.Root>
  <Input.Prefix>
    <Mail className="h-5 w-5 text-zinc-500" />
  </Input.Prefix>
  <Input.Control id="email" type="email" defaultValue="user@example.com" />
</Input.Root>
```

## Padrão: label com texto auxiliar

```tsx
<label htmlFor="bio" className="text-sm font-medium text-zinc-700">
  Bio
  <span className="mt-0.5 block text-sm font-normal text-zinc-500">
    Write a short introduction.
  </span>
</label>
```