---
name: rs-next-js-select-de-data-parte-02
description: "Applies time/hour Select component pattern with React Hook Form integration in Next.js. Use when user asks to 'create a time picker', 'add hour selection', 'build a select with icons', 'implement time slot selector', or 'integrate Select with react-hook-form'. Generates Select with trigger, icon, placeholder, and mapped time options. Make sure to use this skill whenever building time/hour selection UI in Next.js with shadcn/radix Select components. Not for date pickers, calendar components, or native HTML select elements."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: formularios-e-componentes
  tags: [select, react-hook-form, shadcn-ui, radix, time-picker, next-js, form-field]
---

# Select de Horario com React Hook Form

> Ao criar um campo de selecao de horario, use o componente Select com FormField, mapeie as opcoes a partir de um array de horarios, e mantenha o estilo consistente com os demais campos do formulario.

## Rules

1. **Use Select do componente, nao HTML nativo** — `<Select>` com `<SelectTrigger>`, `<SelectContent>`, `<SelectItem>`, porque garante consistencia visual e acessibilidade
2. **Conecte ao form via onValueChange e value** — `onValueChange={field.onChange}` e `value={field.value}`, porque o Select nao usa onChange padrao como inputs
3. **Inclua icone dentro do Trigger** — envolva icone e SelectValue numa div com `flex items-center gap-2`, porque o padrao visual exige icone + placeholder lado a lado
4. **Gere opcoes via map sobre array de horarios** — use `timeOptions.map(time => <SelectItem>)`, porque horarios sao dados derivados, nao hardcoded
5. **Key e value do SelectItem sao o proprio horario** — `key={time} value={time}`, porque cada horario e unico no array

## How to write

### FormField com Select de horario

```tsx
<FormField
  control={form.control}
  name="time"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Hora</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Selecione um horário" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  )}
/>
```

### Array de horarios (9h-21h)

```tsx
const timeOptions = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9
  return `${hour.toString().padStart(2, "0")}:00`
})
// ["09:00", "10:00", ..., "21:00"]
```

## Example

**Before (sem padrao):**
```tsx
<select onChange={field.onChange} value={field.value}>
  <option value="">Selecione</option>
  <option value="09:00">09:00</option>
  <option value="10:00">10:00</option>
  {/* ... hardcoded */}
</select>
```

**After (com este skill):**
```tsx
<Select onValueChange={field.onChange} value={field.value}>
  <SelectTrigger>
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <SelectValue placeholder="Selecione um horário" />
    </div>
  </SelectTrigger>
  <SelectContent>
    {timeOptions.map((time) => (
      <SelectItem key={time} value={time}>
        {time}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo de horario em formulario | Use Select com timeOptions mapeado |
| Select com React Hook Form | Use `onValueChange` e `value`, nao `onChange` |
| Icone dentro do trigger | Div wrapper com flex + gap, icone + SelectValue |
| Opcoes sequenciais (horas, meses) | Gere via Array.from + map |
| Estilo do trigger | Mantenha consistente com outros campos do form |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<select>` HTML nativo com shadcn | `<Select>` component |
| `onChange={field.onChange}` no Select | `onValueChange={field.onChange}` |
| Horarios hardcoded um por um | `timeOptions.map()` |
| Icone e placeholder soltos no trigger | `<div className="flex items-center gap-2">` |
| `<option>` dentro de Select component | `<SelectItem>` |

## Troubleshooting

### Comportamento diferente entre dev e producao
**Symptom:** Funcionalidade funciona em `npm run dev` mas nao em `npm run build && npm start`
**Cause:** Dev mode e mais permissivo — producao aplica otimizacoes, cache agressivo, e validacoes mais estritas
**Fix:** Sempre testar com `npm run build && npm start` antes de deploy. Verificar que nao ha erros no build output. Limpar .next antes de rebuildar

### Erro "Module not found" apos refatoracao
**Symptom:** Import de modulo falha apos mover arquivo
**Cause:** Path do import nao foi atualizado, ou alias de path (@/) nao esta configurado
**Fix:** Atualizar todos os imports que referenciam o arquivo movido. Verificar tsconfig.json paths para aliases

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-o-select-de-data-parte-02/references/deep-explanation.md) — O componente Select do Radix UI (base do shadcn/ui) nao e um input HTML nativo. Ele nao dispara even
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-o-select-de-data-parte-02/references/code-examples.md) — import { Clock } from "lucide-react"
