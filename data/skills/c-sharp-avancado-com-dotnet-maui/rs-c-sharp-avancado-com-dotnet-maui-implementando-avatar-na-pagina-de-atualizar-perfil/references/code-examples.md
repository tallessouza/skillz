# Code Examples: Avatar com Border Overlay no .NET MAUI

## Exemplo 1: AvatarView copiado do Dashboard (ANTES da revisao)

```xml
<!-- ERRADO: copiado sem revisar propriedades -->
<toolkit:AvatarView
    BackgroundColor="{AppThemeBinding Light={StaticResource AvatarColorLight},
                      Dark={StaticResource AvatarColorDark}}"
    BorderWidth="0"
    CornerRadius="31"
    FontSize="18"
    HeightRequest="62"
    WidthRequest="62"
    Text="{Binding Username, Converter={StaticResource NameToAvatarConverter}}" />
```

## Exemplo 2: AvatarView revisado para pagina de perfil (DEPOIS)

```xml
<!-- CORRETO: propriedades ajustadas para o contexto da pagina de perfil -->
<toolkit:AvatarView
    BackgroundColor="{AppThemeBinding Light={StaticResource PrimaryColorLight},
                      Dark={StaticResource PrimaryColorDark}}"
    BorderWidth="0"
    CornerRadius="50"
    FontSize="32"
    HeightRequest="100"
    WidthRequest="100"
    Text="{Binding Username, Converter={StaticResource NameToAvatarConverter}}" />
```

Diferencas:
- `AvatarColorLight/Dark` → `PrimaryColorLight/Dark` (cor do Figma e diferente)
- `FontSize="18"` → `FontSize="32"` (tamanho do texto no Figma)
- `62x62` → `100x100` (dimensoes do Figma para perfil)
- `CornerRadius="31"` → `CornerRadius="50"` (metade do novo tamanho)

## Exemplo 3: Dependencias necessarias no XAML

```xml
<!-- Namespace do toolkit no ContentPage -->
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"

<!-- FontFamily (copiar da pagina de origem) -->
<!-- Converter como recurso da pagina -->
<ContentPage.Resources>
    <converters:NameToAvatarConverter x:Key="NameToAvatarConverter" />
</ContentPage.Resources>
```

## Exemplo 4: ViewModel com propriedade Username

```csharp
// Copiado do DashboardViewModel e adaptado
public class UserProfileViewModel : BaseViewModel
{
    private readonly IUserStorage _userStorage;

    public string Username => _userStorage.GetUsername();

    public UserProfileViewModel(IUserStorage userStorage)
    {
        _userStorage = userStorage;
    }
}
```

## Exemplo 5: Evolucao do CornerRadius

```xml
<!-- CornerRadius=0 → quadrado -->
<toolkit:AvatarView HeightRequest="100" WidthRequest="100" CornerRadius="0" />

<!-- CornerRadius=10 → bordas levemente arredondadas -->
<toolkit:AvatarView HeightRequest="100" WidthRequest="100" CornerRadius="10" />

<!-- CornerRadius=15 → mais arredondado -->
<toolkit:AvatarView HeightRequest="100" WidthRequest="100" CornerRadius="15" />

<!-- CornerRadius=50 → circulo perfeito (100/2) -->
<toolkit:AvatarView HeightRequest="100" WidthRequest="100" CornerRadius="50" />
```

## Exemplo 6: Border com StrokeThickness variado

```xml
<!-- StrokeThickness=5 → borda muito grossa -->
<Border StrokeThickness="5" Stroke="Red" ... />

<!-- StrokeThickness=3 → borda ideal para o design -->
<Border StrokeThickness="3"
    Stroke="{AppThemeBinding Light={StaticResource SecondaryColorLight},
             Dark={StaticResource SecondaryColorDark}}" ... />
```

## Exemplo 7: Componente completo Avatar + Overlay

```xml
<!-- Avatar circular -->
<toolkit:AvatarView
    BackgroundColor="{AppThemeBinding Light={StaticResource PrimaryColorLight},
                      Dark={StaticResource PrimaryColorDark}}"
    BorderWidth="0"
    CornerRadius="50"
    FontSize="32"
    HeightRequest="100"
    WidthRequest="100"
    Text="{Binding Username, Converter={StaticResource NameToAvatarConverter}}" />

<!-- Icone de edicao sobreposto com margem negativa -->
<Border
    BackgroundColor="{AppThemeBinding Light={StaticResource HighlightColorLight},
                      Dark={StaticResource HighlightColorDark}}"
    HeightRequest="35"
    WidthRequest="35"
    StrokeShape="RoundRectangle 35,35,35,35"
    StrokeThickness="3"
    Stroke="{AppThemeBinding Light={StaticResource SecondaryColorLight},
             Dark={StaticResource SecondaryColorDark}}"
    Margin="0,-20,0,0">
    <Image
        Source="icon_pen"
        HeightRequest="15"
        WidthRequest="15">
        <Image.Behaviors>
            <toolkit:IconTintColorBehavior
                TintColor="{AppThemeBinding Light={StaticResource SecondaryColorLight},
                            Dark={StaticResource SecondaryColorDark}}" />
        </Image.Behaviors>
    </Image>
</Border>
```

## Exemplo 8: Calculo de margem negativa via Figma

```
Tecnica do instrutor:
1. Selecionar elemento no Figma
2. Shift + Seta Cima = move 10px (1 vez = 10, 2 vezes = 20)
3. Alt + hover sobre outro elemento = mostra distancia
4. Distancia zero = sobreposicao exata

Resultado: Margin="0,-20,0,0"
  - 0: sem margem esquerda
  - -20: sobe 20px (sobrepoe o avatar)
  - 0: sem margem direita
  - 0: sem margem inferior
```