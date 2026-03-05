---
name: rs-next-js-select-de-data-parte-02
description: "Applies time/hour Select component pattern with React Hook Form integration in Next.js. Use when user asks to 'create a time picker', 'add hour selection', 'build a select with icons', 'implement time slot selector', or 'integrate Select with react-hook-form'. Generates Select with trigger, icon, placeholder, and mapped time options. Make sure to use this skill whenever building time/hour selection UI in Next.js with shadcn/radix Select components. Not for date pickers, calendar components, or native HTML select elements."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
