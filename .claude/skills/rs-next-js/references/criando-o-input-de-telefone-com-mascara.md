---
name: rs-next-js-input-telefone-mascara
description: "Applies phone input masking with React iMask when building form fields in React/Next.js. Use when user asks to 'create a phone input', 'add phone mask', 'format phone field', 'input with mask', or 'masked input'. Configures IMaskInput with Brazilian phone format, integrates with form libraries, and applies consistent styling. Make sure to use this skill whenever generating phone or formatted input fields in React projects. Not for date masks, currency masks, or general form validation logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: phone-input-mask
  tags: [react, next-js, react-imask, phone-mask, input-formatting, react-hook-form]
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

## Troubleshooting

### Server Action nao executa ao submeter formulario
**Symptom:** Formulario submete mas nada acontece, sem erros no console
**Cause:** Action nao esta sendo passada corretamente ao form, ou falta "use server" no topo do arquivo de action
**Fix:** Garantir que a funcao de action tem `"use server"` no topo. Passar a action via atributo `action` do form: `<form action={minhaAction}>`

### Validacao de formulario nao mostra erros
**Symptom:** Dados invalidos sao submetidos sem feedback ao usuario
**Cause:** Validacao esta no servidor mas o retorno nao e tratado no cliente
**Fix:** Usar `useActionState` (React 19) para capturar o retorno da server action e exibir erros. Adicionar validacao client-side com Zod para feedback instantaneo

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-o-input-de-telefone-com-mascara/references/deep-explanation.md) — O instrutor destaca que existem varias formas de implementar mascaras: libs dedicadas, regex manual,
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-o-input-de-telefone-com-mascara/references/code-examples.md) — pnpm add react-imask
