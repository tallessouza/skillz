# Code Examples: Paginas de Cadastro e Recuperacao

## Pagina de Sign Up completa

```tsx
// app/auth/sign-up/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignUpPage() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
        />
      </div>

      <Button type="submit" className="w-full">
        Create account
      </Button>

      <Button variant="link" size="sm" className="w-full" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <Button type="button" variant="outline" className="w-full">
        Sign up with GitHub
      </Button>
    </form>
  )
}
```

## Pagina de Forgot Password completa

```tsx
// app/auth/forgot-password/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <Button type="submit" className="w-full">
        Recover password
      </Button>

      <Button variant="link" size="sm" className="w-full" asChild>
        <Link href="/auth/sign-in">Sign in instead</Link>
      </Button>
    </form>
  )
}
```

## Adicionando link de navegacao na pagina de Sign In

```tsx
// Adicionar apos o botao de submit no sign-in
<Button variant="link" size="sm" className="w-full" asChild>
  <Link href="/auth/sign-up">Create new account</Link>
</Button>
```

## Mapa de navegacao entre paginas

```
Sign In ──────────────── Sign Up
  │  "Create new account"    │ "Already registered? Sign in"
  │                           │
  │  "Forgot your password?"  │
  ▼                           │
Forgot Password ──────────────┘
  "Sign in instead"
```

## Variacoes: quando adicionar mais campos

### Signup com telefone (variacao)
```tsx
<div className="space-y-2">
  <Label htmlFor="phone">Phone</Label>
  <Input id="phone" name="phone" type="tel" />
</div>
```

### Signup com termos de uso (variacao)
```tsx
<div className="flex items-center space-x-2">
  <Checkbox id="terms" name="terms" />
  <Label htmlFor="terms">
    I agree to the <Link href="/terms">Terms of Service</Link>
  </Label>
</div>
```