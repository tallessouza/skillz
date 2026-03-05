# Code Examples: Sizing de Popup no .NET MAUI

## Exemplo completo do instrutor

### Codigo no popup (code-behind)

```csharp
// No construtor ou metodo de inicializacao do popup
var screenWidth = DeviceDisplay.MainDisplayInfo.Width;    // Largura em PIXELS
var density = DeviceDisplay.MainDisplayInfo.Density;       // Pixels por DIP

// Converter para DIP e pegar 80%
WidthRequest = (screenWidth / density) * 0.8;
```

### Valores reais do debug

| Propriedade | Valor |
|-------------|-------|
| `MainDisplayInfo.Width` | 720 (pixels) |
| `MainDisplayInfo.Density` | 1.75 (pixels por DIP) |
| `720 / 1.75` | 411.43 (DIP — largura total da tela) |
| `411.43 * 0.8` | 329.14 (DIP — 80% da largura) |

### XAML do popup com padding removido

```xml
<mct:Popup xmlns:mct="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
           Padding="0">
    <!-- Conteudo do popup -->
</mct:Popup>
```

## Variacao: Diferentes porcentagens

```csharp
var dipWidth = DeviceDisplay.MainDisplayInfo.Width / DeviceDisplay.MainDisplayInfo.Density;

// 80% — espacamento de 10% de cada lado (recomendado pelo instrutor)
WidthRequest = dipWidth * 0.8;

// 70% — mais respiro lateral
WidthRequest = dipWidth * 0.7;

// 90% — quase tela cheia mas sem colar
WidthRequest = dipWidth * 0.9;
```

## Variacao: Altura tambem

```csharp
var screenHeight = DeviceDisplay.MainDisplayInfo.Height;
var density = DeviceDisplay.MainDisplayInfo.Density;

HeightRequest = (screenHeight / density) * 0.5; // 50% da altura da tela
```

## Erro comum demonstrado na aula

```csharp
// ERRADO — passa pixels diretamente, MAUI interpreta como DIP
var screenWidth = DeviceDisplay.MainDisplayInfo.Width; // 720
WidthRequest = screenWidth * 0.8; // 576 DIP = MUITO maior que a tela!
// Resultado: popup colado nas bordas, extrapolando a tela
```

## Pattern reutilizavel

```csharp
// Helper para converter qualquer dimensao de pixels para DIP
public static double PixelsToDip(double pixels)
{
    return pixels / DeviceDisplay.MainDisplayInfo.Density;
}

// Uso
WidthRequest = PixelsToDip(DeviceDisplay.MainDisplayInfo.Width) * 0.8;
```