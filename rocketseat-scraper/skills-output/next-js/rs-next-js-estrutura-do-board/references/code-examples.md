# Code Examples: Estrutura do Board

## 1. Configuracao de cores customizadas no CSS

```css
/* app/globals.css */
@theme {
  --color-navy-50: #f0f2f5;
  --color-navy-200: #9ba3b0;
  --color-navy-500: #3a4250;
  --color-navy-700: #252a33;
  --color-navy-800: #1e2229;
  --color-navy-950: #13161b;
}
```

Uso no Tailwind: `bg-navy-950`, `text-navy-50`, `border-navy-500`, etc.

## 2. Configuracao da fonte Inter no layout

```typescript
// app/layout.tsx
import { Inter } from "next/font/google"

const interFont = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${interFont.className} bg-navy-950 text-navy-50 antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

Pontos-chave:
- `Inter` importado de `next/font/google` (otimizacao automatica do Next.js)
- `subsets: ["latin"]` — carrega apenas caracteres necessarios
- `antialiased` — suaviza renderizacao da fonte

## 3. Estrutura completa da pagina do board

```typescript
// app/page.tsx
import { ArchiveIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="max-w-[1620px] w-full mx-auto p-10 flex flex-col gap-8 h-dvh">
      {/* Header */}
      <div>
        {/* Header content vai aqui */}
      </div>

      {/* Board */}
      <main className="grid grid-cols-4 gap-5 flex-1 items-stretch">
        {/* Coluna 1: Backlog */}
        <div className="bg-navy-800 rounded-xl border-[0.5px] border-navy-500 pt-3 flex flex-col gap-1">
          {/* Header da coluna */}
          <div className="flex items-center justify-between px-3">
            <span className="bg-navy-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <ArchiveIcon className="size-3" />
              Backlog
            </span>
            <span className="text-xs text-navy-200">4</span>
          </div>

          {/* Content - Cards */}
          <div className="flex flex-col gap-3 overflow-y-scroll p-3">
            <div>Card 1</div>
            <div>Card 2</div>
            <div>Card 3</div>
          </div>
        </div>

        {/* Coluna 2: To Do */}
        <div className="bg-navy-800 rounded-xl border-[0.5px] border-navy-500 pt-3 flex flex-col gap-1">
          {/* Mesma estrutura */}
        </div>

        {/* Coluna 3: In Progress */}
        <div className="bg-navy-800 rounded-xl border-[0.5px] border-navy-500 pt-3 flex flex-col gap-1">
          {/* Mesma estrutura */}
        </div>

        {/* Coluna 4: Done */}
        <div className="bg-navy-800 rounded-xl border-[0.5px] border-navy-500 pt-3 flex flex-col gap-1">
          {/* Mesma estrutura */}
        </div>
      </main>
    </div>
  )
}
```

## 4. Instalacao do Lucide React para icones

```bash
npm install lucide-react
```

```typescript
import { ArchiveIcon } from "lucide-react"

// Uso com classe size-3 para icones pequenos
<ArchiveIcon className="size-3" />
```

## 5. Anatomia do header da coluna

```typescript
{/* Container do header */}
<div className="flex items-center justify-between px-3">
  {/* Lado esquerdo: titulo com icone */}
  <span className="bg-navy-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
    <ArchiveIcon className="size-3" />
    Backlog
  </span>

  {/* Lado direito: contador */}
  <span className="text-xs text-navy-200">4</span>
</div>
```

Detalhes:
- `justify-between` — titulo na esquerda, contador na direita
- `bg-navy-700` no titulo — destaque sutil sobre o `bg-navy-800` da coluna
- `text-navy-200` no contador — cor mais clara para hierarquia visual
- `size-3` no icone — proporcional ao `text-xs`

## 6. Container principal — por que cada classe

```typescript
<div className="max-w-[1620px] w-full mx-auto p-10 flex flex-col gap-8 h-dvh">
```

| Classe | Funcao |
|--------|--------|
| `max-w-[1620px]` | Largura maxima para monitores grandes |
| `w-full` | Ocupa 100% ate o max-width |
| `mx-auto` | Centraliza horizontalmente |
| `p-10` | Padding generoso nas laterais e topo |
| `flex flex-col` | Layout vertical (header em cima, board embaixo) |
| `gap-8` | Espacamento entre header e board |
| `h-dvh` | Altura total do viewport dinamico |