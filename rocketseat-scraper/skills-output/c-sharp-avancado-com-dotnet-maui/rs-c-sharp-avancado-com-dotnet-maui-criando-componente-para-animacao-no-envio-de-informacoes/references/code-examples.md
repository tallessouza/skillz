# Code Examples: Componente de Animacao Lottie no .NET MAUI

## Exemplo completo do componente

### AnimationSendInformationComponent.xaml

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skiasharp="clr-namespace:SkiaSharp.Extended.UI.Controls;assembly=SkiaSharp.Extended.UI"
             x:Class="PlanShare.Views.Components.StatusPage.AnimationSendInformationComponent">

    <skiasharp:SKLottieView
        Source="airplane.json"
        VerticalOptions="Center"
        HorizontalOptions="Center"
        RepeatCount="-1"
        HeightRequest="300"
        WidthRequest="300" />

</ContentView>
```

### AnimationSendInformationComponent.xaml.cs (code-behind — sem alteracoes)

```csharp
namespace PlanShare.Views.Components.StatusPage;

public partial class AnimationSendInformationComponent : ContentView
{
    public AnimationSendInformationComponent()
    {
        InitializeComponent();
    }
}
```

## Criando o componente no Visual Studio

1. Botao direito na pasta `Views/Components/StatusPage/`
2. Adicionar → Novo Item
3. Selecionar `.NET MAUI` no menu lateral
4. Escolher `.NET MAUI ContentView`
5. Nomear: `AnimationSendInformationComponent`
6. Pressionar Enter

## Propriedades do SKLottieView explicadas

```xml
<skiasharp:SKLottieView
    Source="airplane.json"          <!-- Nome do arquivo Lottie em Resources/Raw/ -->
    VerticalOptions="Center"        <!-- Centraliza verticalmente -->
    HorizontalOptions="Center"      <!-- Centraliza horizontalmente -->
    RepeatCount="-1"                <!-- -1 = loop infinito -->
    HeightRequest="300"             <!-- Altura em pixels logicos -->
    WidthRequest="300" />           <!-- Largura em pixels logicos -->
```

## Variacoes de RepeatCount

```xml
<!-- Loop infinito (para loading/status) -->
<skiasharp:SKLottieView RepeatCount="-1" Source="loading.json" />

<!-- Executa 1 vez (para animacao de sucesso) -->
<skiasharp:SKLottieView RepeatCount="1" Source="success.json" />

<!-- Executa 3 vezes -->
<skiasharp:SKLottieView RepeatCount="3" Source="notification.json" />
```

## Usando o componente em uma pagina

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:components="clr-namespace:PlanShare.Views.Components.StatusPage"
             x:Class="PlanShare.Views.RegisterAccountPage">

    <VerticalStackLayout>
        <!-- Outros elementos da pagina -->

        <!-- Componente de animacao reutilizavel -->
        <components:AnimationSendInformationComponent />
    </VerticalStackLayout>

</ContentPage>
```

## Estrutura de arquivos necessaria

```
PlanShare/
├── Resources/
│   └── Raw/
│       └── airplane.json              <!-- Arquivo Lottie -->
├── Views/
│   ├── Components/
│   │   └── StatusPage/
│   │       ├── AnimationSendInformationComponent.xaml
│   │       └── AnimationSendInformationComponent.xaml.cs
│   └── RegisterAccountPage.xaml
```

## Pre-requisito: pacote NuGet

O pacote `SkiaSharp.Extended.UI.Controls` deve estar instalado no projeto. Sem ele, o namespace `SkiaSharp.Extended.UI.Controls` nao sera encontrado.

```bash
dotnet add package SkiaSharp.Extended.UI.Controls
```