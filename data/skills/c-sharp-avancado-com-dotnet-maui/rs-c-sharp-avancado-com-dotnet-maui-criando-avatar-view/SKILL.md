---
name: rs-csharp-maui-criando-avatar-view
description: "Applies AvatarView component patterns when building .NET MAUI user interfaces. Use when user asks to 'create avatar', 'show user initials', 'build profile header', 'add user icon', or 'implement dashboard header' in MAUI apps. Configures CommunityToolkit AvatarView with theme-aware colors, border removal, font settings, and vertical alignment. Make sure to use this skill whenever building user profile UI elements in .NET MAUI. Not for image processing, authentication, or backend user management."
---

# AvatarView no .NET MAUI

> Use o AvatarView do CommunityToolkit para exibir iniciais do usuario com cores tematicas, sem reinventar o componente com Label + Shape.

## Rules

1. **Use AvatarView do Toolkit, nao Label sobre Ellipse** — o componente `AvatarView` do CommunityToolkit ja suporta imagem (prioridade) e texto (fallback), porque reimplementar gera inconsistencias e mais codigo
2. **Sempre sete BorderWidth="0"** — alguns dispositivos Android adicionam borda preta fina automaticamente, porque o .NET MAUI tem comportamento inconsistente entre devices
3. **Use AppThemeBinding para todas as cores** — BackgroundColor e TextColor devem respeitar Light/Dark mode, porque hardcoded colors quebram em troca de tema
4. **Centralize verticalmente o conteudo adjacente** — use `VerticalOptions="Center"` no VerticalStackLayout ao lado do avatar, porque o alinhamento padrao nao centraliza com o circulo
5. **Exiba iniciais, nao nome completo** — um nome: primeira letra; dois ou mais nomes: iniciais dos dois primeiros, porque o espaco do avatar e limitado
6. **Prepare cores no arquivo Colors antes de usar** — defina pares Light/Dark (ex: `AvatarColorLight`/`AvatarColorDark`), porque facilita manutencao e consistencia

## How to write

### AvatarView basico com tema

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

### Header com avatar alinhado

```xml
<Grid Margin="0,40,0,0">
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="Auto" />
        <ColumnDefinition Width="*" />
    </Grid.ColumnDefinitions>

    <toolkit:AvatarView Grid.Column="0"
        BackgroundColor="{AppThemeBinding Light={StaticResource AvatarColorLight}, Dark={StaticResource AvatarColorDark}}"
        TextColor="{AppThemeBinding Light={StaticResource SecondaryColorLight}, Dark={StaticResource SecondaryColorDark}}"
        FontSize="18"
        FontFamily="{x:Static fonts:FontFamily.MainFontBlack}"
        BorderWidth="0"
        Text="BW" />

    <VerticalStackLayout Grid.Column="1" VerticalOptions="Center">
        <Label Text="Bem vindo," />
        <Label Text="Bruce Wayne" />
    </VerticalStackLayout>
</Grid>
```

## Example

**Before (implementacao manual errada):**
```xml
<Grid>
    <Ellipse Fill="Purple" WidthRequest="40" HeightRequest="40" />
    <Label Text="BW" HorizontalOptions="Center" VerticalOptions="Center" />
</Grid>
<VerticalStackLayout>
    <Label Text="Bem vindo," />
    <Label Text="Bruce Wayne" />
</VerticalStackLayout>
```

**After (com AvatarView do Toolkit):**
```xml
<toolkit:AvatarView
    BackgroundColor="{AppThemeBinding Light={StaticResource AvatarColorLight}, Dark={StaticResource AvatarColorDark}}"
    TextColor="{AppThemeBinding Light={StaticResource SecondaryColorLight}, Dark={StaticResource SecondaryColorDark}}"
    FontSize="18"
    FontFamily="{x:Static fonts:FontFamily.MainFontBlack}"
    BorderWidth="0"
    Text="BW" />

<VerticalStackLayout VerticalOptions="Center">
    <Label Text="Bem vindo," />
    <Label Text="Bruce Wayne" />
</VerticalStackLayout>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Usuario tem foto de perfil | AvatarView com ImageSource (imagem tem prioridade sobre Text) |
| Usuario sem foto | AvatarView com Text das iniciais |
| Apenas um nome informado | Exibir uma unica inicial |
| Dois ou mais nomes | Exibir iniciais dos dois primeiros nomes |
| Borda aparecendo no Android | Confirmar BorderWidth="0" |
| Texto desalinhado ao lado do avatar | VerticalOptions="Center" no StackLayout adjacente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<Ellipse>` + `<Label>` para avatar | `<toolkit:AvatarView>` |
| `BackgroundColor="Purple"` hardcoded | `BackgroundColor="{AppThemeBinding ...}"` |
| `TextColor="White"` hardcoded | `TextColor="{AppThemeBinding ...}"` |
| Omitir BorderWidth | `BorderWidth="0"` explicitamente |
| VerticalStackLayout sem VerticalOptions | `VerticalOptions="Center"` para alinhar com avatar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
