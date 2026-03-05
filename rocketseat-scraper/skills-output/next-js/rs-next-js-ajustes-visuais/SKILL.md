---
name: rs-next-js-ajustes-visuais
description: "Applies visual polish patterns for Next.js components using Tailwind CSS grid/spacing utilities. Use when user asks to 'fix layout', 'align components', 'adjust spacing', 'polish UI', 'clean up card layout', or 'setup Prisma client'. Enforces responsive grid alignment, margin/padding discipline, and clean component structure. Make sure to use this skill whenever refining Tailwind layouts or initializing Prisma in Next.js. Not for design system creation, complex animations, or database schema design."
---

# Ajustes Visuais — Next.js + Tailwind

> Polir layout e espaçamento com Tailwind exige disciplina: cada classe utilitaria deve ter proposito claro, responsividade explicita, e alinhamento com o design original.

## Rules

1. **Use margin direcional, nunca margin generico** — `mb-8` nao `m-8`, porque margin generico aplica nos 4 lados e desalinha elementos adjacentes
2. **Responsividade explicita com breakpoints** — `mt-1 md:mt-0` nao apenas `mt-1`, porque mobile e desktop tem necessidades diferentes de espacamento
3. **Col span responsivo** — `col-span-2 md:col-span-1` para elementos que ocupam largura total no mobile mas dividem espaco no desktop
4. **Remova informacao que nao esta no design** — se o Figma nao mostra, remova do componente, porque informacao extra polui a interface sem agregar valor
5. **Espacamento consistente entre secoes** — defina um valor padrao (ex: `mb-8`) e mantenha em toda a pagina, porque inconsistencia visual e percebida mesmo inconscientemente
6. **Prisma client como singleton exportado** — crie em `lib/prisma.ts` e exporte, nunca instancie inline no componente

## How to write

### Ajuste de grid com responsividade

```typescript
// Card com colunas responsivas
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="col-span-2 md:col-span-1">
    {/* Conteudo que ocupa full width no mobile */}
  </div>
  <div className="pr-4 md:pr-0">
    {/* Padding condicional por breakpoint */}
  </div>
</div>
```

### Margin direcional vs generico

```typescript
// Espacamento entre secoes da pagina
<section className="mb-8">  {/* Apenas embaixo */}
  <h2>Appointments</h2>
</section>
<section className="mb-8">
  <AppointmentCard />
</section>
```

### Prisma client singleton

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

### Uso em Server Component

```typescript
// app/page.tsx
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const appointments = await prisma.appointment.findMany()
  return <AppointmentList appointments={appointments} />
}
```

## Example

**Before (layout quebrado):**
```tsx
<div className="m-4">  {/* margin nos 4 lados - desalinha */}
  <div className="text-left">
    <p className="text-sm">{appointment.time}</p>  {/* info desnecessaria */}
    <p className="text-sm">{appointment.patient}</p>  {/* nao esta no Figma */}
  </div>
  <div>{appointment.description}</div>
</div>
```

**After (layout polido):**
```tsx
<div className="mb-8">  {/* apenas margin bottom */}
  <div className="col-span-2 md:col-span-1 text-left">
    <p className="text-sm">{appointment.description}</p>
  </div>
  <div className="mt-1 md:mt-0 pr-4">
    {/* Espaco reservado para botoes de edicao/remocao */}
  </div>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento colado no anterior | Adicione `mb-{n}` no elemento de cima, confira valor no Figma |
| Card quebrando layout no mobile | Use `col-span-2 md:col-span-1` para responsividade |
| Info no componente que nao esta no design | Remova — menos e mais em cards |
| Espacamento entre secoes inconsistente | Padronize um valor (ex: `mb-8`) para toda a pagina |
| Prisma usado em multiplos arquivos | Singleton em `lib/prisma.ts`, importe onde precisar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `m-4` (margin generico) | `mb-4` (direcional) |
| `mt-1` sem breakpoint quando layout muda | `mt-1 md:mt-0` |
| `new PrismaClient()` inline no componente | `import { prisma } from '@/lib/prisma'` |
| Info extra "porque pode ser util" | Apenas o que o design especifica |
| Espacamentos ad-hoc por secao | Valor padrao consistente (`mb-8`) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
