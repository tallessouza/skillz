# Deep Explanation: Funções de Cores no CSS

## RGB — Red, Green, Blue

RGB trabalha com três canais aditivos de luz:
- **Red (Vermelho):** 0 a 255 — 0 é ausência, 255 é máximo
- **Green (Verde):** 0 a 255
- **Blue (Azul):** 0 a 255

Quando todos estão em 0, o resultado é preto. Quando todos em 255, branco puro. A combinação dos três canais gera qualquer cor no espectro sRGB.

O instrutor demonstra: `rgb(255, 40, 60)` resulta num vermelho forte com leves toques de verde e azul — um vermelho levemente alaranjado/rosado.

### Limitação do RGB
RGB não é intuitivo para humanos. Se alguém pede "um azul mais claro", em RGB você precisa aumentar os três canais de formas diferentes. Em HSL, basta aumentar a luminosidade.

## HSL — Hue, Saturation, Lightness

O instrutor menciona que usa HSL bastante, e por boas razões:

### Hue (Matiz): 0 a 360
Representa a posição no círculo cromático:
- 0° = vermelho
- 60° = amarelo
- 120° = verde
- 180° = ciano
- 240° = azul
- 300° = magenta
- 360° = vermelho (volta ao início)

### Saturation (Saturação): 0% a 100%
O instrutor explica usando o Color Picker do DevTools:
- **100%** = cor totalmente saturada (vívida)
- **0%** = sem saturação (escala de cinza)

No Color Picker, a saturação vai do eixo X: esquerda (sem saturação) para direita (saturada).

### Lightness (Luminosidade): 0% a 100%
- **0%** = preto total (independente do hue)
- **50%** = a cor pura
- **100%** = branco total (independente do hue)

O instrutor explica o eixo Y do Color Picker: de 0% (embaixo, escuro) até 50% (meio), depois eixo X de 50% até 100% (branco total).

### Por que HSL é preferido
- Ajustar "claridade" = mudar só o L
- Ajustar "vivacidade" = mudar só o S
- Mudar completamente a cor = mudar só o H
- Cada canal tem significado humano claro

## Alpha (Opacidade)

Tanto RGB quanto HSL aceitam um quarto valor — o canal alpha:
- `rgb(255 40 60 / 0.5)` — 50% transparente
- `hsl(270 80% 50% / 0.8)` — 20% transparente

O instrutor também menciona que hexadecimal aceita alpha: os dois dígitos extras no final (ex: `#ff2840cc`).

### Alpha vs Opacity
- `alpha` na função de cor: afeta **só aquela declaração** de cor
- `opacity` na propriedade: afeta **o elemento inteiro e seus filhos**

## Color Mix

Função moderna do CSS para mesclar duas cores:

```css
color-mix(in <espaço-de-cor>, <cor1>, <cor2>)
```

O instrutor demonstra misturando vermelho com amarelo em HSL, resultando em laranja. O browser interpola entre as duas cores no espaço de cor especificado.

### Por que declarar o espaço de cor
A interpolação em `srgb` produz resultados diferentes de `hsl` ou `lab`. Em HSL, a interpolação segue o círculo cromático (vermelho → amarelo passa pelo laranja). Em sRGB, a interpolação é linear nos canais RGB (pode produzir tons "enlameados").

### Aplicações práticas do color-mix
- Gerar hover states: `color-mix(in hsl, var(--primary), white 20%)`
- Criar paletas derivadas de uma cor base
- Mesclar cores de tema sem cálculo manual

## Onde aplicar cores no CSS

O instrutor lista: `color` (fonte), `border-color`, `background-color`, e qualquer propriedade que aceite valor de cor.