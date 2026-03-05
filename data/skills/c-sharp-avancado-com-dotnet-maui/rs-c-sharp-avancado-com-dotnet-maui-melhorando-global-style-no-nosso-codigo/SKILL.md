---
name: rs-csharp-maui-global-style-organization
description: "Enforces organized global style architecture in .NET MAUI projects by splitting styles into separate ResourceDictionary files. Use when user asks to 'create styles', 'organize XAML', 'add global styles', 'style a MAUI app', or 'clean up app.xaml'. Applies rules: one ResourceDictionary per component type, merge dictionaries in app.xaml, padding for internal spacing, ApplyToDerivedTypes for base classes. Make sure to use this skill whenever structuring styles in any .NET MAUI project. Not for platform-specific styling, CSS-based frameworks, or Blazor Hybrid styling."
---

# Organizacao de Global Styles no .NET MAUI

> Separe estilos globais em ResourceDictionary por tipo de componente e importe-os no app.xaml via MergedDictionaries.

## Rules

1. **Um ResourceDictionary por tipo de componente** — `ButtonStyles.xaml`, `ContentPageStyles.xaml`, `LabelStyles.xaml`, porque um unico arquivo de estilos cresce rapidamente (400+ linhas) e torna manutencao impossivel
2. **Importe via MergedDictionaries no app.xaml** — o app.xaml so contem imports, nunca estilos inline, porque centraliza a descoberta sem poluir o arquivo
3. **Delete o code-behind de ResourceDictionary** — remova o `.xaml.cs` E o atributo `x:Class` do XAML, porque estilos nao precisam de logica C# e a referencia orfã causa erro de runtime
4. **Use `ApplyToDerivedTypes="True"` para classes base** — ContentPage, View, etc., porque paginas customizadas herdam dessas classes e sem essa flag o estilo nao e aplicado
5. **Padding e interno, Margin e externo** — use Padding na ContentPage para espacamento interno da pagina, Margin em componentes para espacamento entre eles
6. **Valores direcionais: esquerda, cima, direita, baixo** — `30,40,30,40` nao `40` uniforme, porque ajuste fino evita quebra de layout em dispositivos menores

## How to write

### Estrutura de arquivos de estilo

```
Resources/
└── Styles/
    ├── ButtonStyles.xaml          # Todos os estilos de botao
    ├── ContentPageStyles.xaml     # Estilos de pagina
    ├── LabelStyles.xaml           # Estilos de texto
    └── EntryStyles.xaml           # Estilos de input
```

### ResourceDictionary isolado (sem code-behind)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Style TargetType="Button" x:Key="PrimaryButton">
        <Setter Property="BackgroundColor" Value="#6750A4" />
        <Setter Property="TextColor" Value="White" />
        <Setter Property="CornerRadius" Value="8" />
    </Style>

</ResourceDictionary>
```

### app.xaml com imports organizados

```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Resources/Styles/ButtonStyles.xaml" />
            <ResourceDictionary Source="Resources/Styles/ContentPageStyles.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

### ContentPage style com ApplyToDerivedTypes

```xml
<Style TargetType="ContentPage" ApplyToDerivedTypes="True">
    <Setter Property="Padding" Value="30,40,30,40" />
</Style>
```

## Example

**Before (tudo no app.xaml):**
```xml
<Application.Resources>
    <ResourceDictionary>
        <Style TargetType="Button" x:Key="PrimaryButton">
            <Setter Property="BackgroundColor" Value="#6750A4" />
            <Setter Property="TextColor" Value="White" />
        </Style>
        <Style TargetType="Button" x:Key="GoogleLoginButton">
            <Setter Property="BackgroundColor" Value="White" />
            <Setter Property="TextColor" Value="Black" />
            <Setter Property="BorderColor" Value="#DADCE0" />
        </Style>
        <Style TargetType="ContentPage">
            <Setter Property="Padding" Value="40" />
        </Style>
        <!-- 400+ linhas misturando todos os componentes -->
    </ResourceDictionary>
</Application.Resources>
```

**After (separado por componente):**
```xml
<!-- app.xaml — limpo, so imports -->
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="Resources/Styles/ButtonStyles.xaml" />
            <ResourceDictionary Source="Resources/Styles/ContentPageStyles.xaml" />
        </ResourceDictionary.MergedDictionaries>
    </ResourceDictionary>
</Application.Resources>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo tipo de componente precisa de estilo | Crie novo ResourceDictionary dedicado |
| Estilo so usado em uma pagina | Defina no ResourceDictionary local da pagina, nao no global |
| Deletou code-behind do ResourceDictionary | Remova tambem o `x:Class` do XAML |
| Padding uniforme quebra layout | Use valores direcionais `esq,cima,dir,baixo` |
| Estilo nao aplica em pagina customizada | Adicione `ApplyToDerivedTypes="True"` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Declarar 20+ estilos inline no app.xaml | Um ResourceDictionary por tipo de componente |
| `<Style TargetType="ContentPage">` sem ApplyToDerivedTypes | Adicione `ApplyToDerivedTypes="True"` |
| Deletar `.xaml.cs` mas manter `x:Class` no XAML | Remova ambos juntos |
| `Padding="40"` sem testar em dispositivos menores | Use valores direcionais ajustados: `30,40,30,40` |
| Path com barra inicial: `/Resources/Styles/...` | Sem barra: `Resources/Styles/...` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
