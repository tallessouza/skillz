---
name: rs-next-js-instalacao-shadcn-ui
description: "Guides shadcn/ui installation and configuration in Next.js projects. Use when user asks to 'install shadcn', 'add shadcn ui', 'setup shadcn', 'configure component library', or 'add ui components to next.js'. Covers init setup, component installation, and usage patterns with Tailwind CSS and Radix primitives. Make sure to use this skill whenever setting up shadcn/ui in any Next.js project. Not for custom component creation from scratch, Tailwind-only setup, or Material UI/Chakra UI libraries."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: instalacao
  tags: [shadcn-ui, radix, tailwind, component-library, next-js, cn-utility]
---

# Instalacao e Configuracao do shadcn/ui no Next.js

> Instalar shadcn/ui como biblioteca de componentes copiados (nao importados) integrada com Tailwind CSS e Radix UI.

## Prerequisites

- Next.js project configurado
- Tailwind CSS instalado
- Package manager: pnpm, npm, yarn ou bun

## Steps

### Step 1: Inicializar shadcn/ui

```bash
pnpm dlx shadcn-ui@latest init
```

Respostas recomendadas durante o init:
- Style: **default**
- Base color: **gray**
- CSS variables: **yes**
- Force: **yes**

O init cria:
- `lib/utils.ts` com helper `cn()` para merge de classes
- `components.json` com configuracao do projeto
- Variaveis CSS no `globals.css`

### Step 2: Instalar componentes individuais

```bash
pnpm dlx shadcn-ui@latest add button
```

Cada componente instalado:
1. Cria arquivo em `src/components/ui/{component}.tsx`
2. Instala dependencias do Radix se necessario
3. Codigo fica 100% no projeto (editavel)

### Step 3: Usar o componente

```tsx
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <Button variant="secondary" onClick={() => console.log("clicked")}>
      Click me
    </Button>
  )
}
```

## Output format

Apos instalacao, a estrutura sera:

```
src/
├── components/
│   └── ui/
│       └── button.tsx    # Componente copiado, editavel
├── lib/
│   └── utils.ts          # Helper cn()
└── app/
    └── globals.css        # Variaveis CSS do tema
components.json            # Config do shadcn
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa de botao, dialog, alert | `pnpm dlx shadcn-ui@latest add {component}` |
| Quer customizar variante | Edite direto o arquivo em `components/ui/` |
| React 19 com refs | Refs sao props comuns, nao precisa de forwardRef |
| Quer ver exemplo de uso | Documentacao do shadcn tem exemplos abaixo de cada componente |

## Error handling

- Se init falhar: verificar que Tailwind esta configurado corretamente
- Se componente nao renderiza: verificar import paths no `tsconfig.json` (alias `@/`)
- Se estilos quebrados: verificar que `globals.css` foi atualizado com variaveis CSS

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-instalacao-shadcn-ui/references/deep-explanation.md) — O instrutor destaca que shadcn/ui e "sensacional" por uma razao especifica: voce nao importa compone
- [code-examples.md](../../../data/skills/next-js/rs-next-js-instalacao-shadcn-ui/references/code-examples.md) — pnpm dlx shadcn-ui@latest init
