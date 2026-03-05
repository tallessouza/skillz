---
name: rs-csharp-maui-pincode-keyboard
description: "Applies custom numeric keyboard implementation patterns in .NET MAUI using PinCode library. Use when user asks to 'add a keyboard', 'implement pin code input', 'create connection code screen', 'build numeric keypad', or 'customize MAUI keyboard'. Covers KeyboardView configuration, ShapeViewer styling, BackspaceViewer with ImageButton, theme-aware colors via AppThemeBinding, and SVG icon tinting with CommunityToolkit. Make sure to use this skill whenever building PIN/code input screens in MAUI. Not for standard Entry/keyboard input, physical keyboard handling, or non-MAUI platforms."
---

# Teclado Numerico Customizado em .NET MAUI

> Ao implementar telas de codigo de conexao/PIN em MAUI, use KeyboardView do pacote PinCode com estilizacao theme-aware e BackspaceViewer com ImageButton SVG.

## Rules

1. **Adicione o namespace XAML do pacote** — inclua o `xmlns` do PinCode no topo do arquivo XAML, porque sem isso o KeyboardView nao sera reconhecido
2. **Configure espacamento via ColumnSpace e RowSpace** — o teclado e um grid interno, esses valores controlam gaps entre botoes (ex: ColumnSpace=40, RowSpace=20)
3. **Use AppThemeBinding para cores dos botoes** — `{AppThemeBinding Light={StaticResource KeyboardColorLight}, Dark={StaticResource KeyboardColorDark}}`, porque garante adaptacao automatica Light/Dark Mode
4. **BackspaceViewer com ImageButton, nao Button** — use ImageButton com source SVG para o icone de apagar, porque permite tinting via IconTintColorBehavior do CommunityToolkit
5. **Exporte icones como SVG** — o IconTintColorBehavior so funciona com imagens SVG, nao PNG/JPEG
6. **Teste sempre em ambos os temas** — Light Mode E Dark Mode, porque cores esquecidas so aparecem no tema alternativo
7. **Use Margin no KeyboardView para espacamento** — separe o teclado do CodeViewer com margem superior (ex: Margin="0,50,0,0") baseada no design

## How to write

### KeyboardView completo

```xml
<pinCode:KeyboardView
    ColumnSpacing="40"
    RowSpacing="20"
    Margin="0,50,0,0">

    <pinCode:KeyboardView.ShapeViewer>
        <Button
            BackgroundColor="{AppThemeBinding
                Light={StaticResource KeyboardColorLight},
                Dark={StaticResource KeyboardColorDark}}"
            TextColor="{AppThemeBinding
                Light={StaticResource PrimaryColorLight},
                Dark={StaticResource PrimaryColorDark}}"
            CornerRadius="15"
            HeightRequest="60"
            WidthRequest="60"
            FontSize="24" />
    </pinCode:KeyboardView.ShapeViewer>

    <pinCode:KeyboardView.BackspaceViewer>
        <ImageButton
            Padding="{OnPlatform Android='12', iOS='10'}"
            Background="Transparent"
            Source="icon_erase.svg">
            <ImageButton.Behaviors>
                <toolkit:IconTintColorBehavior
                    TintColor="{AppThemeBinding
                        Light=Black,
                        Dark=White}" />
            </ImageButton.Behaviors>
        </ImageButton>
    </pinCode:KeyboardView.BackspaceViewer>

</pinCode:KeyboardView>
```

### Namespace no XAML

```xml
xmlns:pinCode="clr-namespace:PinCode;assembly=PinCode"
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

## Example

**Before (copiado da documentacao sem customizacao):**
```xml
<pinCode:KeyboardView>
    <pinCode:KeyboardView.ShapeViewer>
        <Button BackgroundColor="Transparent" />
    </pinCode:KeyboardView.ShapeViewer>
</pinCode:KeyboardView>
```

**After (com tema, cores e backspace customizado):**
```xml
<pinCode:KeyboardView ColumnSpacing="40" RowSpacing="20" Margin="0,50,0,0">
    <pinCode:KeyboardView.ShapeViewer>
        <Button
            BackgroundColor="{AppThemeBinding Light={StaticResource KeyboardColorLight}, Dark={StaticResource KeyboardColorDark}}"
            TextColor="{AppThemeBinding Light={StaticResource PrimaryColorLight}, Dark={StaticResource PrimaryColorDark}}"
            CornerRadius="15" HeightRequest="60" WidthRequest="60" FontSize="24" />
    </pinCode:KeyboardView.ShapeViewer>
    <pinCode:KeyboardView.BackspaceViewer>
        <ImageButton Background="Transparent" Source="icon_erase.svg">
            <ImageButton.Behaviors>
                <toolkit:IconTintColorBehavior TintColor="{AppThemeBinding Light=Black, Dark=White}" />
            </ImageButton.Behaviors>
        </ImageButton>
    </pinCode:KeyboardView.BackspaceViewer>
</pinCode:KeyboardView>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao esquerdo do zero nao necessario | Omita LeftSideButtonShapeViewer completamente |
| Cores nao aparecem no Dark Mode | Verifique se definiu AppThemeBinding com ambos Light e Dark |
| Icone de backspace nao muda de cor | Confirme que imagem e SVG e tem IconTintColorBehavior |
| Teclado colado no CodeViewer | Adicione Margin top no KeyboardView |
| Padding do backspace diferente por plataforma | Use OnPlatform para Android e iOS |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `BackgroundColor="Transparent"` nos botoes numericos | Use AppThemeBinding com cores definidas em Colors.xaml |
| Usar PNG para icone de backspace | Use SVG para permitir tinting dinamico |
| Ignorar teste em Dark Mode | Teste sempre em ambos os temas |
| Usar Button para backspace | Use ImageButton com SVG source |
| Hardcodar cores no XAML | Defina em Colors.xaml como StaticResource |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
