# Code Examples: HTML do Botao Switch e SVG

## Estrutura completa do switch (como demonstrado na aula)

```html
<!-- Dentro do body, apos a section de profile -->
<div id="switch">
  <button></button>
  <span></span>
</div>
```

O `#switch` e criado com o atalho Emmet: `#switch` + Enter gera `<div id="switch"></div>`.

## Arquivo SVG completo (moon-stars.svg)

```svg
<!-- assets/moon-stars.svg -->
<!-- Copiado do Phosphor Icons via "Copy SVG" -->
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
  <path d="...dados do path da lua com estrelas..." />
</svg>
```

Pontos importantes:
- O `xmlns` define o namespace SVG
- `width` e `height` definem tamanho padrao
- `viewBox` define o sistema de coordenadas interno
- `<path d="...">` contem as instrucoes de desenho

## Demonstracao com tag img (feita e depois removida)

```html
<!-- O instrutor mostrou isso para demonstrar que funciona -->
<button>
  <img src="assets/moon-stars.svg" alt="Moon and stars" />
</button>

<!-- Mas disse que vai usar CSS ao inves disso -->
<!-- "a gente vai colocar de outra forma" -->
```

## Variacao: SVG inline (mencionada como possibilidade)

```html
<button>
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
    <path d="..." />
  </svg>
</button>
```

Vantagem: controle total via CSS (mudar fill, stroke, etc.)
Desvantagem: polui o HTML com codigo SVG longo

## Variacao: SVG via CSS background (forma escolhida pelo instrutor)

```css
/* Sera implementado nas proximas aulas */
#switch button {
  background-image: url('./assets/moon-stars.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: none;
  /* dimensoes e estilos do botao */
}
```

## Variacao: SVG via CSS mask (para mudar cor dinamicamente)

```css
/* Alternativa avancada para temas claro/escuro */
#switch button::before {
  content: '';
  display: block;
  width: 24px;
  height: 24px;
  mask-image: url('./assets/moon-stars.svg');
  mask-size: contain;
  background-color: currentColor;
}
```

## Estrutura HTML completa em contexto

```html
<body>
  <!-- ... header, profile section, etc ... -->

  <div id="switch">
    <button></button>
    <span></span>
  </div>

  <!-- ... resto do conteudo ... -->
</body>
```