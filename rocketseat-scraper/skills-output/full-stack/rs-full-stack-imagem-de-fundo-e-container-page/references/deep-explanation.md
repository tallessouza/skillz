# Deep Explanation: Imagem de Fundo e Container Page

## Por que background-image e nao img tag?

O instrutor coloca a imagem no `body` via CSS porque e uma imagem decorativa — ela nao carrega significado semantico. A tag `<img>` e para imagens que fazem parte do conteudo (fotos de produto, avatares, etc). Imagens de fundo sao responsabilidade do CSS.

## background-size: cover vs contain vs 100%

O instrutor explica que imagens de fundo **repetem por padrao**. Ao diminuir a pagina (Ctrl + menos), a repeticao fica visivel. As opcoes:

- **cover** — a imagem cobre toda a area visivel, cortando o excesso se necessario. O instrutor escolhe esta porque "ela vai cobrir toda a area visivel que a gente tiver". Independente do tamanho da janela, a imagem sempre preenche.
- **contain** — a imagem fica inteira visivel, mas pode sobrar espaco nos lados.
- **100%** — funciona para largura mas pode distorcer a proporcao.
- **auto** — usa o tamanho original da imagem.

O instrutor demonstra mudando o zoom do navegador para simular telas grandes e mostra que sem `cover`, a imagem repete.

## O problema do box model (848px vs 800px)

Este e o ponto mais importante da aula. O instrutor usa o DevTools (F12) para provar que o container esta maior que 800px:

1. Vai em Computed > width: mostra 800px
2. Mas ao passar o mouse sobre o elemento no inspector, mostra **848px**
3. A diferenca: `800 + 24 (padding-left) + 24 (padding-right) = 848`

Esse e o **comportamento padrao do box model CSS** (content-box): width define apenas o conteudo, padding e border sao somados por fora.

A solucao `box-sizing: border-box` muda o modelo: width passa a incluir padding e border. Entao 800px = conteudo + padding + border, tudo junto.

## Fluxo Figma-to-CSS que o instrutor ensina

1. **Selecionar o elemento no Figma** — clicar nele
2. **Ver padding** — na secao Auto Layout, aparece vertical padding e horizontal padding
3. **Ver espacamento entre filhos** — o valor entre os itens dentro do container (24px neste caso)
4. **Ver largura** — se aparece "Fixed" com valor, usar `width: Xpx`
5. **Ver cor** — clicar no elemento, ir nos controles de cor, copiar o hex
6. **Ver border-radius** — aparece no canto do elemento selecionado
7. **Ver margem** — Alt + hover para medir distancias entre elementos (48px de topo)

## Organizacao do CSS na ordem do HTML

O instrutor enfatiza: "como eu gosto de ir organizando a escrita do meu CSS, conforme eu imagino que esta aparecendo aqui no HTML". Entao se o HTML e:

```html
<body>
  <div id="page">
    <img>
    <main>
```

O CSS segue: body → #page → img → main. Isso facilita a navegacao mental entre HTML e CSS.

## Margin auto para centralizacao

`margin: 48px auto` e um shorthand:
- Primeiro valor (48px) = margin-top e margin-bottom
- Segundo valor (auto) = margin-left e margin-right

`auto` em margins horizontais distribui o espaco igualmente, centralizando o elemento. So funciona quando o elemento tem uma largura definida (800px neste caso).

O instrutor extrai o 48px do Figma usando Alt + hover para medir a distancia do topo do container ate a borda.