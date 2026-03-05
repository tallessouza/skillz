# Code Examples: Period Section Component Pattern

## Mock data de appointments

```tsx
const appointments = [
  { date: new Date("2025-08-17T10:00:00") },
  { date: new Date("2025-08-17T11:00:00") },
  { date: new Date("2025-08-17T14:00:00") },
  { date: new Date("2025-08-17T19:00:00") },
]
```

Resultado esperado: 2 na manha (10h, 11h), 1 na tarde (14h), 1 na noite (19h).

## PeriodSection completo (como mostrado na aula)

```tsx
import { Sun, Cloud, Moon } from "lucide-react"

const periodIcons = {
  morning: <Sun className="text-accent-blue" />,
  afternoon: <Cloud className="text-accent-orange" />,
  evening: <Moon className="text-accent-yellow" />,
}

interface PeriodSectionProps {
  period: any // instrutor deixou como any temporariamente
}

export const PeriodSection = ({ period }: PeriodSectionProps) => {
  return (
    <section className="mb-8 bg-background-primary rounded-xl">
      <div className="flex items-center px-5 py-3 justify-between border-b border-[#stroke-color]">
        <div>
          {periodIcons[period.type as keyof typeof periodIcons]}
        </div>
        <h2 className="text-label-large-size text-content-primary">
          {period.title}
        </h2>
      </div>
      {/* conteudo dos appointments sera adicionado na proxima aula */}
    </section>
  )
}
```

## Barrel export

```ts
// components/PeriodSection/index.ts
export * from "./PeriodSection"
```

## Uso na Page

```tsx
import { PeriodSection } from "@/components/PeriodSection"

export default function Home() {
  return (
    <main>
      {/* ... outros componentes ... */}
      <PeriodSection period={{ type: "morning", title: "Manhã" }} />
      <PeriodSection period={{ type: "afternoon", title: "Tarde" }} />
      <PeriodSection period={{ type: "evening", title: "Noite" }} />
    </main>
  )
}
```

## Variacao: tipagem completa (evolucao natural)

```tsx
type PeriodType = "morning" | "afternoon" | "evening"

interface Period {
  type: PeriodType
  title: string
  appointments: Appointment[]
}

interface Appointment {
  id: string
  date: Date
  // ... outros campos
}

// Funcao de agrupamento (sera implementada na proxima aula)
function groupAppointmentsByPeriod(appointments: Appointment[]): Period[] {
  const morning = appointments.filter(a => {
    const hour = a.date.getHours()
    return hour >= 9 && hour < 12
  })
  const afternoon = appointments.filter(a => {
    const hour = a.date.getHours()
    return hour >= 13 && hour < 18
  })
  const evening = appointments.filter(a => {
    const hour = a.date.getHours()
    return hour >= 19 && hour <= 21
  })

  return [
    { type: "morning", title: "Manhã", appointments: morning },
    { type: "afternoon", title: "Tarde", appointments: afternoon },
    { type: "evening", title: "Noite", appointments: evening },
  ]
}
```

## Tailwind classes utilizadas

| Classe | Valor | Proposito |
|--------|-------|-----------|
| `mb-8` | margin-bottom: 2rem | Espaco entre sections |
| `rounded-xl` | border-radius: 0.75rem | Bordas arredondadas do card |
| `px-5` | padding-horizontal: 1.25rem (20px) | Padding lateral do header |
| `py-3` | padding-vertical: 0.75rem (12px) | Padding vertical do header |
| `border-b` | border-bottom | Linha separadora do header |
| `items-center` | align-items: center | Alinhamento vertical |
| `justify-between` | justify-content: space-between | Icone na esquerda, titulo na direita |