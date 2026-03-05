# Deep Explanation: Ajustando o Conteúdo do Card

## Por que `<figure>` ao invés de `<div>`?

O instrutor faz uma reestruturação deliberada: troca divs por figure nos cards. A razão é semântica — `<figure>` existe especificamente para conteúdo que carrega informação extra associada (figcaption). Serve para:

- Imagens com descrição/referência
- Áudios com explicação
- Vídeos com legenda
- Qualquer mídia com contexto textual

A vantagem prática: ao invés de ter "um monte de divs pra tudo quanto é lado", figure comunica a relação entre a mídia e sua legenda tanto para o browser quanto para leitores de tela.

## O problema do texto invisível (overflow: hidden)

O instrutor demonstra um problema comum: após adicionar o figcaption com span e h2, o texto não aparece. A primeira reação seria pensar que é a tag nova, mas não — é o CSS.

O card usa `position: relative` com a imagem cobrindo tudo de forma absoluta, e `overflow: hidden` cortando tudo que transborda. O figcaption fica "abaixo" da área visível.

**Solução:** Posicionar o figcaption com `position: absolute` e `bottom: 0`, ancorando-o na base do card dentro da área visível. O padding de 24px dá o respiro visual.

**Lição:** Quando conteúdo não aparece, antes de culpar o HTML, investigue o CSS — especialmente `overflow: hidden` e posicionamento.

## Display inline-block: o melhor dos dois mundos

O instrutor cria a classe `.content-tag` e explica por que usa `display: inline-block`:

### Problema com `block`:
- A tag ocupa toda a largura disponível
- Background-color se estende além do texto

### Problema com `inline`:
- Padding vertical (top/bottom) existe visualmente mas NÃO é calculado no layout
- O elemento não "empurra" vizinhos verticalmente
- O padding aparece mas se sobrepõe a outros elementos

### Solução: `inline-block`
- Mantém o tamanho ajustado ao conteúdo (comportamento inline)
- Calcula padding vertical corretamente (comportamento block)
- É independente da tag HTML — funciona em `<span>`, `<div>`, qualquer uma

O instrutor demonstra visualmente a diferença comentando/descomentando o `display: inline-block`.

## Box-shadow explicado passo a passo

O instrutor mostra como descobriu o box-shadow: copiando o CSS computado do design e filtrando o que importa. A maioria das propriedades copiadas "literalmente não importam" — o importante é o box-shadow.

### Os 4 valores:
1. **Offset horizontal (X):** Move a sombra para a direita (positivo) ou esquerda (negativo). `0px` = centralizada horizontalmente.
2. **Offset vertical (Y):** Move a sombra para baixo (positivo) ou cima (negativo). `4px` = levemente abaixo.
3. **Blur radius:** Quanto a sombra se espalha/borra. `16px` = suave e difusa.
4. **Cor:** Geralmente RGBA para controlar transparência. `rgba(17,18,19,0.4)` = quase preta com 40% de opacidade.

### RGBA explicado:
- R (0-255): vermelho. 255 = muito vermelho, 0 = sem vermelho
- G (0-255): verde
- B (0-255): azul
- A (0-1): alpha/transparência. 0 = invisível, 1 = opaco

Os dois últimos dígitos em hexadecimal (#RRGGBBAA) controlam transparência. Por isso RGBA é preferido para sombras — a transparência é essencial.

## Utility classes para fontes

O instrutor cria utilitários tipográficos antecipando as necessidades:

- `text-2xl` → para h1 (extra grande)
- `text-xl` → para h2
- `text-lg` → para h3
- `text-sm` → para textos menores

Cada um usa CSS variables (`var(--font-size-2xl)`, etc.) para manter consistência com o design system.

## Letter-spacing com `em`

O instrutor usa `letter-spacing: 0.04em` e explica que `em` é relativo ao `font-size` do pai (na verdade, do próprio elemento). Isso significa que o espaçamento entre letras escala proporcionalmente com o tamanho da fonte, mantendo a proporção visual independente do tamanho.

A diferença visual é sutil mas perceptível: sem letter-spacing as letras ficam "grudadinhas", com 0.04em há uma separação elegante — especialmente importante em texto `uppercase`.