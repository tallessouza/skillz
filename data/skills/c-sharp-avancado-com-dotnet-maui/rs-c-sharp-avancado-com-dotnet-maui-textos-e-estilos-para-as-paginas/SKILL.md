---
name: rs-csharp-dotnet-maui-textos-estilos
description: "Applies .NET MAUI global label styling and text decoration patterns when writing XAML pages. Use when user asks to 'style labels', 'create global styles', 'add underline to text', 'style MAUI page titles', or 'create ResourceDictionary for labels'. Enforces implicit/explicit style separation, reusable page title styles, and proper text decoration usage. Make sure to use this skill whenever creating or styling Label elements in .NET MAUI XAML. Not for button styles, content page styles, or non-XAML styling approaches."
---

# Textos e Estilos Globais no .NET MAUI

> Crie estilos globais reutilizaveis para labels em ResourceDictionary, separando estilo implicito (default) de estilos explicitos (nomeados) para manter consistencia visual.

## Rules

1. **Crie ResourceDictionary separado por componente** — `LabelStyles.xaml` para labels, `ButtonStyles.xaml` para botoes, porque mantem organizacao e facilita manutencao
2. **Remova o code-behind de ResourceDictionary de estilos** — delete o `.xaml.cs` e remova `x:Class` do XAML, porque estilos nunca precisam de code-behind
3. **Use estilo implicito como default** — `Style TargetType="Label"` sem `x:Key` aplica a todos os labels automaticamente, porque evita repetir propriedades basicas
4. **Use estilo explicito com x:Key para variantes** — titulo de pagina usa `x:Key="PageTitle"`, porque sobrescreve apenas as propriedades que diferem do default
5. **Use x:Key, nunca Name para estilos** — `x:Key="PageTitle"` nao `Name="PageTitle"`, porque `Name` nao funciona para referencia via StaticResource
6. **Envolva texto clicavel em VerticalStackLayout com altura fixa** — garante area de toque adequada para o usuario, porque label sozinho tem area de toque muito pequena

## How to write

### ResourceDictionary para Labels

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
                    xmlns:fontFamily="clr-namespace:MeuApp.Constants">

    <!-- Estilo implicito: aplica a TODOS os labels sem x:Key -->
    <Style TargetType="Label">
        <Setter Property="TextColor" Value="Black" />
        <Setter Property="FontSize" Value="14" />
        <Setter Property="FontFamily"
                Value="{x:Static fontFamily:FontFamily.SecondaryFontRegular}" />
    </Style>

    <!-- Estilo explicito: apenas para titulos de pagina -->
    <Style x:Key="PageTitle" TargetType="Label">
        <Setter Property="FontSize" Value="18" />
        <Setter Property="FontFamily"
                Value="{x:Static fontFamily:FontFamily.MainFontBlack}" />
    </Style>
</ResourceDictionary>
```

### Registrar no App.xaml

```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Resources/Style/ButtonStyles.xaml" />
            <ResourceDictionary Source="Resources/Style/ContentPage.xaml" />
            <ResourceDictionary Source="Resources/Style/LabelStyles.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

### Usar estilo explicito na pagina

```xml
<Label Text="Login" Style="{StaticResource PageTitle}" />
```

### Texto com underline

```xml
<Label Text="Esqueceu sua senha?"
       TextDecorations="Underline"
       HorizontalOptions="End" />
```

### Texto clicavel com area de toque adequada

```xml
<VerticalStackLayout HeightRequest="40" Padding="0,7,0,0" Margin="0,40,0,0">
    <Label Text="Esqueceu sua senha?"
           TextDecorations="Underline"
           HorizontalOptions="End" />
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding AlgumCommand}" />
    </VerticalStackLayout.GestureRecognizers>
</VerticalStackLayout>
```

## Example

**Before (estilo repetido em cada pagina):**
```xml
<Label Text="Criar minha conta"
       FontSize="18"
       FontFamily="HalloweenBlack"
       TextColor="Black" />
<Label Text="Subtitulo aqui"
       FontSize="14"
       FontFamily="WorkSansRegular"
       TextColor="Black" />
```

**After (com estilos globais):**
```xml
<Label Text="Criar minha conta" Style="{StaticResource PageTitle}" />
<Label Text="Subtitulo aqui" />
<!-- herda estilo implicito: 14, WorkSansRegular, Black -->
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Texto aparece em multiplas paginas com mesmo estilo | Criar estilo explicito com `x:Key` no ResourceDictionary |
| Texto exclusivo de uma pagina | Estilizar inline no componente |
| Texto clicavel | Envolver em VerticalStackLayout com HeightRequest para area de toque |
| Alinhar texto a direita | `HorizontalOptions="End"` (funciona), nao `VerticalOptions` (bug no MAUI) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Name="PageTitle"` em Style | `x:Key="PageTitle"` em Style |
| `TextDecorations="None"` explicitamente | Omitir TextDecorations (None e o default) |
| GestureRecognizer direto no Label | VerticalStackLayout wrapper com HeightRequest |
| Repetir FontSize/FontFamily em cada Label | Estilo implicito no ResourceDictionary |
| `VerticalOptions="Center"` em Label dentro de StackLayout | `Padding="0,7,0,0"` como workaround |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
