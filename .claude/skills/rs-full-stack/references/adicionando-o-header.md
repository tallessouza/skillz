---
name: rs-full-stack-adicionando-o-header
description: "Applies CSS header layout patterns with hover animations and transitions when building navigation components. Use when user asks to 'create a header', 'add navigation', 'animate on hover', 'rotate icon on hover', or 'build a nav bar'. Enforces flexbox layout, CSS attribute selectors for targeting images, transform transitions, and absolute-positioned badges. Make sure to use this skill whenever creating header/nav components with icons and hover effects. Not for complex JavaScript animations, page routing logic, or backend API work."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, header, navigation, flexbox, hover, transition, animation]
---

# Header com Animações CSS

> Construa headers semânticos com layout flexbox, seletores de atributo para imagens e transições de hover suaves.

## Rules

1. **Use `nav` para navegação clicável** — se os elementos são links, use `<nav>` em vez de `<header>` para semântica e acessibilidade, porque leitores de tela identificam regiões de navegação
2. **Adicione `title` em links com apenas imagem** — descreva a ação do link no atributo `title`, porque imagens sozinhas não comunicam a ação ao usuário ou ao SEO
3. **Use seletores de atributo `[src*="keyword"]` para imagens** — selecione imagens pelo conteúdo do `src` em vez de classes extras, porque reduz markup e é auto-descritivo
4. **Sempre declare `transition` no estado base** — coloque a propriedade `transition` no elemento, não no `:hover`, porque a transição precisa existir antes do estado mudar
5. **Use `max-width` + `width: 100%` para containers** — garante largura máxima com responsividade, porque o layout não estoura em telas grandes nem quebra em pequenas
6. **Posicione badges com `position: absolute` dentro de `position: relative`** — o badge (contador) fica ancorado ao ícone pai, porque absolute sem relative pai se ancora ao viewport

## How to write

### Header layout com flexbox

```css
header {
  max-width: 80rem;
  width: 100%;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### Hover com rotate e transition

```css
img[src*="logo"] {
  width: 2rem;
  height: 2rem;
  transition: transform 500ms;
}

img[src*="logo"]:hover {
  transform: rotate(90deg);
}

img[src*="shopping"]:hover {
  transform: rotate(-30deg);
}
```

### Badge posicionado sobre ícone

```html
<a href="#" title="Carrinho de compras">
  <img src="assets/icons/shopping-bag.svg" />
  <span>1</span>
</a>
```

```css
header a {
  position: relative;
}

header span {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 500 0.75rem/1.3 "Inter", sans-serif;
}
```

## Example

**Before (sem acessibilidade, sem transição):**
```html
<div class="header">
  <img src="assets/logo.svg" />
  <img src="assets/icons/shopping-bag.svg" />
</div>
```

**After (semântico, acessível, animado):**
```html
<nav>
  <a href="#" title="Página inicial">
    <img src="assets/logo.svg" />
  </a>
  <a href="#" title="Carrinho de compras">
    <img src="assets/icons/shopping-bag.svg" />
    <span>1</span>
  </a>
</nav>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Todos os filhos são links clicáveis | Use `<nav>` em vez de `<header>` |
| Link contém apenas imagem | Adicione `title` descritivo no `<a>` |
| Hover precisa de animação suave | Declare `transition` no estado base, `transform` no `:hover` |
| Badge/contador sobre ícone | `position: relative` no pai, `absolute` no badge |
| Ícones SVG de tamanhos variados | Force `width` e `height` iguais para uniformidade |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `transition` dentro do `:hover` | `transition` no elemento base |
| `<div>` para navegação clicável | `<nav>` com `<a>` internos |
| `<a>` com imagem sem `title` | `<a title="Descrição da ação">` |
| `.logo-img` classe extra para selecionar | `img[src*="logo"]` seletor de atributo |
| Badge sem container `position: relative` | Pai com `relative`, badge com `absolute` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Transicao nao funciona no hover | `transition` declarada no `:hover` em vez do estado base | Mova `transition` para o seletor do elemento, nao do `:hover` |
| Badge posicionado no canto da pagina | Pai do badge sem `position: relative` | Adicione `position: relative` no elemento pai do badge |
| Seletor de atributo nao seleciona imagem | String no `src*=` nao corresponde ao arquivo | Verifique se o keyword corresponde ao nome do arquivo |
| Icones com tamanhos diferentes | SVGs sem `width` e `height` forcados | Force dimensoes iguais via CSS: `width: 2rem; height: 2rem` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre semântica, acessibilidade e seletores de atributo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações