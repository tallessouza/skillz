---
name: rs-full-stack-position-2
description: "Enforces correct CSS position usage when writing layouts. Use when user asks to 'position an element', 'create a modal', 'make sticky header', 'fix element on screen', 'overlay elements', or 'use z-index'. Applies rules for relative, absolute, fixed, sticky positioning with containing block awareness. Make sure to use this skill whenever generating CSS that involves positioning, overlays, modals, or stacking. Not for flexbox, grid layout, or general spacing with margin/padding."
---

# CSS Position

> Ao posicionar elementos, entenda o containing block e o stacking context antes de escolher o valor de position.

## Rules

1. **Static e o padrao — so mude quando necessario** — `position: static` e o default, elementos seguem o normal flow sem propriedades de offset, porque adicionar position sem necessidade cria complexidade desnecessaria
2. **Relative mantem o espaco original** — o elemento se desloca visualmente mas o espaco que ocupava permanece, porque o normal flow nao e quebrado
3. **Absolute quebra o normal flow** — o elemento sai do fluxo e se posiciona relativo ao containing block mais proximo (pai com position != static), porque sem containing block proximo ele usa a pagina inteira
4. **Sempre defina containing block para absolute** — coloque `position: relative` no pai antes de usar absolute no filho, porque sem isso o elemento se posiciona relativo a pagina toda
5. **Fixed ignora containing block proximo** — sempre relativo ao initial containing block (viewport), porque o proposito e fixar na tela independente de scroll
6. **Sticky requer elemento pai com scroll** — o elemento gruda quando atinge o offset definido, relativo ao pai mais proximo com mecanismo de scroll (overflow), porque sem overflow no pai o sticky nao funciona como esperado
7. **Use inset: 0 para cobrir o containing block** — ao inves de `top: 0; left: 0; right: 0; bottom: 0`, porque e mais conciso e expressa melhor a intencao de preencher todo o espaco

## How to write

### Absolute dentro de containing block

```css
/* Pai define o containing block */
.container {
  position: relative;
}

/* Filho se posiciona dentro do pai */
.element {
  position: absolute;
  top: 20px;
  right: 20px;
}
```

### Modal overlay (padrao com absolute + inset)

```css
.overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
}
```

### Elemento fixo na tela (botao de scroll-to-top)

```css
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}
```

### Sticky header dentro de container com scroll

```css
.scroll-container {
  overflow: auto;
  height: 400px;
}

.sticky-header {
  position: sticky;
  top: 0;
}
```

## Example

**Before (absolute sem containing block):**
```css
/* Elemento vai parar relativo a pagina toda */
.parent {
  /* sem position definido */
}
.child {
  position: absolute;
  top: 0;
  left: 0;
}
```

**After (containing block definido):**
```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 0;
  left: 0;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Deslocar elemento sem afetar layout | `position: relative` com offset |
| Posicionar dentro de um container | `position: absolute` + pai com `position: relative` |
| Fixar na viewport (chat widget, scroll-to-top) | `position: fixed` |
| Grudar durante scroll (nav, header) | `position: sticky` + verificar pai com overflow |
| Cobrir area inteira do pai | `position: absolute; inset: 0` |
| Controlar sobreposicao visual | `z-index` (valores maiores = mais proximo do usuario) |
| Preencher todos os offsets iguais | `inset: 10px` ao inves de top/right/bottom/left separados |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `position: absolute` sem pai posicionado | Adicione `position: relative` no pai |
| `top: 0; left: 0; right: 0; bottom: 0` | `inset: 0` |
| `position: sticky` sem verificar overflow do pai | Confirme que o pai tem mecanismo de scroll |
| `position: fixed` para elemento que deveria respeitar container | Use `absolute` com containing block |
| `z-index: 9999` arbitrario | Use escala controlada (1, 10, 100) |
| `position: relative` + offset quando flexbox/grid resolve | Use alignment do layout system |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre containing block, stacking context, normal flow e writing mode
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes para cada tipo de position