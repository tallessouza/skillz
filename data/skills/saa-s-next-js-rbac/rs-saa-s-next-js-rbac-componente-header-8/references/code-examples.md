# Code Examples: Componente Header — Next.js SaaS

## Estrutura de pastas com route groups

```
src/app/
├── (auth)/              # Rotas de autenticacao (login, registro)
│   ├── layout.tsx       # Layout para paginas de auth
│   └── auth/
│       ├── sign-in/
│       └── sign-up/
├── (app)/               # Rotas do usuario autenticado
│   ├── layout.tsx       # Valida autenticacao, redireciona se nao logado
│   └── page.tsx         # Home (mesma URL que /)
├── api/
│   └── auth/
│       └── sign-out/    # Route handler para logout
└── layout.tsx           # Layout raiz (global)
```

## Layout do route group autenticado

```typescript
// src/app/(app)/layout.tsx
import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  // Layout minimo — nao fixa header/sidebar ainda
  return <>{children}</>
}
```

## Pagina home com header

```typescript
// src/app/(app)/page.tsx
export default async function Home() {
  return (
    <div className="py-4">
      <Header />
      <main>{/* Conteudo principal */}</main>
    </div>
  )
}
```

## Header completo

```typescript
// src/components/header.tsx
import Image from 'next/image'
import skillzIcon from '@/assets/skillz-icon.svg'
import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      {/* Lado esquerdo: Logo + Selectors */}
      <div className="flex items-center gap-3">
        <Image
          src={skillzIcon}
          className="size-6 dark:invert"
          alt="Skillz"
        />
        {/* Org selector e Project selector virao aqui */}
      </div>

      {/* Lado direito: Acoes + Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications, theme toggle virao aqui */}
        <ProfileButton />
      </div>
    </div>
  )
}
```

## Profile Button com dropdown completo

```typescript
// src/components/profile-button.tsx
import { ChevronDown, LogOut } from 'lucide-react'
import { auth } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>

        {(user.avatarUrl || user.name) && (
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            {user.name && (
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            )}
          </Avatar>
        )}

        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          {/* ANCHOR, nao Link — evita prefetch da rota de logout */}
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" />
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Funcao getInitials — detalhamento

```typescript
function getInitials(name: string): string {
  // "John Doe" → ["John", "Doe"]
  return name
    .split(' ')
    // ["John", "Doe"] → ["J", "D"]
    .map((word) => word.charAt(0).toUpperCase())
    // Pega apenas os 2 primeiros
    .slice(0, 2)
    // ["J", "D"] → "JD"
    .join('')
}

// Exemplos:
// "Diego Fernandes" → "DF"
// "John" → "J"
// "Ana Maria Silva" → "AM" (slice limita a 2)
```

## Dark mode com invert no logo

```typescript
// Logo SVG preto que fica branco no dark mode
<Image
  src={logoIcon}
  className="size-6 dark:invert"
  alt="Logo"
/>
// dark:invert aplica filter: invert(1) apenas no tema dark
// Funciona bem para logos monocromaticos
```

## Avatar do GitHub como source

```typescript
// GitHub disponibiliza avatar como PNG via URL
<AvatarImage src="https://github.com/diego3g.png" />

// Em producao, o avatarUrl vem do banco de dados
// populado durante OAuth com GitHub
<AvatarImage src={user.avatarUrl} />
```