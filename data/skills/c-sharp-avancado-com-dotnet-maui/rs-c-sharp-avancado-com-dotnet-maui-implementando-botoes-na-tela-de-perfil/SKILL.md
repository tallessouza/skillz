---
name: rs-csharp-maui-botoes-perfil
description: "Applies .NET MAUI Grid layout and button styling patterns when building profile pages or button groups. Use when user asks to 'create buttons side by side', 'equal width buttons', 'grid layout MAUI', 'profile page buttons', or 'button styles XAML'. Enforces star-sizing for equal distribution, column spacing, and named styles with x:Key for secondary/dangerous buttons. Make sure to use this skill whenever laying out multiple buttons horizontally in .NET MAUI. Not for navigation, data binding, or backend logic."
---

# Botoes com Grid e Estilos no .NET MAUI

> Use Grid com star-sizing para distribuir botoes igualmente e crie estilos nomeados (x:Key) para variantes visuais de botoes.

## Rules

1. **Use Grid para botoes lado a lado** — `ColumnDefinitions="*,*"` garante larguras iguais, porque HorizontalStackLayout nao garante distribuicao proporcional
2. **Nao defina RowDefinitions quando ha apenas uma linha** — o Grid assume uma linha por padrao, porque declarar explicitamente e redundante
3. **Use ColumnSpacing no Grid** — `ColumnSpacing="20"` ao inves de margem nos botoes, porque centraliza o espacamento e evita calculo manual
4. **Crie estilos com x:Key para variantes** — o estilo global (sem Key) aplica a todos os botoes; variantes precisam de `x:Key` porque dois estilos globais para o mesmo TargetType causam conflito
5. **Sobrescreva apenas propriedades necessarias** — no estilo secundario, mude BackgroundColor e TextColor sem repetir FontFamily, porque heranca cuida do resto
6. **Nao sobrescreva com o mesmo valor** — se FontSize global ja e 14, nao coloque FontSize 14 no estilo nomeado, porque e redundante e confuso

## How to write

### Grid com dois botoes iguais

```xml
<Grid ColumnDefinitions="*,*" ColumnSpacing="20" Margin="0,70,0,25">
    <Button Grid.Column="0"
            Text="{x:Static resources:AppResource.ChangePassword}"
            Style="{StaticResource SecondaryButtonStyle}" />
    <Button Grid.Column="1"
            Text="{x:Static resources:AppResource.UpdateProfile}" />
</Grid>
<Button Text="{x:Static resources:AppResource.DeleteMyAccount}"
        Style="{StaticResource DangerousButtonStyle}" />
```

### Estilos nomeados para botoes

```xml
<!-- Secundario: transparente com borda -->
<Style x:Key="SecondaryButtonStyle" TargetType="Button">
    <Setter Property="BackgroundColor" Value="Transparent" />
    <Setter Property="TextColor" Value="{AppThemeBinding Light={StaticResource PrimaryColorLight}, Dark={StaticResource PrimaryColorDark}}" />
    <Setter Property="BorderColor" Value="{AppThemeBinding Light={StaticResource PrimaryColorLight}, Dark={StaticResource PrimaryColorDark}}" />
    <Setter Property="BorderWidth" Value="2" />
</Style>

<!-- Perigoso: transparente sem borda, texto vermelho -->
<Style x:Key="DangerousButtonStyle" TargetType="Button">
    <Setter Property="BackgroundColor" Value="Transparent" />
    <Setter Property="TextColor" Value="{AppThemeBinding Light={StaticResource DangerousActionColorLight}, Dark={StaticResource DangerousActionColorDark}}" />
</Style>
```

## Example

**Before (botoes sem grid):**
```xml
<HorizontalStackLayout>
    <Button Text="Alterar Senha" WidthRequest="150" />
    <Button Text="Atualizar Perfil" WidthRequest="150" Margin="20,0,0,0" />
</HorizontalStackLayout>
```

**After (com Grid e estilos):**
```xml
<Grid ColumnDefinitions="*,*" ColumnSpacing="20" Margin="0,70,0,25">
    <Button Grid.Column="0" Text="{x:Static resources:AppResource.ChangePassword}"
            Style="{StaticResource SecondaryButtonStyle}" />
    <Button Grid.Column="1" Text="{x:Static resources:AppResource.UpdateProfile}" />
</Grid>
<Button Text="{x:Static resources:AppResource.DeleteMyAccount}"
        Style="{StaticResource DangerousButtonStyle}" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 2+ botoes lado a lado com mesma largura | Grid com `*,*` |
| 3 botoes iguais | Grid com `*,*,*` |
| Uma coluna 2x maior que outra | Use `2*,*` |
| Botao sozinho abaixo do Grid | Declare fora do Grid, nao dentro |
| Estilo unico para um tipo de botao | Crie com `x:Key` em ButtonStyle.xaml |
| Espacamento entre colunas | `ColumnSpacing` no Grid, nunca margem nos filhos |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `WidthRequest` fixo em botoes lado a lado | `ColumnDefinitions="*,*"` no Grid |
| Margem no botao para espacar do vizinho | `ColumnSpacing` no Grid |
| Dois `<Style TargetType="Button">` sem Key | Um global + variantes com `x:Key` |
| Sobrescrever FontSize com o mesmo valor do global | Omitir a propriedade no estilo nomeado |
| Colocar botao isolado dentro do Grid | Declarar fora do Grid como elemento irmao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
