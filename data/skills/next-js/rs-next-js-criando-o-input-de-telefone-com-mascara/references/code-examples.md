# Code Examples: Input de Telefone com Máscara

## Exemplo 1: Instalacao

```bash
pnpm add react-imask
```

O pacote `react-imask` ja inclui os tipos TypeScript e o wrapper React.

## Exemplo 2: Import basico

```tsx
import { IMaskInput } from 'react-imask'
```

## Exemplo 3: Mascara de telefone BR (da aula)

```tsx
<IMaskInput
  mask="(00) 00000-0000"
  placeholder="(99) 99999-9999"
  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
/>
```

O `className` acima replica o estilo padrao de um input Shadcn UI para manter consistencia.

## Exemplo 4: Integrado com FormField (Shadcn + React Hook Form)

```tsx
import { Phone } from 'lucide-react'
import { IMaskInput } from 'react-imask'
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form'

// Dentro do Form component:
<FormField
  control={form.control}
  name="phone"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <IMaskInput
            mask="(00) 00000-0000"
            placeholder="(99) 99999-9999"
            value={field.value}
            onAccept={(value) => field.onChange(value)}
            className="flex h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
          />
        </div>
      </FormControl>
    </FormItem>
  )}
/>
```

## Exemplo 5: Mascara dinamica (celular + fixo)

```tsx
<IMaskInput
  mask={[
    { mask: '(00) 0000-0000' },   // fixo: 8 digitos
    { mask: '(00) 00000-0000' },  // celular: 9 digitos
  ]}
  placeholder="(99) 99999-9999"
  onAccept={(value) => setPhone(value)}
/>
```

O iMask escolhe automaticamente a mascara correta baseado no numero de digitos digitados.

## Exemplo 6: Capturando valor limpo vs formatado

```tsx
<IMaskInput
  mask="(00) 00000-0000"
  onAccept={(value, mask) => {
    console.log('Sem mascara:', value)        // "11999887766"
    console.log('Com mascara:', mask.value)    // "(11) 99988-7766"
  }}
/>
```

## Exemplo 7: Posicionamento no formulario (ordem da aula)

```tsx
<form>
  {/* Campo: Nome do Tutor */}
  <FormField name="tutorName" ... />

  {/* Campo: Nome do Pet */}
  <FormField name="petName" ... />

  {/* Campo: Telefone (com mascara) — ESTE */}
  <FormField name="phone" ... />

  {/* Campo: Descricao */}
  <FormField name="description" ... />
</form>
```

## Exemplo 8: Outros formatos possiveis com iMask

```tsx
// CPF
<IMaskInput mask="000.000.000-00" />

// CNPJ
<IMaskInput mask="00.000.000/0000-00" />

// CEP
<IMaskInput mask="00000-000" />

// Cartao de credito
<IMaskInput mask="0000 0000 0000 0000" />

// Data
<IMaskInput mask="00/00/0000" />
```

Todos seguem a mesma logica: `0` = slot numerico, demais caracteres sao fixos.