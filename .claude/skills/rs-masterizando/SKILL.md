---
name: rs-masterizando
description: "Enforces Tailwind CSS best practices when styling components, building responsive layouts, implementing dark mode, creating design system variants, or animating UI elements. Make sure to use this skill whenever writing Tailwind utility classes, configuring themes, composing reusable UI components with Radix UI, applying responsive breakpoints, or building sidebar/form layouts. Not for backend logic, API routes, or non-Tailwind styling approaches."
---

# Tailwind CSS — Decision Tree Router

> Siga a árvore de decisão para chegar na skill certa. 37 skills organizadas em 8 domínios.

## Decision Tree

```
O que você está fazendo com Tailwind?
│
├─ Setup / fundamentos?
│  ├─ Criando projeto → [o-tailwind-criando-projeto-com-tailwind.md](references/o-tailwind-criando-projeto-com-tailwind.md)
│  ├─ Fundamentos → [o-tailwind-fundamentos-do-tailwind.md](references/o-tailwind-fundamentos-do-tailwind.md)
│  ├─ Theme First API → [o-tailwind-theme-first-api-do-tailwind.md](references/o-tailwind-theme-first-api-do-tailwind.md)
│  ├─ Seletores e estados → [o-tailwind-seletores-e-estados.md](references/o-tailwind-seletores-e-estados.md)
│  └─ Valores arbitrários → [o-tailwind-valores-arbitrarios.md](references/o-tailwind-valores-arbitrarios.md)
│
├─ Layout / formulários?
│  ├─ Estrutura do layout → [o-tailwind-estrutura-do-layout.md](references/o-tailwind-estrutura-do-layout.md)
│  ├─ Estrutura de formulário → [o-tailwind-estrutura-do-formulario-1.md](references/o-tailwind-estrutura-do-formulario-1.md)
│  ├─ Campos grid → [o-tailwind-campos-do-formulario.md](references/o-tailwind-campos-do-formulario.md)
│  └─ Textarea com toolbar → [o-tailwind-input-de-biografia.md](references/o-tailwind-input-de-biografia.md)
│
├─ Sidebar / navegação?
│  ├─ Menu de navegação → [o-tailwind-menu-de-navegacao.md](references/o-tailwind-menu-de-navegacao.md)
│  ├─ Sidebar collapsible (Radix) → [o-tailwind-abertura-da-sidebar.md](references/o-tailwind-abertura-da-sidebar.md)
│  ├─ Logo + busca → [o-tailwind-logo-e-input-de-busca.md](references/o-tailwind-logo-e-input-de-busca.md)
│  └─ Responsividade sidebar → [o-tailwind-responsividade-da-sidebar.md](references/o-tailwind-responsividade-da-sidebar.md)
│
├─ Componentes / composition?
│  ├─ Pattern de composição → [o-tailwind-pattern-de-composicao.md](references/o-tailwind-pattern-de-composicao.md)
│  ├─ File input componentizado → [o-tailwind-componentizando-file-input.md](references/o-tailwind-componentizando-file-input.md)
│  ├─ Select com Radix → [o-tailwind-criando-select-de-pais.md](references/o-tailwind-criando-select-de-pais.md)
│  └─ Tabs com Radix → [o-tailwind-criando-abas-com-radix-tabs.md](references/o-tailwind-criando-abas-com-radix-tabs.md)
│
├─ Variantes / design system?
│  ├─ Tailwind Variants → [o-tailwind-variantes-de-botoes.md](references/o-tailwind-variantes-de-botoes.md)
│  ├─ Slots API → [o-tailwind-variantes-com-slots.md](references/o-tailwind-variantes-com-slots.md)
│  ├─ Ghost variant → [o-tailwind-variante-ghost-dos-botoes.md](references/o-tailwind-variante-ghost-dos-botoes.md)
│  └─ Focus effects → [o-tailwind-criando-efeitos-de-foco.md](references/o-tailwind-criando-efeitos-de-foco.md)
│
├─ Dark mode?
│  ├─ Dark mode setup → [o-tailwind-dark-mode-no-tailwind.md](references/o-tailwind-dark-mode-no-tailwind.md)
│  ├─ Tema dark sidebar → [o-tailwind-tema-dark-da-sidebar.md](references/o-tailwind-tema-dark-da-sidebar.md)
│  └─ Theme switcher → [o-tailwind-theme-switcher.md](references/o-tailwind-theme-switcher.md)
│
├─ Responsividade?
│  ├─ Breakpoints → [o-tailwind-responsividade-e-breakpoints.md](references/o-tailwind-responsividade-e-breakpoints.md)
│  ├─ Formulários responsivos → [o-tailwind-responsividade-do-formulario.md](references/o-tailwind-responsividade-do-formulario.md)
│  └─ Abas com scroll → [o-tailwind-responsividade-das-abas.md](references/o-tailwind-responsividade-das-abas.md)
│
└─ Animações?
   ├─ Framer Motion (abas) → [o-tailwind-animacao-das-abas.md](references/o-tailwind-animacao-das-abas.md)
   ├─ Animação de selects → [o-tailwind-animando-abertura-dos-selects.md](references/o-tailwind-animando-abertura-dos-selects.md)
   └─ AutoAnimate → [o-tailwind-animando-portfolio.md](references/o-tailwind-animando-portfolio.md)
```

## Roteamento pelo orquestrador

Quando chamado pelo `rs-implementation-workflow`:
- **Fase 3 (Implementação)** → Siga o ramo relevante por tipo de UI
