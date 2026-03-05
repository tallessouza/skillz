# Code Examples: Exibindo PopUp no .NET MAUI

## Exemplo 1: ViewModel completa com IPopupService

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    private readonly IPopupService _popupService;

    public UserProfileViewModel(IPopupService popupService)
    {
        _popupService = popupService;
    }

    [RelayCommand]
    public async Task ChangeProfilePhoto()
    {
        var popupOptions = new PopupOptions
        {
            Shadow = null,
            Shape = new RoundRectangle
            {
                CornerRadius = new CornerRadius(10),
                StrokeThickness = 0
            }
        };

        await _popupService.ShowPopupAsync<OptionsForProfilePhotoViewModel>(
            Shell.Current,
            popupOptions
        );
    }
}
```

## Exemplo 2: XAML com gesture recognizer agrupado

```xml
<VerticalStackLayout>
    <components:AvatarView
        WidthRequest="120"
        HeightRequest="120"
        Image="{Binding UserPhoto}" />

    <Border
        Margin="0,-20,0,0"
        WidthRequest="32"
        HeightRequest="32"
        HorizontalOptions="Center">
        <Image Source="pencil_icon.png" />
    </Border>

    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding ChangeProfilePhotoCommand}" />
    </VerticalStackLayout.GestureRecognizers>
</VerticalStackLayout>
```

## Exemplo 3: Popup XAML com posicionamento

```xml
<toolkit:Popup
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    VerticalOptions="End">

    <VerticalStackLayout Padding="20">
        <Label Text="Bem-vindo ao .NET MAUI" />
    </VerticalStackLayout>
</toolkit:Popup>
```

## Exemplo 4: PopupOptions — variações

### Sem sombra, sem borda
```csharp
var options = new PopupOptions
{
    Shadow = null,
    Shape = new RoundRectangle
    {
        CornerRadius = new CornerRadius(10),
        StrokeThickness = 0
    }
};
```

### Com overlay laranja (demonstracao)
```csharp
var options = new PopupOptions
{
    Shadow = null,
    PageOverlayColor = Colors.Orange,
    Shape = new RoundRectangle
    {
        CornerRadius = new CornerRadius(10),
        StrokeThickness = 0
    }
};
```

### Chamada minima (sem customizacao)
```csharp
await _popupService.ShowPopupAsync<OptionsForProfilePhotoViewModel>(Shell.Current);
```

### Chamada com opcoes
```csharp
await _popupService.ShowPopupAsync<OptionsForProfilePhotoViewModel>(
    Shell.Current,
    popupOptions
);
```

## Exemplo 5: MauiProgram.cs — registro do toolkit

```csharp
public static MauiApp CreateMauiApp()
{
    var builder = MauiApp.CreateBuilder();
    builder
        .UseMauiApp<App>()
        .UseMauiCommunityToolkit(); // registra IPopupService automaticamente

    return builder.Build();
}
```