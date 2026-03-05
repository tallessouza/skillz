# Code Examples: Skeleton Loading em .NET MAUI

## 1. Estrutura de pastas

```
Views/
└── Components/
    └── Skeletons/          # Pasta para todos componentes skeleton
        └── SkeletonView.cs  # Componente base
```

## 2. SkeletonView — Classe completa

```csharp
// Views/Components/Skeletons/SkeletonView.cs
namespace MeuApp.Views.Components.Skeletons;

public class SkeletonView : BoxView
{
    public SkeletonView()
    {
        // Define cor baseada no tema atual
        Color = Application.Current!.GetSkeletonViewColor();

        // Animacao sera adicionada na proxima aula
    }
}
```

## 3. Extension Method para cor do skeleton

```csharp
// Extensions/ApplicationExtensions.cs
public static Color GetSkeletonViewColor(this Application application)
{
    var key = Application.Current!.IsLightMode()
        ? "SkeletonLoadingColorLight"
        : "SkeletonLoadingColorDark";

    return (Color)application.Resources[key];
}
```

### Padrao existente no projeto (referencia)

```csharp
// Metodos ja existentes que seguem o mesmo padrao
public static Color GetPrimaryColor(this Application application)
{
    var key = Application.Current!.IsLightMode()
        ? "PrimaryColorLight"
        : "PrimaryColorDark";

    return (Color)application.Resources[key];
}

public static Color GetLineColor(this Application application)
{
    var key = Application.Current!.IsLightMode()
        ? "LineColorLight"
        : "LineColorDark";

    return (Color)application.Resources[key];
}
```

## 4. Definicao de cores no Resources

```xml
<!-- Resources/Styles/Colors.xaml -->

<!-- Light Mode -->
<Color x:Key="SkeletonLoadingColorLight">#E0E0E0</Color>

<!-- Dark Mode -->
<Color x:Key="SkeletonLoadingColorDark">#3A3A3A</Color>
```

## 5. Uso do BoxView — Propriedades chave

```xml
<!-- Retangulo basico -->
<BoxView
    Color="Blue"
    WidthRequest="200"
    HeightRequest="40" />

<!-- Quadrado -->
<BoxView
    Color="Gray"
    WidthRequest="100"
    HeightRequest="100" />

<!-- Circulo (quadrado com CornerRadius = metade) -->
<BoxView
    Color="Gray"
    WidthRequest="160"
    HeightRequest="160"
    CornerRadius="80" />
```

## 6. Exemplos de skeleton para diferentes componentes

```xml
<!-- Skeleton para avatar circular -->
<local:SkeletonView
    WidthRequest="160"
    HeightRequest="160"
    CornerRadius="80" />

<!-- Skeleton para nome do usuario -->
<local:SkeletonView
    WidthRequest="180"
    HeightRequest="24"
    CornerRadius="4" />

<!-- Skeleton para email (mais largo) -->
<local:SkeletonView
    WidthRequest="240"
    HeightRequest="16"
    CornerRadius="4" />

<!-- Skeleton para bio (multiplas linhas) -->
<local:SkeletonView
    WidthRequest="300"
    HeightRequest="14"
    CornerRadius="4" />
<local:SkeletonView
    WidthRequest="260"
    HeightRequest="14"
    CornerRadius="4" />
```

## 7. Padrao de visibilidade com trigger (referencia do projeto)

```xml
<!-- Padrao usado em login/registro que sera replicado para skeleton -->
<VerticalStackLayout>
    <!-- Skeleton visivel durante loading -->
    <local:SkeletonView
        WidthRequest="160"
        HeightRequest="160"
        CornerRadius="80"
        IsVisible="False">
        <VisualElement.Triggers>
            <DataTrigger
                TargetType="BoxView"
                Binding="{Binding IsLoading}"
                Value="True">
                <Setter Property="IsVisible" Value="True" />
            </DataTrigger>
        </VisualElement.Triggers>
    </local:SkeletonView>

    <!-- Componente real visivel quando dados carregaram -->
    <Image
        Source="{Binding AvatarUrl}"
        WidthRequest="160"
        HeightRequest="160"
        IsVisible="True">
        <VisualElement.Triggers>
            <DataTrigger
                TargetType="Image"
                Binding="{Binding IsLoading}"
                Value="True">
                <Setter Property="IsVisible" Value="False" />
            </DataTrigger>
        </VisualElement.Triggers>
    </Image>
</VerticalStackLayout>
```

## 8. Componentes compostos (antecipado pelo instrutor)

```csharp
// Exemplo de como criar componente composto com skeleton
// (sera implementado em aulas futuras)
namespace MeuApp.Views.Components.Skeletons;

public class SkeletonEntry : ContentView
{
    public SkeletonEntry()
    {
        Content = new SkeletonView
        {
            HeightRequest = 44,
            CornerRadius = 8
        };
    }
}
```