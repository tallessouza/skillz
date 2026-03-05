# Deep Explanation: Reset de CSS

## Por que navegadores adicionam estilos padrao?

Cada navegador tem uma **user agent stylesheet** — um CSS interno que define estilos basicos para que HTML puro seja minimamente legivel. O problema: esses estilos variam entre navegadores e criam inconsistencias.

Exemplos de estilos padrao comuns:
- `body` recebe `margin: 8px` (Chrome, Firefox)
- `p` recebe `margin-top` e `margin-bottom` (geralmente 1em)
- `h1`-`h6` recebem margins e font-sizes diferentes
- `ul`/`ol` recebem padding-left para identacao

## O seletor universal `*`

O `*` seleciona **todos os elementos** da pagina. Ao aplicar `margin: 0` e `padding: 0` nele, voce remove qualquer espacamento padrao do navegador. Isso da controle total ao desenvolvedor.

Na aula, o instrutor demonstra visualmente: ao inspecionar o body no DevTools, aparece a margin de 8px que "ninguem pediu". Ao aplicar o reset, esse espaco desaparece.

## Box Model: content-box vs border-box

### O problema com content-box (padrao)

Por padrao, CSS usa `box-sizing: content-box`. Isso significa que `width` e `height` definem apenas a area de **conteudo**. Padding e border sao somados **por fora**.

Exemplo do instrutor: uma `.container` com `width: 360px` e `padding: 100px`:
- Largura real = 360 + 100 + 100 = **560px**
- O layout quebra, o desenvolvedor fica "quebrando a cabeca" tentando calcular

### A solucao com border-box

Com `box-sizing: border-box`, o `width` inclui padding e border. A caixa **se vira** para acomodar o padding internamente.

Mesma `.container` com `width: 360px` e `padding: 100px`:
- Largura real = **360px** (mantida)
- Area de conteudo = 360 - 100 - 100 = 160px
- O padding e acomodado dentro dos 360px

O instrutor explica: "quando a medida vem da borda, ele mantém os 360 pixels e qualquer preenchimento interno ele vai se virar para tentar colocar."

## Analogia da borda

O instrutor usa a palavra "bordinha, bordinha" para explicar que com `border-box`, a **medida e feita a partir da borda externa da caixa**, nao do conteudo. Tudo que esta dentro (padding, conteudo) se ajusta para caber no tamanho definido.

## Por que resetar e a primeira coisa a fazer

Sem reset, cada elemento comeca com valores diferentes dependendo do navegador. Isso torna o CSS imprevisivel. Com reset, voce parte de uma base limpa e previsivel — zero margin, zero padding, e caixas que respeitam o tamanho que voce define.