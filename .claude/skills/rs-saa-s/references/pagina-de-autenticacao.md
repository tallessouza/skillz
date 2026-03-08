---
name: rs-saas-nextjs-rbac-pagina-autenticacao
description: "Generates Next.js authentication pages with ShadCN UI following Skillz's SaaS RBAC patterns. Use when user asks to 'create login page', 'build sign-in form', 'auth page layout', 'authentication UI', or 'create sign-up page' in Next.js App Router projects. Applies centered auth layout, ShadCN theme variables for colors, SVG icon dark mode inversion, and proper form structure. Make sure to use this skill whenever building authentication interfaces in Next.js with ShadCN. Not for API auth logic, JWT handling, session management, or backend authentication flows."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, jwt, oauth, github]
---

# Pagina de Autenticacao Next.js com ShadCN UI

> Paginas de autenticacao seguem layout centralizado com tema via variaveis CSS do ShadCN, nunca cores hardcoded.

## Rules

1. **Crie uma pasta `(auth)` dentro de `app/`** — agrupa todas as paginas de autenticacao sob um layout compartilhado, porque o App Router usa route groups para layouts sem afetar a URL
2. **Layout de auth centraliza com flex** — `min-h-screen flex items-center justify-center flex-col px-4`, porque centraliza verticalmente sem hacks e o `px-4` evita conteudo grudado nas laterais em mobile
3. **Use variaveis de cor do ShadCN, nunca cores diretas** — `text-foreground` nao `text-gray-400`, porque as variaveis alternam automaticamente entre dark/light mode sem duplicar estilos
4. **Inverta icones SVG no dark mode com `dark:invert`** — aplica filtro CSS que troca preto por branco, porque icones SVG pretos ficam invisiveis no tema escuro
5. **Limite largura do formulario com `w-full max-w-xs`** — maximo de 320px mas responsivo para telas menores, porque formularios de auth nao devem ocupar tela inteira
6. **Relacione label e input via `htmlFor`/`id`** — acessibilidade basica obrigatoria, porque screen readers dependem dessa associacao

## How to write

### Layout de autenticacao

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
```

### Pagina de sign-in

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
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
      </div>

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

      <Button type="submit" className="w-full">
        Sign in with e-mail
      </Button>

      <Separator />

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

### Icone SVG com dark mode

```tsx
// Icone preto no light, branco no dark — sem duplicar assets
<Image src={githubIcon} alt="" className="size-4 mr-2 dark:invert" />
```

## Example

**Before (cores hardcoded, sem tema):**
```tsx
<Link href="/forgot" className="text-gray-400 text-sm hover:text-gray-200">
  Forgot password?
</Link>
<button className="bg-blue-500 text-white w-full">Sign in</button>
<img src="/github.png" className="w-4 h-4" />
```

**After (com variaveis ShadCN e dark mode):**
```tsx
<Link href="/auth/forgot-password" className="text-xs font-medium text-foreground hover:underline">
  Forgot your password?
</Link>
<Button type="submit" className="w-full">Sign in with e-mail</Button>
<Image src={githubIcon} alt="" className="size-4 mr-2 dark:invert" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Cor de texto em elemento interativo | Use `text-foreground`, `text-muted-foreground`, nunca `text-gray-*` |
| Icone SVG preto em tema dark | Adicione `dark:invert` na className |
| Formulario de auth precisa de largura | `w-full max-w-xs` no wrapper (320px max) |
| Link secundario (forgot password) | `text-xs font-medium text-foreground hover:underline` |
| Botao social login (GitHub, Google) | `Button variant="outline"` com icone SVG |
| Icone sem texto propio mas dentro de botao com texto | `alt=""` — semantica vem do botao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `className="text-gray-400 dark:text-gray-200"` | `className="text-foreground"` |
| `<img src="/icon.svg">` | `<Image src={importedIcon} alt="" />` |
| `className="h-screen flex items-center"` | `className="min-h-screen flex items-center"` |
| `<div style={{maxWidth: 320}}>` | `className="w-full max-w-xs"` |
| `className="w-4 h-4"` | `className="size-4"` |
| Botao sem `type="submit"` em form | `<Button type="submit">` |

## Troubleshooting

### Token invalido ou expirado
**Symptom:** Requisicao autenticada retorna 401
**Cause:** Token JWT expirou ou foi assinado com secret diferente
**Fix:** Verifique que o JWT_SECRET e o mesmo entre geracao e verificacao, e que o token nao expirou

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
