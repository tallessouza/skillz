# Code Examples: Extension Methods e DI para PopUps no .NET MAUI

## 1. DeviceDisplayExtension completo

```csharp
// Extensions/DeviceDisplayExtension.cs
namespace PlanShare.Extensions;

public static class DeviceDisplayExtension
{
    private const double PercentageWidthOfPopupOnScreen = 0.8;

    public static double GetWidthForPopup(this IDeviceDisplay deviceDisplay)
    {
        // Largura em pixels do dispositivo
        var screenWidthInPixels = deviceDisplay.MainDisplayInfo.Width;

        // Densidade de pixels (ex: 2.0 em telas Retina, 3.0 em telas xxhdpi)
        var screenDensity = deviceDisplay.MainDisplayInfo.Density;

        // Converte pixels para DIP (Device Independent Pixels)
        var screenWidthInDIP = screenWidthInPixels / screenDensity;

        // Retorna 80% da largura em DIP
        return screenWidthInDIP * PercentageWidthOfPopupOnScreen;
    }
}
```

## 2. Registro no MauiProgram

```csharp
// MauiProgram.cs
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            // ... outras configurações
            .AddStorage()
            .AddDeviceInfo();  // Registrar info do dispositivo

        return builder.Build();
    }

    private static MauiAppBuilder AddDeviceInfo(this MauiAppBuilder appBuilder)
    {
        // DeviceDisplay.Current já é a instância — passa direto como parâmetro
        appBuilder.Services.AddSingleton(DeviceDisplay.Current);
        return appBuilder;
    }
}
```

## 3. PopUp consumindo via DI

```csharp
// Popups/OptionsForProfilePopup.xaml.cs
public partial class OptionsForProfilePopup : Popup
{
    public OptionsForProfilePopup(
        OptionsForProfileViewModel viewModel,
        IDeviceDisplay deviceDisplay)  // Injetado pelo DI container
    {
        InitializeComponent();
        BindingContext = viewModel;

        // Uma linha limpa em vez de cálculo inline
        WidthRequest = deviceDisplay.GetWidthForPopup();
    }
}
```

## 4. Antes vs Depois — Comparação completa

### Antes (código problemático)

```csharp
// PopUp com acoplamento direto à classe estática
public partial class OptionsForProfilePopup : Popup
{
    public OptionsForProfilePopup(OptionsForProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;

        // Problema 1: DeviceDisplay é classe estática — impossível mockar em testes
        var screenWidth = DeviceDisplay.MainDisplayInfo.Width;
        var density = DeviceDisplay.MainDisplayInfo.Density;

        // Problema 2: cálculo inline — será copiado em cada popup
        // Problema 3: 0.8 é número mágico — o que significa?
        WidthRequest = (screenWidth / density) * 0.8;
    }
}
```

### Depois (código organizado)

```csharp
// PopUp desacoplado e reutilizável
public partial class OptionsForProfilePopup : Popup
{
    public OptionsForProfilePopup(
        OptionsForProfileViewModel viewModel,
        IDeviceDisplay deviceDisplay)
    {
        InitializeComponent();
        BindingContext = viewModel;
        WidthRequest = deviceDisplay.GetWidthForPopup();
    }
}
```

## 5. Como ficaria um teste de unidade

```csharp
// Exemplo de como o código refatorado facilita testes
[Fact]
public void GetWidthForPopup_ReturnsEightyPercentOfScreenWidth()
{
    // Arrange — agora é possível mockar IDeviceDisplay
    var mockDisplay = new Mock<IDeviceDisplay>();
    mockDisplay.Setup(d => d.MainDisplayInfo).Returns(
        new DisplayInfo(width: 1080, height: 1920, density: 2.0));

    // Act
    var result = mockDisplay.Object.GetWidthForPopup();

    // Assert — (1080 / 2.0) * 0.8 = 432
    Assert.Equal(432, result);
}
```

## 6. Variação: extension method com porcentagem customizável

```csharp
// Se no futuro precisar de popups com larguras diferentes
public static double GetWidthForPopup(
    this IDeviceDisplay deviceDisplay,
    double percentage = PercentageWidthOfPopupOnScreen)
{
    var screenWidthInPixels = deviceDisplay.MainDisplayInfo.Width;
    var screenDensity = deviceDisplay.MainDisplayInfo.Density;
    var screenWidthInDIP = screenWidthInPixels / screenDensity;

    return screenWidthInDIP * percentage;
}

// Uso:
WidthRequest = deviceDisplay.GetWidthForPopup();       // 80% padrão
WidthRequest = deviceDisplay.GetWidthForPopup(0.6);    // 60% para popup menor
```