# Deep Explanation: Estilizando o Track

## Por que span ignora width e height?

O elemento `<span>` tem `display: inline` por padrao. Elementos inline fluem como texto — eles se ajustam ao conteudo e **ignoram silenciosamente** propriedades de dimensao (`width`, `height`, `margin-top`, `margin-bottom`).

Isso e um dos bugs visuais mais frustrantes para iniciantes porque **nao ha erro no console**. O CSS simplesmente nao aplica a propriedade e o elemento fica com tamanho zero ou do conteudo.

A solucao e mudar para `display: block` (ocupa linha inteira) ou `display: inline-block` (aceita dimensoes mas permanece na mesma linha). Para um track de toggle/switch, `display: block` e o mais comum.

### Elementos inline por padrao:
- `<span>`, `<a>`, `<em>`, `<strong>`, `<i>`, `<b>`, `<code>`

### Elementos block por padrao:
- `<div>`, `<p>`, `<h1>`-`<h6>`, `<section>`, `<article>`

## Variaveis CSS como ponte entre Design e Codigo

O instrutor destaca que ao copiar propriedades do Figma, os nomes dos tokens ja estao la: "Surface Color", "Stroke Color". A conversao e direta:

```
Figma: Surface Color → CSS: var(--surface-color)
Figma: Stroke Color  → CSS: var(--stroke-color)
```

O insight do instrutor: **"O legal das variaveis e isso, ne? Se a gente faz inclusive semelhante ao que foi desenhado, muito facinho da gente poder fazer sem pensar muito."**

Ou seja: quando o design system usa tokens nomeados e o CSS usa variaveis com os mesmos nomes, a traducao Figma→CSS se torna mecanica — nao precisa "pensar", so seguir o que esta escrito.

## Backdrop Filter e Compatibilidade

`backdrop-filter` aplica efeitos visuais (blur, saturacao, etc.) ao fundo atras do elemento, nao ao elemento em si. E diferente de `filter` que afeta o proprio elemento.

Navegadores WebKit (Safari, iOS) precisam do prefixo `-webkit-backdrop-filter`. Sem ele, o efeito de blur nao aparece nesses navegadores. A boa pratica e sempre declarar ambos:

```css
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
```

## Border Radius 9999px — Por que nao 50%?

- `border-radius: 50%` em um retangulo cria uma **elipse**, nao uma pilula
- `border-radius: 9999px` (valor absurdamente alto) cria uma pilula perfeita porque o navegador limita o raio ao maximo possivel — que e metade da menor dimensao
- Isso funciona independente de width/height, entao e seguro usar sempre para formato pill/capsula