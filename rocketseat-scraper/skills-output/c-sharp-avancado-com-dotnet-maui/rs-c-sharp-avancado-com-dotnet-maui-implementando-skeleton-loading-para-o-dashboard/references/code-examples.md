# Code Examples: Skeleton Loading para Dashboard (.NET MAUI)

## Exemplo completo: xmlns para SkeletonView

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skeleton="clr-namespace:YourApp.Components"
             xmlns:models="clr-namespace:YourApp.Models">
```

## Exemplo completo: SkeletonView substituindo AvatarView

```xml
<!-- Elemento real -->
<AvatarView HeightRequest="62"
            WidthRequest="62"
            CornerRadius="31"
            Source="{Binding AvatarUrl}"/>

<!-- Skeleton equivalente -->
<skeleton:SkeletonView HeightRequest="62"
                       WidthRequest="62"
                       CornerRadius="31"/>
```

## Exemplo completo: SkeletonView substituindo Label

```xml
<!-- Elemento real -->
<Label Text="{Binding UserName}"
       FontSize="16"/>

<!-- Skeleton equivalente -->
<skeleton:SkeletonView HeightRequest="15"
                       WidthRequest="110"
                       HorizontalOptions="Start"/>
```

## Exemplo completo: CollectionView com x:Array

```xml
<CollectionView>
  <CollectionView.ItemsSource>
    <x:Array Type="{x:Type x:String}">
      <x:String>1</x:String>
      <x:String>2</x:String>
      <x:String>3</x:String>
    </x:Array>
  </CollectionView.ItemsSource>
  <CollectionView.HeaderTemplate>
    <DataTemplate>
      <!-- Header SEM GestureRecognizer -->
      <VerticalStackLayout>
        <Image Source="add_icon.png"/>
        <Label Text="ADD"/>
      </VerticalStackLayout>
    </DataTemplate>
  </CollectionView.HeaderTemplate>
  <CollectionView.ItemTemplate>
    <DataTemplate>
      <VerticalStackLayout Spacing="8">
        <!-- Avatar skeleton -->
        <skeleton:SkeletonView HeightRequest="50"
                               WidthRequest="50"
                               CornerRadius="25"/>
        <!-- Nome skeleton -->
        <skeleton:SkeletonView HeightRequest="15"
                               WidthRequest="50"
                               HorizontalOptions="Center"/>
      </VerticalStackLayout>
    </DataTemplate>
  </CollectionView.ItemTemplate>
</CollectionView>
```

## Exemplo completo: DataTrigger para alternancia

```xml
<!-- Layout skeleton -->
<VerticalStackLayout IsVisible="False">
  <VerticalStackLayout.Triggers>
    <DataTrigger TargetType="VerticalStackLayout"
                 Binding="{Binding StatusPage}"
                 Value="{x:Static models:StatusPage.Load}">
      <Setter Property="IsVisible" Value="True"/>
    </DataTrigger>
  </VerticalStackLayout.Triggers>
  <!-- skeleton views -->
</VerticalStackLayout>

<!-- Layout dados reais -->
<VerticalStackLayout IsVisible="False">
  <VerticalStackLayout.Triggers>
    <DataTrigger TargetType="VerticalStackLayout"
                 Binding="{Binding StatusPage}"
                 Value="{x:Static models:StatusPage.Default}">
      <Setter Property="IsVisible" Value="True"/>
    </DataTrigger>
  </VerticalStackLayout.Triggers>
  <!-- elementos reais -->
</VerticalStackLayout>
```

## Exemplo: Removendo codigo temporario de ViewModels

```csharp
// ANTES (codigo temporario para forcar refresh token)
public class UserConnectionJoinerViewModel
{
    private readonly IRefreshTokenService _refreshTokenService;

    public UserConnectionJoinerViewModel(IRefreshTokenService refreshTokenService)
    {
        _refreshTokenService = refreshTokenService;
    }

    public async Task Initialize()
    {
        await _refreshTokenService.RefreshIfNeeded(); // temporario
        // ... resto do codigo
    }
}

// DEPOIS (limpo — dashboard cuida do refresh)
public class UserConnectionJoinerViewModel
{
    public async Task Initialize()
    {
        // ... resto do codigo, sem refresh temporario
    }
}
```

## Controlando quantidade de itens skeleton

```xml
<!-- 2 itens -->
<x:Array Type="{x:Type x:String}">
  <x:String>1</x:String>
  <x:String>2</x:String>
</x:Array>

<!-- 3 itens (recomendado pelo instrutor) -->
<x:Array Type="{x:Type x:String}">
  <x:String>1</x:String>
  <x:String>2</x:String>
  <x:String>3</x:String>
</x:Array>

<!-- 4 itens -->
<x:Array Type="{x:Type x:String}">
  <x:String>1</x:String>
  <x:String>2</x:String>
  <x:String>3</x:String>
  <x:String>4</x:String>
</x:Array>
```