---
name: rs-next-js-finalizando-visual-appointment-form
description: "Enforces responsive form layout patterns and submit button UX when building forms in Next.js with React Hook Form. Use when user asks to 'create a form', 'add a submit button', 'make form responsive', 'handle form submission', or 'add loading state to button'. Applies rules: grid layout for desktop with stacked mobile fallback, submit button with spinner and disabled state during submission, always initialize defaultValues for all fields. Make sure to use this skill whenever building forms with React Hook Form in Next.js. Not for API route logic, server actions implementation, or form validation rules."
---

# Formulario Responsivo com Loading State

> Formularios responsivos usam grid para desktop e stack para mobile, com botao de submit que bloqueia multiplas requisicoes via isSubmitting.

## Rules

1. **Agrupe campos relacionados em div com grid responsivo** — `space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0`, porque no mobile os campos empilham naturalmente e no desktop ficam lado a lado
2. **Sempre desabilite o botao durante submit** — use `disabled={isSubmitting}` do `formState`, porque evita multiplas requisicoes simultaneas
3. **Exiba spinner durante submit** — use `Loader2` com `animate-spin` quando `isSubmitting` for true, porque da feedback visual ao usuario
4. **Inicialize todos os campos no defaultValues** — inclua string vazia para campos opcionais, porque campos sem default geram erros de controlled/uncontrolled
5. **Alinhe o botao de submit a direita** — use `flex justify-end` no container do botao, porque segue o padrao visual de formularios

## How to write

### Layout responsivo de campos

```tsx
<div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
  <FormField name="time" control={form.control} render={/* ... */} />
  <FormField name="scheduleAt" control={form.control} render={/* ... */} />
</div>
```

### Botao de submit com loading

```tsx
import { Loader2 } from "lucide-react"

const { formState: { isSubmitting } } = form

<div className="flex justify-end">
  <Button type="submit" variant="brand" disabled={isSubmitting}>
    {isSubmitting && (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    )}
    Agendar
  </Button>
</div>
```

### Default values completos

```tsx
const form = useForm({
  defaultValues: {
    name: "",
    email: "",
    phone: "",
    time: "",      // Sempre inicializar, mesmo campos opcionais
    scheduleAt: "",
  },
})
```

## Example

**Before (sem loading, sem defaults completos):**
```tsx
const form = useForm({
  defaultValues: { name: "", email: "" },
  // time e scheduleAt sem default → erro de controlled input
})

<Button type="submit">Agendar</Button>
// Usuario pode clicar multiplas vezes durante submit
```

**After (com this skill applied):**
```tsx
const form = useForm({
  defaultValues: { name: "", email: "", time: "", scheduleAt: "" },
})

const { formState: { isSubmitting } } = form

<div className="flex justify-end">
  <Button type="submit" variant="brand" disabled={isSubmitting}>
    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    Agendar
  </Button>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| 2+ campos que fazem sentido lado a lado | Agrupe em div com `md:grid md:grid-cols-2` |
| Formulario com server action async | Sempre use `isSubmitting` para desabilitar botao |
| Campo adicionado ao form | Adicione ao `defaultValues` imediatamente |
| Botao de submit | Sempre em container `flex justify-end` |
| Tela mobile | `space-y-4` para espaçamento vertical entre campos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<Button type="submit">Agendar</Button>` sem disabled | `<Button disabled={isSubmitting}>` |
| `useForm({})` sem defaultValues completos | `useForm({ defaultValues: { campo: "" } })` |
| Campos lado a lado sem responsividade | `md:grid md:grid-cols-2` com `space-y-4` mobile |
| Spinner customizado com CSS | `<Loader2 className="animate-spin" />` do Lucide |
| Botao de submit sem feedback visual | `{isSubmitting && <Loader2 />}` antes do texto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
