# Deep Explanation: CSS :has() e Figure/Figcaption em Layouts de Noticias

## O Seletor :has() — A "Pergunta" do CSS

O instrutor apresenta o `:has()` com uma analogia de pergunta:

> "Imagina uma pergunta: figcaption, tem la dentro uma classe com text-large? Nao importa em qualquer lugar, tem uma text-large ali dentro? Tem sim. Pronto, se tem entao aplica o padding de 12."

Isso e poderoso porque inverte a direcao do CSS. Normalmente o CSS so seleciona para baixo (pai → filho). Com `:has()`, o pai "pergunta" sobre seus filhos e se estiliza baseado na resposta.

### Como funciona tecnicamente

```css
figcaption:has(.text-large) {
  padding: 12px;
}
```

Isso significa: "Selecione todo `figcaption` que contenha, em qualquer nivel de profundidade, um elemento com a classe `.text-large`". O seletor afeta o `figcaption` (o pai), nao o `.text-large` (o filho).

### Por que nao usar classes extras?

Sem `:has()`, voce precisaria adicionar uma classe manual no figcaption:

```html
<!-- Abordagem antiga: classe manual -->
<figcaption class="figcaption-small">
  <p class="text-large">...</p>
</figcaption>
```

Com `:has()`, o CSS detecta automaticamente:

```html
<!-- Abordagem moderna: :has() detecta -->
<figcaption>
  <p class="text-large">...</p>
</figcaption>
```

Menos HTML, menos chance de esquecer a classe, CSS mais declarativo.

## Figure/Figcaption — Semantica Correta

O instrutor converte `<div>` genericas para `<figure>` com `<figcaption>`. Isso nao e apenas estetico — e semantico.

- `<figure>` indica conteudo autocontido (imagem com legenda)
- `<figcaption>` e a legenda/descricao associada
- Screen readers anunciam a relacao entre imagem e texto
- SEO entende melhor a estrutura do conteudo

### Quando usar figure vs div

- **figure**: conteudo com imagem + descricao associada (noticias, galerias, portfolios)
- **div**: container generico sem significado semantico

## Multi-cursor Editing (Dica de Produtividade)

O instrutor usa `Cmd-D` (Mac) / `Ctrl-D` (Windows/Linux) para selecionar multiplas ocorrencias de `<div>` e substituir por `<figure>` simultaneamente. Tecnica essencial para refatoracao rapida de markup.

## Controle de Linhas de Texto

O instrutor ajusta o conteudo textual para caber em exatamente 3 linhas no design. Menciona que:

1. Por enquanto, o ajuste e manual (cortar texto, adicionar reticencias)
2. Com JavaScript, isso pode ser feito dinamicamente
3. O design funciona apenas em tela larga — responsividade sera abordada depois

### Nota sobre Responsividade

O instrutor alerta: "Numa tela que nao tem espaco vai ficar tudo ruim, bem estranho. E por isso que a gente continua estudando, porque num certo momento voce vai aprender a adaptar isso para telas menores."

Isso reforça que este layout e desktop-first e precisa de media queries para funcionar em dispositivos menores.