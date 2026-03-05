# Code Examples: Textos e Estilos Globais no .NET MAUI

## 1. Criando o ResourceDictionary (LabelStyles.xaml)

### Passo 1: Criar o arquivo
No Visual Studio: botao direito em `Resources/Style` → Add New Item → .NET MAUI Resource Dictionary → nome: `LabelStyles`

### Passo 2: Remover code-behind
- Deletar `LabelStyles.xaml.cs`
- Remover `x:Class` do XAML

### Passo 3: Resultado final

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                    xmlns:fontFamily="clr-namespace:PlanShare.Constants">

    <!-- Estilo implicito: default para todos os Labels -->
    <Style TargetType="Label">
        <Setter Property="TextColor" Value="Black" />
        <Setter Property="FontSize" Value="14" />
        <Setter Property="FontFamily"
                Value="{x:Static fontFamily:FontFamily.SecondaryFontRegular}" />
    </Style>

    <!-- Estilo explicito: titulos de pagina -->
    <Style x:Key="PageTitle" TargetType="Label">
        <Setter Property="FontSize" Value="18" />
        <Setter Property="FontFamily"
                Value="{x:Static fontFamily:FontFamily.MainFontBlack}" />
    </Style>
</ResourceDictionary>
```

## 2. Registrar no App.xaml

```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Resources/Style/ButtonStyles.xaml" />
            <ResourceDictionary Source="Resources/Style/ContentPage.xaml" />
            <ResourceDictionary Source="Resources/Style/LabelStyles.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

## 3. Pagina de Registro (RegisterUserAccountPage.xaml)

```xml
<!-- Titulo com estilo explicito -->
<Label Text="Criar minha conta"
       Style="{StaticResource PageTitle}"
       Margin="0,20,0,0" />

<!-- Subtitulo herda estilo implicito (14, WorkSans Regular, Black) -->
<Label Text="Comande sua rotina com facilidade, porque voce merece mais tempo para o que ama"
       Margin="0,20,0,0" />

<!-- Link "Ja possui uma conta? Faca login" -->
<HorizontalStackLayout HorizontalOptions="Center" Margin="0,20,0,0">
    <Label Text="Ja possui uma conta? " />
    <Label Text="Faca login!"
           FontFamily="{x:Static fontFamily:FontFamily.SecondaryFontBlack}"
           TextColor="Blue" />
</HorizontalStackLayout>
```

## 4. Pagina de Login (LoginPage.xaml)

```xml
<!-- Titulo -->
<Label Text="Login" Style="{StaticResource PageTitle}" />

<!-- Texto clicavel com underline e area de toque -->
<VerticalStackLayout HeightRequest="40"
                     Padding="0,7,0,0"
                     Margin="0,40,0,0">
    <Label Text="Esqueceu sua senha?"
           TextDecorations="Underline"
           HorizontalOptions="End" />
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding ForgotPasswordCommand}" />
    </VerticalStackLayout.GestureRecognizers>
</VerticalStackLayout>
```

## 5. TextDecorations — Todas as opcoes

```xml
<!-- Default (nao precisa declarar) -->
<Label Text="Texto normal" />

<!-- Sublinhado -->
<Label Text="Esqueceu sua senha?" TextDecorations="Underline" />

<!-- Riscado -->
<Label Text="R$ 99,90" TextDecorations="Strikethrough" />
```

## 6. Importacao de constantes de fonte no XAML

No topo do arquivo XAML da pagina ou ResourceDictionary:

```xml
xmlns:fontFamily="clr-namespace:PlanShare.Constants"
```

Uso inline (quando precisa sobrescrever apenas a fonte):

```xml
<Label Text="Faca login!"
       FontFamily="{x:Static fontFamily:FontFamily.SecondaryFontBlack}" />
```

## 7. Alinhamento horizontal de texto

```xml
<!-- Alinhado a direita -->
<Label Text="Esqueceu sua senha?" HorizontalOptions="End" />

<!-- Centralizado -->
<Label Text="Texto centralizado" HorizontalOptions="Center" />

<!-- Alinhado a esquerda (default) -->
<Label Text="Texto normal" HorizontalOptions="Start" />
```

## 8. Workaround para centralizacao vertical

```xml
<!-- VerticalOptions="Center" tem bug no MAUI -->
<!-- Use Padding como workaround -->
<VerticalStackLayout HeightRequest="40" Padding="0,7,0,0">
    <Label Text="Texto centralizado verticalmente" />
</VerticalStackLayout>
```

## 9. Margem no Figma → Margin no XAML

Quando o Figma mostra espaçamento de 20px acima de um elemento:

```xml
<!-- Margin="left,top,right,bottom" -->
<Label Text="Subtitulo" Margin="0,20,0,0" />
```

Quando o espaçamento e 40px acima:

```xml
<VerticalStackLayout Margin="0,40,0,0">
    <!-- conteudo -->
</VerticalStackLayout>
```