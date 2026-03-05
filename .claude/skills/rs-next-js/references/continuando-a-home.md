---
name: rs-next-js-continuando-a-home
description: "Applies period-based component grouping pattern when building schedule or appointment UIs in Next.js. Use when user asks to 'create a schedule component', 'group items by time period', 'build appointment list', 'separate morning afternoon evening', or 'create period section component'. Enforces icon-mapping-by-object pattern, typed period props, and correct Tailwind spacing for card-based layouts. Make sure to use this skill whenever building time-grouped UI sections. Not for date picker logic, calendar grid layouts, or backend scheduling APIs."
---

# Period Section Component Pattern

> Ao agrupar itens por periodo do dia, use um componente reutilizavel com mapeamento de icones por objeto e props tipadas.

## Rules

1. **Separe periodos em componentes reutilizaveis** — crie um `PeriodSection` que recebe o periodo como prop, porque cada periodo (manha, tarde, noite) tem icone, titulo e estilo diferentes
2. **Mapeie icones com objeto, nao com if/else** — use `periodIcons[period.type]` em vez de condicionais encadeadas, porque escala melhor e e mais legivel
3. **Use cores semanticas por periodo** — manha=blue, tarde=orange, noite=yellow, porque cria distincao visual imediata
4. **Wrape em section com rounded container** — use `section` com `bg-background-primary rounded-xl` para criar cards visuais consistentes
5. **Separe logica de agrupamento do componente visual** — a funcao que agrupa appointments por horario deve ficar fora do componente, porque facilita testes e reutilizacao

## How to write

### Icon mapping por objeto

```tsx
import { Sun, Cloud, Moon } from "lucide-react"

const periodIcons = {
  morning: <Sun className="text-accent-blue" />,
  afternoon: <Cloud className="text-accent-orange" />,
  evening: <Moon className="text-accent-yellow" />,
}
```

### PeriodSection component

```tsx
interface PeriodSectionProps {
  period: {
    type: "morning" | "afternoon" | "evening"
    title: string
    appointments: Appointment[]
  }
}

export const PeriodSection = ({ period }: PeriodSectionProps) => {
  return (
    <section className="mb-8 bg-background-primary rounded-xl">
      <div className="flex items-center px-5 py-3 justify-between border-b border-stroke">
        <div>
          {periodIcons[period.type]}
        </div>
        <h2 className="text-label-large-size text-content-primary">
          {period.title}
        </h2>
      </div>
      {/* appointment items renderizados aqui */}
    </section>
  )
}
```

### Barrel export

```ts
// components/PeriodSection/index.ts
export * from "./PeriodSection"
```

## Example

**Before (condicionais encadeadas):**
```tsx
const getIcon = (type: string) => {
  if (type === "morning") return <Sun className="text-blue-500" />
  if (type === "afternoon") return <Cloud className="text-orange-500" />
  if (type === "evening") return <Moon className="text-yellow-500" />
  return null
}
```

**After (objeto de mapeamento):**
```tsx
const periodIcons = {
  morning: <Sun className="text-accent-blue" />,
  afternoon: <Cloud className="text-accent-orange" />,
  evening: <Moon className="text-accent-yellow" />,
}

// Uso: {periodIcons[period.type]}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 3+ variantes visuais por tipo | Objeto de mapeamento, nao if/else |
| Componente usado em lista | Barrel export no index.ts |
| Mock data temporario | Use datas reais com `new Date("2025-08-17T10:00:00")` |
| Periodos do dia | Manha: 9-12, Tarde: 13-18, Noite: 19-21 |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (type === "morning") return <Sun />` encadeado | `periodIcons[type]` via objeto |
| Logica de agrupamento dentro do JSX | Funcao separada que retorna periodos agrupados |
| `className="text-blue-500"` hardcoded | `className="text-accent-blue"` com design tokens |
| Componente sem tipagem de props | `interface PeriodSectionProps` com union type |
| Tudo num arquivo so | Pasta `PeriodSection/` com index.ts + componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-continuando-a-home/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-continuando-a-home/references/code-examples.md)
