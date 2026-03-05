# Code Examples: Criando a Funcao de Submit

## Exemplo completo do submit handler

```typescript
// Dentro do componente do formulario
import { toast } from 'sonner'

async function onSubmit(data: ScheduleFormData) {
  // 1. Desestruturar hora e minutos do time string
  const [hour, minutes] = data.time.split(':')

  // 2. Criar DateTime unificado
  const scheduleAt = new Date(data.scheduleAt)
  scheduleAt.setHours(Number(hour), Number(minutes), 0, 0)

  // 3. Chamar server action (proxima aula)
  // await createSchedule({ ...data, scheduleAt })

  // 4. Feedback visual
  toast.success('Agendamento criado com sucesso')
}
```

## Configuracao do Toaster no layout

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

## Visualizacao do fluxo de dados

```
Input time: "10:00:00" (string do input)
         |
         v
split(':') → ["10", "00", "00"]
         |
         v
desestruturacao → hour = "10", minutes = "00"
         |
         v
Number() → hour = 10, minutes = 0
         |
         v
scheduleAt.setHours(10, 0, 0, 0)
         |
         v
DateTime completo: 2024-03-15T10:00:00.000Z
```

## Instalacao do Sonner

```bash
pnpm add sonner
```

## Variacoes de toast

```typescript
// Sucesso
toast.success('Agendamento criado com sucesso')

// Erro (para usar quando server action falhar)
toast.error('Erro ao criar agendamento')

// Com descricao
toast.success('Agendamento criado', {
  description: 'Voce sera notificado 30 minutos antes',
})
```

## Schema Prisma relacionado

```prisma
model Schedule {
  id          String   @id @default(uuid())
  scheduleAt  DateTime  // Campo unico — date + time combinados
  // ... outros campos
}
```