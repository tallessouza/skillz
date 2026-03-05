---
name: rs-saas-nextjs-convite-outro-email
description: "Applies the email mismatch invite handling pattern when building SaaS invite flows in Next.js. Use when user asks to 'handle invites', 'build invite page', 'manage organization invites', or 'show pending invitations'. Covers: mismatch UI, sign-out without prefetch, and pending invite display. Make sure to use this skill whenever implementing invite acceptance flows in multi-tenant SaaS apps. Not for email sending, notification systems, or auth provider setup."
---

# Lidando com Convite para Outro E-mail

> Quando o usuario logado tem e-mail diferente do convite, mostre claramente a situacao e ofereca opcoes explicitas: trocar conta ou voltar ao dashboard.

## Rules

1. **Sempre compare e-mail do convite com e-mail autenticado** — se diferentes, nao mostre o botao de aceitar, porque aceitar com conta errada quebra a consistencia de permissoes
2. **Mostre ambos os e-mails com destaque visual** — `text-foreground font-medium` nos e-mails, porque o usuario precisa identificar rapidamente qual e qual
3. **Ofereca duas acoes claras no mismatch** — "Sign out" e "Back to dashboard", porque o usuario decide se quer trocar de conta ou ignorar o convite
4. **Use ancora nativa para sign-out, nao Next Link** — `<a>` em vez de `<Link>`, porque Next Link faz prefetch da rota e pode deslogar o usuario antes dele clicar
5. **Exiba convites pendentes no dashboard** — o usuario nao deve depender de e-mail externo para descobrir convites pendentes

## How to write

### UI de mismatch de e-mail

```tsx
<div className="space-y-4">
  <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
    This invite was sent to{' '}
    <span className="text-foreground font-medium">{invite.email}</span>{' '}
    but you are authenticated as{' '}
    <span className="text-foreground font-medium">{currentUserEmail}</span>
  </p>

  <div className="space-y-2">
    <Button variant="secondary" className="w-full" asChild>
      <a href="/api/auth/sign-out">
        <LogOut className="mr-2 size-4" />
        Sign out from {currentUserEmail}
      </a>
    </Button>

    <Button variant="outline" className="w-full" asChild>
      <a href="/">Back to dashboard</a>
    </Button>
  </div>
</div>
```

### Logica de decisao na pagina de convite

```tsx
if (!isAuthenticated) {
  // Mostra tela de login/cadastro para aceitar
} else if (currentUserEmail !== invite.email) {
  // Mostra UI de mismatch (acima)
} else {
  // Mostra botao de aceitar convite
}
```

## Example

**Before (erro comum — aceita com qualquer conta):**
```tsx
// Nao verifica e-mail, qualquer usuario logado pode aceitar
export default function InvitePage({ invite }) {
  return <Button onClick={acceptInvite}>Accept Invite</Button>
}
```

**After (com esta skill aplicada):**
```tsx
export default function InvitePage({ invite }) {
  const { user } = useAuth()

  if (user.email !== invite.email) {
    return (
      <div className="space-y-4">
        <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
          This invite was sent to{' '}
          <span className="text-foreground font-medium">{invite.email}</span>
          {' '}but you are authenticated as{' '}
          <span className="text-foreground font-medium">{user.email}</span>
        </p>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full" asChild>
            <a href="/api/auth/sign-out">
              <LogOut className="mr-2 size-4" />
              Sign out from {user.email}
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href="/">Back to dashboard</a>
          </Button>
        </div>
      </div>
    )
  }

  return <Button onClick={acceptInvite}>Accept Invite</Button>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario logado, e-mail bate | Mostre botao de aceitar |
| Usuario logado, e-mail diferente | Mostre UI de mismatch com opcoes |
| Usuario nao logado | Redirecione para login/cadastro |
| Link de sign-out | Use `<a>` nativa, nunca `<Link>` do Next |
| Convites pendentes | Exiba no dashboard, nao dependa de e-mail externo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Aceitar convite sem verificar e-mail | Compare `user.email === invite.email` antes |
| Usar `<Link>` do Next para sign-out | Use `<a href="/api/auth/sign-out">` para evitar prefetch |
| Esconder convites pendentes do dashboard | Liste convites pendentes dentro da aplicacao |
| Mostrar apenas "acesso negado" no mismatch | Explique qual e-mail esperado vs atual e ofereca acoes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
