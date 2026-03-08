---
name: rs-next-js-criando-o-appointment-card
description: "Applies AppointmentCard component patterns when building card-based UI components in Next.js with Tailwind CSS. Use when user asks to 'create a card component', 'build an appointment list', 'display scheduled items', or 'structure a data card with multiple sections'. Enforces visual separation between time, patient/entity, and service/description sections, responsive layout with flex utilities, and component preparation for future actions (edit/delete). Make sure to use this skill whenever creating card components that display structured data with multiple fields. Not for form components, modals, or page-level layouts."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: appointment-card
  tags: [next-js, react, card-component, tailwind, responsive, barrel-export, visual-hierarchy]
---

# Criando o AppointmentCard

> Componentes de card com dados estruturados devem separar visualmente cada grupo de informacao (horario, entidade, servico) em divs independentes com tipografia e cores distintas.

## Rules

1. **Separe grupos de informacao em divs distintas** — horario em uma div, dados da entidade em outra, servico em outra, porque facilita futuras features como edicao e remocao por secao
2. **Use tipografia para criar hierarquia** — `text-label-small` + `font-semibold` para dados primarios, `text-paragraph-small` + `text-content-secondary` para dados secundarios, porque hierarquia visual guia o olhar do usuario
3. **Prepare a estrutura para acoes futuras** — mesmo sem botoes de editar/remover ainda, a separacao em divs permite adicionar acoes sem refatorar o layout
4. **Use separadores explicitos entre dados inline** — um span com `|` e cor secundaria entre nome do paciente e nome do tutor, porque torna a leitura mais clara
5. **Responsividade com breakpoints Tailwind** — `md:justify-start` vs `justify-end`, `md:col-span-1` vs `col-span-2`, porque o card deve funcionar em mobile e desktop
6. **Exporte componentes via barrel file (index.tsx)** — crie `index.tsx` que re-exporta o componente, porque padroniza imports no projeto

## How to write

### Estrutura basica do card

```tsx
// components/AppointmentCard/AppointmentCard.tsx
interface AppointmentCardProps {
  appointment: Appointment // tipo vindo do Prisma/dominio
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div>
      {/* Secao: Horario */}
      <div className="text-left pr-4 md:pr-0">
        <span className="text-label-small text-content-primary font-semibold">
          {appointment.time}
        </span>
      </div>

      {/* Secao: Paciente/Entidade + Tutor */}
      <div className="text-right md:text-left pr-4 flex items-center justify-end md:justify-start gap-1">
        <span className="text-label-small text-content-primary font-semibold">
          {appointment.petName}
        </span>
        <span className="text-label-small text-content-secondary">|</span>
        <span className="text-paragraph-small text-content-secondary">
          {appointment.tutorName}
        </span>
      </div>

      {/* Secao: Servico */}
      <div className="text-left px-4 md:px-0 mt-1 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
        <span className="text-paragraph-small text-content-secondary">
          {appointment.serviceDescription}
        </span>
      </div>
    </div>
  )
}
```

### Barrel file

```tsx
// components/AppointmentCard/index.tsx
export { AppointmentCard } from './AppointmentCard'
```

### Uso no componente pai

```tsx
// Dentro do PeriodSection ou similar
import { AppointmentCard } from '@/components/AppointmentCard'

{appointments.map((appointment) => (
  <AppointmentCard key={appointment.id} appointment={appointment} />
))}
```

## Example

**Before (tudo em uma unica div sem separacao):**
```tsx
function Card({ appointment }) {
  return (
    <div className="flex gap-2">
      <span>{appointment.time}</span>
      <span>{appointment.petName} | {appointment.tutorName}</span>
      <span>{appointment.serviceDescription}</span>
    </div>
  )
}
```

**After (com separacao visual e hierarquia):**
```tsx
function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div>
      <div className="text-left pr-4 md:pr-0">
        <span className="text-label-small text-content-primary font-semibold">
          {appointment.time}
        </span>
      </div>

      <div className="text-right md:text-left pr-4 flex items-center justify-end md:justify-start gap-1">
        <span className="text-label-small text-content-primary font-semibold">
          {appointment.petName}
        </span>
        <span className="text-label-small text-content-secondary">|</span>
        <span className="text-paragraph-small text-content-secondary">
          {appointment.tutorName}
        </span>
      </div>

      <div className="text-left px-4 md:px-0 mt-1 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
        <span className="text-paragraph-small text-content-secondary">
          {appointment.serviceDescription}
        </span>
      </div>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Card exibe 3+ campos de dados | Separe em divs por grupo semantico |
| Dois campos inline relacionados | Use separador `|` com cor secundaria |
| Card tera acoes futuras (edit/delete) | Estruture em secoes independentes desde o inicio |
| Layout muda entre mobile e desktop | Use breakpoints Tailwind (`md:`) para flex direction e justify |
| Componente sera usado em lista | Receba o objeto inteiro como prop tipada, nao props individuais |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Todos os dados em um unico span | Divs separadas por grupo semantico |
| Separador como string concatenada `name + " | " + tutor` | Span dedicado para o separador com estilo proprio |
| Props individuais `time={a.time} pet={a.petName}` | Prop unica tipada `appointment={appointment}` |
| Estilos inline para responsividade | Classes Tailwind com breakpoints |
| Componente sem barrel file | `index.tsx` re-exportando o componente |

## Troubleshooting

### Comportamento diferente entre dev e producao
**Symptom:** Funcionalidade funciona em `npm run dev` mas nao em `npm run build && npm start`
**Cause:** Dev mode e mais permissivo — producao aplica otimizacoes, cache agressivo, e validacoes mais estritas
**Fix:** Sempre testar com `npm run build && npm start` antes de deploy. Verificar que nao ha erros no build output. Limpar .next antes de rebuildar

### Erro "Module not found" apos refatoracao
**Symptom:** Import de modulo falha apos mover arquivo
**Cause:** Path do import nao foi atualizado, ou alias de path (@/) nao esta configurado
**Fix:** Atualizar todos os imports que referenciam o arquivo movido. Verificar tsconfig.json paths para aliases

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-criando-o-appointment-card/references/deep-explanation.md) — O instrutor explica que a decisao de separar horario, paciente/tutor e servico em divs distintas nao
- [code-examples.md](../../../data/skills/next-js/rs-next-js-criando-o-appointment-card/references/code-examples.md) — components/
