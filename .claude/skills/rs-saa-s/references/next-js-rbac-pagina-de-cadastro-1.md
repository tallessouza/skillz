---
name: rs-saas-nextjs-rbac-pagina-cadastro
description: "Generates signup and forgot-password pages in Next.js following SaaS auth flow patterns. Use when user asks to 'create signup page', 'add registration form', 'forgot password page', 'auth pages', or 'authentication flow'. Applies patterns: asChild for semantic links, password confirmation field, navigation between auth pages, variant='link' buttons. Make sure to use this skill whenever building authentication page flows in Next.js. Not for API integration, form validation logic, or backend auth implementation."
---

# Paginas de Cadastro e Recuperacao de Senha (Next.js SaaS)

> Construa paginas de autenticacao reutilizando estrutura da pagina de login, adicionando apenas os campos e links especificos de cada fluxo.

## Rules

1. **Reutilize a estrutura da pagina de sign-in** — signup e forgot-password sao variacoes da mesma base, porque manter consistencia visual reduz codigo e bugs
2. **Use `asChild` para links estilizados como botoes** — porque semanticamente uma navegacao deve ser uma ancora (`<Link>`), nao um `<button>`, mesmo com estilo de botao
3. **Adicione campo de confirmacao de senha no signup** — campo separado `password_confirmation` com type password, porque validacao de confirmacao e padrao de seguranca
4. **Remova elementos irrelevantes por contexto** — signup nao tem "forgot password" link, forgot-password nao tem separador nem OAuth, porque cada pagina tem escopo proprio
5. **Navegacao bidirecional entre paginas de auth** — sign-in linka para signup, signup linka para sign-in, forgot-password linka para sign-in, porque o usuario deve navegar sem usar o botao voltar do browser

## How to write

### Pagina de Signup (campos adicionais ao sign-in)

```tsx
// app/auth/sign-up/page.tsx
// Adicione campo name e password confirmation alem dos campos base
<div className="space-y-4">
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

  <Button type="submit" className="w-full">Create account</Button>
</div>
```

### Link semantico com asChild

```tsx
// Botao que e semanticamente uma ancora
<Button variant="link" size="sm" asChild>
  <Link href="/auth/sign-in">Already registered? Sign in</Link>
</Button>
```

### Pagina de Forgot Password (simplificada)

```tsx
// app/auth/forgot-password/page.tsx
// Apenas campo de email + botao de recuperacao + link para sign-in
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">E-mail</Label>
    <Input id="email" name="email" type="email" />
  </div>

  <Button type="submit" className="w-full">Recover password</Button>

  <Button variant="link" size="sm" asChild>
    <Link href="/auth/sign-in">Sign in instead</Link>
  </Button>
</div>
```

## Example

**Before (botao de navegacao como button — errado semanticamente):**
```tsx
<Button variant="link" size="sm" onClick={() => router.push('/auth/sign-in')}>
  Already registered? Sign in
</Button>
```

**After (ancora com estilo de botao via asChild):**
```tsx
<Button variant="link" size="sm" asChild>
  <Link href="/auth/sign-in">Already registered? Sign in</Link>
</Button>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Navegacao entre paginas de auth | Use `Button variant="link" asChild` com `<Link>` |
| Signup tem OAuth (GitHub) | Mude texto para "Sign up with GitHub" (cria conta automaticamente) |
| Campo de senha no signup | Remova o link "forgot password" — usuario esta criando senha, nao recuperando |
| Forgot password | Remova separador e botoes de OAuth — so precisa do email |
| Botao de navegacao secundario | Use `size="sm"` para hierarquia visual |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `<Button onClick={() => router.push(...)}>` para nav | `<Button asChild><Link href="...">` |
| Copiar pagina inteira e editar tudo | Copiar base e ajustar apenas campos/links/textos |
| Forgot password com campos de senha | Apenas campo de email |
| Signup sem confirmacao de senha | Adicionar campo `password_confirmation` |
| Navegacao unidirecional (so ida) | Links bidirecionais entre todas as paginas de auth |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-pagina-de-cadastro-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-pagina-de-cadastro-1/references/code-examples.md)
