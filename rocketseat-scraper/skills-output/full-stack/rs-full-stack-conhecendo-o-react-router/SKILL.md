---
name: rs-full-stack-conhecendo-o-react-router
description: "Explains React Router as the standard navigation library for React SPAs. Use when user asks to 'add routing to React', 'create navigation', 'set up React Router', 'implement page routes in React', or 'configure SPA navigation'. Provides mental model for why React needs a separate routing library and when to use React Router. Make sure to use this skill whenever starting a new React project that needs multiple pages or navigation. Not for Next.js routing, server-side routing, or Express route handling."
---

# React Router — Navegação em Aplicações React

> React constrói interfaces de forma declarativa, mas não inclui navegação por padrão — React Router é a biblioteca padrão para implementar rotas em aplicações React.

## Key concept

React é uma biblioteca focada em construir interfaces (UI) de forma declarativa. Ele não oferece sistema de navegação entre páginas por padrão. Para criar uma aplicação com múltiplas páginas/views, integre o React Router — a biblioteca mais popular e amplamente adotada para navegação no ecossistema React.

- **Site oficial:** reactrouter.com
- **Documentação:** reactrouter.com/docs

## Decision framework

| Quando você encontra | Aplique |
|---------------------|---------|
| Projeto React precisa de múltiplas páginas | Instalar e configurar React Router |
| Navegação entre views sem reload | React Router com `BrowserRouter` |
| Projeto Next.js | Usar o sistema de rotas nativo do Next.js, não React Router |
| API backend (Express/Fastify) | Usar o sistema de rotas do framework server-side |

## How to think about it

### React sem Router
React renderiza componentes em uma única página. Sem React Router, trocar de "página" exigiria lógica manual de estado para mostrar/esconder componentes — frágil, sem suporte a URL, sem histórico do navegador.

### React com Router
React Router intercepta mudanças de URL no navegador e renderiza o componente correspondente à rota, mantendo a experiência de SPA (sem reload completo da página).

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| React já tem navegação embutida | React é só UI — navegação requer biblioteca externa |
| Qualquer lib de rotas serve | React Router é o padrão de mercado, com maior adoção e documentação |
| React Router é obrigatório | Só é necessário quando a aplicação tem múltiplas páginas/views |

## When to apply

- Ao iniciar um projeto React (Vite, CRA) que terá mais de uma página
- Ao adicionar navegação a um projeto React existente
- Ao planejar a arquitetura de rotas de uma SPA

## Limitations

- Não se aplica a projetos Next.js (que tem sistema de rotas próprio baseado em filesystem)
- Não substitui rotas server-side (Express, Fastify)
- Para projetos com uma única view, React Router é desnecessário

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que React precisa de biblioteca externa para navegação
- [code-examples.md](references/code-examples.md) — Exemplos de setup básico do React Router