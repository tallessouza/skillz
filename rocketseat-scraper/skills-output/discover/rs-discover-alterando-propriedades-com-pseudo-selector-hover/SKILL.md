---
name: rs-discover-pseudo-selector-hover
description: "Applies CSS :hover pseudo-selector patterns and transition properties when styling interactive elements. Use when user asks to 'style a button', 'add hover effect', 'make element interactive', 'add transition', or 'animate on hover'. Ensures smooth transitions with proper duration and targeted properties. Make sure to use this skill whenever creating interactive UI elements with hover states. Not for JavaScript event handlers, animations with keyframes, or complex motion design."
---

# Pseudo-selector :hover e Transições CSS

> Ao criar estados hover, sempre defina a transição no elemento base com propriedade específica, nunca `all`.

## Rules

1. **Declare hover com `elemento:hover`** — dois pontos sem espaço antes de `hover`, porque é um pseudo-selector CSS que ativa ao passar o mouse
2. **Coloque `transition` no elemento base, não no `:hover`** — a transição deve existir no estado padrão para funcionar tanto na ida quanto na volta
3. **Especifique a propriedade na transition** — `transition: background-color 0.2s` não `transition: all 0.2s`, porque `all` transiciona tudo incluindo propriedades indesejadas ao carregar a página
4. **Use duração entre 0.1s e 0.3s para hover** — 0.2s é o ponto ideal: rápido o suficiente para parecer responsivo, suave o suficiente para não ser abrupto
5. **Altere apenas propriedades visuais relevantes no hover** — background-color, border-color, opacity, não mude layout (padding, margin, width)

## How to write

### Hover básico com transição

```css
/* Transição declarada no estado base */
.button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1.5px solid transparent;
  transition: background-color 0.2s;
}

/* Propriedades alteradas no hover */
.button:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: white;
}
```

### Múltiplas propriedades na transição

```css
.button {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1.5px solid transparent;
  transition: background-color 0.2s, border-color 0.2s;
}
```

## Example

**Before (problema com `all`):**
```css
.button {
  padding: 16px 32px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1.5px solid transparent;
  transition: all 0.5s; /* Transiciona TUDO ao carregar a página */
}

.button:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: white;
}
```

**After (propriedade específica, duração ideal):**
```css
.button {
  padding: 16px 32px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1.5px solid transparent;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: white;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Botão com mudança de cor | `transition: background-color 0.2s` no base |
| Múltiplas props mudam no hover | Liste cada uma: `transition: background-color 0.2s, border-color 0.2s` |
| Quer transição em tudo | Ainda prefira listar propriedades específicas |
| Efeito parece lento | Reduza para 0.15s-0.2s |
| Efeito parece abrupto | Aumente para 0.2s-0.3s |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `transition: all 0.5s` | `transition: background-color 0.2s` |
| `.button:hover { transition: ... }` | `.button { transition: ... }` |
| `hover` sem os dois pontos | `:hover` (pseudo-selector) |
| `transition: 0.2s` (sem propriedade) | `transition: background-color 0.2s` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre pseudo-selectors, analogia do transition no estado base, e edge cases com `all`
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula expandidos com variações