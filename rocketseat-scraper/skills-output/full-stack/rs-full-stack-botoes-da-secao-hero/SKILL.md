---
name: rs-full-stack-botoes-da-secao-hero
description: "Applies CSS button styling with box-shadow, scale hover effects, and transitions when building interactive hero sections. Use when user asks to 'create buttons', 'style a hero section', 'add hover effects', 'add box-shadow', or 'make interactive buttons'. Covers multiple box-shadows, scale transitions, flexbox button layout, and browser compatibility. Make sure to use this skill whenever styling CTA buttons or hero section interactive elements. Not for JavaScript click handlers, form validation, or backend logic."
---

# Botões Interativos com CSS — Hero Section

> Botões de hero section combinam layout flex, múltiplas sombras gradativas e transições de escala para criar interatividade suave.

## Rules

1. **Use Display Flex nos containers de botões** — `display: flex` com `gap` para espaçamento, porque garante alinhamento lateral consistente sem hacks de margin
2. **Aplique múltiplas sombras no box-shadow** — separe com vírgula para criar profundidade gradativa, porque uma única sombra fica artificial
3. **Use `scale` com `transition` no hover** — nunca aplique escala sem transição, porque o efeito fica abrupto e quebra a experiência
4. **Verifique compatibilidade no caniuse.com** — `scale` standalone funciona em browsers modernos, mas `transform: scale()` é o fallback seguro
5. **Seletores compostos sem espaço** — `.button.button-buy` (sem espaço) seleciona elemento com ambas as classes; com espaço busca descendente e nada funciona
6. **Span com flex para ícones circulares** — `display: flex` + `border-radius: 50%` + padding cria botões circulares consistentes sem distorção

## How to write

### Layout de botões hero

```css
.buttons {
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
}

.button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 5rem;
}
```

### Múltiplas sombras gradativas

```css
.shadow {
  box-shadow:
    0 2px 5px rgb(0 0 0 / 0.1),
    0 9px 9px rgb(0 0 0 / 0.09),
    0 0.5px 20px rgb(0 0 0 / 0.05),
    0 1px 15px rgb(0 0 0 / 0.01);
}
```

### Hover com escala e transição

```css
.button {
  transition: scale 350ms;
}

.button:hover {
  scale: 1.1;
}

/* Fallback para browsers antigos */
.button {
  transition: transform 350ms;
}
.button:hover {
  transform: scale(1.1);
}
```

## Example

**Before (botão sem interatividade):**
```css
.btn {
  background: orange;
  padding: 10px 20px;
  border-radius: 8px;
}
.btn:hover {
  transform: scale(1.1); /* sem transition = pulo abrupto */
}
```

**After (com esta skill aplicada):**
```css
.btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 3rem;
  background-color: var(--any-tap-sun);
  border-radius: 5rem;
  transition: scale 350ms;
  box-shadow:
    0 2px 5px rgb(0 0 0 / 0.1),
    0 9px 9px rgb(0 0 0 / 0.09),
    0 0.5px 20px rgb(0 0 0 / 0.05),
    0 1px 15px rgb(0 0 0 / 0.01);
}
.btn:hover {
  scale: 1.1;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Botão CTA em hero section | Flex + sombra múltipla + scale hover com transition |
| Ícone dentro de botão | Span com `display: flex`, `border-radius: 50%`, padding igual |
| Sombra precisa de profundidade | 3-4 camadas de box-shadow com opacidade decrescente |
| Precisa suportar browsers antigos | `transform: scale()` ao invés de `scale` standalone |
| Dois botões lado a lado | Container flex com gap, não margin entre eles |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `scale: 1.1` sem transition | `transition: scale 350ms` + `scale: 1.1` no hover |
| `.button .button-buy` (com espaço) | `.button.button-buy` (sem espaço, mesma classe) |
| `box-shadow: 0 2px 5px black` | `box-shadow: 0 2px 5px rgb(0 0 0 / 0.1)` com múltiplas camadas |
| `margin-right: 20px` entre botões | Container com `display: flex; gap: 2rem` |
| Ícone circular com width/height fixo | Span com `padding + border-radius: 50% + display: flex` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre múltiplas sombras, compatibilidade de browsers e seletores compostos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações