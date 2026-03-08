---
name: rs-saas-nextjs-rbac-convidar-novo-usuario
description: "Generates invite member forms in Next.js SaaS applications with inline email+role layout, server actions, and automatic form reset. Use when user asks to 'create invite form', 'add member invitation', 'build invite UI', or 'implement team invite feature'. Applies patterns: inline form layout with flex, RequestFormReset for auto-reset, revalidateTag for cache sync, skip success toast when result is visible in list. Make sure to use this skill whenever building invitation or team member flows in Next.js. Not for authentication flows, login forms, or signup pages."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: geral
  tags: [saas, nextjs, zod, server-actions, react-hooks]
---

# Formulario de Convite de Membros

> Formularios de convite usam layout inline (email + role + botao na mesma linha), resetam automaticamente apos sucesso, e dispensam mensagem de sucesso quando o resultado ja aparece na interface.

## Rules

1. **Layout inline para formularios simples** — email, select de role e botao na mesma linha com `flex items-center gap-2`, porque reduz friccao visual e acelera o fluxo do usuario
2. **Use `RequestFormReset` do ReactDOM** — reseta o formulario automaticamente apos submit bem-sucedido, porque o usuario espera um form limpo para o proximo convite
3. **Dispense toast de sucesso quando o resultado e visivel** — se o item aparece na lista abaixo do form, o feedback visual ja e suficiente, porque duplicar feedback polui a interface
4. **Revalide o cache com tag especifica** — use `revalidateTag` com formato `{org}/invites` apos criar o convite, porque garante que a lista atualiza sem reload
5. **Valide email e role no schema** — use zod com `z.string().email()` e o `roleSchema` do pacote de auth, porque validacao compartilhada previne inconsistencias entre front e back
6. **Reutilize componentes existentes como base** — copie um form similar (project form, org form) e adapte, porque manter padroes consistentes reduz bugs

## How to write

### Form inline com email + role + botao

```tsx
<div className="flex items-center gap-2">
  <div className="flex-1">
    <Input
      name="email"
      type="email"
      placeholder="john@example.com"
    />
  </div>

  <Select name="role" defaultValue="MEMBER">
    <SelectTrigger className="w-32">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="MEMBER">Member</SelectItem>
      <SelectItem value="BILLING">Billing</SelectItem>
      <SelectItem value="ADMIN">Admin</SelectItem>
    </SelectContent>
  </Select>

  <Button type="submit" disabled={isPending}>
    <UserPlus className="mr-2 size-4" />
    Invite user
  </Button>
</div>
```

### Server action com revalidacao

```typescript
'use server'

const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  role: roleSchema,
})

export async function createInviteAction(data: FormData) {
  const result = inviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  const { email, role } = result.data
  const currentOrg = getCurrentOrg()

  await createInvite({ email, role, org: currentOrg })

  revalidateTag(`${currentOrg}/invites`)
}
```

### Reset automatico com RequestFormReset

```tsx
import { RequestFormReset } from 'react-dom'

// Dentro do form, apos o submit com sucesso:
<RequestFormReset form={formRef} />
```

## Example

**Before (form com feedback redundante):**
```tsx
export function CreateInviteForm() {
  const [success, setSuccess] = useState(false)

  async function handleSubmit(data: FormData) {
    await createInviteAction(data)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form action={handleSubmit}>
      <Label>Email</Label>
      <Input name="email" type="email" />
      <Label>Role</Label>
      <Select name="role">...</Select>
      {success && <Alert>Invite sent successfully!</Alert>}
      <Button className="w-full">Send invite</Button>
    </form>
  )
}
```

**After (com esta skill aplicada):**
```tsx
'use client'

export function CreateInviteForm() {
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createInviteAction)

  return (
    <form action={handleSubmit}>
      {!success && message && (
        <Alert variant="destructive">{message}</Alert>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input name="email" type="email" placeholder="john@example.com" />
        </div>

        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={isPending}>
          <UserPlus className="mr-2 size-4" />
          Invite user
        </Button>
      </div>
    </form>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Resultado aparece em lista logo abaixo do form | Nao mostrar toast/alert de sucesso |
| Form tem apenas 2-3 campos simples | Layout inline (mesma linha) |
| Form tem 4+ campos ou campos complexos | Layout vertical tradicional |
| Precisa resetar form apos sucesso | Usar `RequestFormReset` do ReactDOM |
| Validacao de role/permissao | Reutilizar schema do pacote de auth |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<Label>Email</Label>` em form inline simples | `placeholder="john@example.com"` |
| `<Button className="w-full">` em layout inline | `<Button>` sem w-full, dentro do flex |
| Toast de sucesso + item visivel na lista | Apenas o item aparecendo na lista |
| Schema de role duplicado no frontend | Import do `roleSchema` do pacote compartilhado |
| Reset manual com `setState('')` por campo | `RequestFormReset` do ReactDOM |

## Troubleshooting

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
