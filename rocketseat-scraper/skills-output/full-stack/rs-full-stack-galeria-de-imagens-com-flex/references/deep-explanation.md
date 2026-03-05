# Deep Explanation: Galeria de Imagens com Flexbox

## Por que flex e nao grid para galerias simples?

Flexbox e ideal para galerias onde as imagens tem tamanho uniforme e o layout e uma simples sequencia que quebra linha. O instrutor escolhe flex porque:

1. **Simplicidade** — `display: flex` + `flex-wrap: wrap` resolve o problema inteiro em duas propriedades
2. **Reorganizacao automatica** — ao redimensionar a janela, as imagens se reorganizam naturalmente sem media queries
3. **Menor overhead cognitivo** — nao precisa definir grid-template-columns ou pensar em tracks

Grid seria mais adequado quando voce precisa de controle preciso sobre linhas E colunas simultaneamente, ou layouts assimetricos.

## O comportamento padrao do flex (e por que wrap e essencial)

Quando voce aplica `display: flex`, o comportamento padrao e `flex-wrap: nowrap`. Isso significa que TODOS os filhos ficam numa unica linha, mesmo que isso extrapole o container. O instrutor demonstra isso ao vivo: as imagens "vazam" para a lateral.

Ao adicionar `flex-wrap: wrap`, o flex passa a quebrar linha quando nao ha espaco suficiente. As imagens que nao cabem na linha atual descem para a proxima. Esse e o comportamento desejado para galerias.

## object-fit: cover — o segredo para imagens consistentes

Nem toda foto e um quadrado perfeito. Quando voce define `width: 286px` e `height: 286px` numa imagem retangular, sem object-fit ela distorce (estica ou achata).

`object-fit: cover` resolve isso fazendo a imagem:
- Preencher TODO o espaco definido (286x286)
- Manter o aspect ratio original
- Cortar o excesso (as bordas que nao cabem sao cortadas)

E como se a imagem fosse uma moldura: ela sempre preenche, cortando o que sobra.

## padding-block vs padding

O instrutor usa `padding-block: 24px` ao inves de `padding: 24px`. A diferenca:

- `padding-block` aplica padding apenas no eixo do bloco (topo e base em layouts horizontais)
- `padding` aplicaria nos 4 lados
- O espacamento lateral ja e tratado pelo container (`.container`), entao so precisa do vertical

## Gap vs Margin

O instrutor usa `gap: 24px` ao inves de margins nas imagens. Vantagens do gap:

1. **Sem margin collapse** — gap nunca colapsa, margins sim
2. **Sem espacamento extra nas bordas** — gap so aplica ENTRE elementos, margin aplicaria tambem na primeira e ultima imagem
3. **Uma unica propriedade** — ao inves de `margin-right` + `margin-bottom` com reset na ultima coluna

## Separacao de CSS em arquivos

O instrutor cria `main.css` como arquivo separado e importa com `@import main.css`. Esse padrao organiza o CSS por secao semantica da pagina, facilitando manutencao.

## Textos alternativos (alt)

O instrutor menciona que o ideal seria colocar textos alternativos nas imagens, mas opta por nao fazer por questao de tempo. Em producao, SEMPRE inclua `alt` descritivo para acessibilidade.