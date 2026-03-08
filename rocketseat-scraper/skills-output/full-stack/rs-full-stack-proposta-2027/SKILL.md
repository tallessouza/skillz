---
name: rs-full-stack-proposta-2027
description: "Applies CSS styling fundamentals in React applications when integrating stylesheets with components, choosing styling approaches, or structuring CSS for React projects. Use when user asks to 'style a component', 'add CSS to React', 'create styled layout', or 'integrate CSS with JSX'. Make sure to use this skill whenever starting CSS work in a React project or deciding on a styling strategy. Not for advanced CSS frameworks like Tailwind, CSS-in-JS libraries, or complex animation systems."
---

# Estilização CSS no React — Fundamentos

> Domine os fundamentos de CSS no React antes de avançar para abstrações e frameworks de estilização.

## Conceito central

CSS no React segue uma abordagem incremental: primeiro entenda como conectar CSS aos componentes, depois evolua para padrões mais sofisticados. O foco inicial é construir uma base sólida nos fundamentos de estilização, não criar interfaces complexas.

## Framework de decisão

| Situação | Abordagem |
|----------|-----------|
| Primeiro contato com CSS no React | Comece com CSS puro importado nos componentes |
| Estilos compartilhados entre componentes | CSS global ou arquivos CSS dedicados por escopo |
| Estilos específicos de um componente | CSS Modules ou estilos inline via `style` prop |
| Projeto já tem padrão definido | Siga o padrão existente, não misture abordagens |

## Como pensar estilização no React

### Progressão de aprendizado

1. **Fundamentos primeiro** — entenda como importar e aplicar CSS em componentes JSX
2. **Componentização + estilo** — cada componente pode ter seu próprio CSS
3. **Projeto prático** — consolide os fundamentos aplicando em uma aplicação real

### CSS acompanha componentes

No React, a estilização está diretamente ligada à estrutura de componentes. Diferente de HTML tradicional onde CSS é global por padrão, no React cada componente pode encapsular seus próprios estilos, reforçando a separação de responsabilidades.

## Pilares para estilização sólida

| Pilar | Descrição |
|-------|-----------|
| Componentes | Estrutura visual encapsulada e reutilizável |
| JSX | Sintaxe que conecta markup e lógica, incluindo referências a estilos |
| CSS | Camada visual que dá forma aos componentes |

## Equívocos comuns

| Pessoas pensam | Realidade |
|---------------|-----------|
| Preciso de uma lib de CSS para usar React | CSS puro funciona perfeitamente com React |
| Devo criar interfaces complexas desde o início | Fundamentos sólidos primeiro, complexidade depois |
| Estilização no React é completamente diferente | Os mesmos conceitos de CSS se aplicam, apenas a forma de conectar muda |

## Quando aplicar

- Ao iniciar qualquer projeto React que precise de estilização visual
- Ao ensinar ou revisar fundamentos de CSS no contexto React
- Antes de adotar frameworks como Tailwind ou styled-components, garanta domínio dos fundamentos

## Limitações

- Esta skill cobre fundamentos — para CSS Modules, consulte skills específicas de CSS Modules
- Para Tailwind CSS, consulte `rs-masterizando`
- Para interfaces complexas com design system, consulte skills de componentes avançados

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre a abordagem incremental de CSS no React
- [code-examples.md](references/code-examples.md) — Exemplos práticos de integração CSS com componentes React