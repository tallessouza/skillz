# Deep Explanation: Criando Header no Dashboard

## Por que Grid e nao outro layout?

O instrutor visualiza o header como uma tabela de uma unica linha com quatro colunas. Essa analogia de "tabela" e central no .NET MAUI: o Grid e o layout mais poderoso para posicionamento preciso porque permite controle pixel-a-pixel via ColumnDefinitions e RowDefinitions, ao contrario de HorizontalStackLayout que nao permite que uma coluna ocupe "todo o espaco restante".

## A logica do asterisco (star sizing)

Quando voce coloca `*` em uma ColumnDefinition, o .NET MAUI faz uma conta simples:
1. Soma todas as colunas com tamanho fixo (62 + 40 + 40 = 142)
2. Subtrai da largura total disponivel
3. O restante vai para as colunas com `*`

Se voce colocar `*` em multiplas colunas, o espaco restante e dividido igualmente. Se colocar `2*` e `*`, a primeira recebe o dobro da segunda. O instrutor enfatiza isso como uma "pegadinha" do Figma: nao copie a largura do texto do Figma (101px, 112px) porque o nome do usuario varia — use `*`.

## Por que 40px e nao 20px para colunas de icones?

Os icones tem 20px de HeightRequest, mas as colunas sao 40px. O instrutor explica que isso e para area de toque: 20px e muito pequeno para o dedo do usuario clicar. Colocar a coluna com 40px da espaco ao redor do icone, melhorando a usabilidade. Essa e uma pratica de UX importante em mobile.

## Rotacao de imagens: reutilizacao inteligente

O instrutor usa o exemplo do icone do sino inclinado 15 graus e expande para uma analogia com setas: se voce tem uma seta apontando para a direita, nao precisa de 4 imagens diferentes. Basta rotacionar: 0° (direita), 90° (baixo), 180° (esquerda), 270° (cima). Isso reduz o tamanho do app e simplifica a manutencao dos assets.

Valores de Rotation:
- Positivo: rotacao horaria
- Negativo: rotacao anti-horaria
- 0: posicao original

## VerticalStackLayout como agrupador

O Grid nao garante que dois elementos na mesma coluna fiquem um abaixo do outro — eles podem se sobrepor. O VerticalStackLayout dentro da coluna garante empilhamento vertical. O instrutor faz paralelo com o Figma onde os dois textos estao em um "agrupamento".

## Leitura do UserStorage

O padrao e simples: injete o `UserStorage` no construtor da ViewModel, chame `.Get()` que retorna um record com `Id` e `Name`, e acesse `.Name` diretamente. Nao ha necessidade de armazenar o objeto user inteiro — acesse a propriedade especifica que precisa.

Detalhe importante sobre naming no MVVM Toolkit: a propriedade privada `userName` (camelCase) gera automaticamente a propriedade publica `UserName` (PascalCase) via source generator. No XAML, o binding usa `UserName` (PascalCase).

## Sobre RowDefinitions omitido

Quando o Grid tem apenas uma linha, voce nao precisa definir RowDefinitions. O .NET MAUI assume uma unica linha automaticamente. So defina quando tiver multiplas linhas.