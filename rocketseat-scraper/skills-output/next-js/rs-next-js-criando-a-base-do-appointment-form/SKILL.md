---
name: rs-next-js-criando-base-appointment-form
description: "Generates appointment form scaffolding using shadcn/ui Dialog, React Hook Form, and Zod in Next.js. Use when user asks to 'create a form', 'build a booking form', 'make an appointment component', 'add a modal form', or 'scaffold a dialog with form'. Applies patterns: 'use client' directive for form components, Dialog wrapping form trigger, shadcn/ui component composition, React Hook Form + Zod setup. Make sure to use this skill whenever building modal-based forms in Next.js App Router projects. Not for API routes, server actions implementation, or non-modal inline forms."
---

# Criando a Base do Appointment Form

> Formularios em Next.js App Router que usam React Hook Form precisam da diretiva 'use client' e devem ser estruturados dentro de um Dialog do shadcn/ui quando apresentados como modal.

## Rules

1. **Sempre adicione 'use client'** — componentes com React Hook Form executam no cliente, porque o hook useForm usa estado e efeitos do React que nao existem no servidor
2. **Envolva o formulario em Dialog do shadcn/ui** — use Dialog > DialogTrigger > DialogContent > DialogHeader > DialogTitle > DialogDescription, porque isso garante acessibilidade (ESC fecha, click fora fecha, foco gerenciado)
3. **Use asChild no DialogTrigger** — passe `asChild` para o DialogTrigger e coloque o Button dentro, porque isso evita renderizar dois botoes aninhados
4. **Instale dependencias antes de codar** — react-hook-form, @hookform/resolvers, zod, sonner (toasts), porque tentar importar sem instalar quebra o build
5. **Componentes UI vem de @/components/ui/** — Button, Dialog, Input todos importados do design system local, porque centraliza estilizacao e variantes
6. **Crie variantes de Button no design system** — adicione variantes como `brand` no arquivo button.tsx, porque variantes ficam reutilizaveis em todo o projeto

## How to write

### Estrutura do componente modal-form

```tsx
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
        <form>
          {/* Inputs serao adicionados aqui */}
          <Button type="submit">Enviar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Instalacao de dependencias

```bash
# React Hook Form + validacao
npm install react-hook-form @hookform/resolvers zod

# Toast notifications
npm install sonner

# Componentes shadcn/ui
npx shadcn@latest add dialog button
```

### Uso na page

```tsx
import { AppointmentForm } from "@/components/AppointmentForm"

export default function Page() {
  return (
    <div>
      {/* outros componentes */}
      <div>
        <AppointmentForm />
      </div>
    </div>
  )
}
```

## Example

**Before (form sem estrutura de modal):**
```tsx
export function BookingForm() {
  return (
    <form>
      <input type="text" />
      <button>Submit</button>
    </form>
  )
}
```

**After (com Dialog + design system + diretiva client):**
```tsx
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const BookingForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">Novo agendamento</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agende um atendimento</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar.
          </DialogDescription>
        </DialogHeader>
        <form>
          <Button type="submit">Enviar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario precisa de estado/hooks | Adicione 'use client' no topo do arquivo |
| Formulario abre como modal/popup | Use Dialog do shadcn/ui, nao crie modal custom |
| Botao abre o modal | DialogTrigger com asChild + Button dentro |
| Projeto usa shadcn/ui | Instale componentes via CLI (`npx shadcn@latest add`) |
| Precisa de validacao | Instale react-hook-form + @hookform/resolvers + zod juntos |
| Precisa de feedback ao usuario | Use sonner para toasts |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<DialogTrigger><button>` (sem asChild) | `<DialogTrigger asChild><Button>` |
| Modal custom com useState + overlay manual | `<Dialog>` do shadcn/ui com acessibilidade built-in |
| Form component sem 'use client' usando hooks | `"use client"` no topo do arquivo |
| Instalar UI libs genericas (Material UI, etc) quando ja usa shadcn | `npx shadcn@latest add dialog` |
| Validacao manual com if/else | Zod schema + @hookform/resolvers |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
