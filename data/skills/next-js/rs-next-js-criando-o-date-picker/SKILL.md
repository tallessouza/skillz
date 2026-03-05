---
name: rs-next-js-criando-o-date-picker
description: "Applies DatePicker component patterns when building date selection UI in Next.js with Tailwind. Use when user asks to 'create a date picker', 'build calendar input', 'date navigation component', 'responsive date selector', or 'popover with calendar'. Enforces sequential date navigation arrows, popover trigger pattern, responsive show/hide strategy, and icon sizing conventions. Make sure to use this skill whenever building date-related input components in React/Next.js. Not for date formatting logic, date utilities, or backend date handling."
---

# Criando o DatePicker

> Construa DatePickers como componentes compostos: botoes de navegacao sequencial + popover com calendario + layout responsivo com hidden/show por breakpoint.

## Rules

1. **Separe navegacao sequencial do calendario** — adicione setas esquerda/direita alem do calendario popup, porque usuarios querem navegar dia-a-dia sem abrir o calendario inteiro
2. **Use hidden/block por breakpoint para responsividade** — renderize o componente duas vezes (header e body) controlando visibilidade com `hidden md:block` e `block md:hidden`, porque isso evita logica JS de media query
3. **Extraia componentes de seta em componente reutilizavel** — os botoes left/right sao quase identicos, porque duplicar gera inconsistencia quando mudar estilizacao
4. **Use Popover do Radix/shadcn para o calendario** — PopoverTrigger envolve o botao que mostra a data, PopoverContent contem o calendario, porque popover gerencia focus trap e acessibilidade
5. **Dimensione icones explicitamente** — `h-4 w-4` (16px) para icones dentro de botoes, porque tamanhos implicitos variam entre icon libraries
6. **Use min-w para o botao trigger** — `min-w-[180px]` garante que o texto "Selecione uma data" nao quebre o layout, porque conteudo dinamico (datas formatadas) varia em largura

## How to write

### Estrutura do DatePicker

```tsx
// components/DatePicker/index.tsx
export const DatePicker = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Botao voltar data */}
      <Button variant="outline">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Popover com calendario */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[180px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-content-brand" />
              <span>Selecione uma data</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {/* Calendario aqui */}
        </PopoverContent>
      </Popover>

      {/* Botao avancar data */}
      <Button variant="outline">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

### Layout responsivo (duas instancias com hidden)

```tsx
// page.tsx — Home
export default function Home() {
  return (
    <div>
      {/* Header area */}
      <div className="flex items-center gap-4">
        <div>
          <h1>Titulo</h1>
          <p>Descricao</p>
        </div>
        {/* Visivel apenas no desktop */}
        <DatePicker className="hidden md:flex" />
      </div>

      {/* Visivel apenas no mobile */}
      <DatePicker className="mt-3 mb-8 flex md:hidden" />

      {/* Resto do conteudo */}
    </div>
  )
}
```

## Example

**Before (date picker sem navegacao sequencial):**
```tsx
const DatePicker = () => (
  <Popover>
    <PopoverTrigger>
      <input type="date" />
    </PopoverTrigger>
  </Popover>
)
```

**After (com navegacao e layout responsivo):**
```tsx
const DatePicker = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <Button variant="outline">
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[180px]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-content-brand" />
            <span>{selectedDate ?? "Selecione uma data"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>{/* Calendar component */}</PopoverContent>
    </Popover>
    <Button variant="outline">
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Navegacao dia-a-dia e importante | Adicione setas left/right ao lado do popover |
| Desktop e mobile tem posicao diferente | Renderize 2x com hidden/block por breakpoint |
| Botoes left/right sao identicos | Extraia ArrowButton component reutilizavel |
| Texto do trigger pode variar em largura | Use min-w no botao, nao w fixo |
| Icone indica acao (abrir dropdown) | Use ChevronDown com opacity-50 |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<input type="date">` nativo | Popover + Calendar component customizado |
| Media query JS para mostrar/esconder | `hidden md:flex` / `flex md:hidden` no className |
| Icones sem dimensao explicita | `className="h-4 w-4"` sempre |
| Width fixo `w-[180px]` no trigger | `min-w-[180px]` para flexibilidade |
| Duplicar markup dos botoes left/right | Componente ArrowButton com prop direction |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
