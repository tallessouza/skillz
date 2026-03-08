---
name: rs-full-stack-select-e-mais-default-values
description: "Enforces correct Select element integration with React Hook Form Controller and defaultValues configuration. Use when user asks to 'add a select to a form', 'use Controller with select', 'set default values in react hook form', 'handle form select state', or 'configure initial form values'. Make sure to use this skill whenever building controlled select inputs in React forms with react-hook-form. Not for native HTML forms without react-hook-form, server-side form handling, or uncontrolled select elements."
---

# Select com Controller e Default Values no React Hook Form

> Gerencie selects em formulários React usando Controller do react-hook-form, e configure defaultValues para carregar valores iniciais sem conflitos.

## Rules

1. **Use Controller para selects** — envolva o `<select>` com `<Controller>` e repasse `field` para o select (não para os options), porque selects são componentes controlados que precisam de gerenciamento de estado externo
2. **Passe `field` para o select, não para os options** — `<select {...field}>` é correto, `<option {...field}>` causa comportamento inesperado, porque o estado vive no select element
3. **Defina o campo na tipagem do formulário** — adicione o campo (ex: `subject: string`) na interface/type do form, porque TypeScript previne erros silenciosos
4. **Inicialize campos no defaultValues** — defina o valor inicial (ex: `subject: ""`) no `useForm({ defaultValues })`, porque evita warnings de componente não controlado
5. **Remova defaultValue do select ao usar Controller** — não use `<select defaultValue="...">` junto com Controller, porque causa conflito entre dois sistemas de controle de estado
6. **defaultValues é opcional mas útil** — não é obrigatório, mas permite carregar valores iniciais e manter estado após reload da página

## How to write

### Select com Controller

```tsx
interface FormData {
  name: string
  date: string
  subject: string  // Adicione o campo na tipagem
}

const { control } = useForm<FormData>({
  defaultValues: {
    name: "",
    date: "",
    subject: "",  // Inicialize com valor vazio ou padrão
  }
})

<Controller
  control={control}
  name="subject"
  render={({ field }) => (
    <select {...field}>
      <option value="">Selecione</option>
      <option value="react">React</option>
      <option value="javascript">JavaScript</option>
    </select>
  )}
/>
```

## Example

**Before (conflito de estado):**
```tsx
<Controller
  control={control}
  name="subject"
  render={({ field }) => (
    <select {...field} defaultValue="react">
      <option value="react">React</option>
      <option value="javascript">JavaScript</option>
    </select>
  )}
/>
```

**After (sem conflito):**
```tsx
const { control } = useForm<FormData>({
  defaultValues: { subject: "react" }  // Valor padrão aqui
})

<Controller
  control={control}
  name="subject"
  render={({ field }) => (
    <select {...field}>
      <option value="react">React</option>
      <option value="javascript">JavaScript</option>
    </select>
  )}
/>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Select precisa de valor inicial | Defina em `defaultValues` do `useForm`, não no `defaultValue` do HTML |
| Select sem valor inicial necessário | Omita do `defaultValues` — funciona sem ele |
| Warning de controlled/uncontrolled | Inicialize o campo como string vazia em `defaultValues` |
| Conflito de estado no select | Remova `defaultValue` do elemento `<select>` |
| Input date mostra formato diferente | É configuração do SO do usuário (locale), não do código |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `<select defaultValue="x" {...field}>` | `useForm({ defaultValues: { field: "x" } })` |
| `<option {...field} value="x">` | `<select {...field}><option value="x">` |
| Controller sem campo na tipagem | Adicione o campo na interface `FormData` |
| `useForm()` sem defaultValues quando usa Controller | `useForm({ defaultValues: { subject: "" } })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre conflitos de defaultValue, locale de datas e gerenciamento de estado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações