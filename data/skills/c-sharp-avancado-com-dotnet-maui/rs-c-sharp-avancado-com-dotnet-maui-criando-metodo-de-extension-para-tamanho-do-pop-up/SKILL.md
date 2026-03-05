---
name: rs-csharp-maui-extension-method-popup
description: "Enforces extension method extraction and dependency injection patterns in .NET MAUI when writing PopUp sizing logic or reusable UI calculations. Use when user asks to 'create a popup', 'calculate popup size', 'refactor MAUI code', 'add extension method', or 'inject device display'. Applies rules: never use static classes directly (DeviceDisplay), always inject via interface (IDeviceDisplay), extract reusable calculations into extension methods, eliminate magic numbers with named constants. Make sure to use this skill whenever generating .NET MAUI popup code or refactoring static class usage. Not for general C# extension methods unrelated to MAUI, nor for popup content/layout design."
---

# Extension Methods e Injeção de Dependência para PopUps no .NET MAUI

> Extraia cálculos reutilizáveis para extension methods e substitua classes estáticas por interfaces injetadas via DI.

## Rules

1. **Nunca use classes estáticas do MAUI diretamente** — `DeviceDisplay.MainDisplayInfo` impede testes de unidade porque `Current` é nulo fora do runtime do app. Use a interface `IDeviceDisplay` via injeção de dependência
2. **Registre implementações de dispositivo no MauiProgram** — `builder.Services.AddSingleton(DeviceDisplay.Current)` porque o MAUI não registra automaticamente essas interfaces
3. **Extraia cálculos reutilizáveis para extension methods** — calcular largura de popup não é responsabilidade do popup, e será copiado/colado em cada novo popup se não for extraído
4. **Elimine números mágicos com constantes nomeadas** — `0.8` não comunica nada; `PercentageWidthOfPopupOnScreen` deixa claro que são 80% da tela, porque código é escrito para humanos, não para máquinas
5. **Use `this` na assinatura do extension method** — `this IDeviceDisplay deviceDisplay` é obrigatório para que o método funcione como extensão

## How to write

### Registrar IDeviceDisplay no MauiProgram

```csharp
// Em MauiProgram.cs — método separado para device info
private static MauiAppBuilder AddDeviceInfo(this MauiAppBuilder appBuilder)
{
    // Quando já temos a instância, passamos como parâmetro (não como tipo genérico)
    appBuilder.Services.AddSingleton(DeviceDisplay.Current);
    return appBuilder;
}

// Chamar no CreateMauiApp:
builder.AddDeviceInfo();
```

### Extension method para largura do PopUp

```csharp
public static class DeviceDisplayExtension
{
    private const double PercentageWidthOfPopupOnScreen = 0.8;

    public static double GetWidthForPopup(this IDeviceDisplay deviceDisplay)
    {
        var screenWidthInPixels = deviceDisplay.MainDisplayInfo.Width;
        var screenDensity = deviceDisplay.MainDisplayInfo.Density;
        var screenWidthInDIP = screenWidthInPixels / screenDensity;

        return screenWidthInDIP * PercentageWidthOfPopupOnScreen;
    }
}
```

### Usar no PopUp via injeção

```csharp
public partial class OptionsForProfilePopup : Popup
{
    public OptionsForProfilePopup(ViewModel viewModel, IDeviceDisplay deviceDisplay)
    {
        InitializeComponent();
        BindingContext = viewModel;

        WidthRequest = deviceDisplay.GetWidthForPopup();
    }
}
```

## Example

**Before (más práticas):**
```csharp
public OptionsForProfilePopup(ViewModel viewModel)
{
    InitializeComponent();
    BindingContext = viewModel;

    var screenWidth = DeviceDisplay.MainDisplayInfo.Width;
    var density = DeviceDisplay.MainDisplayInfo.Density;
    WidthRequest = (screenWidth / density) * 0.8;
}
```

**After (com esta skill aplicada):**
```csharp
public OptionsForProfilePopup(ViewModel viewModel, IDeviceDisplay deviceDisplay)
{
    InitializeComponent();
    BindingContext = viewModel;

    WidthRequest = deviceDisplay.GetWidthForPopup();
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Usando classe estática do MAUI (DeviceDisplay, Connectivity, etc) | Substitua pela interface (IDeviceDisplay, IConnectivity) via DI |
| Cálculo será usado em mais de um lugar | Extraia para extension method |
| Número literal no código sem contexto | Crie constante com nome descritivo |
| Registrando instância já existente no DI | Use `AddSingleton(instância)`, não `AddSingleton<ITipo, Tipo>()` |
| Precisa agrupar registros de DI | Crie método de extensão no MauiProgram (ex: `AddDeviceInfo`) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `DeviceDisplay.MainDisplayInfo.Width` | `deviceDisplay.MainDisplayInfo.Width` (injetado) |
| `(width / density) * 0.8` inline no popup | `deviceDisplay.GetWidthForPopup()` |
| `0.8` como número mágico | `PercentageWidthOfPopupOnScreen = 0.8` |
| `AddSingleton<IDeviceDisplay>(DeviceDisplay.Current)` com tipo explícito desnecessário | `AddSingleton(DeviceDisplay.Current)` — o compilador infere |
| Copiar cálculo de largura em cada popup | Um extension method reutilizável |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
