# Code Examples: Organization Switcher

## Exemplo completo do Header com Switcher

```tsx
// src/components/header.tsx
import { Slash } from 'lucide-react'
import skillzIcon from '@/assets/skillz-icon.svg'
import Image from 'next/image'
import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={skillzIcon}
          className="size-6 dark:invert"
          alt="Skillz"
        />

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
```

## Organization Switcher completo

```tsx
// src/components/organization-switcher.tsx
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function OrganizationSwitcher() {
  // TODO: buscar organizacoes da API
  const currentOrg = null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[164px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrg ? (
          <>
            <Avatar className="mr-2 size-4">
              <AvatarImage src={currentOrg.avatarUrl} />
              <AvatarFallback />
            </Avatar>
            <span className="line-clamp-1">{currentOrg.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select organization</span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>

          {/* Exemplo estatico — substituir por dados da API */}
          <DropdownMenuItem asChild>
            <Link href="/org/skillz">
              <Avatar className="mr-2 size-4">
                <AvatarImage src="https://github.com/skillz.png" />
                <AvatarFallback />
              </Avatar>
              <span className="line-clamp-1">Skillz</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Variacoes do padrao

### Com estado de organizacao selecionada

```tsx
'use client'

import { useParams } from 'next/navigation'

export function OrganizationSwitcher() {
  const { slug } = useParams<{ slug: string }>()

  const currentOrg = organizations.find((org) => org.slug === slug)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[164px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrg ? (
          <>
            <Avatar className="mr-2 size-4">
              <AvatarImage src={currentOrg.avatarUrl} />
              <AvatarFallback />
            </Avatar>
            <span className="line-clamp-1">{currentOrg.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Select organization</span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      {/* ... content */}
    </DropdownMenu>
  )
}
```

### Workspace Switcher (mesmo padrao, dominio diferente)

```tsx
export function WorkspaceSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[180px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <Avatar className="mr-2 size-4">
          <AvatarImage src={currentWorkspace.icon} />
          <AvatarFallback />
        </Avatar>
        <span className="line-clamp-1">{currentWorkspace.name}</span>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-8}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {workspaces.map((ws) => (
            <DropdownMenuItem key={ws.id} asChild>
              <Link href={`/workspace/${ws.slug}`}>
                <Avatar className="mr-2 size-4">
                  <AvatarImage src={ws.icon} />
                  <AvatarFallback />
                </Avatar>
                <span className="line-clamp-1">{ws.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/create-workspace">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```