---
name: rs-next-js-input-telefone-mascara
description: "Applies phone input masking with React iMask when building form fields in React/Next.js. Use when user asks to 'create a phone input', 'add phone mask', 'format phone field', 'input with mask', or 'masked input'. Configures IMaskInput with Brazilian phone format, integrates with form libraries, and applies consistent styling. Make sure to use this skill whenever generating phone or formatted input fields in React projects. Not for date masks, currency masks, or general form validation logic."
---

# Input de Telefone com Máscara (React iMask)

> Use IMaskInput para campos formatados — mascaras declarativas poupam tempo e eliminam regex manual.

## Rules

1. **Use `react-imask` para mascaras de input** — `IMaskInput` aceita um prop `mask` declarativo, porque regex manual e fragil e demorado
2. **Declare o formato no prop `mask`** — use `(00) 00000-0000` com zeros como placeholders numericos, porque o iMask interpreta `0` como "qualquer digito"
3. **Mantenha consistencia visual** — aplique os mesmos classNames/estilos dos outros inputs do formulario, porque campos desalinhados quebram a UX
4. **Use placeholder realista** — coloque um exemplo como `(99) 99999-9999`, porque guia o usuario sobre o formato esperado
5. **Integre com form libraries via onChange/onAccept** — use `onAccept` para capturar o valor sem mascara, porque form state precisa do valor limpo

## How to write

### Instalacao

```bash
pnpm add react-imask
```

### Input com mascara de telefone BR

```tsx
import { IMaskInput } from 'react-imask'

<IMaskInput
  mask="(00) 00000-0000"
  placeholder="(99) 99999-9999"
  className="h-12 w-full rounded-md border px-3"
  onAccept={(value) => field.onChange(value)}
/>
```

### Integrado com React Hook Form / Shadcn Form

```tsx
import { IMaskInput } from 'react-imask'

<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <IMaskInput
            mask="(00) 00000-0000"
            placeholder="(99) 99999-9999"
            className="h-12 w-full rounded-md border pl-10 pr-3"
            value={field.value}
            onAccept={(value) => field.onChange(value)}
          />
        </div>
      </FormControl>
    </FormItem>
  )}
/>
```

## Example

**Before (regex manual):**
```tsx
const formatPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

<input
  value={phone}
  onChange={(e) => setPhone(formatPhone(e.target.value))}
  placeholder="Telefone"
/>
```

**After (com react-imask):**
```tsx
import { IMaskInput } from 'react-imask'

<IMaskInput
  mask="(00) 00000-0000"
  placeholder="(99) 99999-9999"
  className="h-12 w-full rounded-md border px-3"
  onAccept={(unmasked) => setPhone(unmasked)}
/>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Telefone BR celular | `mask="(00) 00000-0000"` |
| Telefone BR fixo | `mask="(00) 0000-0000"` |
| Ambos (celular + fixo) | Use mask array: `[{mask: '(00) 0000-0000'}, {mask: '(00) 00000-0000'}]` |
| Precisa do valor sem mascara | Use callback `onAccept` (recebe valor limpo) |
| Precisa do valor com mascara | Use callback `onChange` (recebe valor formatado) |
| Estilizacao deve combinar com outros inputs | Copie exatamente o className dos inputs existentes |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Regex manual para mascara de telefone | `IMaskInput` com prop `mask` |
| `onChange` para capturar valor limpo | `onAccept` — ja retorna sem mascara |
| Placeholder generico "Telefone" | Placeholder com formato: `(99) 99999-9999` |
| Input com altura diferente dos demais | Mesma classe `h-12` (ou a altura padrao do form) |
| Instalar `inputmask` ou `cleave.js` em projeto React | `react-imask` — feito para React, suporta refs |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
