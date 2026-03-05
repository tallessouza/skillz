# Code Examples: Criando a Base do Appointment Form

## Exemplo 1: Componente inicial minimo

O instrutor comeca com o minimo absoluto antes de adicionar o Dialog:

```tsx
export const AppointmentForm = () => {
  return (
    <form>
      <button type="submit">Enviar</button>
    </form>
  )
}
```

Depois substitui o form pelo Dialog completo.

## Exemplo 2: Componente completo da aula

```tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const AppointmentForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">Novo agendamento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agende um atendimento</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para agendar um atendimento.
          </DialogDescription>
        </DialogHeader>
        {/* Form com inputs sera adicionado nas proximas aulas */}
      </DialogContent>
    </Dialog>
  )
}
```

## Exemplo 3: Uso na page

```tsx
import { AppointmentForm } from "@/components/AppointmentForm"

export default function Page() {
  return (
    <div>
      {/* Listagem de dados mocados */}
      <div>
        <AppointmentForm />
      </div>
    </div>
  )
}
```

## Exemplo 4: Comandos de instalacao

```bash
# Dependencias de formulario e validacao
npm install react-hook-form @hookform/resolvers zod

# Toasts
npm install sonner

# Componentes shadcn/ui
npx shadcn@latest add dialog
npx shadcn@latest add button
```

## Exemplo 5: Variante brand no Button (referencia)

O instrutor menciona que ja tinha o Button configurado e adicionou variantes. Estrutura tipica:

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brand: "bg-brand text-white hover:bg-brand/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Exemplo 6: Proximos passos mencionados (preview)

O instrutor antecipa o que vem nas proximas aulas:

```tsx
// Estrutura futura com inputs e validacao
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

const appointmentSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  date: z.string(),
  time: z.string(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

export const AppointmentForm = () => {
  const { register, handleSubmit } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  })

  const onSubmit = (data: AppointmentFormData) => {
    toast.success("Agendamento criado!")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">Novo agendamento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agende um atendimento</DialogTitle>
          <DialogDescription>...</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Inputs com mascara de telefone, selecao de horario, etc */}
          <Button type="submit">Agendar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```