# Code Examples: Schema de Formulario com Zod + React Hook Form

## Exemplo completo do schema da aula

```typescript
import { z } from "zod"

const appointmentFormSchema = z.object({
  tutorName: z.string().min(3, { message: "O nome do tutor é obrigatório" }),
  petName: z.string().min(3, { message: "O nome do pet é obrigatório" }),
  phone: z.string().min(11, { message: "O telefone é obrigatório" }),
  description: z.string().min(3, { message: "A descrição é obrigatória" }),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>
```

## Configuracao completa do useForm

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const form = useForm<AppointmentFormValues>({
  defaultValues: {
    tutorName: "",
    petName: "",
    phone: "",
    description: "",
  },
  resolver: zodResolver(appointmentFormSchema),
})
```

## Funcao onSubmit tipada

```typescript
function onSubmit(data: AppointmentFormValues) {
  console.log("agendamento", data)
  // data.tutorName, data.petName, data.phone, data.description
  // todos ja validados e tipados
}
```

## JSX com Form do shadcn/ui + handleSubmit

```tsx
import { Form } from "@/components/ui/form"

// Dentro do componente:
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <input {...form.register("tutorName")} />
    <input {...form.register("petName")} />
    <input {...form.register("phone")} />
    <input {...form.register("description")} />
    <button type="submit">Salvar</button>
  </form>
</Form>
```

## Estilizacao responsiva do botao (Tailwind)

```tsx
<div className="fixed bottom-0 left-0 right-0 flex justify-center bg-[#COR_DO_FIGMA] py-[18px] px-6 mb-6 md:right-6 md:top-auto md:left-auto md:w-auto md:bg-transparent md:p-0">
  {/* Botao de novo agendamento */}
</div>
```

## Dialog customizado (shadcn/ui)

```tsx
<Dialog>
  <DialogContent variant="appointment" overlay="blurred" showCloseButton={true}>
    <DialogTitle size="modal">Novo Agendamento</DialogTitle>
    <DialogDescription size="modal">
      Preencha os dados do agendamento
    </DialogDescription>
    {/* Form aqui */}
  </DialogContent>
</Dialog>
```

## Instalacao dos pacotes

```bash
npm add react-hook-form @hookform/resolvers
# zod ja instalado previamente

# shadcn/ui form component
npx shadcn-ui@latest add form
# ATENCAO: diga "no" se perguntar sobre sobrescrever button
```

## Variacao: adicionando campos de data/hora depois

```typescript
// Fase 1 (esta aula): apenas strings
const schemaV1 = z.object({
  tutorName: z.string().min(3, { message: "Nome obrigatório" }),
  petName: z.string().min(3, { message: "Nome obrigatório" }),
  phone: z.string().min(11, { message: "Telefone obrigatório" }),
  description: z.string().min(3, { message: "Descrição obrigatória" }),
})

// Fase 2 (proximas aulas): com data e hora
const schemaV2 = schemaV1.extend({
  date: z.date({ required_error: "Selecione uma data" }),
  time: z.string().min(1, { message: "Selecione um horário" }),
})
```