---
name: rs-csharp-maui-popup-elements
description: "Applies .NET MAUI popup element implementation patterns when building interactive popups with CommunityToolkit. Use when user asks to 'create a popup', 'add popup options', 'build a modal', 'implement popup UI', or 'add touch targets in MAUI'. Covers VerticalStackLayout grouping for touch areas, BoxView lines, resource file text binding, and app-theme-binding colors. Make sure to use this skill whenever implementing popup or modal UI in .NET MAUI. Not for navigation, page layout, or non-popup dialogs."
---

# Implementando Elementos no PopUp (.NET MAUI)

> Agrupe opcoes interativas em VerticalStackLayout para ampliar a area de toque, use BoxView para linhas divisorias, e centralize textos com recursos de idioma.

## Rules

1. **Agrupe cada opcao em um VerticalStackLayout** — porque um label sozinho tem area de toque muito pequena, dificultando o clique do usuario
2. **Use BoxView com HeightRequest para linhas divisorias** — `HeightRequest="1"`, porque sem altura definida o BoxView nao aparece. Largura se expande automaticamente
3. **Nunca hardcode textos** — use arquivo de resources (`ResourceTexts.resx`) com static binding, porque facilita traducao e manutencao
4. **Use AppThemeBinding para cores** — `{AppThemeBinding Light={StaticResource LinesColorLight}, Dark={StaticResource LinesColorDark}}`, porque respeita o tema do dispositivo
5. **Use padding vertical para aumentar area de toque** — `Padding="0,10,0,0"` no VerticalStackLayout, porque melhora usabilidade em telas touch
6. **Use background color vermelho temporario para debug** — remova antes de commit, porque ajuda a visualizar areas e espacamentos durante desenvolvimento

## How to write

### Estrutura do PopUp com opcoes

```xml
<VerticalStackLayout> <!-- Container pai -->

    <!-- Opcao 1: com linha divisoria -->
    <VerticalStackLayout Spacing="15" Padding="0,10,0,0">
        <Label
            Text="{x:Static resources:ResourceTexts.UploadPhoto}"
            HorizontalOptions="Center" />
        <BoxView
            HeightRequest="1"
            Color="{AppThemeBinding
                Light={StaticResource LinesColorLight},
                Dark={StaticResource LinesColorDark}}" />
    </VerticalStackLayout>

    <!-- Opcao 2: com linha divisoria -->
    <VerticalStackLayout Spacing="15" Padding="0,10,0,0">
        <Label
            Text="{x:Static resources:ResourceTexts.TakePhoto}"
            HorizontalOptions="Center" />
        <BoxView
            HeightRequest="1"
            Color="{AppThemeBinding
                Light={StaticResource LinesColorLight},
                Dark={StaticResource LinesColorDark}}" />
    </VerticalStackLayout>

    <!-- Ultima opcao: SEM linha, COM padding inferior -->
    <VerticalStackLayout Padding="0,10,0,10">
        <Label
            Text="{x:Static resources:ResourceTexts.DeleteProfilePicture}"
            HorizontalOptions="Center" />
    </VerticalStackLayout>

    <!-- Botao cancelar com margem superior -->
    <Button
        Text="{x:Static resources:ResourceTexts.Cancel}"
        Margin="0,20,0,0" />

</VerticalStackLayout>
```

### Importar resource file no XAML

```xml
<!-- No topo do arquivo XAML, adicione o xmlns do resource -->
xmlns:resources="clr-namespace:SeuApp.Resources.Texts"
```

## Example

**Before (area de toque pequena, textos hardcoded):**
```xml
<VerticalStackLayout>
    <Label Text="Fazer upload de uma foto" />
    <Label Text="Tirar foto" />
    <Label Text="Deletar foto" />
    <Button Text="Cancelar" />
</VerticalStackLayout>
```

**After (com agrupamento, linhas, recursos e espacamento):**
```xml
<VerticalStackLayout>
    <VerticalStackLayout Spacing="15" Padding="0,10,0,0">
        <Label Text="{x:Static resources:ResourceTexts.UploadPhoto}"
               HorizontalOptions="Center" />
        <BoxView HeightRequest="1"
                 Color="{AppThemeBinding
                     Light={StaticResource LinesColorLight},
                     Dark={StaticResource LinesColorDark}}" />
    </VerticalStackLayout>

    <VerticalStackLayout Spacing="15" Padding="0,10,0,0">
        <Label Text="{x:Static resources:ResourceTexts.TakePhoto}"
               HorizontalOptions="Center" />
        <BoxView HeightRequest="1"
                 Color="{AppThemeBinding
                     Light={StaticResource LinesColorLight},
                     Dark={StaticResource LinesColorDark}}" />
    </VerticalStackLayout>

    <VerticalStackLayout Padding="0,10,0,10">
        <Label Text="{x:Static resources:ResourceTexts.DeleteProfilePicture}"
               HorizontalOptions="Center" />
    </VerticalStackLayout>

    <Button Text="{x:Static resources:ResourceTexts.Cancel}"
            Margin="0,20,0,0" />
</VerticalStackLayout>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Opcao com divisor abaixo | VerticalStackLayout com Label + BoxView, Spacing="15" |
| Ultima opcao da lista | VerticalStackLayout SEM BoxView, com Padding inferior |
| Botao separado das opcoes | Margin top de 20 no Button |
| Debug de areas de toque | BackgroundColor="Red" temporario no VerticalStackLayout |
| Textos do app | Sempre em arquivo .resx com x:Static binding |
| Cores que variam com tema | AppThemeBinding com Light e Dark |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Text="Cancelar"` | `Text="{x:Static resources:ResourceTexts.Cancel}"` |
| `<Label>` solto como opcao tocavel | `<VerticalStackLayout>` agrupando Label + BoxView |
| `<BoxView />` sem HeightRequest | `<BoxView HeightRequest="1" />` |
| `Color="Gray"` hardcoded | `Color="{AppThemeBinding Light=..., Dark=...}"` |
| Opcoes sem padding | `Padding="0,10,0,0"` para area de toque adequada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
