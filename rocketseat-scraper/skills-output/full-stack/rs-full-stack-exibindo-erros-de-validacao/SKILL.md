---
name: rs-full-stack-exibindo-erros-de-validacao
description: "Enforces React Hook Form validation error display patterns when building forms with inline error messages. Use when user asks to 'show form errors', 'display validation messages', 'handle form validation', 'add error feedback to inputs', or 'use formState errors'. Applies formState.errors with optional chaining, conditional rendering of error spans, and real-time validation feedback. Make sure to use this skill whenever implementing form validation UI with React Hook Form. Not for server-side validation, toast notifications, or non-React form libraries."
---

# Exibindo Erros de Validação com React Hook Form

> Recupere erros do formState e exiba mensagens inline que somem automaticamente quando o campo atende aos critérios de validação.

## Rules

1. **Desestruture formState do useForm** — extraia `formState: { errors }` junto com `control` e `handleSubmit`, porque centraliza todo o estado do formulário num único hook
2. **Use optional chaining ao acessar erros** — `errors.name?.message` e não `errors.name.message`, porque cada campo pode ou não ter erro (propriedades são opcionais)
3. **Renderize condicionalmente com `&&`** — `{errors.name?.message && <span>...</span>}`, porque o span só deve existir no DOM quando há erro
4. **Coloque o span de erro imediatamente após o input** — mantém a mensagem visualmente associada ao campo que falhou
5. **Use a message do schema de validação** — exiba `errors.field?.message` como conteúdo do span, porque a mensagem já foi definida no Zod/Yup e não deve ser duplicada no JSX

## How to write

### Desestruturação do useForm

```typescript
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

### Exibição condicional de erro por campo

```tsx
<input {...register("name")} />
{errors.name?.message && (
  <span className="error">{errors.name.message}</span>
)}

<input type="date" {...register("date")} />
{errors.date?.message && (
  <span className="error">{errors.date.message}</span>
)}

<select {...register("subject")}>
  <option value="">Selecione</option>
</select>
{errors.subject?.message && (
  <span className="error">{errors.subject.message}</span>
)}

<textarea {...register("description")} />
{errors.description?.message && (
  <span className="error">{errors.description.message}</span>
)}
```

## Example

**Before (erro fixo, sem validação dinâmica):**
```tsx
<input {...register("name")} />
<span className="error">Nome é obrigatório</span>
```

**After (com formState.errors):**
```tsx
const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
})

// No JSX:
<input {...register("name")} />
{errors.name?.message && (
  <span className="error">{errors.name.message}</span>
)}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo não atende critério | Mensagem aparece automaticamente via formState |
| Usuário corrige o campo | Mensagem some em tempo real (re-validação automática) |
| Formulário submetido sem preencher | Todas as mensagens de erro aparecem simultaneamente |
| Campo tem múltiplas regras (ex: required + minLength) | Exibe a mensagem da primeira regra violada |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `errors.name.message` (sem optional chaining) | `errors.name?.message` |
| `<span>Nome é obrigatório</span>` (mensagem hardcoded) | `<span>{errors.name.message}</span>` (mensagem do schema) |
| `{errors.name && <span>{errors.name}</span>}` (sem .message) | `{errors.name?.message && <span>{errors.name.message}</span>}` |
| Verificar erros com `if/else` fora do JSX | Usar `&&` inline no JSX para renderização condicional |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre formState, ciclo de re-validação e integração com Zod
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações