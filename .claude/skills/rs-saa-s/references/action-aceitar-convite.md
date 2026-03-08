---
name: rs-saas-nextjs-rbac-action-aceitar-convite
description: "Applies invite acceptance patterns in Next.js SaaS apps handling multiple auth states. Use when user asks to 'handle invites', 'accept invitation flow', 'invite with authentication check', 'redirect after login', or 'cookie-based redirect flow'. Covers cookie handoff for unauthenticated users, auto-accept on login, and same-email verification. Make sure to use this skill whenever implementing invitation or token-based flows that span authentication boundaries. Not for general auth setup, RBAC permissions, or organization CRUD."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: server-actions
  tags: [saas, nextjs, oauth, github, invites, members, server-actions]
---

# Action: Aceitar Convite

> Implemente fluxos de aceitacao de convite tratando tres estados de autenticacao: nao autenticado, autenticado com email correto, e autenticado com email errado.

## Tres cenarios de autenticacao

| Estado | Comportamento |
|--------|--------------|
| Nao autenticado | Mostra botao de login, salva `inviteId` em cookie, redireciona para `/auth/sign-in` com email no searchParam |
| Autenticado com mesmo email | Mostra botao "Join {org}", aceita convite direto via server action |
| Autenticado com email diferente | Mostra mensagem de erro ou instrucao para trocar de conta |

## Rules

1. **Use cookies para persistir estado entre login e aceitacao** — salve o `inviteId` em cookie antes de redirecionar para login, porque o redirect quebra o contexto da pagina
2. **Aceite o convite em todos os pontos de entrada de login** — sign-in por email, sign-up, e OAuth callback, porque o usuario pode logar por qualquer via
3. **Use try/catch silencioso ao aceitar convite no login** — nao mostre erro se falhar, porque pode ser email incorreto e o usuario nao precisa saber
4. **Delete o cookie de inviteId apos aceitar** — `cookies().delete('inviteId')` para evitar reprocessamento
5. **Preencha o email no formulario de login** — use `searchParams` para passar o email do convite e setar como `defaultValue`, porque facilita o usuario logar com a conta correta
6. **Verifique email do usuario autenticado contra email do convite** — a API ja valida, mas a UI deve mostrar o botao correto baseado na comparacao

## Steps

### Step 1: Verificar autenticacao na pagina de convite

```typescript
const isUserAuthenticated = isAuthenticated() // checa cookies, nao e async

if (!isUserAuthenticated) {
  // mostrar botao de sign-in
}
```

### Step 2: Fluxo nao autenticado — cookie + redirect

```typescript
async function signInToAcceptTheInvite() {
  'use server'

  cookies().set('inviteId', inviteId)
  redirect(`/auth/sign-in?email=${invite.email}`)
}
```

### Step 3: Preencher email no sign-in form

```typescript
const searchParams = useSearchParams()

<Input
  name="email"
  defaultValue={searchParams.get('email') ?? ''}
/>
```

### Step 4: Aceitar convite nos pontos de login

```typescript
// Em sign-in action, OAuth callback, etc:
const inviteId = cookies().get('inviteId')?.value

if (inviteId) {
  try {
    await acceptInvite(inviteId)
  } catch {}
  cookies().delete('inviteId')
}
```

### Step 5: Fluxo autenticado com mesmo email

```typescript
let currentUserEmail: string | null = null

if (isUserAuthenticated) {
  const user = await auth()
  currentUserEmail = user.email
}

const isAuthenticatedWithSameEmail = currentUserEmail === invite.email

if (isAuthenticatedWithSameEmail) {
  // mostrar botao "Join {org.name}"
}
```

### Step 6: Server action para aceitar direto

```typescript
async function acceptInviteAction() {
  'use server'

  await acceptInvite(inviteId)
  redirect(`/org/${invite.organization.slug}`)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario pode logar por OAuth e email | Coloque aceitacao de convite em AMBOS os callbacks |
| Sign-up nao loga automaticamente | Convite sera aceito no login subsequente (cookie persiste) |
| API ja valida email do convite | Nao precisa validar novamente no frontend, use try/catch |
| Cookie de inviteId ja existe | Sobrescreva — usuario so pode aceitar um convite por vez |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Passar inviteId via query param entre paginas | Use cookie — persiste entre redirects e refreshes |
| Mostrar erro ao usuario quando accept falha no login | Use try/catch vazio — falha pode ser email incorreto |
| Esquecer de deletar cookie apos aceitar | Sempre `cookies().delete('inviteId')` apos processar |
| Aceitar convite so no sign-in por email | Aceite em todos os entry points: email, OAuth, callback |
| Criar server action fora do componente sem necessidade | Inline server action com `'use server'` dentro do componente quando so usado ali |

## Troubleshooting

### Token invalido ou expirado
**Symptom:** Requisicao autenticada retorna 401
**Cause:** Token JWT expirou ou foi assinado com secret diferente
**Fix:** Verifique que o JWT_SECRET e o mesmo entre geracao e verificacao, e que o token nao expirou

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Cookie nao persiste entre requisicoes
**Symptom:** Token desaparece apos refresh da pagina
**Cause:** Cookie configurado sem `path: '/'` ou com `httpOnly` incorreto
**Fix:** Configure o cookie com `path: '/'` e verifique que `httpOnly` esta correto para o caso de uso

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
