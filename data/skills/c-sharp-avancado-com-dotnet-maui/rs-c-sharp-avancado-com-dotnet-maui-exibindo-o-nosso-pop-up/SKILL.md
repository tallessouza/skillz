---
name: rs-csharp-maui-exibindo-popup
description: "Applies .NET MAUI popup display patterns using CommunityToolkit.Maui IPopupService. Use when user asks to 'show a popup', 'display a dialog', 'create a popup in MAUI', 'customize popup appearance', or 'configure popup options'. Enforces correct ShowPopupAsync usage with ViewModel association, PopupOptions customization (shadow, overlay, shape), and gesture recognizer binding. Make sure to use this skill whenever implementing popups in .NET MAUI projects. Not for standard navigation, alerts, or action sheets."
---

# Exibindo PopUp no .NET MAUI com CommunityToolkit

> Exiba popups via IPopupService passando a ViewModel associada, e customize aparencia com PopupOptions.

## Rules

1. **Use IPopupService, nao instancie popups manualmente** — `ShowPopupAsync<TViewModel>` recebe a ViewModel associada ao popup, nao o tipo do popup em si, porque o CommunityToolkit resolve o binding automaticamente
2. **Passe Shell.Current como pagina** — o servico exige a pagina principal como parametro obrigatorio para posicionar o popup corretamente
3. **Agrupe elementos para gesture recognizer** — quando multiplos elementos devem responder ao toque, envolva-os em um `VerticalStackLayout` com `TapGestureRecognizer`, porque elementos separados limitam a area clicavel
4. **Configure PopupOptions para customizacao visual** — shadow, overlay color e shape sao controlados via `PopupOptions`, nao no XAML do popup
5. **Receba IPopupService via injecao de dependencia** — `UseMauiCommunityToolkit()` ja registra o servico, nao precisa configurar manualmente

## How to write

### Comando na ViewModel

```csharp
[RelayCommand]
public async Task ChangeProfilePhoto()
{
    var popupOptions = new PopupOptions
    {
        Shadow = null, // remove sombra
        Shape = new RoundRectangle
        {
            CornerRadius = new CornerRadius(10),
            StrokeThickness = 0 // remove borda
        }
    };

    await _popupService.ShowPopupAsync<OptionsForProfilePhotoViewModel>(
        Shell.Current,
        popupOptions
    );
}
```

### Injecao do servico na ViewModel

```csharp
private readonly IPopupService _popupService;

public UserProfileViewModel(IPopupService popupService)
{
    _popupService = popupService;
}
```

### Bind do gesto no XAML

```xml
<VerticalStackLayout>
    <components:AvatarView ... />
    <Border Margin="0,-20,0,0" ...>
        <Image Source="pencil_icon.png" />
    </Border>

    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding ChangeProfilePhotoCommand}" />
    </VerticalStackLayout.GestureRecognizers>
</VerticalStackLayout>
```

### Posicionamento do popup

```xml
<!-- No XAML do popup -->
<toolkit:Popup VerticalOptions="End">
    <!-- conteudo -->
</toolkit:Popup>
```

## Example

**Before (popup sem customizacao):**
```csharp
await _popupService.ShowPopupAsync<MyPopupViewModel>(Shell.Current);
// Resultado: popup com sombra, borda cinza, overlay padrao
```

**After (popup customizado):**
```csharp
var popupOptions = new PopupOptions
{
    Shadow = null,
    Shape = new RoundRectangle
    {
        CornerRadius = new CornerRadius(10),
        StrokeThickness = 0
    }
};

await _popupService.ShowPopupAsync<MyPopupViewModel>(Shell.Current, popupOptions);
// Resultado: sem sombra, sem borda, bordas arredondadas
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa exibir popup | Use `IPopupService.ShowPopupAsync<TViewModel>` |
| Popup deve aparecer embaixo | `VerticalOptions="End"` no XAML do popup |
| Sombra indesejada | `Shadow = null` no PopupOptions |
| Borda indesejada | `StrokeThickness = 0` no Shape |
| Cor de overlay customizada | `PageOverlayColor = Colors.X` no PopupOptions |
| Multiplos elementos clicaveis | Agrupe em `VerticalStackLayout` com `TapGestureRecognizer` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `ShowPopupAsync<MeuPopup>(...)` (tipo do popup) | `ShowPopupAsync<MeuPopupViewModel>(...)` (tipo da ViewModel) |
| Gesture recognizer em cada elemento separado | Agrupe em container com gesture recognizer unico |
| Instanciar popup manualmente e exibir | Use IPopupService via DI |
| Configurar visual do popup no code-behind | Use PopupOptions no ShowPopupAsync |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
