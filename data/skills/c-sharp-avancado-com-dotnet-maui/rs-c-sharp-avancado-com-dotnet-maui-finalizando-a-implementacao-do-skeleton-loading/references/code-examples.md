# Code Examples: Skeleton Loading em .NET MAUI

## 1. Componente original (EntryLabelComponent em Inputs)

```csharp
// Views/Components/Inputs/EntryLabelComponent.xaml.cs
namespace PlanShare.App.Views.Components.Inputs;

public partial class EntryLabelComponent : ContentView
{
    public static readonly BindableProperty TitleProperty = ...;
    public static readonly BindableProperty PlaceholderProperty = ...;
    public static readonly BindableProperty KeyboardTypeProperty = ...;
    public static readonly BindableProperty TextValueProperty = ...;

    public string Title { get; set; }
    public string Placeholder { get; set; }
    public Keyboard KeyboardType { get; set; }
    public string TextValue { get; set; }

    public EntryLabelComponent()
    {
        InitializeComponent();
    }
}
```

## 2. Componente skeleton (copiado e simplificado)

```csharp
// Views/Components/Skeletons/EntryLabelComponent.xaml.cs
namespace PlanShare.App.Views.Components.Skeletons;  // Namespace alterado!

public partial class EntryLabelComponent : ContentView
{
    // Apenas Title mantido — removidos Placeholder, KeyboardType, TextValue
    public static readonly BindableProperty TitleProperty = ...;

    public string Title { get; set; }

    public EntryLabelComponent()
    {
        InitializeComponent();
    }
}
```

```xml
<!-- Views/Components/Skeletons/EntryLabelComponent.xaml -->
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skeleton="clr-namespace:PlanShare.App.Views.Components.Skeletons"
             x:Class="PlanShare.App.Views.Components.Skeletons.EntryLabelComponent">
    <!-- x:Class aponta para o namespace correto de Skeletons -->
    <VerticalStackLayout>
        <Label Text="{Binding Title, Source={x:Reference this}}" />
        <!-- Entry substituida por SkeletonView -->
        <skeleton:SkeletonView HeightRequest="38" CornerRadius="3" />
    </VerticalStackLayout>
</ContentView>
```

## 3. Uso na UserProfilePage

```xml
<!-- UserProfilePage.xaml -->
<VerticalStackLayout IsVisible="{Binding IsLoading}">

    <!-- Skeleton para avatar -->
    <skeleton:SkeletonView WidthRequest="120" HeightRequest="120"
                           CornerRadius="60" />

    <!-- Border com icone de edicao (sempre visivel) -->
    <Border>
        <!-- conteudo do icone de lapis -->
    </Border>

    <!-- Skeleton para campo Nome -->
    <skeleton:EntryLabelComponent Title="Nome" Margin="0,5,0,0" />

    <!-- Skeleton para campo E-mail (sem margem extra) -->
    <skeleton:EntryLabelComponent Title="E-mail" />

    <!-- Botoes desabilitados durante carregamento -->
    <Button Text="Alterar Senha" IsEnabled="False" />
    <Button Text="Atualizar Perfil" IsEnabled="False" />
    <Button Text="Deletar Conta" IsEnabled="False" />

</VerticalStackLayout>
```

## 4. Checklist ao copiar arquivo XAML

```
Ao copiar EntryLabelComponent de Inputs/ para Skeletons/:

1. Ctrl-C, Ctrl-V do arquivo → OK, Visual Studio copia XAML + CodeBehind

2. CodeBehind — alterar namespace:
   ANTES: namespace PlanShare.App.Views.Components.Inputs;
   DEPOIS: namespace PlanShare.App.Views.Components.Skeletons;

3. XAML — alterar x:Class:
   ANTES: x:Class="PlanShare.App.Views.Components.Inputs.EntryLabelComponent"
   DEPOIS: x:Class="PlanShare.App.Views.Components.Skeletons.EntryLabelComponent"

4. Se renomear o arquivo, alterar TAMBEM o nome da classe:
   ANTES: public partial class EntryLabelComponent
   DEPOIS: public partial class NovoNomeComponent
   E no XAML: x:Class="...Skeletons.NovoNomeComponent"
```

## 5. Botoes desabilitados — padrao

```xml
<!-- Padrao para incluir botoes em tela de skeleton loading -->
<Button Text="Acao Qualquer"
        IsEnabled="False"
        Style="{StaticResource PrimaryButton}" />
<!-- IsEnabled="False" impede qualquer interacao durante carregamento -->
```