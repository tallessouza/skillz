---
name: rs-csharp-maui-styles-explicit-implicit-global
description: "Enforces .NET MAUI styling patterns using implicit, explicit, and global styles. Use when user asks to 'style a component', 'create a button style', 'add global styles', 'organize MAUI styles', or 'apply consistent styling in XAML'. Applies rules: implicit styles via TargetType without key, explicit styles via x:Key, global styles in App.xaml, style inheritance with property overrides. Make sure to use this skill whenever writing XAML styles or organizing .NET MAUI component appearance. Not for CSS styling, Blazor components, or non-MAUI frameworks."
---

# Styles no .NET MAUI: Explícitos, Implícitos e Globais

> Organize estilos em grupos com variações controladas — implícitos para o padrão, explícitos para variações, globais para consistência entre páginas.

## Rules

1. **Mantenha padrões de estilo no app** — não invente um estilo diferente por página, porque isso gera inconsistência visual e dificulta manutenção
2. **Use estilo implícito para o padrão base** — declare `Style` com `TargetType` sem `x:Key`, porque todo componente daquele tipo na página/app herda automaticamente
3. **Use estilo explícito para variações** — adicione `x:Key` ao `Style` e referencie com `Style="{StaticResource NomeDaChave}"`, porque permite variações controladas sem duplicação
4. **Declare estilos globais no App.xaml** — mova styles para `Application.Resources`, porque estilos em `ContentPage.Resources` só funcionam naquela página
5. **Sobrescreva apenas o necessário** — propriedades definidas diretamente no componente sobrescrevem o estilo implícito, porque o MAUI prioriza declaração local
6. **Nunca duplique TargetType sem Key** — dois estilos implícitos para o mesmo tipo causam erro, porque o MAUI não sabe qual aplicar

## How to write

### Estilo Implícito (padrão para todos os componentes do tipo)

```xml
<ContentPage.Resources>
    <Style TargetType="Button">
        <Setter Property="CornerRadius" Value="20"/>
        <Setter Property="FontSize" Value="18"/>
        <Setter Property="HeightRequest" Value="60"/>
        <Setter Property="FontFamily" Value="HalloweenBlack"/>
        <Setter Property="BackgroundColor" Value="Red"/>
        <Setter Property="TextColor" Value="White"/>
    </Style>
</ContentPage.Resources>
```

### Estilo Explícito (variação com chave)

```xml
<Style TargetType="Button" x:Key="ButtonGoogleLogin">
    <Setter Property="BackgroundColor" Value="#E0E0E0"/>
    <Setter Property="TextColor" Value="Black"/>
</Style>

<!-- Uso no componente -->
<Button Text="Login com Google"
        Style="{StaticResource ButtonGoogleLogin}"/>
```

### Estilo Global (App.xaml)

```xml
<!-- App.xaml -->
<Application.Resources>
    <Style TargetType="Button">
        <Setter Property="CornerRadius" Value="20"/>
        <Setter Property="FontSize" Value="18"/>
        <Setter Property="HeightRequest" Value="60"/>
    </Style>

    <Style TargetType="Button" x:Key="ButtonDangerAction">
        <Setter Property="BackgroundColor" Value="Red"/>
        <Setter Property="TextColor" Value="White"/>
    </Style>
</Application.Resources>
```

## Example

**Before (estilos repetidos em cada componente):**

```xml
<Button Text="Login" BackgroundColor="Black" TextColor="White"
        CornerRadius="20" FontSize="18" HeightRequest="60"
        FontFamily="HalloweenBlack"/>

<Button Text="Google" BackgroundColor="#E0E0E0" TextColor="Black"
        CornerRadius="20" FontSize="18" HeightRequest="60"
        FontFamily="HalloweenBlack"/>
```

**After (com estilos implícito + explícito):**

```xml
<Application.Resources>
    <Style TargetType="Button">
        <Setter Property="CornerRadius" Value="20"/>
        <Setter Property="FontSize" Value="18"/>
        <Setter Property="HeightRequest" Value="60"/>
        <Setter Property="FontFamily" Value="HalloweenBlack"/>
        <Setter Property="BackgroundColor" Value="Black"/>
        <Setter Property="TextColor" Value="White"/>
    </Style>

    <Style TargetType="Button" x:Key="ButtonGoogleLogin">
        <Setter Property="BackgroundColor" Value="#E0E0E0"/>
        <Setter Property="TextColor" Value="Black"/>
    </Style>
</Application.Resources>

<!-- Página: botão padrão herda implícito -->
<Button Text="Login"/>

<!-- Botão com variação explícita (herda o resto) -->
<Button Text="Google" Style="{StaticResource ButtonGoogleLogin}"/>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Propriedade igual em todos os componentes do tipo | Coloque no estilo implícito |
| Variação de cor/aparência para contexto específico | Crie estilo explícito com `x:Key` |
| Estilo usado em mais de uma página | Mova para `App.xaml` (global) |
| Propriedade depende da posição na página (ex: Margin) | Mantenha no componente, não no estilo |
| Precisa sobrescrever uma propriedade do implícito | Declare a propriedade diretamente no componente |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Repetir CornerRadius/FontSize em cada Button | Criar estilo implícito com essas propriedades |
| Dois `Style TargetType="Button"` sem Key | Um implícito + variações com `x:Key` |
| Estilos em `ContentPage.Resources` que precisam ser reutilizados | Mover para `Application.Resources` no App.xaml |
| `x:Key` igual para dois estilos do mesmo tipo | Chaves únicas por variação (ex: `ButtonDanger`, `ButtonGoogleLogin`) |
| Colocar Margin no estilo global | Margin depende do layout — controlar no componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
