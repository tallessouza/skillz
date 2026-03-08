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
│  ├─ ESLint + Prettier → [o-tailwind-configurando-es-lint-e-prettier.md](references/o-tailwind-configurando-es-lint-e-prettier.md)
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
│  ├─ Perfil do usuário → [o-tailwind-perfil-do-usuario.md](references/o-tailwind-perfil-do-usuario.md)
│  ├─ Widget de espaço usado → [o-tailwind-widget-de-espaco-usado.md](references/o-tailwind-widget-de-espaco-usado.md)
│  └─ Responsividade sidebar → [o-tailwind-responsividade-da-sidebar.md](references/o-tailwind-responsividade-da-sidebar.md)
│
├─ Componentes / composition?
│  ├─ Pattern de composição → [o-tailwind-pattern-de-composicao.md](references/o-tailwind-pattern-de-composicao.md)
│  ├─ File input componentizado → [o-tailwind-componentizando-file-input.md](references/o-tailwind-componentizando-file-input.md)
│  ├─ Context + preview imagem → [o-tailwind-context-e-preview-da-imagem.md](references/o-tailwind-context-e-preview-da-imagem.md)
│  ├─ Listagem de arquivos → [o-tailwind-listagem-de-arquivos.md](references/o-tailwind-listagem-de-arquivos.md)
│  ├─ File item multi-estado → [o-tailwind-criando-componente-file-item.md](references/o-tailwind-criando-componente-file-item.md)
│  ├─ Select com Radix → [o-tailwind-criando-select-de-pais.md](references/o-tailwind-criando-select-de-pais.md)
│  ├─ Componentizando select → [o-tailwind-componentizando-o-select.md](references/o-tailwind-componentizando-o-select.md)
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

## Cross-References — Decision Coverage

Quando este router nao cobre uma decisao, delegue para:

| Decisao | Delegue para | Motivo |
|---------|-------------|--------|
| D1_FRAMEWORK_WEB (Next.js) | [rs-next-js](../rs-next-js/SKILL.md) | Next.js App Router |
| D3_STATE (Redux/Zustand) | [rs-redux-zustand](../rs-redux-zustand/SKILL.md) | State management |
| D3_TESTING (componentes) | [rs-testes-e](../rs-testes-e/SKILL.md) | Testes de componentes |
| D3_AUTH (JWT/OAuth) | [rs-seguranca-para](../rs-seguranca-para/SKILL.md) | Auth |
