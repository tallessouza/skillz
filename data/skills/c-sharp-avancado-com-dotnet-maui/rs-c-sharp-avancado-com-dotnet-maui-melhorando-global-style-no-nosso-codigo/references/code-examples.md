# Code Examples: Organizacao de Global Styles no .NET MAUI

## 1. Criando ButtonStyles.xaml

No Visual Studio: botao direito em `Resources/Styles` → Add New Item → .NET MAUI → .NET MAUI ResourceDictionary

Nome: `ButtonStyles.xaml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Style TargetType="Button" x:Key="PrimaryButton">
        <Setter Property="BackgroundColor" Value="#6750A4" />
        <Setter Property="TextColor" Value="White" />
        <Setter Property="CornerRadius" Value="8" />
        <Setter Property="FontSize" Value="16" />
        <Setter Property="HeightRequest" Value="48" />
    </Style>

    <Style TargetType="Button" x:Key="GoogleLoginButton">
        <Setter Property="BackgroundColor" Value="White" />
        <Setter Property="TextColor" Value="Black" />
        <Setter Property="BorderColor" Value="#DADCE0" />
        <Setter Property="BorderWidth" Value="1" />
        <Setter Property="CornerRadius" Value="8" />
    </Style>

</ResourceDictionary>
```

Apos criar, delete o `ButtonStyles.xaml.cs` (code-behind) e remova `x:Class` do XAML.

## 2. Criando ContentPageStyles.xaml

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Style TargetType="ContentPage" ApplyToDerivedTypes="True">
        <Setter Property="Padding" Value="30,40,30,40" />
    </Style>

</ResourceDictionary>
```

Note o `ApplyToDerivedTypes="True"` — sem isso, paginas como `OnboardingPage` que herdam de `ContentPage` nao receberao o estilo.

## 3. app.xaml final (limpo)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Application xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App">

    <Application.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="Resources/Styles/ButtonStyles.xaml" />
                <ResourceDictionary Source="Resources/Styles/ContentPageStyles.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Application.Resources>

</Application>
```

## 4. Erro comum: code-behind orfao

Se voce deletar `ButtonStyles.xaml.cs` mas deixar isso no XAML:

```xml
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                    x:Class="PlanShare.Resources.Styles.ButtonStyles">
```

O app vai crashar com erro "StaticResource not found" porque o MAUI nao consegue importar o ResourceDictionary.

**Fix:** remova a linha `x:Class`:

```xml
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">
```

## 5. Padding — comparacao de valores

```xml
<!-- Uniforme: 40 em todas as direcoes (pode quebrar em dispositivos menores) -->
<Setter Property="Padding" Value="40" />

<!-- Direcional: esquerda=30, cima=40, direita=30, baixo=40 -->
<Setter Property="Padding" Value="30,40,30,40" />

<!-- Zero: sem espacamento -->
<Setter Property="Padding" Value="0" />

<!-- Explicito zero em todas: base para ajuste fino -->
<Setter Property="Padding" Value="0,0,0,0" />
```

## 6. Heranca que justifica ApplyToDerivedTypes

```csharp
// OnboardingPage.xaml.cs (code-behind gerado automaticamente)
namespace PlanShare.Pages;

public partial class OnboardingPage : ContentPage  // herda de ContentPage
{
    public OnboardingPage()
    {
        InitializeComponent();
    }
}
```

Sem `ApplyToDerivedTypes="True"`, o `<Style TargetType="ContentPage">` nao aplica a `OnboardingPage` porque ela e uma classe derivada, nao uma instancia direta de `ContentPage`.