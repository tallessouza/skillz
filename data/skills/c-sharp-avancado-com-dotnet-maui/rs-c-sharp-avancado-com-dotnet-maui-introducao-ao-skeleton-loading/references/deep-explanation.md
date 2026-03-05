# Deep Explanation: Skeleton Loading em .NET MAUI

## Por que Skeleton Loading e nao um spinner?

O instrutor enfatiza que o problema real nao e tecnico — e de **comunicacao**. Quando a pagina abre e os elementos aparecem vazios enquanto a API responde, o usuario interpreta como defeito. A mensagem transmitida e: "toquei aqui e nada aconteceu, o app esta quebrado."

O skeleton loading resolve isso transmitindo: "espera um pouquinho que ja estamos carregando as informacoes pra voce." E uma questao de UX, nao de performance.

## Principio fundamental: Shape Matching

O conceito central do skeleton loading e **cobrir os componentes mantendo o mesmo formato**. O instrutor explica com clareza:

> "Voce nao vai colocar um quadrado de skeleton e quando a informacao ficar pronta, esconder o quadrado e mostrar um circulo. Nao faz sentido."

Quando o skeleton desaparece, nao pode haver "quebra de design". O circulo skeleton vira circulo com avatar. O retangulo skeleton vira retangulo com texto. A transicao deve ser imperceptivel em forma — so muda o conteudo.

## Por que BoxView?

O BoxView e um componente nativo do .NET MAUI que desenha retangulos e quadrados. O instrutor destaca que e "bem flexivel" porque permite controlar:

- **Color** — cor do fundo (cinza claro para skeleton)
- **WidthRequest / HeightRequest** — dimensoes
- **CornerRadius** — arredondamento das bordas

### O truque do circulo

O instrutor explica o raciocinio geometrico: um circulo e um quadrado com bordas totalmente arredondadas. Se o quadrado tem 160x160, o CornerRadius deve ser 80 (metade). Isso arredonda os 4 cantos igualmente, formando um circulo perfeito.

## Por que classe C# e nao XAML?

O instrutor opta por criar uma classe C# pura (sem arquivo .xaml) porque:

1. Nao precisa de layout visual declarativo — as propriedades sao definidas no construtor
2. As animacoes (efeito de reflexo) serao implementadas em codigo C#
3. E mais simples de reutilizar como componente base

## Arquitetura de reutilizacao

O instrutor cria uma pasta `Views/Components/Skeletons/` (plural) porque antecipa:

1. **SkeletonView** — componente base (herda BoxView)
2. **Componentes compostos** — como SkeletonEntry, SkeletonLabel, que usam SkeletonView internamente

Isso evita criar skeleton views individuais repetidamente. A pasta agrupa tudo relacionado a skeleton.

## Padrao de Extension Methods para cores

O projeto ja tinha um padrao estabelecido em `Extensions/ApplicationExtensions.cs` com metodos como `GetPrimaryColor()` e `GetLineColor()`. O instrutor segue o mesmo padrao criando `GetSkeletonViewColor()`, que:

1. Verifica se o tema e Light ou Dark
2. Busca a chave correspondente em `Resources/Styles/Colors`
3. Faz cast para `Color`

As cores ja estavam pre-definidas no arquivo Colors como `SkeletonLoadingColorLight` e `SkeletonLoadingColorDark`.

## Abordagem de triggers e status

O instrutor menciona que o padrao de mostrar/esconder skeleton usa a mesma abordagem ja implementada nas paginas de login/registro: **triggers baseados em status da pagina**. Quando a pagina esta carregando, os skeletons ficam visiveis. Quando os dados chegam, os skeletons somem e os componentes reais aparecem.

## Animacao (proxima aula)

O efeito visual completo do skeleton inclui uma animacao de "reflexo" (shimmer) que percorre o componente da esquerda para a direita. O instrutor separou isso em outra aula para explicar cada parametro da animacao do .NET MAUI em detalhe.