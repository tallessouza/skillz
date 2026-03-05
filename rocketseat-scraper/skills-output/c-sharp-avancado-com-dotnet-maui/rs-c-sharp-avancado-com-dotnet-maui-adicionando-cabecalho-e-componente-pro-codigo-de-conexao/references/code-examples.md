# Code Examples: PIN Code Viewer Layout

## Exemplo 1: Header com titulo e subtitulo

```xml
<pinCode:PinCodeAuthorizationCodePage.Header>
    <VerticalStackLayout Margin="0,0,0,40" Spacing="20">
        <Label
            Text="{x:Static resource:ResourceText.TitleConnectionCode}"
            FontSize="28"
            HorizontalOptions="Center"
            FontFamily="{x:Static fontFamily:FontFamily.MainFontsBlack}" />
        <Label
            Text="{x:Static resource:ResourceText.SubtitleConnectionCode}"
            FontSize="18"
            FontFamily="{x:Static fontFamily:FontFamily.MainFontsRegular}" />
    </VerticalStackLayout>
</pinCode:PinCodeAuthorizationCodePage.Header>
```

**Notas:**
- `Margin="0,0,0,40"` — sem margem lateral/superior, 40px abaixo para separar do CodeViewer
- `Spacing="20"` — espaco entre titulo e subtitulo
- O titulo usa `MainFontsBlack` (Hello Black) e o subtitulo usa `MainFontsRegular` (Hello Regular)
- O subtitulo NAO tem `HorizontalOptions="Center"` — alinhamento padrao (esquerda)

## Exemplo 2: ShowCodeViewer completo

```xml
<pinCode:PinCodeAuthorizationCodePage.CodeViewer>
    <codeViewer:ShowCodeViewer
        CodeLength="6"
        CodeColor="Transparent"
        CodeStrokeColor="{AppThemeBinding
            Light={StaticResource PrimaryColorLight},
            Dark={StaticResource PrimaryColorDark}}">

        <!-- Shape de cada posicao de digito -->
        <codeViewer:ShowCodeViewer.ShapeViewer>
            <Rectangle
                WidthRequest="50"
                HeightRequest="50"
                RadiusX="10"
                RadiusY="10"
                StrokeThickness="2"
                Stroke="{AppThemeBinding
                    Light={StaticResource PrimaryColorLight},
                    Dark={StaticResource PrimaryColorDark}}" />
        </codeViewer:ShowCodeViewer.ShapeViewer>

        <!-- Estilo do caractere exibido -->
        <codeViewer:ShowCodeViewer.PinCharacterLabel>
            <Label
                FontSize="25"
                HorizontalOptions="Center"
                VerticalOptions="Center"
                FontFamily="{x:Static fontFamily:FontFamily.SecondaryFontsBlack}" />
        </codeViewer:ShowCodeViewer.PinCharacterLabel>

    </codeViewer:ShowCodeViewer>
</pinCode:PinCodeAuthorizationCodePage.CodeViewer>
```

## Exemplo 3: MaskCodeViewer (alternativa — mostra temporariamente)

```xml
<codeViewer:MaskCodeViewer
    CodeLength="6"
    HideCodesAfter="300"
    CodeColor="Transparent"
    CodeStrokeColor="{AppThemeBinding
        Light={StaticResource PrimaryColorLight},
        Dark={StaticResource PrimaryColorDark}}">

    <codeViewer:MaskCodeViewer.ShapeViewer>
        <Rectangle WidthRequest="50" HeightRequest="50"
                   RadiusX="10" RadiusY="10" StrokeThickness="2"
                   Stroke="{AppThemeBinding Light=..., Dark=...}" />
    </codeViewer:MaskCodeViewer.ShapeViewer>

    <codeViewer:MaskCodeViewer.MaskContents>
        <Ellipse WidthRequest="20" HeightRequest="20" Fill="Black" />
    </codeViewer:MaskCodeViewer.MaskContents>

    <codeViewer:MaskCodeViewer.PinCharacterLabel>
        <Label FontSize="25" HorizontalOptions="Center" VerticalOptions="Center"
               FontFamily="{x:Static fontFamily:FontFamily.SecondaryFontsBlack}" />
    </codeViewer:MaskCodeViewer.PinCharacterLabel>

</codeViewer:MaskCodeViewer>
```

**Nota:** `HideCodesAfter="300"` significa que o digito aparece por 300ms e depois e substituido pelo conteudo de `MaskContents`.

## Exemplo 4: Variacao com Ellipse (circulo) no ShapeViewer

```xml
<codeViewer:ShowCodeViewer.ShapeViewer>
    <Ellipse
        WidthRequest="50"
        HeightRequest="50"
        StrokeThickness="2"
        Stroke="{AppThemeBinding
            Light={StaticResource PrimaryColorLight},
            Dark={StaticResource PrimaryColorDark}}" />
</codeViewer:ShowCodeViewer.ShapeViewer>
```

## Exemplo 5: Namespace necessario no XAML

```xml
<!-- No topo do arquivo XAML, adicionar: -->
xmlns:codeViewer="clr-namespace:PinCodeAuthorizationCodePage.CodeViewer;assembly=PinCodeAuthorizationCodePage"

<!-- Tambem garantir os usings para fontes e recursos: -->
xmlns:fontFamily="clr-namespace:App.Fonts"
xmlns:resource="clr-namespace:App.Resources"
```

## Exemplo 6: Recursos de texto no arquivo de resources

```xml
<!-- No arquivo de Resources (.resx): -->
<data name="TitleConnectionCode">
    <value>Código de conexão</value>
</data>
<data name="SubtitleConnectionCode">
    <value>Digite o código de acesso exibido na tela do aplicativo</value>
</data>
```