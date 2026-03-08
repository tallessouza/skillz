---
name: rs-next-js-adicionando-o-calendar
description: "Applies Calendar DatePicker implementation pattern in Next.js with Popover, controlled state, and URL sync. Use when user asks to 'add a date picker', 'implement calendar selection', 'create a date input', or 'add popover with calendar'. Enforces controlled component pattern with URL update on selection and proper popover state management. Make sure to use this skill whenever building date selection UI in React/Next.js projects. Not for date formatting libraries, date range pickers, or backend date handling."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: ui-components
  tags: [calendar, datepicker, popover, controlled-component, url-sync, shadcn]
---

# Adicionando Calendar com DatePicker

> Implemente date pickers como controlled components dentro de Popovers, sincronizando a data selecionada com a URL.

## Rules

1. **Use Popover para conter o Calendar** — PopoverTrigger com button + PopoverContent com Calendar, porque mantém o padrao de UI composable do shadcn/radix
2. **Calendar é controlled component** — passe `selected={date}` e `onSelect={handler}`, porque o estado precisa sincronizar com a URL
3. **Atualize a URL ao selecionar data** — o handler de selecao atualiza searchParams e fecha o popover, porque a URL é source of truth para filtros em Next.js
4. **Feche o popover apos selecao** — chame `setOpen(false)` no onSelect handler, porque o usuario espera que selecionar uma data feche o dropdown
5. **Remova bordas do PopoverContent** — adicione classe para remover border padrao, porque o calendar ja tem sua propria estilizacao
6. **Ajuste padding e alinhamento** — use `p-0` e `align` no PopoverContent, porque o calendar precisa ficar encaixado sem espacamento extra

## Steps

### Step 1: Estrutura do Popover com Calendar

```tsx
<Popover open={isOpen} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <button>
      <CalendarIcon />
      {format(date, "dd 'de' MMMM", { locale: ptBR })}
    </button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0 border-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      autoFocus
      locale={ptBR}
    />
  </PopoverContent>
</Popover>
```

### Step 2: Handler de selecao com URL sync

```tsx
const handleDateSelect = (selectedDate: Date | undefined) => {
  if (selectedDate) {
    // Atualiza URL com a data selecionada
    updateUrlWithDate(selectedDate)
  }
  // Fecha o popover
  setOpen(false)
}
```

### Step 3: Estado controlado do Popover

```tsx
const [isOpen, setOpen] = useState(false)
const [date, setDate] = useState<Date>(new Date())
```

## Example

**Before (calendar sem controle):**
```tsx
<Popover>
  <PopoverTrigger>Selecionar data</PopoverTrigger>
  <PopoverContent>
    <Calendar mode="single" />
  </PopoverContent>
</Popover>
```

**After (controlled com URL sync):**
```tsx
const [isOpen, setOpen] = useState(false)
const [date, setDate] = useState<Date>(new Date())

const handleDateSelect = (selectedDate: Date | undefined) => {
  if (selectedDate) {
    setDate(selectedDate)
    const params = new URLSearchParams(searchParams)
    params.set("date", format(selectedDate, "yyyy-MM-dd"))
    router.push(`?${params.toString()}`)
  }
  setOpen(false)
}

<Popover open={isOpen} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <button>{format(date, "dd 'de' MMMM", { locale: ptBR })}</button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0 border-0">
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      autoFocus
      locale={ptBR}
    />
  </PopoverContent>
</Popover>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Data precisa persistir na URL | Use searchParams como source of truth |
| Popover deve fechar ao selecionar | Controle `open` state e feche no handler |
| Calendar com locale PT-BR | Passe `locale={ptBR}` do date-fns |
| Calendar dentro de popover fica desalinhado | Use `className="w-auto p-0"` no PopoverContent |
| Componente de data sera reutilizado | Extraia para sub-componente do DatePicker |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Calendar sem estado controlado | `selected={date} onSelect={handler}` |
| Fechar popover manualmente com ref | Controle via `open` e `onOpenChange` |
| Guardar data so no estado local | Sincronize com URL via searchParams |
| Deixar border padrao do PopoverContent com Calendar | Adicione `border-0` e `p-0` |
| Repetir estilizacao do DatePicker em multiplos lugares | Extraia sub-componente reutilizavel |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-adicionando-o-calendar/references/deep-explanation.md) — O instrutor enfatiza que o Calendar deve ser um **Controlled Component** — ou seja, o estado da data
- [code-examples.md](../../../data/skills/next-js/rs-next-js-adicionando-o-calendar/references/code-examples.md) — "use client"
