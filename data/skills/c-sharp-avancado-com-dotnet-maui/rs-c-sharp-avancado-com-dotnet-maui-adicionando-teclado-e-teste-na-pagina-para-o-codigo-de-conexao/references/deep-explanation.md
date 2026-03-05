# Deep Explanation: Teclado Numerico Customizado em .NET MAUI

## Por que o teclado e um grid

O instrutor explica que o teclado numerico do PinCode e internamente uma tabela/grid. As propriedades `ColumnSpacing` e `RowSpacing` controlam o espacamento entre colunas e linhas dessa tabela. Nao ha nada de especial — e o mesmo conceito de um Grid MAUI normal aplicado ao layout dos botoes.

## ShapeViewer: cada numero e um botao

Cada "quadradinho" no teclado e um Button individual. O ShapeViewer define o template/estilo que TODOS os botoes numericos vao usar. Voce passa um Button com as propriedades desejadas (cor, borda arredondada, tamanho da fonte, altura, largura) e o componente replica esse estilo para todos os 10 digitos.

## BackspaceViewer: Button vs ImageButton

A documentacao do PinCode oferece duas opcoes para o botao de apagar:
- **Button**: botao com texto
- **ImageButton**: botao com imagem

O instrutor escolhe ImageButton porque permite usar um icone SVG exportado do Figma (`icon_erase.svg`). A vantagem crucial e que com SVG + `IconTintColorBehavior` do CommunityToolkit, voce consegue trocar a cor do icone dinamicamente baseado no tema (preto no Light Mode, branco no Dark Mode).

## LeftSideButtonShapeViewer: opcional

A documentacao mostra que existe um espaco a esquerda do zero onde voce pode colocar qualquer botao especial (ex: Face ID). O instrutor mostra que no design do app esse espaco fica vazio, entao ele simplesmente deleta essa propriedade do codigo. Nao e obrigatorio usar.

## AppThemeBinding: o padrao para temas

O padrao recorrente no curso e usar `{AppThemeBinding Light=..., Dark=...}` para QUALQUER propriedade visual que muda entre temas. Para cores definidas como resources, combina-se com `{StaticResource NomeDaCor}`. As cores devem estar definidas no arquivo `Colors.xaml` dentro da pasta Styles/Resources.

Cores usadas nesta aula:
- `KeyboardColorLight`: #BEBEBE (cinza claro)
- `KeyboardColorDark`: #19B5FE (azul)
- `PrimaryColorLight` e `PrimaryColorDark`: cores do texto dos numeros

## Padding por plataforma

O instrutor usa `Padding="{OnPlatform Android='12', iOS='10'}"` no ImageButton do backspace. Ele menciona que ja tinha testado essas numeracoes antes — cada plataforma renderiza padding de forma ligeiramente diferente, entao ajustes especificos sao necessarios.

## Fluxo de teste com ViewModel

Apos implementar o teclado, o instrutor coloca um breakpoint na funcao da ViewModel que recebe o codigo digitado. Ao tocar nos botoes do teclado, a funcao e chamada automaticamente com o codigo como parametro. Ele testa:
1. Digitar 6 digitos (123456) — verifica que o breakpoint bate e o valor esta correto
2. Usar backspace para apagar — verifica que funciona
3. Digitar novo codigo (475809) — confirma funcionamento
4. Trocar para Dark Mode — verifica cores do teclado (azul), cor do icone SVG (branco), e funcionalidade completa

## Hot Reload vs Rebuild

O instrutor nota que alteracoes no KeyboardView (adicionar Margin, trocar TextColor) nem sempre funcionam com Hot Reload — as vezes e necessario um rebuild completo. O primeiro build demora mais, mas rebuilds subsequentes sao rapidos.