---
name: rs-full-stack-estruturando-a-navegacao
description: "Enforces structured HTML navigation patterns when building navbars, menus, or headers. Use when user asks to 'create a navbar', 'build navigation', 'structure a header', 'add a menu', or 'create nav links'. Applies rules: plan structure mentally before coding, use semantic nav/header hierarchy, wrap clickable logos in anchor tags, organize assets in subfolders, use Emmet shortcuts for repeated structures. Make sure to use this skill whenever generating HTML navigation components. Not for CSS styling, JavaScript interactivity, or backend routing."
---

# Estruturando a Navegação HTML

> Planeje mentalmente a estrutura da navegação antes de escrever código, usando elementos semânticos e assets organizados.

## Rules

1. **Planeje a estrutura antes de codar** — visualize mentalmente quais elementos existem (logo, menu, links) e como se aninham, porque isso evita retrabalho e HTML desorganizado
2. **Use hierarquia semântica header/nav** — `header > nav` ou `nav > header`, ambos válidos dependendo do contexto, porque semântica correta melhora acessibilidade e SEO
3. **Envolva logos em anchor tags** — `<a href="#" id="logo"><img src="..."></a>`, porque a logo sempre será clicável para voltar ao topo/home
4. **Organize assets em subpastas** — `assets/images/`, `assets/icons/`, arquivos soltos na raiz de assets só quando não cabem em categoria, porque assets soltos viram caos rapidamente
5. **Use IDs descritivos para menus** — `id="primary-menu"`, `id="secondary-menu"`, porque projetos reais terão múltiplos menus e IDs genéricos causam conflitos
6. **Links placeholder sempre com hash** — `href="#"` para links ainda sem destino, porque mantém a estrutura navegável pronta para implementação real

## How to write

### Estrutura base de navegação

```html
<header>
  <nav>
    <!-- Logo clicável -->
    <a href="#" id="logo">
      <img src="./assets/logo.svg" alt="Logo marca">
    </a>

    <!-- Menu principal -->
    <ul id="primary-menu">
      <li><a href="#"><img src="./assets/icons/search.svg" alt="Ícone de busca"></a></li>
      <li><a href="#">Destinos</a></li>
      <li><a href="#">Pacotes</a></li>
      <li><a href="#"><img src="./assets/profile.png" alt="Foto de perfil"></a></li>
    </ul>
  </nav>
</header>
```

### Emmet para itens repetidos

```
li*3>a
```
Gera 3 `<li>` com `<a>` dentro de cada um — use o asterisco para multiplicar estruturas repetidas.

## Example

**Before (sem planejamento):**
```html
<div class="top">
  <img src="logo.png">
  <div class="links">
    <span onclick="go()">Home</span>
    <span onclick="go()">About</span>
  </div>
</div>
```

**After (com esta skill aplicada):**
```html
<header>
  <nav>
    <a href="#" id="logo">
      <img src="./assets/logo.svg" alt="Logo marca">
    </a>
    <ul id="primary-menu">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
    </ul>
  </nav>
</header>
```

## Heuristics

| Situação | Ação |
|----------|------|
| Logo no nav | Sempre envolver em `<a>` com id="logo" |
| Múltiplos menus | Usar IDs: primary-menu, secondary-menu |
| Ícones no menu | `<img>` dentro de `<a>` com alt descritivo |
| Imagem de perfil | Não vai em icons/ nem images/ — fica na raiz de assets |
| Muitos `<li>` iguais | Usar Emmet: `li*N>a` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `<div class="nav">` | `<nav>` |
| `<img src="logo.png">` (clicável sem link) | `<a href="#" id="logo"><img ...></a>` |
| `<span onclick="...">Link</span>` | `<a href="#">Link</a>` |
| Assets todos soltos em uma pasta | Subpastas: `assets/images/`, `assets/icons/` |
| `<ul class="menu">` (genérico) | `<ul id="primary-menu">` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre hierarquia semântica e organização de assets
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações