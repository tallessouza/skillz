---
name: rs-discover-caixas-html-css-pratica
description: "Enforces box-model thinking when structuring HTML/CSS layouts. Use when user asks to 'create a layout', 'build a page structure', 'add a container', 'structure HTML', or 'organize divs'. Applies rules: everything is a box, use container pattern, unique IDs, explicit dimensions with pixels, border for debugging. Make sure to use this skill whenever building page structure from a design mockup. Not for styling colors, typography, animations, or JavaScript logic."
---

# As Caixas do HTML e CSS

> Ao construir layouts, enxergue tudo como caixas que contem outras caixas — comece pela caixa principal (container) e componha de fora para dentro.

## Rules

1. **Tudo sao caixas** — cada elemento visual e uma caixa retangular, porque o navegador renderiza tudo como retangulos no box model
2. **Comece pela caixa externa** — crie primeiro o container principal antes das caixas internas, porque a estrutura se constroi de fora para dentro
3. **Use `div` para caixas genericas** — div nao tem estilos visuais proprios do browser, porque isso evita interferencias inesperadas no layout
4. **IDs sao unicos como RG** — cada `id` so pode existir uma vez na pagina, porque IDs duplicados causam bugs silenciosos no CSS e JavaScript
5. **Defina dimensoes explicitas no container** — use `width` e `height` em pixels para caixas com tamanho fixo, porque sem dimensoes a div colapsa e fica invisivel
6. **Use borda para debug visual** — `border: 1px solid` torna a caixa visivel durante desenvolvimento, porque div sem conteudo ou borda e invisivel

## How to write

### Container principal

```html
<body>
  <div id="container">
    <!-- caixas internas aqui -->
  </div>
</body>
```

```css
#container {
  width: 360px;
  height: 712px;
  border: 1px solid; /* remover depois do debug */
}
```

### Leitura de um layout (de fora para dentro)

```html
<div id="container">
  <div id="profile">
    <div id="avatar">...</div>
    <div id="name">...</div>
  </div>
  <div id="switch">...</div>
  <div id="social-links">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
  </div>
  <footer>Texto do rodape</footer>
</div>
```

## Example

**Before (sem estrutura de caixas):**
```html
<body>
  <img src="avatar.png">
  <h1>Nome</h1>
  <a href="#">Link 1</a>
  <a href="#">Link 2</a>
  <p>Footer</p>
</body>
```

**After (com pensamento em caixas):**
```html
<body>
  <div id="container">
    <div id="profile">
      <img src="avatar.png">
      <h1>Nome</h1>
    </div>
    <div id="social-links">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
    </div>
    <footer>Footer</footer>
  </div>
</body>
```

```css
#container {
  width: 360px;
  height: 712px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tem um design/mockup para implementar | Identifique todas as caixas antes de escrever codigo |
| Grupo de elementos relacionados | Envolva em uma `div` com id descritivo |
| Nao consegue ver o elemento na tela | Adicione `border: 1px solid` para debug |
| Precisa de tamanho fixo (mobile mockup) | Use `width` e `height` em pixels |
| Quer reusar o mesmo nome | Use `class` ao inves de `id` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Dois elementos com mesmo `id` | IDs unicos: `container-1`, `container-2` |
| Escrever HTML sem analisar o layout primeiro | Mapear caixas no mockup antes de codar |
| Div sem dimensao e sem conteudo (invisivel) | Adicionar width/height ou border para visualizar |
| Aninhar tudo sem agrupamento logico | Agrupar elementos relacionados em divs nomeadas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre box model, analogia das caixas, e pixels
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes