# Code Examples: Pagina de Autenticacao

## Estrutura de pastas completa

```
app/
├── layout.tsx              # Layout global (html, body)
├── (auth)/
│   ├── layout.tsx          # Layout de auth (centralizado)
│   └── sign-in/
│       └── page.tsx        # Pagina de sign-in
src/
└── assets/
    └── github-icon.svg     # Icone SVG importavel
```

## Layout global vs layout de auth

### Layout global (ja existe)
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Layout de auth (novo, aninhado)
```tsx
// app/(auth)/layout.tsx
// NAO tem <html> e <body> — ja existe no layout global
// Este layout e ANINHADO, nao substitui o global
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
```

## Pagina de sign-in completa

```tsx
// app/(auth)/sign-in/page.tsx
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import githubIcon from '@/assets/github-icon.svg'

export default function SignInPage() {
  return (
    <form className="space-y-4">
      {/* Campo de email */}
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      {/* Campo de password com link de recuperacao */}
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Botao principal */}
      <Button type="submit" className="w-full">
        Sign in with e-mail
      </Button>

      {/* Separador visual */}
      <Separator />

      {/* Login social */}
      <Button variant="outline" className="w-full">
        <Image
          src={githubIcon}
          alt=""
          className="size-4 mr-2 dark:invert"
        />
        Sign in with GitHub
      </Button>
    </form>
  )
}
```

## Espacamento com Tailwind `space-y-*`

```tsx
// space-y-4 = 16px entre cada filho direto
<form className="space-y-4">
  <div>...</div>   {/* 16px abaixo */}
  <div>...</div>   {/* 16px abaixo */}
  <Button>...</Button>
</form>

// space-y-1 = 4px entre label e input
<div className="space-y-1">
  <Label>E-mail</Label>   {/* 4px abaixo */}
  <Input />
</div>
```

## Variantes do Button ShadCN usadas

```tsx
// Default — botao primario solido
<Button type="submit" className="w-full">
  Sign in with e-mail
</Button>

// Outline — apenas borda, fundo transparente
<Button variant="outline" className="w-full">
  Sign in with GitHub
</Button>
```

## Comparacao: cores diretas vs variaveis ShadCN

```tsx
// ERRADO — precisa duplicar para dark mode
<Link className="text-gray-400 dark:text-gray-200 hover:underline">
  Forgot password?
</Link>

// CORRETO — variavel CSS resolve automaticamente
<Link className="text-foreground hover:underline">
  Forgot password?
</Link>
```

Variaveis disponiveis no ShadCN:
- `background` / `foreground` — cores principais
- `muted` / `muted-foreground` — cores secundarias
- `accent` / `accent-foreground` — cores de destaque
- `destructive` / `destructive-foreground` — cores de erro/perigo

## Importando e usando SVG como icone

```tsx
// 1. Salve o SVG em src/assets/github-icon.svg
// 2. Importe como modulo
import githubIcon from '@/assets/github-icon.svg'

// 3. Use com next/image
<Image
  src={githubIcon}
  alt=""                              // vazio quando dentro de botao com texto
  className="size-4 mr-2 dark:invert" // 16x16, margem direita, inverte no dark
/>
```

## Extensao da pagina para sign-up (variacao)

```tsx
// app/(auth)/sign-up/page.tsx — mesmo padrao, campos adicionais
export default function SignUpPage() {
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input name="name" id="name" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input name="password_confirmation" type="password" id="password_confirmation" />
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>

      <Separator />

      <Button variant="outline" className="w-full">
        <Image src={githubIcon} alt="" className="size-4 mr-2 dark:invert" />
        Sign up with GitHub
      </Button>
    </form>
  )
}
```