---
name: rs-testes-arq-frontend-setup-design-system
description: "Applies shadcn/ui (chat.cn) design system setup workflow in Next.js projects. Use when user asks to 'setup shadcn', 'add design system', 'configure ui components', 'install shadcn ui', or 'setup component library'. Follows folder organization pattern with styles/ directory and progressive component installation. Make sure to use this skill whenever initializing shadcn/ui in a Next.js project. Not for custom component creation from scratch, Tailwind-only setups, or non-Next.js frameworks."
---

# Setup Design System (shadcn/ui)

> Configurar shadcn/ui em projetos Next.js seguindo organizacao de pastas e instalacao progressiva de componentes.

## Prerequisites

- Projeto Next.js inicializado
- Node.js 18+
- Package manager (npm/pnpm/bun)

## Steps

### Step 1: Inicializar shadcn/ui

```bash
npx shadcn@latest init
```

Opcoes recomendadas:
- Style: **neutral** (base neutra, customizar depois)
- Aceitar dependencias e global CSS

### Step 2: Organizar CSS global

Criar pasta `styles/` e mover o CSS global para la, porque mantem separacao clara entre estilos e componentes.

```bash
mkdir -p src/styles
mv src/app/globals.css src/styles/global.css
```

### Step 3: Atualizar import no layout

```typescript
// src/app/layout.tsx
import '@/styles/global.css'
```

### Step 4: Atualizar tailwind.config (se necessario)

Verificar que o path do CSS em `tailwind.config.ts` aponta para `src/styles/global.css`.

### Step 5: Instalar componentes sob demanda

```bash
# Instalar apenas quando precisar
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Componentes ficam em `src/components/ui/`.

## Output format

```
src/
├── styles/
│   └── global.css          # CSS global movido para ca
├── components/
│   └── ui/
│       ├── button.tsx       # Componentes shadcn
│       ├── card.tsx
│       └── input.tsx
├── app/
│   └── layout.tsx           # Import atualizado
└── lib/
    └── utils.ts             # cn() utility (auto-gerado)
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa de novo componente UI | `npx shadcn@latest add {componente}` — nunca criar do zero |
| Estilos default nao atendem | Customizar variaveis CSS no global.css, nao editar componentes diretamente |
| Linter reclamando de aspas/semicolons | Salvar arquivo para aplicar config do projeto (prettier/eslint) |
| Icones necessarios | Instalar `lucide-react` — e o icon set padrao do shadcn |

## Error handling

- Se import do CSS quebrar: verificar path relativo em `layout.tsx` — deve ser `@/styles/global.css`
- Se componentes nao renderizam: verificar se `tailwind.config` inclui `./src/components/**/*.tsx` no content
- Se estilos nao aplicam: verificar se `global.css` esta sendo importado no root layout

## Verification

- Rodar `npm run dev` e verificar que a pagina carrega sem erros
- Importar um `<Button>` em qualquer pagina e confirmar que renderiza com estilos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
