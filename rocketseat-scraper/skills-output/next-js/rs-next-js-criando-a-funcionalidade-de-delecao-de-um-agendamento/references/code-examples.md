# Code Examples: Delecao com Server Actions e Alert Dialog

## Server Action completa

```typescript
// app/actions.ts (ou arquivo de actions do modulo)
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteAppointments(id: string) {
  try {
    await prisma.appointments.delete({
      where: { id }
    })
    revalidatePath("/") // ajustar path conforme a rota
  } catch (error) {
    console.error(error)
    return { error: "Erro ao remover agendamento" }
  }
}
```

### Comparacao com create e update Actions

```typescript
// CREATE - recebe FormData, faz parse, valida
export async function createAppointment(data: FormData) {
  try {
    const parsed = schema.parse(Object.fromEntries(data))
    await prisma.appointments.create({ data: parsed })
    revalidatePath("/")
  } catch (error) {
    console.error(error)
    return { error: "Erro ao criar o agendamento" }
  }
}

// UPDATE - recebe id + FormData, faz parse, valida
export async function updateAppointment(id: string, data: FormData) {
  try {
    const parsed = schema.parse(Object.fromEntries(data))
    await prisma.appointments.update({ where: { id }, data: parsed })
    revalidatePath("/")
  } catch (error) {
    console.error(error)
    return { error: "Erro ao atualizar o agendamento" }
  }
}

// DELETE - recebe apenas id, sem parse
export async function deleteAppointments(id: string) {
  try {
    await prisma.appointments.delete({ where: { id } })
    revalidatePath("/")
  } catch (error) {
    console.error(error)
    return { error: "Erro ao remover agendamento" }
  }
}
```

## Componente AppointmentCard completo

```tsx
"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner" // ou sua lib de toast
import { deleteAppointments } from "@/app/actions"

interface AppointmentCardProps {
  appointmentId: string
  // ... outras props
}

export function AppointmentCard({ appointmentId }: AppointmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)

    const result = await deleteAppointments(appointmentId)

    if (result?.error) {
      toast.error(result.error)
      setIsDeleting(false)
      return
    }

    toast.success("Agendamento removido com sucesso")
    setIsDeleting(false)
  }

  return (
    <div>
      {/* ... conteudo do card ... */}

      {/* Botao de edit (Dialog separado) */}
      {/* ... */}

      {/* Botao de delete com Alert Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="remove" size="icon">
            <Trash2 size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este agendamento?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
```

## Instalacao do Alert Dialog (shadcn/ui)

```bash
npx shadcn-ui@latest add alert-dialog
```

## Variacao: delete generico reutilizavel

```typescript
// Para outros recursos alem de appointments
export async function deleteRecord(
  model: "appointments" | "pets" | "owners",
  id: string,
  revalidate: string
) {
  try {
    await (prisma[model] as any).delete({ where: { id } })
    revalidatePath(revalidate)
  } catch (error) {
    console.error(error)
    return { error: `Erro ao remover registro` }
  }
}
```

## Variacao: componente de confirmacao reutilizavel

```tsx
interface DeleteConfirmProps {
  onConfirm: () => Promise<void>
  isDeleting: boolean
  title?: string
  description?: string
}

function DeleteConfirm({
  onConfirm,
  isDeleting,
  title = "Remover item",
  description = "Tem certeza? Esta ação não pode ser desfeita.",
}: DeleteConfirmProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="remove" size="icon">
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```