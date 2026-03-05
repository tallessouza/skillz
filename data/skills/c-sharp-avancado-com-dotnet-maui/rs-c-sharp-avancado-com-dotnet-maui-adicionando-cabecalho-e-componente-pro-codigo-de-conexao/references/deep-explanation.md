# Deep Explanation: PIN Code Viewer Layout no .NET MAUI

## Arquitetura da pagina de conexao

A pagina de codigo de conexao tem uma responsabilidade unica: capturar o codigo digitado pelo usuario. Ela NAO faz comunicacao com API ou SignalR — apenas coleta o codigo e navega para outra pagina que cuida da comunicacao. Essa separacao de responsabilidades e intencional.

## Tres tipos de CodeViewer — quando usar cada um

### HideCodeViewer
A medida que o usuario pressiona botoes, os digitos sao preenchidos mas NAO exibidos. Util para senhas ou PINs de seguranca onde o conteudo nao deve ser visivel.

### ShowCodeViewer
Exibe o codigo normalmente conforme o usuario digita. Ideal para codigos de conexao, verificacao ou qualquer situacao onde nao ha risco de seguranca em mostrar o valor.

### MaskCodeViewer (mostra temporariamente)
Comportamento hibrido — mostra o digito por um curto periodo (configuravel via `HideCodesAfter` em milissegundos) e depois esconde, substituindo por uma mascara (`MaskContents`). Semelhante ao comportamento padrao de campos de senha em dispositivos moveis.

Propriedades extras do MaskCodeViewer:
- `HideCodesAfter`: tempo em milissegundos ate esconder (ex: 300ms)
- `MaskContents`: elemento visual que substitui o digito (pode ser Ellipse, Label, Image, qualquer View)

```xml
<codeViewer:MaskCodeViewer.MaskContents>
    <Ellipse WidthRequest="20" HeightRequest="20" Fill="Black" />
</codeViewer:MaskCodeViewer.MaskContents>
```

## Bug do .NET 9 com estilos globais

Quando se utiliza uma biblioteca externa para construir paginas no .NET MAUI, os estilos globais definidos no `App.xaml` ou `Styles.xaml` NAO propagam para elementos dentro dessas paginas. Isso e descrito pelo instrutor como um "bugzinho do .NET 9". A solucao e passar todos os estilos (FontFamily, FontSize, etc.) explicitamente em cada elemento.

Por isso e fundamental ter o `using` do namespace de fontes no arquivo XAML — sem ele, nao seria possivel referenciar as fontes via `{x:Static}`.

## Propriedades do CodeViewer (comuns a todos os tipos)

| Propriedade | Default | Descricao |
|-------------|---------|-----------|
| `CodeLength` | 4 | Quantidade de digitos do codigo |
| `Spacing` | (default da lib) | Espacamento entre os shapes dos digitos |
| `CodeColor` | — | Cor de fundo do shape quando tem digito |
| `CodeStrokeColor` | — | Cor da borda do shape quando tem digito |
| `ShapeViewer` | — | Geometria de cada posicao (Rectangle, Ellipse) |
| `PinCharacterLabel` | — | Label que exibe o caractere digitado |

## Header e SubHeader

A biblioteca oferece duas areas de conteudo customizavel:
- **Header**: acima do PIN Code Viewer — aceita qualquer layout (VerticalStackLayout, imagens, etc.)
- **SubHeader**: abaixo do PIN Code Viewer — util para links como "reenviar codigo" ou instrucoes adicionais

Ambas sao propriedades da pagina `PinCodeAuthorizationCodePage` e aceitam qualquer `View` como conteudo.

## Decisoes de design do instrutor

- `CodeColor="Transparent"` porque o design no Figma mostra fundo transparente nos quadrados
- `CodeStrokeColor` usa `AppThemeBinding` porque a cor da borda muda entre Light e Dark mode
- `Rectangle` 50x50 com `RadiusX/RadiusY=10` para bordas arredondadas conforme o Figma
- `StrokeThickness="2"` para borda sutil
- Label do caractere usa fonte `SecondaryFontsBlack` tamanho 25, centralizado vertical e horizontalmente