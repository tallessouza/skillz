---
name: rs-next-js-editando-um-agendamento
description: "Applies flexible form component patterns for create/edit modes in Next.js when user asks to 'edit a record', 'make a form reusable', 'add edit functionality', 'create/edit form', or 'flexible component with children'. Enforces children prop pattern for trigger flexibility, optional data prop for edit pre-fill, and useEffect reset for form population. Make sure to use this skill whenever building forms that serve both creation and editing flows. Not for server actions, API routes, or database operations."
---

# Editando um Agendamento — Componente Flexivel Create/Edit

> Torne formularios flexiveis passando children como trigger e dados opcionais como props para preencher campos na edicao.

## Rules

1. **Use children para triggers flexiveis** — passe o botao de abertura como children do formulario, porque isso permite variantes visuais diferentes (botao grande para criar, icone pequeno para editar) sem duplicar o componente
2. **Dados de edicao sao props opcionais** — o tipo do dado (ex: `appointment`) deve ser `T | undefined`, porque na criacao nao existe dado previo
3. **Use useEffect + form.reset para preencher** — ao receber dados de edicao, chame `form.reset(data)` dentro de um useEffect, porque isso sincroniza o estado do formulario com os dados existentes
4. **Envolva children em DialogTrigger** — renderize o DialogTrigger condicionalmente so quando children existir, porque o componente pode ser usado sem trigger externo
5. **Nomeie botoes de acao semanticamente** — use `aria-label` descritivo como "Press edit icon", porque facilita acessibilidade e leitura do codigo

## How to write

### Props tipadas com children e dados opcionais

```typescript
interface AppointmentFormProps {
  children?: React.ReactNode
  appointment?: Appointment // undefined na criacao, preenchido na edicao
}

export function AppointmentForm({ children, appointment }: AppointmentFormProps) {
  // ...
}
```

### Trigger condicional com children

```tsx
{children && (
  <DialogTrigger asChild>
    {children}
  </DialogTrigger>
)}
```

### Preenchimento via useEffect

```tsx
useEffect(() => {
  if (appointment) {
    form.reset(appointment)
  }
}, [appointment, form])
```

### Variantes de trigger no componente pai

```tsx
{/* Criacao — botao grande */}
<AppointmentForm>
  <Button>Novo Agendamento</Button>
</AppointmentForm>

{/* Edicao — icone pequeno */}
<AppointmentForm appointment={appointment}>
  <Button variant="edit" size="icon" aria-label="Press edit icon">
    <Pen size={16} />
  </Button>
</AppointmentForm>
```

## Example

**Before (formulario rigido, so criacao):**
```tsx
export function AppointmentForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Novo Agendamento</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleCreate}>
          {/* campos vazios sempre */}
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**After (flexivel para create e edit):**
```tsx
export function AppointmentForm({ children, appointment }: AppointmentFormProps) {
  useEffect(() => {
    if (appointment) form.reset(appointment)
  }, [appointment, form])

  return (
    <Dialog>
      {children && (
        <DialogTrigger asChild>{children}</DialogTrigger>
      )}
      <DialogContent>
        <form onSubmit={appointment ? handleUpdate : handleCreate}>
          {/* campos preenchidos na edicao */}
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario usado em create e edit | Props opcionais + children pattern |
| Botao de trigger varia visualmente | Passe como children, nao hardcode |
| Dados existentes para preencher | useEffect + form.reset |
| Precisa diferenciar create vs update no submit | Verifique se appointment existe para escolher a action |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Dois componentes separados CreateForm/EditForm | Um componente com props opcionais |
| `defaultValues` hardcoded no useForm para edicao | `useEffect` + `form.reset(data)` |
| Trigger fixo dentro do Dialog | Children pattern para flexibilidade |
| `if (mode === 'edit')` com string literal | `if (appointment)` checando a presenca do dado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-editando-um-agendamento/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-editando-um-agendamento/references/code-examples.md)
