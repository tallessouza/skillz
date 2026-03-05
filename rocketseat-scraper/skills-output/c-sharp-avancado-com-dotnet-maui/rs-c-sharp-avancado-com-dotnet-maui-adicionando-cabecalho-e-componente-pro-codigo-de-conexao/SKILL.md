---
name: rs-csharp-maui-pin-code-viewer-layout
description: "Applies .NET MAUI PIN Code Authorization page layout patterns when building connection code screens with header, CodeViewer, and ShapeViewer customization. Use when user asks to 'create a PIN input page', 'build a connection code screen', 'customize PIN code viewer', or 'implement code entry UI in MAUI'. Covers header composition, CodeViewer type selection (show/hide/mask), ShapeViewer geometry, and PinCharacterLabel styling. Make sure to use this skill whenever implementing PIN/code entry interfaces in .NET MAUI with the PinCodeAuthorization library. Not for SignalR communication, API integration, or keyboard implementation."
---

# PIN Code Viewer — Layout e Componentes no .NET MAUI

> Configure header, CodeViewer e ShapeViewer da biblioteca PinCodeAuthorization para construir telas de entrada de codigo com aparencia customizada.

## Rules

1. **Referencie o namespace do CodeViewer no XAML** — adicione o `xmlns` do CodeViewer no arquivo XAML, porque sem ele os tipos `ShowCodeViewer`, `HideCodeViewer` e `MaskCodeViewer` nao serao reconhecidos
2. **Estilos globais nao funcionam dentro de bibliotecas externas** — passe `FontFamily`, `FontSize` e demais estilos explicitamente em cada label/elemento, porque no .NET 9 estilos globais nao propagam para paginas de bibliotecas externas
3. **Utilize recursos estaticos para textos** — use `{x:Static resource:ResourceText.ChaveAqui}` para titulos e subtitulos, porque centraliza traducoes e evita strings hardcoded
4. **Escolha o tipo de CodeViewer antes de customizar** — decida entre `HideCodeViewer` (esconde), `ShowCodeViewer` (mostra) ou `MaskCodeViewer` (mostra temporariamente), porque cada tipo tem propriedades extras diferentes
5. **Cores devem respeitar Light/Dark mode** — use `AppThemeBinding` para `CodeStrokeColor` e cores de borda do ShapeViewer, porque garante consistencia visual nos dois temas
6. **ShapeViewer define a geometria de cada digito** — use `Rectangle` com largura e altura iguais para quadrados, ou `Ellipse` para circulos, porque o shape e independente do tipo de CodeViewer escolhido

## How to write

### Header customizado

```xml
<pinCode:PinCodeAuthorizationCodePage.Header>
    <VerticalStackLayout Margin="0,0,0,40" Spacing="20">
        <Label
            Text="{x:Static resource:ResourceText.TitleConnectionCode}"
            FontSize="28"
            HorizontalOptions="Center"
            FontFamily="{x:Static fontFamily:FontFamily.MainFontsBlack}" />
        <Label
            Text="{x:Static resource:ResourceText.SubtitleConnectionCode}"
            FontSize="18"
            FontFamily="{x:Static fontFamily:FontFamily.MainFontsRegular}" />
    </VerticalStackLayout>
</pinCode:PinCodeAuthorizationCodePage.Header>
```

### CodeViewer com ShowCodeViewer

```xml
<pinCode:PinCodeAuthorizationCodePage.CodeViewer>
    <codeViewer:ShowCodeViewer
        CodeLength="6"
        CodeColor="Transparent"
        CodeStrokeColor="{AppThemeBinding
            Light={StaticResource PrimaryColorLight},
            Dark={StaticResource PrimaryColorDark}}">

        <codeViewer:ShowCodeViewer.ShapeViewer>
            <Rectangle
                WidthRequest="50"
                HeightRequest="50"
                RadiusX="10"
                RadiusY="10"
                StrokeThickness="2"
                Stroke="{AppThemeBinding
                    Light={StaticResource PrimaryColorLight},
                    Dark={StaticResource PrimaryColorDark}}" />
        </codeViewer:ShowCodeViewer.ShapeViewer>

        <codeViewer:ShowCodeViewer.PinCharacterLabel>
            <Label
                FontSize="25"
                HorizontalOptions="Center"
                VerticalOptions="Center"
                FontFamily="{x:Static fontFamily:FontFamily.SecondaryFontsBlack}" />
        </codeViewer:ShowCodeViewer.PinCharacterLabel>

    </codeViewer:ShowCodeViewer>
</pinCode:PinCodeAuthorizationCodePage.CodeViewer>
```

