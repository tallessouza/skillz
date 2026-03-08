---
name: rs-full-stack-data-1
description: "Enforces date input handling in React forms using Controller and spread operator. Use when user asks to 'add a date field', 'create date input', 'handle date in form', 'implement date picker', or 'use Controller with input'. Applies Controller pattern for controlled inputs, string typing for dates, and spread operator for prop forwarding. Make sure to use this skill whenever adding date or specialized inputs to React forms with react-hook-form. Not for native HTML date pickers without React, date formatting libraries, or calendar component design."
---

# Input de Data em Formulários React

> Utilize Controller do react-hook-form para inputs de data, tipando como string e repassando propriedades via spread operator.

## Rules

1. **Tipe campos de data como string** — use `string` no TypeScript para campos de data em formulários, porque o valor do input HTML date é sempre uma string no formato `YYYY-MM-DD`
2. **Inicialize com string vazia** — `date: ""` como valor padrão, porque evita valores undefined que causam warnings de componentes não-controlados
3. **Use Controller para inputs especializados** — envolva inputs de data com `<Controller />` do react-hook-form, porque permite controle total sobre o ciclo de vida do valor
4. **Repasse props com spread operator** — use `{...field}` para despejar todas as propriedades do Controller no input, porque mantém onChange, onBlur, value e ref sincronizados automaticamente

## How to write

### Tipagem do formulário

```typescript
type FormData = {
  name: string
  date: string  // Sempre string para inputs HTML date
}

const defaultValues: FormData = {
  name: "",
  date: "",  // String vazia, nunca undefined
}
```

### Controller com input de data

```tsx
<Controller
  control={control}
  name="date"
  render={({ field }) => (
    <Input type="date" {...field} />
  )}
/>
```

## Example

**Before (input date sem Controller):**
```tsx
type FormData = {
  name: string
  date: Date  // Tipo errado para input HTML
}

// Input solto, sem controle do react-hook-form
<input type="date" onChange={(e) => setDate(e.target.value)} />
```

**After (com Controller e spread operator):**
```tsx
type FormData = {
  name: string
  date: string  // String — valor real do input HTML
}

const { control, handleSubmit } = useForm<FormData>({
  defaultValues: { name: "", date: "" }
})

<Controller
  control={control}
  name="date"
  render={({ field }) => (
    <Input type="date" {...field} />
  )}
/>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Input date em formulário react-hook-form | Sempre use Controller + spread operator |
| Tipagem do campo date | Use `string`, nunca `Date` |
| Valor padrão de date | String vazia `""` |
| Bug de tipo ao salvar data | Verifique se tipou como string e atualize a página |
| Precisa de onChange customizado | Extraia field do render e compose o handler |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `date: Date` na tipagem do form | `date: string` |
| `date: undefined` como default | `date: ""` |
| `<input onChange={...} value={...}>` manual | `<Controller render={({field}) => <Input {...field} />} />` |
| `field.onChange`, `field.value` separados | `{...field}` com spread operator |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre tipagem de dates e padrão Controller
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variações de inputs controlados