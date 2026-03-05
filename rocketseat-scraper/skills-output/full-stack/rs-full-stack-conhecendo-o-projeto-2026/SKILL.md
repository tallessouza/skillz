---
name: rs-full-stack-conhecendo-o-projeto-2026
description: "Applies CSS animation and transition patterns when building landing pages with scroll animations, hover transitions, and entrance effects. Use when user asks to 'animate on scroll', 'add hover transition', 'create entrance animation', 'build an animated landing page', or 'CSS keyframes for LP'. Make sure to use this skill whenever implementing CSS animations on landing pages or product showcase sites. Not for JavaScript animation libraries, React motion, or SVG animations."
---

# CSS Animations & Transitions — Projeto LP de Patins

> Ao construir landing pages animadas, separar claramente tres categorias de movimento: animacoes de entrada, transicoes de hover, e animacoes de scroll.

## Rules

1. **Separe animacoes por tipo de trigger** — entrada (on load), hover (on mouse), scroll (on scroll), porque cada uma usa tecnicas CSS diferentes e mistura-las causa codigo confuso
2. **Animacoes de entrada usam @keyframes** — elementos que aparecem ao carregar a pagina usam keyframes com animation, porque transitions precisam de mudanca de estado
3. **Transicoes de hover usam transition** — efeitos ao passar o mouse usam `transition` no estado base, nao `@keyframes`, porque sao mudancas entre dois estados conhecidos
4. **Animacoes de scroll usam classes toggled via JS** — CSS puro nao detecta scroll, entao adicione/remova classes com IntersectionObserver e anime via CSS
5. **Foque no desktop primeiro** — implemente todas as animacoes na versao desktop antes de adaptar para mobile, porque animacoes complexas em mobile podem ter comportamento diferente (hover nao existe em touch)

## Tres categorias de animacao

### 1. Animacao de entrada (on load)
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-element {
  animation: slideIn 0.6s ease-out forwards;
}
```

### 2. Transicao de hover
```css
.nav-link {
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

### 3. Animacao de scroll (com IntersectionObserver)
```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento aparece ao carregar pagina | `@keyframes` + `animation` |
| Efeito ao passar mouse | `transition` no estado base |
| Elemento aparece ao rolar | Classe CSS + IntersectionObserver |
| Sublinhado embaixo de link | `::after` pseudo-element com `transition: width` |
| Versao mobile | Desafio separado — foque no desktop primeiro |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `@keyframes` para hover simples | `transition` no elemento base |
| Animar com JS direto (`element.style`) | Classes CSS toggled via JS |
| Mesmo codigo de animacao para mobile e desktop | Media queries com animacoes adaptadas |
| `animation` sem `forwards` em entrada | `animation: name 0.6s ease forwards` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar cada tipo de animacao CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes