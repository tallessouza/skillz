---
name: rs-full-stack-css-transition-01
description: "Applies CSS transition best practices when writing stylesheets or component styles. Use when user asks to 'add animation', 'smooth hover effect', 'transition on hover', 'animate property change', or 'add CSS transition'. Enforces specific transition-property over 'all', proper duration/delay units, and multi-property configuration. Make sure to use this skill whenever generating CSS with hover states or property changes. Not for JavaScript animations, keyframe animations, or CSS animation property."
---

# CSS Transitions

> Ao escrever transicoes CSS, seja especifico nas propriedades, configure duracoes intencionais e use delay apenas quando necessario.

## Rules

1. **Use `transition-property` com nomes especificos** — `opacity`, `transform`, nao `all`, porque `all` causa problemas de performance em projetos grandes ao transicionar propriedades desnecessarias
2. **Sempre defina `transition-duration`** — sem duracao a transicao nao acontece, use segundos (`1s`) ou milissegundos (`200ms`)
3. **Separe multiplas propriedades por virgula** — cada propriedade pode ter sua propria duracao e delay, configuradas na mesma ordem
4. **Use `transition-delay` com intencao** — delay afeta tanto a entrada quanto a saida da transicao, nao adicione sem motivo
5. **Transicoes precisam de um trigger** — `:hover`, `:focus`, `:active` ou mudanca de classe; sem trigger nao ha transicao visivel
6. **Coloque a transicao no estado base, nao no trigger** — declarar `transition` na `div`, nao no `div:hover`, para que funcione na ida e na volta

## How to write

### Transicao simples (uma propriedade)

```css
.card {
  opacity: 0.6;
  transition-property: opacity;
  transition-duration: 1s;
}

.card:hover {
  opacity: 1;
}
```

### Multiplas propriedades com duracoes diferentes

```css
.box {
  opacity: 0.6;
  transition-property: opacity, transform;
  transition-duration: 1s, 200ms;
}

.box:hover {
  opacity: 1;
  transform: translateX(20px);
}
```

### Com delay separado por propriedade

```css
.box {
  transition-property: opacity, transform;
  transition-duration: 1s, 200ms;
  transition-delay: 1s, 10ms;
}
```

## Example

**Before (problema de performance):**
```css
.box {
  opacity: 0.6;
  transition-property: all;
  transition-duration: 1s;
}

.box:hover {
  opacity: 1;
  transform: translateX(20px);
}
```

**After (especifico e performatico):**
```css
.box {
  opacity: 0.6;
  transition-property: opacity, transform;
  transition-duration: 1s, 200ms;
}

.box:hover {
  opacity: 1;
  transform: translateX(20px);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Hover com mudanca de cor e posicao | Liste ambas: `background-color, transform` com duracoes separadas |
| Transicao rapida (feedback de clique) | Use `100ms` a `200ms` |
| Transicao suave (entrada de conteudo) | Use `300ms` a `1s` |
| Precisa esperar antes de transicionar | Use `transition-delay` |
| Tentado a usar `all` | Liste as propriedades especificas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `transition-property: all` | `transition-property: opacity, transform` |
| `transition` no `:hover` apenas | `transition` no seletor base |
| Duracao sem unidade (`transition-duration: 1`) | Com unidade: `1s` ou `1000ms` |
| Delay em tudo sem motivo | Delay apenas quando a espera e intencional |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre performance de `all` vs propriedades especificas, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes