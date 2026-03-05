# Code Examples: Teclado Numerico Customizado em .NET MAUI

## 1. Namespace XAML necessario

```xml
<!-- Adicionar no topo do arquivo XAML, junto com os outros xmlns -->
xmlns:pinCode="clr-namespace:PinCode;assembly=PinCode"
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

O `pinCode` e para o componente KeyboardView. O `toolkit` e para o `IconTintColorBehavior` que permite tinting de SVGs.

## 2. KeyboardView basico (da documentacao)

```xml
<!-- Versao minima da documentacao — NAO usar em producao -->
<pinCode:KeyboardView>
    <pinCode:KeyboardView.ShapeViewer>
        <Button BackgroundColor="Transparent" />
    </pinCode:KeyboardView.ShapeViewer>
</pinCode:KeyboardView>
```

Problema: botoes transparentes, sem cor de texto, sem backspace customizado.

## 3. KeyboardView completo customizado

```xml
<pinCode:KeyboardView
    ColumnSpacing="40"
    RowSpacing="20"
    Margin="0,50,0,0">

    <!-- Estilo dos botoes numericos (0-9) -->
    <pinCode:KeyboardView.ShapeViewer>
        <Button
            BackgroundColor="{AppThemeBinding
                Light={StaticResource KeyboardColorLight},
                Dark={StaticResource KeyboardColorDark}}"
            TextColor="{AppThemeBinding
                Light={StaticResource PrimaryColorLight},
                Dark={StaticResource PrimaryColorDark}}"
            CornerRadius="15"
            HeightRequest="60"
            WidthRequest="60"
            FontSize="24" />
    </pinCode:KeyboardView.ShapeViewer>

    <!-- Botao de apagar (backspace) -->
    <pinCode:KeyboardView.BackspaceViewer>
        <ImageButton
            Padding="{OnPlatform Android='12', iOS='10'}"
            Background="Transparent"
            Source="icon_erase.svg">
            <ImageButton.Behaviors>
                <toolkit:IconTintColorBehavior
                    TintColor="{AppThemeBinding
                        Light=Black,
                        Dark=White}" />
            </ImageButton.Behaviors>
        </ImageButton>
    </pinCode:KeyboardView.BackspaceViewer>

</pinCode:KeyboardView>
```

## 4. Definicao de cores em Colors.xaml

```xml
<!-- Arquivo: Resources/Styles/Colors.xaml -->
<Color x:Key="KeyboardColorLight">#BEBEBE</Color>
<Color x:Key="KeyboardColorDark">#19B5FE</Color>
<Color x:Key="PrimaryColorLight">#000000</Color>
<Color x:Key="PrimaryColorDark">#FFFFFF</Color>
```

## 5. ViewModel que recebe o codigo

```csharp
// No ViewModel da pagina de conexao
// Esta funcao e chamada automaticamente quando o usuario completa o codigo
public void OnCodeCompleted(string code)
{
    // code contem os digitos digitados, ex: "123456"
    // Aqui voce conecta com o Hub, envia o codigo, etc.
}
```

## 6. Estrutura da pagina completa (ordem dos elementos)

```xml
<ContentPage>
    <!-- Outros elementos da pagina -->

    <!-- CodeViewer (implementado em aula anterior) -->
    <pinCode:CodeViewer ... />

    <!-- Separacao de 50px -->

    <!-- KeyboardView (implementado nesta aula) -->
    <pinCode:KeyboardView
        Margin="0,50,0,0"
        ColumnSpacing="40"
        RowSpacing="20">
        <!-- ShapeViewer + BackspaceViewer -->
    </pinCode:KeyboardView>
</ContentPage>
```

## 7. LeftSideButtonShapeViewer (opcional, NAO usado)

```xml
<!-- EXEMPLO da documentacao — deletado neste projeto -->
<!-- Seria um botao especial a esquerda do zero (ex: Face ID) -->
<pinCode:KeyboardView.LeftSideButtonShapeViewer>
    <Button Text="FaceID" />
</pinCode:KeyboardView.LeftSideButtonShapeViewer>
```

O instrutor deletou esta propriedade porque o design nao usa esse espaco.

## 8. Checklist de teste

```
[ ] Light Mode: botoes com fundo cinza (#BEBEBE)
[ ] Light Mode: texto dos numeros na cor primaria escura
[ ] Light Mode: icone de backspace preto
[ ] Dark Mode: botoes com fundo azul (#19B5FE)
[ ] Dark Mode: texto dos numeros na cor primaria clara
[ ] Dark Mode: icone de backspace branco
[ ] Digitar 6 digitos aciona a funcao da ViewModel
[ ] Backspace apaga o ultimo digito
[ ] Espacamento entre teclado e CodeViewer esta correto (~50px)
```