---
name: rs-next-js-estrutura-do-board
description: "Applies board layout structure patterns when building Kanban-style interfaces with Next.js and Tailwind CSS. Use when user asks to 'create a board', 'build a kanban', 'layout columns', 'task board', or 'grid layout with columns'. Enforces grid-based column layout, dynamic viewport height, custom color theming, proper font loading, and card container patterns. Make sure to use this skill whenever building multi-column board UIs in Next.js projects. Not for API routes, database schemas, or drag-and-drop logic."
---

# Estrutura do Board

> Construa boards Kanban com grid de colunas fixas, viewport dinamico e hierarquia visual clara usando Tailwind CSS.

## Rules

1. **Use grid com colunas fixas para o board** — `grid grid-cols-4` para boards com backlog/todo/in-progress/done, porque cada status precisa de uma coluna dedicada visualmente equivalente
2. **Use dvh ao inves de screen/vh** — `h-dvh` (Dynamic Viewport Height) exclui toolbar e barra de endereco do calculo, funcionando melhor em mobile
3. **Defina cores customizadas no CSS com @theme** — nao hardcode valores hex no JSX, porque centraliza a paleta e permite reutilizacao consistente
4. **Use border de 0.5px para bordas sutis** — `border-[0.5px]` cria efeito de sombra sutil ao inves de borda pesada, elevando o design
5. **Carregue apenas subsets necessarios da fonte** — `subsets: ["latin"]` evita peso desnecessario carregando apenas os caracteres utilizados
6. **Colunas com items-stretch** — garante que todas as colunas ocupem a altura total mesmo com poucos cards

## How to write

### Layout raiz do board
```typescript
// page.tsx - Estrutura principal
<div className="max-w-[1620px] w-full mx-auto p-10 flex flex-col gap-8 h-dvh">
  <div>{/* Header */}</div>
  <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
    {/* Colunas */}
  </main>
</div>
```

### Coluna do board
```typescript
<div className="bg-navy-800 rounded-xl border-[0.5px] border-navy-500 pt-3 flex flex-col gap-1">
  {/* Header da coluna */}
  <div className="flex items-center justify-between px-3">
    <span className="bg-navy-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
      <ArchiveIcon className="size-3" />
      Backlog
    </span>
    <span className="text-xs text-navy-200">4</span>
  </div>
  {/* Cards container */}
  <div className="flex flex-col gap-3 overflow-y-scroll p-3">
    {/* Cards aqui */}
  </div>
</div>
```

### Configuracao de cores e fonte
```typescript
// app/globals.css
@theme {
  --color-navy-50: #f0f2f5;
  --color-navy-200: #9ba3b0;
  --color-navy-500: #3a4250;
  --color-navy-700: #252a33;
  --color-navy-800: #1e2229;
  --color-navy-950: #13161b;
}

// app/layout.tsx
import { Inter } from "next/font/google"
const interFont = Inter({ subsets: ["latin"] })

<html>
  <body className={`${interFont.className} bg-navy-950 text-navy-50 antialiased`}>
```

## Example

**Before (sem estrutura):**
```typescript
export default function Home() {
  return <div>Hello World</div>
}
```

**After (com estrutura do board):**
```typescript
export default function Home() {
  return (
    <div className="max-w-[1620px] w-full mx-auto p-10 flex flex-col gap-8 h-dvh">
      <div>{/* Header */}</div>
      <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
        <div className="bg-navy-800 rounded-xl border-[0.5px] border-navy-500 pt-3 flex flex-col gap-1">
          <div className="flex items-center justify-between px-3">
            <span className="bg-navy-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <ArchiveIcon className="size-3" />
              Backlog
            </span>
            <span className="text-xs text-navy-200">4</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-scroll p-3">
            {/* Cards */}
          </div>
        </div>
        {/* Repetir para Todo, In Progress, Done */}
      </main>
    </div>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Board nao responsivo | Aceitar — foco desktop first, responsivo depois |
| Muitos cards na coluna | `overflow-y-scroll` no container de cards |
| Altura inconsistente entre colunas | `items-stretch` no grid pai |
| Bordas parecendo pesadas | `border-[0.5px]` para efeito sutil |
| Fonte padrao feia | Inter com `antialiased` no body |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `h-screen` | `h-dvh` (Dynamic Viewport Height) |
| `border` (1px default) | `border-[0.5px]` para sutileza |
| Hex colors inline no JSX | `@theme` colors no CSS |
| `Inter({ subsets: ["latin", "cyrillic", ...] })` | `Inter({ subsets: ["latin"] })` somente o necessario |
| Tudo num arquivo so sem componentes | Extrair header, coluna e card em componentes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
