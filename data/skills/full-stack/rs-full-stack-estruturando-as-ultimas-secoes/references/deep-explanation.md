# Deep Explanation: Estruturando Secoes de Portal de Noticias

## Por que `<article>` e nao `<div>`?

O instrutor usa `<article>` para cada item de noticia porque semanticamente representa conteudo que faz sentido isolado — pode ser redistribuido (RSS, redes sociais) sem perder significado. Um `<div>` e generico e nao comunica nada sobre o conteudo.

## Hierarquia de headings: por que `<h3>`?

O instrutor menciona explicitamente: "h3 porque a gente ja tem aqui em cima disso". Isso significa que ja existem `<h1>` e `<h2>` na pagina. A hierarquia de headings deve ser respeitada — pular niveis (ex: h1 → h3) e invalido semanticamente e prejudica acessibilidade e SEO.

## Padrao de header replicavel

Cada secao segue exatamente o mesmo padrao:
1. `<header>` como container
2. `<h3>` com titulo da secao
3. `<a>` com link "ver tudo" contendo seta

Isso cria consistencia visual e de codigo. Quando o instrutor cria a secao "more", ele copia o header da secao anterior — demonstrando que o padrao deve ser identico entre secoes.

## Grid como sistema de layout

O instrutor usa um sistema de utility classes baseado em grid:
- `grid` — ativa CSS Grid
- `grid-flow-col` — muda o flow para colunas (equivale a `grid-auto-flow: column`)
- `gap-16`, `gap-32` — espacamento entre itens

Esse sistema e inspirado em frameworks como Tailwind, mas criado manualmente. A vantagem: cada classe faz uma unica coisa e pode ser combinada.

## Criacao de utility classes sob demanda

Quando o instrutor precisa de `gap-32` e ela nao existe, ele vai ao arquivo de utilitarios e cria:
```css
.gap-32 {
  gap: 32px;
}
```

Esse padrao e importante: nao crie todas as utility classes antecipadamente. Crie conforme a necessidade e elas ficam disponiveis para reutilizacao futura.

## Inversao de ordem imagem/texto

Em algumas secoes, a imagem fica a esquerda e o texto a direita. Em outras, inverte. O instrutor resolve isso simplesmente trocando a ordem das divs no HTML. Isso e possivel porque `grid-flow-col` coloca os filhos em colunas na ordem em que aparecem no DOM.

## Content tags como spans

As categorias dos artigos (ex: "Inteligencia Artificial", "Criptomoedas", "Drones") usam `<span class="content-tag">`. Nao sao links, nao sao headings — sao labels de classificacao. O `<span>` e o elemento correto porque e inline e semanticamente neutro, recebendo significado pela classe CSS.

## Copia e cola como estrategia de producao

O instrutor e explicito sobre copiar e colar articles e ajustar imagens, titulos e textos. Isso nao e "preguica" — e eficiencia em estruturas repetitivas. O padrao e:
1. Crie um article completo e correto
2. Copie N vezes
3. Ajuste: imagem, alt, content-tag, titulo, texto

## Atributos alt como "deverzinho de casa"

O instrutor nota que esqueceu os atributos alt nas imagens e deixa como exercicio. Isso reforta que alt e obrigatorio para acessibilidade — toda `<img>` deve ter alt descritivo.

## Truncamento de texto

Os textos longos dos artigos sao cortados em pontos especificos no HTML. O instrutor identifica palavras-chave onde o texto deve parar e adiciona reticencias. Isso sera complementado com CSS (`text-overflow: ellipsis` ou `line-clamp`) posteriormente.

## Estrutura de secao com ads

A secao de "Artificial Intelligence" inclui uma div de ads ao lado do conteudo:
```html
<section>
  <div><!-- ads --></div>
  <section class="more"><!-- conteudo --></section>
</section>
```

Isso separa conteudo editorial de conteudo publicitario, facilitando estilizacao e eventual remocao de ads.