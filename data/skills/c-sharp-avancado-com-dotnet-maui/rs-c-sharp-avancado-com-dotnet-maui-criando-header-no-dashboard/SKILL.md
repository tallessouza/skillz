---
name: rs-csharp-maui-criando-header-dashboard
description: "Applies .NET MAUI Grid layout patterns when building dashboard headers with multiple columns, image rotation, and data binding from local storage. Use when user asks to 'create a header', 'build a dashboard layout', 'use Grid in MAUI', 'rotate an image', or 'bind user data from preferences'. Covers Grid ColumnDefinitions with star sizing, image Rotation property, VerticalStackLayout grouping, and ObservableProperty binding. Make sure to use this skill whenever creating multi-column layouts in .NET MAUI or reading user data from local storage for display. Not for API integration, navigation logic, or backend data fetching."
---

# Criando Header no Dashboard com Grid Layout (.NET MAUI)

> Estruture headers como Grids de uma linha com colunas de largura estrategica, agrupe textos em VerticalStackLayout, e rotacione imagens em vez de duplicar assets.

## Rules

1. **Use Grid para layouts de header** — defina apenas ColumnDefinitions quando ha uma unica linha, porque RowDefinitions e desnecessario para single-row grids
2. **Use asterisco para colunas expansiveis** — `*` ocupa todo espaco restante, porque nomes de usuario tem tamanhos variaveis e largura fixa truncaria o texto
3. **Agrupe textos verticais em VerticalStackLayout** — nunca coloque dois Labels soltos na mesma coluna do Grid, porque nao ha garantia de empilhamento vertical
4. **Rotacione imagens em vez de duplicar assets** — use a propriedade `Rotation` para reutilizar icones em diferentes angulos, porque reduz o tamanho do app
5. **Defina HeightRequest em imagens dentro de Grid** — sem dimensoes explicitas as imagens ocupam espaco indesejado, porque o Grid nao infere tamanho automaticamente
6. **Leia dados do usuario via storage no construtor da ViewModel** — acesse o nome direto com `.Name` no get, porque simplifica o binding sem variavel intermediaria

## How to write

### Grid com ColumnDefinitions estrategicas

```xml
<Grid ColumnDefinitions="62, *, 40, 40">
    <!-- Coluna 0: avatar/iniciais (62px fixo do Figma) -->
    <!-- Coluna 1: textos expandiveis (*) -->
    <!-- Coluna 2: icone sino (40px para area de toque) -->
    <!-- Coluna 3: icone engrenagem (40px para area de toque) -->
</Grid>
```

### Imagens com Rotation e HeightRequest

```xml
<Image Source="icon_bell.png"
       Grid.Column="2"
       HeightRequest="20"
       Rotation="15" />

<Image Source="icon_settings.png"
       Grid.Column="3"
       HeightRequest="20" />
```

### Textos agrupados em VerticalStackLayout

```xml
<VerticalStackLayout Grid.Column="1">
    <Label Text="{x:Static resources:Strings.TitleWelcome}"
           FontSize="10"
           FontFamily="{x:Static helpers:FontFamily.MainFontRegular}" />
    <Label Text="{Binding UserName}"
           FontSize="16"
           FontFamily="{x:Static helpers:FontFamily.MainFontBlack}" />
</VerticalStackLayout>
```

### ViewModel com ObservableProperty do storage

```csharp
public partial class DashboardViewModel : ObservableObject
{
    [ObservableProperty]
    private string userName;

    public DashboardViewModel(UserStorage userStorage)
    {
        userName = userStorage.Get().Name;
    }
}
```

## Example

**Before (Labels soltos sem estrutura):**
```xml
<Grid>
    <Label Text="Bem-vindo" Grid.Column="1" />
    <Label Text="{Binding UserName}" Grid.Column="1" />
    <Image Source="icon_bell.png" />
    <Image Source="icon_settings.png" />
</Grid>
```

**After (com este skill aplicado):**
```xml
<Grid ColumnDefinitions="62, *, 40, 40">
    <!-- Coluna 0: componente avatar/iniciais (implementado em outra aula) -->

    <VerticalStackLayout Grid.Column="1">
        <Label Text="{x:Static resources:Strings.TitleWelcome}"
               FontSize="10"
               FontFamily="{x:Static helpers:FontFamily.MainFontRegular}" />
        <Label Text="{Binding UserName}"
               FontSize="16"
               FontFamily="{x:Static helpers:FontFamily.MainFontBlack}" />
    </VerticalStackLayout>

    <Image Source="icon_bell.png"
           Grid.Column="2"
           HeightRequest="20"
           Rotation="15" />

    <Image Source="icon_settings.png"
           Grid.Column="3"
           HeightRequest="20" />
</Grid>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Coluna com texto de tamanho variavel | Use `*` na ColumnDefinition |
| Icone pequeno que precisa de area de toque | Use coluna maior que o icone (ex: 40px para icone de 20px) |
| Dois textos um abaixo do outro na mesma coluna | Envolva em `VerticalStackLayout` |
| Icone precisa de inclinacao visual | Use `Rotation="15"` (ou `-15` para o outro lado) |
| Todas as colunas com `*` | Grid divide espaco igualmente entre elas |
| Dado do usuario ja salvo em preferences | Leia no construtor da ViewModel, nao via API |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `ColumnDefinitions="62, 101, 40, 40"` (largura fixa para nome) | `ColumnDefinitions="62, *, 40, 40"` (expansivel) |
| Dois Labels soltos no mesmo Grid.Column | VerticalStackLayout contendo os Labels |
| Imagem sem HeightRequest dentro de Grid | `HeightRequest="20"` explicito |
| Duas imagens identicas mas espelhadas como assets separados | Uma imagem com `Rotation` diferente |
| `Grid.Column` omitido nos elementos | Sempre especifique `Grid.Column` para cada filho do Grid |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
