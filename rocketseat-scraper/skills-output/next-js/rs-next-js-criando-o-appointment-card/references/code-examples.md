# Code Examples: Criando o AppointmentCard

## Estrutura de arquivos

```
components/
  AppointmentCard/
    AppointmentCard.tsx    # Componente principal
    index.tsx              # Barrel file
```

### index.tsx (barrel file)

```tsx
export { AppointmentCard } from './AppointmentCard'
```

## Componente completo conforme a aula

```tsx
// components/AppointmentCard/AppointmentCard.tsx

import { Appointment } from '@/types/appointment' // tipo do Prisma

interface AppointmentCardProps {
  appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div>
      {/* Secao 1: Horario */}
      <div className="text-left pr-4 md:pr-0">
        <span className="text-label-small text-content-primary font-semibold">
          {appointment.time}
        </span>
      </div>

      {/* Secao 2: Nome do pet + separador + nome do tutor */}
      <div className="text-right md:text-left pr-4 flex items-center justify-end md:justify-start gap-1">
        <span className="text-label-small text-content-primary font-semibold">
          {appointment.petName}
        </span>
        <span className="text-label-small text-content-secondary">
          |
        </span>
        <span className="text-paragraph-small text-content-secondary">
          {appointment.tutorName}
        </span>
      </div>

      {/* Secao 3: Servico/descricao */}
      <div className="text-left px-4 md:px-0 mt-1 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
        <span className="text-paragraph-small text-content-secondary">
          {appointment.serviceDescription}
        </span>
      </div>
    </div>
  )
}
```

## Uso no PeriodSection (componente pai)

```tsx
// Dentro do PeriodSection que renderiza a lista de agendamentos
import { AppointmentCard } from '@/components/AppointmentCard'

interface PeriodSectionProps {
  appointments: Appointment[]
}

export function PeriodSection({ appointments }: PeriodSectionProps) {
  return (
    <section>
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
        />
      ))}
    </section>
  )
}
```

## Evolucao futura: com motion (Framer Motion)

O instrutor menciona que o componente vai usar `motion` para animacoes. A evolucao seria:

```tsx
import { motion } from 'framer-motion'

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Mesmas secoes internas */}
    </motion.div>
  )
}
```

## Evolucao futura: com acoes de editar/remover

```tsx
export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div>
      {/* Secoes de dados (horario, pet, servico) */}
      {/* ... */}

      {/* Secao 4: Acoes (futura) */}
      <div className="flex items-center gap-2">
        <button>Editar</button>
        <button>Remover</button>
      </div>
    </div>
  )
}
```

A estrutura separada em divs permite adicionar esta secao de acoes sem refatorar as secoes existentes.

## Tipo Appointment (referencia Prisma)

```typescript
// Tipo gerado pelo Prisma ou definido manualmente
interface Appointment {
  id: string
  time: string
  petName: string
  tutorName: string
  serviceDescription: string
  // campos adicionais conforme o schema
}
```

## Classes Tailwind utilizadas e seu proposito

| Classe | Proposito |
|--------|-----------|
| `text-left` | Alinhamento de texto a esquerda |
| `pr-4` | Padding right 1rem |
| `md:pr-0` | Remove padding right em telas >= 768px |
| `text-label-small` | Tipografia label pequena (design system) |
| `text-content-primary` | Cor de texto primaria (design system) |
| `text-content-secondary` | Cor de texto secundaria (design system) |
| `font-semibold` | Peso da fonte semi-negrito |
| `text-paragraph-small` | Tipografia paragrafo pequeno (design system) |
| `flex` | Display flex |
| `items-center` | Alinha itens ao centro verticalmente |
| `justify-end` | Alinha conteudo ao final (mobile) |
| `md:justify-start` | Alinha conteudo ao inicio (desktop) |
| `gap-1` | Gap de 0.25rem entre flex items |
| `gap-2` | Gap de 0.5rem entre flex items |
| `col-span-2` | Ocupa 2 colunas do grid (mobile) |
| `md:col-span-1` | Ocupa 1 coluna do grid (desktop) |
| `px-4` | Padding horizontal 1rem |
| `mt-1` | Margin top 0.25rem |