# Deep Explanation: Fontes Próprias no Angular

## Por que `public/fontes/` e não `src/assets/`?

No Angular moderno, o diretório `public/` contém assets que são copiados diretamente para a distribuição final (build output) sem processamento. Fontes são arquivos binários estáticos que não precisam de transformação pelo bundler. Ao colocá-las em `public/`, o path no CSS fica limpo: `/fontes/arquivo.ttf` — sem necessidade de referenciar `public/` no caminho.

## Variable Fonts vs Static Fonts

O instrutor destaca um conceito importante: **variable fonts**. Um único arquivo `.ttf` contém todas as variações de weight (200-700 no caso do Cascadia Code). Isso é diferente do formato "estático" onde cada weight é um arquivo separado (Bold, ExtraLight, Regular, etc.).

**Variable font:** Um arquivo, todos os weights. Mais moderno, menor tamanho total.
**Static fonts:** Um arquivo por weight. Compatível com navegadores mais antigos.

No `@font-face`, a diferença se manifesta no `font-weight`:
- Variable font: `font-weight: 100 900` (range)
- Static font: `font-weight: 700` (valor exato)

## Itálico Real vs Itálico Simulado

Este é o insight mais valioso da aula. O instrutor demonstra visualmente a diferença:

**Itálico real:** O tipógrafo desenhou cada caractere em ângulo, com curvas e proporções específicas para a leitura inclinada. É um arquivo separado (`CascadiaCode-Italic.ttf`).

**Itálico simulado:** Quando o navegador não encontra a variante itálica declarada via `@font-face`, ele pega a fonte normal e inclina os caracteres matematicamente. O resultado funciona, mas é visualmente inferior — as curvas ficam distorcidas e o espaçamento não é otimizado.

O instrutor mostra ao vivo a troca entre os dois, e a diferença é perceptível. A lição prática: sempre importe a variante itálica quando disponível.

## Por que declarar no styles.css global?

O `@font-face` precisa ser processado antes que qualquer componente tente usar a fonte. O `styles.css` do Angular é carregado globalmente antes da renderização dos componentes. Se você declarar `@font-face` dentro do CSS de um componente (que tem encapsulamento de view), a fonte pode não estar disponível para outros componentes.

## O `font-style` no @font-face como identificador

O `font-style: italic` na declaração `@font-face` não aplica itálico — ele IDENTIFICA para o navegador qual arquivo usar quando `font-style: italic` for solicitado em um seletor CSS. É um mapeamento, não uma aplicação. Por isso ambas as declarações usam o mesmo `font-family`: o navegador diferencia pelo `font-style`.