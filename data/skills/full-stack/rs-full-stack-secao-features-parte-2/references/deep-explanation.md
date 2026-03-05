# Deep Explanation: Seção Features parte 2 — Grid, Filters e Posicionamento

## Modelo mental das Grid Lines

O instrutor enfatiza um ponto crucial que confunde muitos devs: **grid lines não são cells, são as bordas entre cells**.

Para um grid de 2 rows:
```
Linha 1 ─────────────
         [  Row 1   ]
Linha 2 ─────────────
         [  Row 2   ]
Linha 3 ─────────────
```

Quando ele diz `grid-row: 2 / 3`, significa: "comece na linha 2 (entre row 1 e row 2) e termine na linha 3 (fundo do grid)". Isso posiciona o card na segunda fileira.

Para colunas com 4 slots:
```
Col1  Col2  Col3  Col4  Col5
  |  1  |  2  |  3  |  4  |
```

`grid-column: 1 / 3` = ocupa colunas 1 e 2. `grid-column: 3 / 5` = ocupa colunas 3 e 4.

## Overflow hidden como contenção

O instrutor coloca imagens com `position: absolute` dentro dos cards. Sem `overflow: hidden`, essas imagens "transbordam" — ficam visíveis fora dos limites do card. O `overflow: hidden` funciona como uma "caixinha" que corta tudo que sai.

Ponto importante: o `position: relative` no pai é obrigatório para que o `position: absolute` do filho seja relativo ao card, não à página inteira.

## CSS Filter — Catálogo completo demonstrado

O instrutor faz um tour pelos filtros CSS disponíveis:

| Filtro | O que faz | Exemplo |
|--------|-----------|---------|
| `grayscale(1)` | Preto e branco | Imagem sem cores |
| `blur(5px)` | Embaça | Efeito desfocado |
| `brightness(1.5)` | Brilho | Mais claro |
| `contrast(2)` | Contraste | Mais definido |
| `hue-rotate(230deg)` | Gira a "rodinha" de cor HSL | Muda todas as cores |
| `invert(1)` | Inverte cores | Negativo fotográfico |
| `opacity(0.5)` | Transparência | Semi-transparente |
| `saturate(2)` | Mais saturação | Cores mais vivas |
| `sepia(1)` | Tom envelhecido | Efeito "foto antiga" |
| `drop-shadow(...)` | Sombra na forma real | Respeita transparência |

### Hue-rotate explicado

O "H" em HSL significa Hue — é uma roda de 0° a 360°. O `hue-rotate` gira essa roda para todas as cores da imagem. 0° = original, 180° = cores complementares, 360° = volta ao original.

O instrutor demonstra girando: 21° (mais vermelho), 111° (mais verde), 230° (mais azul).

### Drop-shadow vs Box-shadow

`box-shadow` aplica sombra no **retângulo** do elemento. `drop-shadow` aplica sombra na **forma visual real** — se a imagem tem transparência (PNG/SVG), a sombra segue o contorno da imagem.

Parâmetros do `drop-shadow`:
```
drop-shadow(offset-x offset-y blur-radius color)
drop-shadow(1rem 1rem 4rem rgba(0,0,0,0.34))
```

- `1rem` horizontal — desloca sombra para direita
- `1rem` vertical — desloca sombra para baixo
- `4rem` espalhamento (blur) — quanto maior, mais suave
- `rgba(0,0,0,0.34)` — preto com 34% de opacidade (bem sutil)

O instrutor mostra que com espalhamento 0, a sombra é uma cópia dura. Com 4rem, fica "quase imperceptível, mas tá ali e tá bem levinho".

## Margin-left: auto para empurrar conteúdo

Técnica clássica: em contexto block ou flex, `margin-left: auto` "consome" todo espaço disponível à esquerda, empurrando o elemento para a direita. O instrutor usa isso no card 4 para inverter a posição do conteúdo em relação à imagem decorativa.

## Estratégia de posicionamento por card

| Card | grid-column | grid-row | Imagem decorativa | Extras |
|------|------------|----------|-------------------|--------|
| 3 | 4 / 5 | — | — | — |
| 4 | 1 / 3 | 2 / 3 | left: 2rem (invertida) | margin-left: auto |
| 5 | 3 / 5 | 2 / 3 | top (em vez de bottom) | — |

## Ícones Phosphor usados

O instrutor referencia ícones da biblioteca Phosphor Icons:
- `microphone-stage` — para "grave suas performances"
- `community` / `users-three` — para funcionalidade social
- `music-notes` — para funcionalidade musical
- `game-controller` — mencionado como referência anterior