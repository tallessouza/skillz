---
name: rs-full-stack-textarea-2
description: "Enforces React Hook Form Controller pattern for textarea fields when building forms with controlled inputs. Use when user asks to 'add a textarea', 'create a description field', 'implement multi-line input', 'use Controller with textarea', or 'collect form data without useState'. Applies Controller wrapping, field spreading, and TypeScript typing for textarea. Make sure to use this skill whenever adding textarea to React Hook Form forms. Not for uncontrolled forms, native HTML-only forms, or non-React form libraries."
---

# Textarea com React Hook Form Controller

> Envolva todo textarea em um Controller do React Hook Form, espalhe o `field` diretamente no elemento e mantenha a tipagem sincronizada com `defaultValues`.

## Rules

1. **Envolva textarea em Controller** — use `<Controller name="description" control={control} render={({ field }) => <textarea {...field} />} />`, porque isso delega o gerenciamento de estado ao React Hook Form sem useState manual
2. **Adicione o campo na tipagem** — se `description` não existe no tipo do formulário, adicione `description: string` na interface/type, porque TypeScript vai reclamar se o name não existir na tipagem
3. **Defina valor inicial nos defaultValues** — inclua `description: ""` em `defaultValues` do `useForm`, porque campos sem valor inicial podem causar warnings de controlled/uncontrolled
4. **Espalhe field diretamente no textarea** — use `{...field}` no textarea para conectar `onChange`, `onBlur`, `value` e `ref` automaticamente, porque isso evita wiring manual

## How to write

### Controller para textarea

```typescript
// Tipo do formulário inclui description
type FormData = {
  name: string
  date: string
  description: string
}

// defaultValues inclui description vazio
const { control, handleSubmit } = useForm<FormData>({
  defaultValues: {
    name: "",
    date: "",
    description: "",
  },
})

// Controller envolve o textarea
<Controller
  name="description"
  control={control}
  render={({ field }) => (
    <textarea
      {...field}
      placeholder="Descrição do evento"
      rows={4}
    />
  )}
/>
```

## Example

**Before (estado manual):**
```typescript
const [description, setDescription] = useState("")

<textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Descrição"
/>

// No submit, precisa coletar description manualmente
```

**After (com Controller do React Hook Form):**
```typescript
<Controller
  name="description"
  control={control}
  render={({ field }) => (
    <textarea {...field} placeholder="Descrição" rows={4} />
  )}
/>

// No submit, description já está no objeto data automaticamente
```

## Heuristics

| Situação | Faça |
|----------|------|
| Textarea simples sem validação | Controller + `{...field}` é suficiente |
| Textarea com validação | Adicione `rules` no Controller ou use resolver com Zod |
| Erro de tipagem no name | Adicione o campo na interface/type do formulário |
| Warning de controlled/uncontrolled | Verifique se `defaultValues` inclui o campo |
| Hot reload causa erro visual | Recarregue a página — é comportamento normal durante refatoração |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `useState` para cada campo de textarea | `Controller` com `useForm` |
| `onChange` manual no textarea | `{...field}` spread do Controller |
| `name` no Controller sem tipo correspondente | Adicione o campo na tipagem `FormData` |
| `defaultValues` sem o campo textarea | Inclua `description: ""` nos defaultValues |
| Coletar dados manualmente no submit | Use `handleSubmit(data => ...)` — tudo vem no `data` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre Controller vs estado manual e comportamento de hot reload
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com textarea, tipagem e formulário completo