# Deep Explanation: Formatos de Imagem (PNG, JPG, SVG)

## Rasterizado vs Vetorial — O conceito fundamental

O instrutor explica que toda imagem se categoriza em dois tipos:

**Rasterizada:** composta por pixels — pontinhos quadrados coloridos. Quando voce olha o conjunto, enxerga uma foto ou ilustracao. O problema: pixels tem tamanho fixo. Ao expandir uma imagem de 5x5 (25 pixels) para 7x7 (49 pixels), surgem 24 pixels que precisam ser preenchidos.

**Vetorial:** composta por equacoes matematicas. Altura e largura sao variaveis da equacao. O resultado e sempre correto independente dos valores passados. "Eu posso ficar brincando com a imagem vetorial de aumentar, diminuir, que nao vai fazer diferenca nenhuma porque aquilo esta sendo calculado matematicamente."

## Interpolacao de imagem

Quando uma imagem rasterizada e redimensionada, algoritmos de interpolacao tentam resolver o problema dos pixels extras:

- **Vizinho mais proximo:** copia a cor do pixel adjacente mais proximo
- **Bilinear:** calcula media entre pixels vizinhos
- **Bicubico:** usa mais vizinhos para calculo mais suave

O instrutor enfatiza: "o algoritmo nao e perfeito." Quanto mais voce redimensiona, mais visiveis ficam as falhas — bordas serrilhadas ("parece uma serrinha"), imagens borradas, quadradinhos visiveis.

## Demonstracao pratica no Figma

O instrutor demonstrou expandindo uma imagem JPG de 2000x2000:
- Em 5000x5000: ja comeca a borrar sem zoom profundo
- Em 10000x10000: com pouco zoom, borrao visivel no rosto e textos
- Em 50000x50000: claramente serrilhado e borrado

A mesma imagem em SVG (originalmente 350x350) expandida para 50000x50000: "olha que lindo, nao tem nada de borrado, nada serrilhado."

O instrutor destaca: "a imagem original ajuda — quanto maior a imagem, os algoritmos vao funcionar melhor" — mas o problema persiste porque e inerente ao formato rasterizado.

## Importancia para apps responsivos

"Essa imagem vai ser redimensionada. Eu posso estar utilizando o meu telefone para ver esse app, so que o mesmo codigo ele vai funcionar num tablet. Acha mesmo que aquela imagem vai ter o mesmo tamanho no telefone e no tablet?"

Este e o argumento central para SVG em aplicacoes .NET MAUI: o mesmo app roda em dispositivos com telas drasticamente diferentes.

## SVG como XML manipulavel

O instrutor abre um SVG no Notepad++ e mostra que cada `<path>` tem uma formula matematica cobrindo uma area. Ele troca `fill="black"` por `fill="blue"`, salva, e a cor muda instantaneamente.

Demonstra tambem que cores podem ser em nome (`blue`, `red`, `green`) ou hexadecimal (`#FF69B4`), com hashtag na frente.

## Spoiler do instrutor sobre dark mode

"Imagina que o app vai ter dark mode e light mode. O icone vai ter que ser trocado de cor. Se temos uma imagem em SVG, o nosso codigo consegue manipular e trocar para colocar a cor certinha para dar o contraste."

Isso antecipa que no curso, SVGs serao manipulados programaticamente no .NET MAUI para adaptar icones ao tema do app.

## JPG perde qualidade a cada salvamento

O instrutor explica que abrir → salvar → abrir → salvar repetidamente um JPG degrada progressivamente a qualidade. Isso acontece porque JPG usa compressao com perda (lossy), e cada ciclo de salvamento reaplica a compressao.

## Significado das siglas

| Sigla | Significado |
|-------|-------------|
| PNG | Portable Network Graphics |
| JPG/JPEG | Joint Photograph Experts Group |
| SVG | Scalable Vector Graphics |