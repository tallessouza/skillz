---
name: rs-next-js-continuando-o-appointment-card
description: "Enforces code organization patterns and conditional Tailwind styling in Next.js projects. Use when user asks to 'refactor components', 'organize utils', 'add conditional styles', 'use cn function', or 'move functions to utils'. Applies rules: utils vs lib separation, cn() for conditional classes, avoid premature optimization, mock data in constants. Make sure to use this skill whenever reorganizing Next.js project files or applying conditional Tailwind classes. Not for API routes, database queries, or server-side data fetching."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: appointment-card
  tags: [next-js, tailwind, cn, utils, code-organization, conditional-styles, refactoring]
---

# Organizacao de Codigo e Estilos Condicionais no Next.js

> Organize codigo por responsabilidade (utils vs lib) e use `cn()` para estilos condicionais com Tailwind — refatore apenas quando sentir o problema.

## Rules

1. **Separe utils de lib** — `utils/` contem funcoes auxiliares do dominio, `lib/` contem configuracoes de bibliotecas externas (Prisma client, shadcn, twinmerge), porque cada pasta tem responsabilidade clara
2. **Refatore quando sentir o problema** — crie simples primeiro, mova para utils quando a complexidade justificar, porque otimizacao prematura gera abstrações inuteis
3. **Constantes mock em UPPER_CASE** — `MOCK_APPOINTMENTS` nao `mockAppointments`, porque deixa explicito que sao dados fixos de desenvolvimento
4. **Use barrel exports (index.ts) so quando necessario** — se tem apenas um arquivo em utils, nao crie index.ts, porque adiciona complexidade sem beneficio
5. **Estilos condicionais com cn()** — nunca concatene strings de classes manualmente, use `cn()` do shadcn/tailwind-merge, porque resolve conflitos de classes automaticamente
6. **Props opcionais com default para estilos condicionais** — `isFirstInSection = false` nao prop obrigatoria, porque o componente deve funcionar sem a prop

## How to write

### Estrutura utils vs lib

```typescript
// lib/ — configuracao de bibliotecas externas
// lib/utils.ts (shadcn default — cn function)
// lib/prisma.ts (Prisma client)

// utils/ — funcoes auxiliares do dominio
// utils/appointment-utils.ts
// utils/mock-data.ts
// utils/index.ts (barrel export quando tem 2+ arquivos)
```

### Estilos condicionais com cn()

```typescript
import { cn } from "@/lib/utils"

interface AppointmentCardProps {
  isFirstInSection?: boolean
}

export function AppointmentCard({ isFirstInSection = false }: AppointmentCardProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-[15%_35%_30%_20%] items-center py-3",
        !isFirstInSection && "border-t border-[#353339]"
      )}
    >
      {/* content */}
    </div>
  )
}
```

### Passando prop condicional baseada em index

```typescript
{appointments.map((appointment, index) => (
  <AppointmentCard
    key={appointment.id}
    isFirstInSection={index === 0}
    {...appointment}
  />
))}
```

## Example

**Before (tudo no page.tsx):**
```typescript
// page.tsx
function getPeriod(hour: number) { /* ... */ }
function groupAppointmentsByPeriod(appointments: Appointment[]) { /* ... */ }
const mockAppointments = [/* ... */]

// estilo condicional com string template
<div className={`grid py-3 ${!isFirst ? 'border-t border-gray-700' : ''}`}>
```

**After (com esta skill aplicada):**
```typescript
// utils/appointment-utils.ts
export function getPeriod(hour: number) { /* ... */ }
export function groupAppointmentsByPeriod(appointments: Appointment[]) { /* ... */ }

// utils/mock-data.ts
export const MOCK_APPOINTMENTS = [/* ... */]

// utils/index.ts
export * from "./appointment-utils"
export * from "./mock-data"

// page.tsx
import { groupAppointmentsByPeriod, MOCK_APPOINTMENTS } from "@/utils"

// component com cn()
<div className={cn(
  "grid grid-cols-2 md:grid-cols-[15%_35%_30%_20%] items-center py-3",
  !isFirstInSection && "border-t border-[#353339]"
)}>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao usada so em um arquivo | Mantenha no arquivo, refatore depois se precisar |
| Funcao usada em 2+ arquivos | Mova para utils/ |
| Configuracao de lib externa | Coloque em lib/ |
| Dados mock de desenvolvimento | utils/mock-data.ts com UPPER_CASE |
| Estilo que depende de prop/estado | Use cn() com condicional |
| Grid com colunas customizadas | Use md:grid-cols-[percentuais] para responsividade |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `` className={`base ${cond ? 'x' : ''}`} `` | `className={cn("base", cond && "x")}` |
| Tudo em page.tsx quando cresce | Extraia para utils/ quando sentir o problema |
| `lib/appointment-utils.ts` | `utils/appointment-utils.ts` (lib e para configs de libs) |
| `const mockData = [...]` | `const MOCK_DATA = [...]` |
| `isFirstInSection: boolean` (obrigatoria) | `isFirstInSection?: boolean` (opcional com default) |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-continuando-o-appointment-card/references/deep-explanation.md) — O instrutor faz uma distincao clara entre as duas pastas:
- [code-examples.md](../../../data/skills/next-js/rs-next-js-continuando-o-appointment-card/references/code-examples.md) — // app/page.tsx
