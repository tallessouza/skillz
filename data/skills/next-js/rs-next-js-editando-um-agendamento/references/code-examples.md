# Code Examples: Editando um Agendamento

## 1. Estrutura do AppointmentCard com botao de edicao

```tsx
// appointment-card.tsx
import { AppointmentForm } from './appointment-form'
import { Button } from '@/components/ui/button'
import { Pen } from 'lucide-react'

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <div>
      {/* Dados do agendamento: description, tutor name, etc */}
      <p>{appointment.description}</p>

      {/* Div com estilos de layout para acoes */}
      <div className="text-right mt-2 md:mt-0 col-span-2 flex-1 flex justify-end items-center gap-2">
        <AppointmentForm appointment={appointment}>
          <Button variant="edit" size="icon" aria-label="Press edit icon">
            <Pen size={16} />
          </Button>
        </AppointmentForm>
      </div>
    </div>
  )
}
```

## 2. AppointmentForm completo com children e appointment

```tsx
// appointment-form.tsx
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'

interface AppointmentFormProps {
  children?: React.ReactNode
  appointment?: Appointment
}

export function AppointmentForm({ children, appointment }: AppointmentFormProps) {
  const form = useForm<AppointmentFormData>({
    // defaultValues para criacao (campos vazios)
  })

  // Preenche o formulario quando recebe dados de edicao
  useEffect(() => {
    if (appointment) {
      form.reset(appointment)
    }
  }, [appointment, form])

  return (
    <Dialog>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* campos do formulario */}
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## 3. Page com AppointmentForm para criacao

```tsx
// page.tsx
import { AppointmentForm } from '@/components/appointment-form'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div>
      <AppointmentForm>
        <Button>Novo Agendamento</Button>
      </AppointmentForm>

      {/* Lista de agendamentos com AppointmentCard */}
    </div>
  )
}
```

## 4. Padrao de diferenciar create vs update no submit (proximo passo)

```tsx
// Logica que sera implementada na proxima aula
const onSubmit = async (data: AppointmentFormData) => {
  if (appointment) {
    // Update — server action de atualizacao
    await updateAppointment(appointment.id, data)
  } else {
    // Create — server action existente
    await createAppointment(data)
  }
}
```