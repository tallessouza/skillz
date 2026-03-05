# Code Examples: Criando AvatarView

## Exemplo 1: Margem do header para status bar

```xml
<!-- Adicionando espaco entre o header e a status bar -->
<Grid Margin="0,40,0,0">
    <!-- conteudo do header -->
</Grid>
```

O valor 40 vem do design no Figma. Use Alt + hover sobre elementos no Figma para medir espacamentos.

## Exemplo 2: Behavior da StatusBar (copiado do onboarding)

```xml
<ContentPage.Behaviors>
    <toolkit:StatusBarBehavior
        StatusBarColor="White"
        StatusBarStyle="DarkContent" />
</ContentPage.Behaviors>
```

- `StatusBarColor="White"` para light mode
- `StatusBarStyle="DarkContent"` para icones escuros sobre fundo claro
- Precisa ser adicionado em todas as paginas principais

## Exemplo 3: Cores preparadas em Colors.xaml

```xml
<!-- Resources/Styles/Colors.xaml -->
<Color x:Key="AvatarColorLight">#6C63FF</Color>
<Color x:Key="AvatarColorDark">#8B83FF</Color>
<Color x:Key="SecondaryColorLight">#FFFFFF</Color>
<Color x:Key="SecondaryColorDark">#FFFFFF</Color>
```

As cores devem ser definidas antes de usar no AvatarView. O instrutor ja havia preparado esses valores antecipadamente.

## Exemplo 4: AvatarView completo

```xml
<toolkit:AvatarView
    BackgroundColor="{AppThemeBinding
        Light={StaticResource AvatarColorLight},
        Dark={StaticResource AvatarColorDark}}"
    TextColor="{AppThemeBinding
        Light={StaticResource SecondaryColorLight},
        Dark={StaticResource SecondaryColorDark}}"
    FontSize="18"
    FontFamily="{x:Static fonts:FontFamily.MainFontBlack}"
    BorderWidth="0"
    Text="BW" />
```

### Propriedades explicadas:

| Propriedade | Valor | Razao |
|-------------|-------|-------|
| BackgroundColor | AppThemeBinding | Roxo no light, variante no dark |
| TextColor | AppThemeBinding | Branco (cor secundaria) em ambos os temas |
| FontSize | 18 | Tamanho adequado para iniciais em circulo |
| FontFamily | MainFontBlack | Fonte bold/black para destaque |
| BorderWidth | 0 | Prevenir borda fantasma no Android |
| Text | "BW" | Iniciais (sera substituido por Converter) |

## Exemplo 5: Centralizacao vertical do conteudo adjacente

```xml
<!-- ERRADO: texto fica no topo -->
<VerticalStackLayout Grid.Column="1">
    <Label Text="Bem vindo," />
    <Label Text="Bruce Wayne" />
</VerticalStackLayout>

<!-- CORRETO: texto centralizado com o avatar -->
<VerticalStackLayout Grid.Column="1" VerticalOptions="Center">
    <Label Text="Bem vindo," />
    <Label Text="Bruce Wayne" />
</VerticalStackLayout>
```

## Exemplo 6: Comportamento de prioridade do AvatarView

```xml
<!-- Com imagem: exibe a imagem (prioridade) -->
<toolkit:AvatarView
    ImageSource="profile.png"
    Text="BW" />

<!-- Sem imagem (null): exibe o texto "BW" -->
<toolkit:AvatarView
    Text="BW" />
```

O AvatarView automaticamente prioriza ImageSource sobre Text. Se ImageSource for nulo ou nao encontrado, faz fallback para o Text.