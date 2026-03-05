---
name: rs-csharp-maui-popup-sizing
description: "Applies correct .NET MAUI popup and component sizing using DIP (Device Independent Pixel) calculations. Use when user asks to 'fix popup width', 'resize popup', 'calculate component size', 'handle screen density', or 'set WidthRequest/HeightRequest' in .NET MAUI. Converts pixel values to DIP units by dividing by DeviceDisplay density, then applies percentage for spacing. Make sure to use this skill whenever sizing UI elements in .NET MAUI projects. Not for CSS layouts, web responsive design, or Xamarin.Forms projects."
---

# Tamanhos no .NET MAUI — DIP e Sizing de Componentes

> Sempre converter pixels para DIP antes de atribuir tamanhos a componentes no .NET MAUI, porque o framework nao usa pixels como unidade de medida.

## Rules

1. **Nunca passe pixels diretamente para WidthRequest/HeightRequest** — o .NET MAUI usa DIP (Device Independent Pixel), nao pixels. Passar pixels causa componentes enormes ou minusculos dependendo da densidade da tela
2. **Sempre divida pela densidade do display** — `DeviceDisplay.MainDisplayInfo.Width / DeviceDisplay.MainDisplayInfo.Density` converte pixels para DIP, porque Density indica quantos pixels equivalem a 1 DIP naquele dispositivo
3. **Use porcentagem da largura para popups e modais** — 80% da largura em DIP garante espacamento de 10% em cada lado, evitando popup colado nas bordas ou pequeno demais
4. **Entenda que Density NAO e PPI** — no .NET MAUI, `Density` significa quantos pixels sao necessarios para renderizar 1 DIP, nao pixels por polegada
5. **Remova padding automatico de popups quando necessario** — popups adicionam padding interno automaticamente; use `Padding="0"` para controlar o espacamento manualmente

## How to write

### Calcular largura de popup

```csharp
// Pegar largura em pixels e converter para DIP
var screenWidth = DeviceDisplay.MainDisplayInfo.Width;
var density = DeviceDisplay.MainDisplayInfo.Density;

// Converter pixels -> DIP e aplicar porcentagem
WidthRequest = (screenWidth / density) * 0.8; // 80% da tela
```

### Remover padding automatico do popup

```xml
<!-- No XAML do popup -->
<mct:Popup Padding="0">
    <!-- conteudo -->
</mct:Popup>
```

## Example

**Before (bug — passa pixels direto):**
```csharp
var screenWidth = DeviceDisplay.MainDisplayInfo.Width; // 720 pixels
WidthRequest = screenWidth * 0.8; // 576 — mas MAUI interpreta como 576 DIP = ENORME
```

**After (correto — converte para DIP):**
```csharp
var screenWidth = DeviceDisplay.MainDisplayInfo.Width; // 720 pixels
var density = DeviceDisplay.MainDisplayInfo.Density;   // 1.75
WidthRequest = (screenWidth / density) * 0.8;          // 411 DIP * 0.8 = 329 DIP ✓
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Popup ocupando espaco minimo | Calcule WidthRequest com formula pixels/density * porcentagem |
| Popup colado nas bordas | Reduza a porcentagem (0.7 ou 0.6 em vez de 0.8) |
| Componente com tamanho diferente entre dispositivos | Verifique se esta dividindo pela Density antes de atribuir |
| Popup com espacamento interno excessivo | Adicione `Padding="0"` no XAML |
| Precisa da altura em DIP | Mesma formula: `MainDisplayInfo.Height / Density` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `WidthRequest = DeviceDisplay.MainDisplayInfo.Width` | `WidthRequest = DeviceDisplay.MainDisplayInfo.Width / DeviceDisplay.MainDisplayInfo.Density` |
| `WidthRequest = 720` (valor fixo em pixels) | `WidthRequest = (screenWidth / density) * 0.8` |
| Assumir que Density e PPI | Density = pixels por 1 DIP |
| Chutar valores de largura ate funcionar | Calcular baseado na largura real do dispositivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