## Example

**Before (default sem customizacao):**
```xml
<pinCode:PinCodeAuthorizationCodePage>
    <!-- Apenas ViewModel vinculada, layout padrao da biblioteca -->
</pinCode:PinCodeAuthorizationCodePage>
```

**After (com header, CodeViewer e estilos):**
```xml
<pinCode:PinCodeAuthorizationCodePage
    xmlns:codeViewer="clr-namespace:PinCodeAuthorizationCodePage.CodeViewer;assembly=..."
    xmlns:resource="clr-namespace:App.Resources"
    xmlns:fontFamily="clr-namespace:App.Fonts">

    <pinCode:PinCodeAuthorizationCodePage.Header>
        <VerticalStackLayout Margin="0,0,0,40" Spacing="20">
            <Label Text="{x:Static resource:ResourceText.TitleConnectionCode}"
                   FontSize="28" HorizontalOptions="Center"
                   FontFamily="{x:Static fontFamily:FontFamily.MainFontsBlack}" />
            <Label Text="{x:Static resource:ResourceText.SubtitleConnectionCode}"
                   FontSize="18"
                   FontFamily="{x:Static fontFamily:FontFamily.MainFontsRegular}" />
        </VerticalStackLayout>
    </pinCode:PinCodeAuthorizationCodePage.Header>

    <pinCode:PinCodeAuthorizationCodePage.CodeViewer>
        <codeViewer:ShowCodeViewer CodeLength="6" CodeColor="Transparent"
            CodeStrokeColor="{AppThemeBinding Light=..., Dark=...}">
            <codeViewer:ShowCodeViewer.ShapeViewer>
                <Rectangle WidthRequest="50" HeightRequest="50"
                           RadiusX="10" RadiusY="10" StrokeThickness="2" />
            </codeViewer:ShowCodeViewer.ShapeViewer>
            <codeViewer:ShowCodeViewer.PinCharacterLabel>
                <Label FontSize="25" HorizontalOptions="Center" VerticalOptions="Center"
                       FontFamily="{x:Static fontFamily:FontFamily.SecondaryFontsBlack}" />
            </codeViewer:ShowCodeViewer.PinCharacterLabel>
        </codeViewer:ShowCodeViewer>
    </pinCode:PinCodeAuthorizationCodePage.CodeViewer>

</pinCode:PinCodeAuthorizationCodePage>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Codigo nao deve ser visivel (senha) | Use `HideCodeViewer` |
| Codigo pode ser visivel (codigo de conexao) | Use `ShowCodeViewer` |
| Mostrar brevemente e esconder (estilo senha mobile) | Use `MaskCodeViewer` com `HideCodesAfter` em ms |
| Cores iguais com/sem digito preenchido | `CodeColor="Transparent"`, stroke igual ao tema |
| Quadrado com bordas arredondadas | `Rectangle` com `RadiusX`/`RadiusY` |
| Circulo | `Ellipse` com `WidthRequest`=`HeightRequest` |
| Label dentro de biblioteca externa sem estilo | Passe `FontFamily` explicitamente |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Confiar em estilos globais dentro de paginas de bibliotecas | Passe `FontFamily` explicitamente em cada elemento |
| Hardcodar strings de titulo no XAML | Use `{x:Static resource:ResourceText.Chave}` |
| Usar cor fixa sem `AppThemeBinding` | Use `AppThemeBinding Light=..., Dark=...` |
| Colocar ShapeViewer fora da tag do CodeViewer | Garanta que ShapeViewer esta dentro de `ShowCodeViewer` |
| Esquecer o `xmlns` do CodeViewer | Adicione o namespace no topo do XAML |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
