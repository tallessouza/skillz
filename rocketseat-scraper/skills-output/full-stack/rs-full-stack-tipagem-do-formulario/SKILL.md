---
name: rs-full-stack-tipagem-do-formulario
description: "Enforces TypeScript typing for React Hook Form when creating forms, defining form data types, or using useForm with generics. Use when user asks to 'type a form', 'add form types', 'use useForm with TypeScript', 'create a typed form', or 'fix form type errors'. Applies rules: define FormData type, pass generic to useForm, type the submit handler data parameter. Make sure to use this skill whenever integrating react-hook-form with TypeScript. Not for server-side validation, Zod schema definition, or non-React form handling."
---

# Tipagem de Formulários com React Hook Form

> Defina um tipo para os dados do formulário e passe como generic para useForm — isso garante autocomplete, validação em tempo de edição e consistência no código.

## Rules

1. **Crie um type para os dados do formulário** — `type FormData = { name: string }`, porque sem tipagem o TypeScript não sabe o conteúdo de `data` no submit handler
2. **Passe o type como generic para useForm** — `useForm<FormData>()`, porque isso habilita autocomplete em `defaultValues`, `register`, e no callback de submit
3. **Type o parâmetro data do submit handler** — use o mesmo type `FormData`, porque garante que `data.name` é reconhecido sem `any`
4. **Nunca deixe useForm sem generic em TypeScript** — sem o generic, `defaultValues` não sugere os campos e erros de digitação passam despercebidos

## How to write

### Definindo o tipo e passando para useForm

```typescript
type FormData = {
  name: string
}

const { register, handleSubmit } = useForm<FormData>({
  defaultValues: {
    name: '', // autocomplete disponível aqui
  },
})
```

### Submit handler tipado

```typescript
function handleFormSubmit(data: FormData) {
  console.log(data.name) // TypeScript conhece todas as propriedades
}
```

## Example

**Before (sem tipagem):**
```typescript
const { register, handleSubmit } = useForm({
  defaultValues: {
    name: '', // sem autocomplete, sem validação
  },
})

function onSubmit(data) {
  // data é 'any' — erros de digitação não são detectados
  console.log(data.names) // typo passa despercebido
}
```

**After (com tipagem):**
```typescript
type FormData = {
  name: string
}

const { register, handleSubmit } = useForm<FormData>({
  defaultValues: {
    name: '', // autocomplete sugere 'name'
  },
})

function onSubmit(data: FormData) {
  console.log(data.name) // TypeScript valida
  // data.names → erro: "Did you mean 'name'?"
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulário com 1+ campos | Crie um type dedicado e passe como generic |
| Propriedade não aparece no autocomplete de defaultValues | Verifique se o generic foi passado para useForm |
| Typo em nome de campo não gera erro | Falta o generic no useForm |
| Formulário cresce com novos campos | Adicione ao type — todos os usos são validados automaticamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useForm()` sem generic | `useForm<FormData>()` |
| `function onSubmit(data: any)` | `function onSubmit(data: FormData)` |
| `data.names` sem erro do TS | Passe generic para que typos sejam detectados |
| Tipo inline no generic `useForm<{ name: string }>()` | Type nomeado reutilizável `type FormData = { name: string }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que tipar formulários e como o generic do useForm funciona internamente
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações para formulários com múltiplos campos