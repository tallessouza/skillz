---
name: rs-next-js-iniciando-nosso-system-design
description: "Applies shadcn/ui setup and design system foundation patterns when configuring a Next.js project with component libraries. Use when user asks to 'setup shadcn', 'configure design system', 'install component library', 'setup ui components in next.js', or 'create style guide'. Ensures correct initialization, global styles extraction from Figma, and project structure with styles folder. Make sure to use this skill whenever setting up shadcn/ui or establishing a design system foundation in Next.js projects. Not for individual component customization, Tailwind config from scratch, or non-Next.js projects."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: design-system-setup
  tags: [shadcn-ui, design-system, next-js, tailwind, figma, css-variables, component-library]
---

# Design System com shadcn/ui no Next.js

> Configure shadcn/ui como fundacao do design system, extraindo estilos do Figma para CSS variables e organizando a estrutura de estilos do projeto.

## Prerequisites

- Next.js project com App Router configurado
- pnpm (ou npm/yarn) disponivel
- Figma com style guide definido (cores, tipografia)

## Steps

### Step 1: Inicializar shadcn/ui

```bash
pnpx shadcn@latest init
```

Selecionar style "neutral" (ou conforme preferencia). Isso cria `lib/utils.ts` e configura o projeto.

### Step 2: Instalar componentes base

```bash
pnpx shadcn@latest add button
```

Instalar componentes conforme necessidade — nao instalar tudo de uma vez, porque muitas variacoes nao serao usadas e precisam ser limpas depois.

### Step 3: Organizar estrutura de estilos

```
src/
├── styles/
│   └── globals.css    # Extraido do Figma — CSS variables para cores, tipografia
├── app/
│   └── layout.tsx     # Importa de @/styles/globals.css
```

Mover `globals.css` de `app/` para `src/styles/` e atualizar o import no layout:

```typescript
// src/app/layout.tsx
import "@/styles/globals.css"
```

### Step 4: Configurar globals.css com design tokens do Figma

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 40% 98%;
    /* ... demais tokens extraidos do Figma */
  }
}
```

### Step 5: Verificar funcionamento

```bash
pnpm dev
```

Testar aplicando uma classe do design system (ex: `text-accent-blue`) para confirmar que os estilos estao sendo puxados corretamente.

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente shadcn tem variacoes demais | Limpe as variacoes nao utilizadas no projeto |
| Precisa de novo componente UI | `pnpx shadcn@latest add {componente}` — instale sob demanda |
| Figma tem style guide pronto | Extraia CSS variables e coloque em globals.css |
| globals.css esta em app/ | Mova para src/styles/ para melhor organizacao |
| Componente precisa de customizacao visual | Edite o componente gerado em components/ui/ — shadcn e copy-paste, nao lib |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar todos componentes shadcn de uma vez | Instalar sob demanda conforme necessidade |
| Manter variacoes de componente nao utilizadas | Limpar o componente, mantendo so o necessario |
| Deixar globals.css dentro de app/ | Mover para src/styles/ com pasta dedicada |
| Recriar botoes/inputs do zero | Usar shadcn como base e customizar |
| Hardcodar cores diretamente nos componentes | Usar CSS variables do design system |

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

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-iniciando-nosso-system-design/references/deep-explanation.md) — O instrutor posiciona shadcn/ui nao como uma biblioteca de componentes comum, mas como a **fundacao 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-iniciando-nosso-system-design/references/code-examples.md) — pnpx shadcn@latest init
