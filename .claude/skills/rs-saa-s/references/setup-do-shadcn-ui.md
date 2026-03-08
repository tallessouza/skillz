---
name: rs-saas-nextjs-rbac-setup-shadcn-ui
description: "Applies shadcn/ui setup and component installation workflow in Next.js projects. Use when user asks to 'setup shadcn', 'add UI components', 'install shadcn/ui', 'configure component library', or 'setup design system in Next.js'. Follows correct init sequence, theme configuration, and component installation patterns. Make sure to use this skill whenever setting up shadcn/ui from scratch or adding new shadcn components. Not for custom CSS styling, Tailwind config from scratch, or non-shadcn component libraries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: setup
  tags: [saas, nextjs, ui, tailwind]
---

# Setup do shadcn/ui

> Configurar shadcn/ui seguindo a sequencia correta: init, tema, instalar componentes, formatar arquivos.

## Prerequisites

- Next.js projeto ja criado com Tailwind CSS
- Package manager definido (pnpm recomendado)
- ESLint/Prettier configurado no projeto

## Steps

### Step 1: Inicializar shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

Opcoes recomendadas:
- Style: **Default** (New York deixa componentes menores)
- Base color: **Zinc** (monocromatico, visual limpo)
- CSS variables: **Sim**

### Step 2: Verificar variaveis CSS geradas

O init configura `src/app/globals.css` com variaveis CSS para tema Light e Dark automaticamente. Verificar e re-indentar se necessario — o init pode gerar indentacao inconsistente.

### Step 3: Configurar tema Dark como padrao (durante dev)

```tsx
// src/app/layout.tsx
<html className="dark">
```

Manter classe `dark` no HTML enquanto nao houver toggle de tema implementado, para evitar codar com tema claro.

### Step 4: Instalar componentes necessarios

Instalar multiplos componentes em um unico comando:

```bash
pnpm dlx shadcn@latest add alert button input label separator
```

Componentes sao criados em `src/components/ui/`.

### Step 5: Formatar arquivos gerados

shadcn/ui nao formata os arquivos conforme ESLint/Prettier do projeto. Abrir cada arquivo gerado e salvar para o formatter entrar em acao:

- `src/lib/utils.ts`
- `src/components/ui/alert.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/separator.tsx`

### Step 6: Resolver dependencias

```bash
pnpm install
```

Se o TypeScript server mostrar erros de dependencia, reiniciar o TS server antes de investigar — frequentemente e apenas um bug de cache.

### Step 7: Verificar funcionamento

```tsx
import { Button } from '@/components/ui/button'

export default function Page() {
  return <Button>Sign In</Button>
}
```

## Output format

```
src/
├── app/
│   └── globals.css          # Variaveis CSS light/dark
├── components/
│   └── ui/
│       ├── alert.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── separator.tsx
└── lib/
    └── utils.ts             # cn() helper
```

## Error handling

- Se dependencias nao encontradas apos init: rodar `pnpm install` e reiniciar TS server
- Se componentes com `forwardRef` (React < 19): nao remover — funciona normalmente, e apenas codigo legado que sera simplificado no React 19

## Verification

- Rodar `pnpm run dev` e verificar que a pagina carrega sem erros
- Renderizar um `<Button>` e confirmar que o estilo shadcn/ui esta aplicado
- Verificar que ambos os temas (light/dark) funcionam alternando a classe no HTML

## Troubleshooting

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
