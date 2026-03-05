# Code Examples: Criando Inputs com Formularios Reativos

## Instalacao dos componentes shadcn/ui

```bash
# Os tres componentes necessarios para o formulario
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
```

## Imports necessarios

```tsx
// Componentes do formulario (shadcn/ui)
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Icones (Lucide React)
import { User, Dog } from "lucide-react"
```

## Formulario completo da aula

```tsx
<Form {...form}>
  <form className="space-y-4">
    {/* Nome do tutor */}
    <FormField
      control={form.control}
      name="tutorName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-label-medium text-content-primary">
            nome do tutor
          </FormLabel>
          <FormControl>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brands"
                size={20}
              />
              <Input
                placeholder="nome do tutor"
                className="pl-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Nome do pet */}
    <FormField
      control={form.control}
      name="petName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-label-medium text-content-primary">
            nome do pet
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Dog
                className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brands"
                size={20}
              />
              <Input
                placeholder="nome do pet"
                className="pl-10"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Descrição do serviço */}
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-label-medium text-content-primary">
            descrição do serviço
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="descrição do serviço"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

## Pattern do icone posicionado (isolado)

```tsx
{/* Wrapper relativo cria contexto de posicionamento */}
<div className="relative">
  {/* Icone absoluto centralizado verticalmente */}
  <User
    className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brands"
    size={20}
  />
  {/* Input com padding-left para nao sobrepor o icone */}
  <Input
    placeholder="nome do tutor"
    className="pl-10"
    {...field}
  />
</div>
```

## Variacao: campo sem icone

```tsx
{/* Quando nao ha icone, o input vai direto no FormControl */}
<FormControl>
  <Textarea
    placeholder="descrição do serviço"
    className="resize-none"
    {...field}
  />
</FormControl>
```

## Commit de referencia

O codigo completo desta aula esta disponivel em:
https://github.com/skillz-education/nextjs-pet-shop/commit/52656aebc99775b557141cae1640d17ba0168bc8