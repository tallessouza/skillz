# Deep Explanation: Footer com Animações CSS

## Por que scaleX ao invés de width?

O instrutor usa `transform: scaleX(0)` → `scaleX(1)` para o efeito de underline crescendo. A razão técnica: `transform` é animado pela GPU (compositor thread), enquanto `width` causa reflow — o browser recalcula layout de todos os elementos ao redor. Em footers com muitos links, a diferença é perceptível.

O efeito visual também é diferente: `scaleX` cresce do centro para os lados (comportamento padrão com `transform-origin: center`), enquanto `width` cresceria apenas da esquerda para a direita.

## Pseudo-elementos como camadas visuais

O padrão usado duas vezes na aula:

1. **`::after` para underline** — elemento criado DEPOIS do conteúdo, posicionado absoluto no bottom
2. **`::before` para circle reveal** — elemento criado ANTES do conteúdo, com `z-index: -1` para ficar atrás

A analogia do instrutor: "como se fosse um livro em cima do outro" — sem `z-index: -1`, o `::before` fica na camada superior e esconde o conteúdo (ícone). Com `z-index: -1`, ele vai para "debaixo da página".

## inherit nos pseudo-elementos

No social links, o `::before` usa:
```css
width: inherit;
height: inherit;
border-radius: inherit;
```

Isso puxa os valores do parent (`<a>`), evitando duplicação. Se o tamanho do botão mudar, o círculo de fundo acompanha automaticamente.

## Propriedade rotate vs transform: rotate()

O instrutor mostra que `rotate: 90deg` é uma propriedade CSS mais recente, disponível na maioria dos browsers modernos. O fallback é `transform: rotate(90deg)`. A vantagem da propriedade individual: pode ser animada independentemente de outros transforms (scale, translate) sem conflito.

Na `transition`, o instrutor especifica `transition: rotate 350ms` — transicionando apenas a propriedade rotate, não todas as propriedades.

## Opacidade combinada com scale

No underline do nav, o instrutor adiciona `opacity: 0` no estado base e `opacity: 1` no hover, junto com o scaleX. Isso cria um efeito mais suave — o elemento não só cresce mas também aparece gradualmente. Sem a opacidade, mesmo com `scaleX(0)` pode haver um pixel visível em alguns browsers.

## Acessibilidade em links de ícone

O instrutor enfatiza: quando um `<a>` contém apenas uma `<img>`, leitores de tela não têm contexto. O atributo `title` no link resolve isso — o leitor anuncia "link, Instagram" ao invés de apenas "link, imagem".

## Estrutura HTML do footer

```html
<footer>
  <div class="logo">
    <img src="assets/logo.svg" alt="Sneetap">
    <span>Sneetap</span>
  </div>
  <nav>
    <a href="#">Sobre</a>
    <a href="#">Nossas lojas</a>
    <a href="#">Política de privacidade</a>
  </nav>
  <div class="social-links">
    <a href="#" title="Instagram"><img src="..." alt=""></a>
    <a href="#" title="Facebook"><img src="..." alt=""></a>
    <a href="#" title="YouTube"><img src="..." alt=""></a>
    <a href="#" title="TikTok"><img src="..." alt=""></a>
  </div>
</footer>
```

Três blocos semânticos: logo, navegação, social. Flexbox com `space-between` distribui uniformemente.

## Padding assimétrico

`padding: 4rem 2rem 2rem` — o espaço superior (4rem) é o dobro do inferior (2rem). O instrutor observa isso no design: "o espaço em cima é maior do que o espaço de baixo". Esse padrão é comum em footers para criar separação visual do conteúdo acima.

## fit-content no nav link

O instrutor usa `width: fit-content` no `<a>` do nav para que o elemento (e consequentemente o underline `::after`) ocupe apenas a largura do texto, não toda a largura disponível.