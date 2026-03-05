# Deep Explanation: Organizando os Assets

## Por que organizar antes de codar?

O instrutor enfatiza que a organizacao dos assets deve ser o **primeiro passo** antes de qualquer codigo. A razao e pratica: quando voce esta no meio da implementacao CSS e descobre que falta um icone ou que o arquivo esta com nome errado, voce perde o fluxo de trabalho. A interrupcao para voltar ao Figma, exportar, nomear e organizar no meio do desenvolvimento e custosa em termos de foco.

## O atalho de exportacao batch do Figma

O Figma permite que designers marquem elementos como "exportaveis" no painel de design. Quando o projeto esta bem organizado (como o Style Guide usado na aula), o atalho **Ctrl+Shift+E** (Windows) ou **Cmd+Shift+E** (Mac) exporta todos esses elementos de uma vez. Isso evita clicar elemento por elemento.

Porem, nem todos os assets estao marcados para exportacao automatica. O instrutor mostra que a logo e o icone arrow-right-hover precisaram ser exportados manualmente — clicando no elemento e usando o painel Export individualmente.

## Decisao de formato: SVG vs PNG

- **SVG** para logos e icones: sao graficos vetoriais, escalam infinitamente, pesam menos, e podem ser manipulados via CSS (cor, tamanho)
- **PNG** para fotografias, ads e imagens complexas: preservam detalhes rasterizados que SVG nao consegue representar

O instrutor exporta a logo como SVG explicitamente, e as fotos/ads ficam em PNG (exportacao default do Figma para esses tipos).

## Convencao de nomeacao com estado

O exemplo mais importante da aula e a diferenciacao entre `arrow-right.svg` (branco, estado normal) e `arrow-right-hover.svg` (azul, estado hover). O instrutor explica:

- No Style Guide, o icone hover aparece azul
- Ao exportar, o Figma exporta exatamente o que esta visivel — entao o azul e exportado como arquivo separado
- O sufixo `-hover` no nome indica **quando** aquele asset e usado, nao apenas **o que** ele e

Essa convencao se estende para outros estados: `-active`, `-disabled`, `-focus`.

## Estrutura hierarquica

A decisao de criar `assets/icons/`, `assets/images/` em vez de uma pasta plana vem da escala do projeto. Com 18+ imagens, icones variados, ads e logo, uma pasta plana seria caos. A hierarquia por tipo permite:

1. Encontrar assets rapidamente
2. Aplicar regras de build diferentes por tipo (ex: otimizar PNGs, inline SVGs)
3. Manter o projeto navegavel para outros desenvolvedores

## O commit como checkpoint

O instrutor finaliza a aula fazendo commit das alteracoes. Isso reforca que a organizacao dos assets e uma tarefa completa e merece seu proprio commit — nao deve ser misturada com codigo CSS ou HTML.