---
name: rs-saas-nextjs-rbac-aceitar-convite
description: "Generates invite acceptance pages in Next.js SaaS applications with proper routing, API data fetching, and multi-auth-state handling. Use when user asks to 'create invite page', 'accept invitation flow', 'handle invite link', 'build invite acceptance', or 'invitation UI'. Applies patterns: dynamic route for invite ID, server-side data fetch, avatar with fallback, relative time display, auth-state branching (unauthenticated, correct email, wrong email). Make sure to use this skill whenever building invitation or invite acceptance flows in Next.js. Not for email sending, invite creation API, or RBAC permission setup."
---

# Pagina: Aceitar Convite

> Ao construir paginas de aceitacao de convite, estruture a rota fora do layout autenticado, busque dados do convite server-side, e trate os tres estados de autenticacao do usuario convidado.

## Rules

1. **Rota fora do layout autenticado** — coloque `/invite/[id]` fora da pasta `(app)` que valida autenticacao, porque usuarios nao autenticados precisam acessar essa pagina
2. **Busque dados server-side** — use async server component com `await getInvite(inviteId)` para ter dados do convite antes do render, porque a pagina precisa exibir quem convidou e para qual organizacao
3. **Trate tres estados de auth** — usuario nao autenticado, autenticado com email correto, autenticado com email diferente, porque cada caso exige UI e acao distintas
4. **Avatar com fallback** — sempre use `Avatar > AvatarImage + AvatarFallback` para o autor do convite, porque o avatar pode nao existir
5. **Use text-balance** — aplique `text-balance` em textos descritivos para distribuir caracteres uniformemente entre linhas

## Steps

### Step 1: Criar rota dinamica fora do layout autenticado

```
src/app/invite/[id]/page.tsx   ← FORA de src/app/(app)/
```

```typescript
export default async function InvitePage({
  params,
}: {
  params: { id: string }
}) {
  const inviteId = params.id
  const { invite } = await getInvite(inviteId)
  // ...
}
```

### Step 2: Criar funcao de API para buscar convite individual

```typescript
// src/http/get-invite.ts
export async function getInvite(inviteId: string) {
  const result = await api.get(`invite/${inviteId}`).json<{
    invite: {
      id: string
      email: string
      role: string
      createdAt: string
      organization: { name: string }
      author: { id: string; name: string | null; avatarUrl: string | null }
    }
  }>()
  return result
}
```

### Step 3: Montar UI centralizada com detalhes do convite

```tsx
<div className="flex min-h-screen flex-col items-center justify-center px-4">
  <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="size-16">
        {invite.author.avatarUrl && (
          <AvatarImage src={invite.author.avatarUrl} />
        )}
        <AvatarFallback />
      </Avatar>

      <p className="text-balance text-center leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">
          {invite.author.name ?? 'Someone'}
        </span>{' '}
        invited you to join{' '}
        <span className="font-medium text-foreground">
          {invite.organization.name}
        </span>
        .{' '}
        <span className="text-xs">
          {dayjs(invite.createdAt).fromNow()}
        </span>
      </p>
    </div>

    <Separator />

    {/* Auth state handling below */}
  </div>
</div>
```

### Step 4: Configurar dayjs com relative time

```typescript
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
```

### Step 5: Tratar estados de autenticacao

```
Abaixo do Separator, implementar condicionais:

1. NAO AUTENTICADO → mostrar botao/link para sign-in
2. AUTENTICADO + MESMO EMAIL → mostrar botao "Aceitar convite"
3. AUTENTICADO + EMAIL DIFERENTE → avisar para deslogar e logar com email correto
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina precisa ser acessivel sem login | Rota FORA da pasta com layout autenticado |
| Nome do autor pode ser null | Fallback para "Someone" ou "Alguem" |
| Texto longo em UI centralizada | Usar `text-balance` para distribuicao uniforme |
| Destaque em nomes dentro de texto | Wrap com `span` + `font-medium text-foreground` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Colocar invite dentro de `(app)/` | Colocar em `app/invite/[id]/` na raiz |
| Assumir usuario esta autenticado | Verificar 3 estados de auth |
| Mostrar avatar sem fallback | Usar `AvatarFallback` sempre |
| Texto descritivo sem `text-balance` | Aplicar `text-balance` para melhor leitura |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
