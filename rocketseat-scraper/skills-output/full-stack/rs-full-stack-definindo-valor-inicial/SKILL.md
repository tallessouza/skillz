---
name: rs-full-stack-definindo-valor-inicial
description: "Enforces React Hook Form defaultValues configuration when initializing forms with useForm. Use when user asks to 'create a form', 'setup useForm', 'fix controlled input warning', 'initialize form fields', or 'set default form values'. Applies defaultValues to prevent controlled/uncontrolled input warnings and ensure clean form state. Make sure to use this skill whenever configuring useForm in React. Not for server-side validation, Formik, or non-React form libraries."
---

# Definindo Valor Inicial com useForm

> Sempre configure `defaultValues` no `useForm` para cada campo do formulário, evitando warnings de input controlado/não-controlado.

## Rules

1. **Sempre passe `defaultValues` ao `useForm`** — defina o valor inicial de cada campo, porque sem isso o React emite warnings ao mudar de uncontrolled para controlled input
2. **Use string vazia como valor padrão para campos de texto** — `name: ""` não `name: undefined`, porque `undefined` causa o warning de input não-controlado
3. **Formulários com `handleSubmit` aceitam Enter** — quando o form tem um método submit configurado, o usuário pode submeter pressionando Enter além de clicar no botão, porque o browser dispara o evento submit automaticamente

## How to write

### Configuração do useForm com defaultValues

```typescript
const { register, handleSubmit } = useForm({
  defaultValues: {
    name: "",
  },
})
```

### Formulário completo com submit via botão e Enter

```tsx
function MyForm() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
    },
  })

  function handleSave(data) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <input type="text" {...register("name")} />
      <button type="submit">Salvar</button>
    </form>
  )
}
```

## Example

**Before (warning de input controlado):**
```typescript
const { register, handleSubmit } = useForm()
// React warning: A component is changing an uncontrolled input to be controlled
```

**After (sem warning):**
```typescript
const { register, handleSubmit } = useForm({
  defaultValues: {
    name: "",
  },
})
// Nenhum warning — input é controlado desde o início
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo de texto | `defaultValues: { campo: "" }` |
| Campo numérico | `defaultValues: { campo: 0 }` |
| Campo booleano (checkbox) | `defaultValues: { campo: false }` |
| Formulário de edição com dados existentes | Passe os dados carregados em `defaultValues` |
| Múltiplos campos | Defina todos no mesmo objeto `defaultValues` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useForm()` sem defaultValues | `useForm({ defaultValues: { name: "" } })` |
| `defaultValues: { name: undefined }` | `defaultValues: { name: "" }` |
| `defaultValues: { name: null }` | `defaultValues: { name: "" }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre controlled vs uncontrolled inputs e comportamento do submit
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações