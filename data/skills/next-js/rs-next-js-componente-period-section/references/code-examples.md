# Code Examples: Componente PeriodSection

## Exemplo completo do componente conforme a aula

```tsx
// components/PeriodSection.tsx
import { TimeRange } from './TimeRange'
import { AppointmentCard } from './AppointmentCard'

interface Appointment {
  petName: string
  tutorName: string
  service: string
  time: string
}

interface Period {
  range: { start: string; end: string }
  appointments: Appointment[]
}

interface PeriodSectionProps {
  period: Period
}

export function PeriodSection({ period }: PeriodSectionProps) {
  return (
    <div>
      <TimeRange range={period.range} />

      {period.appointments.length > 0 ? (
        <div className="px-5">
          {/* Headers de coluna — visiveis apenas em telas medias+ */}
          <div className="grid grid-cols-2 md:hidden text-sm text-content-secondary mb-2">
            <span>Horário</span>
            <span>Paciente</span>
          </div>

          {/* Wrapper para animacao futura com Framer Motion */}
          <div>
            {period.appointments.map((appointment, index) => (
              <AppointmentCard key={index} appointment={appointment} />
            ))}
          </div>
        </div>
      ) : (
        <p>Nenhum agendamento para este período.</p>
      )}
    </div>
  )
}
```

## Versao placeholder (antes de criar AppointmentCard)

O instrutor usa esta versao temporaria enquanto o componente AppointmentCard nao existe:

```tsx
{period.appointments.map((appointment, index) => (
  <div key={index}>
    {appointment.petName}
  </div>
))}
```

## Pattern: Estado vazio com mensagem simples

```tsx
// Sem div wrapper desnecessaria
{items.length > 0 ? (
  <div>{/* renderizar lista */}</div>
) : (
  <p>Nenhum agendamento para este período.</p>
)}
```

## Pattern: Grid responsivo com headers condicionais

```tsx
{/* Headers visiveis so em desktop */}
<div className="grid grid-cols-2 md:hidden text-sm text-content-secondary mb-2">
  <span>Horário</span>
  <span>Paciente</span>
</div>
```

## Variacao: 3 colunas (horario, paciente, servico)

```tsx
<div className="grid grid-cols-3 md:hidden text-sm text-content-secondary mb-2">
  <span>Horário</span>
  <span>Paciente</span>
  <span>Serviço</span>
</div>

<div>
  {period.appointments.map((appointment, index) => (
    <div key={index} className="grid grid-cols-3">
      <span>{appointment.time}</span>
      <span>{appointment.petName}</span>
      <span>{appointment.service}</span>
    </div>
  ))}
</div>
```

## Preparacao para Framer Motion (proxima aula)

A div wrapper sem estilos sera transformada em:

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {period.appointments.map((appointment, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AppointmentCard appointment={appointment} />
    </motion.div>
  ))}
</motion.div>
```