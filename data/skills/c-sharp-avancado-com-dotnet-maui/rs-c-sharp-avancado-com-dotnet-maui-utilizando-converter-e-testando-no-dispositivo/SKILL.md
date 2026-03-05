---
name: rs-csharp-maui-xaml-value-converters
description: "Applies IValueConverter pattern in .NET MAUI XAML when binding properties that need transformation before display. Use when user asks to 'format binding value', 'convert data in XAML', 'display initials', 'transform bound property', 'use converter in MAUI', or any XAML data binding with transformation. Ensures correct converter registration in ContentPage.Resources, proper xmlns namespace import, and StaticResource key reference in Binding syntax. Make sure to use this skill whenever implementing IValueConverter or binding with format conversion in .NET MAUI. Not for code-behind logic, ViewModel implementation, or non-XAML data transformation."
---

# XAML Value Converters no .NET MAUI

> Registre converters como recursos da ContentPage com uma chave, importe o namespace via xmlns, e referencie no Binding com StaticResource.

## Rules

1. **Registre o converter em ContentPage.Resources** — declare uma instancia do converter dentro da tag `<ContentPage.Resources>`, porque o XAML precisa de uma referencia nomeada para usar no binding
2. **Importe o namespace com xmlns** — use `xmlns:converters="clr-namespace:SeuApp.Converters"` no ContentPage, porque sem o using o XAML nao encontra a classe do converter
3. **Use x:Key para nomear o converter** — atribua uma chave unica como `x:Key="NameToAvatarName"`, porque eh essa chave que o Binding referencia via StaticResource
4. **Referencie com StaticResource no Binding** — use `{Binding Prop, Converter={StaticResource ChaveDoConverter}}`, porque StaticResource busca nos Resources da pagina
5. **Implemente IValueConverter com null-check** — retorne string vazia se value for null, porque o binding pode ser chamado antes do ViewModel popular a propriedade
6. **Ajuste espacamento com Margin, nao ColumnSpacing** — use Margin no elemento especifico quando o espacamento eh entre elementos pontuais, porque ColumnSpacing afeta TODAS as colunas do Grid

## How to write

### Registro do converter no XAML

```xml
<ContentPage xmlns:converters="clr-namespace:MeuApp.Converters">

    <ContentPage.Resources>
        <converters:NameToAvatarNameConverter x:Key="NameToAvatarName" />
    </ContentPage.Resources>

    <!-- uso no binding -->
    <AvatarView Text="{Binding Username, Converter={StaticResource NameToAvatarName}}" />
</ContentPage>
```

### Classe IValueConverter

```csharp
public class NameToAvatarNameConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not string name || string.IsNullOrWhiteSpace(name))
            return string.Empty;

        var names = name.Split(' ');

        if (names.Length == 1)
            return names[0][0].ToString().ToUpper();

        return $"{names[0][0]}{names[^1][0]}".ToUpper();
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        => throw new NotImplementedException();
}
```

## Example

**Before (binding direto sem converter):**
```xml
<AvatarView Text="{Binding Username}" />
<!-- Exibe "Bruce Wayne" inteiro no avatar -->
```

**After (com converter registrado):**
```xml
<ContentPage xmlns:converters="clr-namespace:MeuApp.Converters">
    <ContentPage.Resources>
        <converters:NameToAvatarNameConverter x:Key="NameToAvatarName" />
    </ContentPage.Resources>

    <AvatarView Text="{Binding Username, Converter={StaticResource NameToAvatarName}}" />
    <!-- Exibe "BW" para "Bruce Wayne", "B" para "Bruce" -->
</ContentPage>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Binding precisa formatar valor antes de exibir | Crie um IValueConverter |
| Converter usado em uma unica pagina | Registre em ContentPage.Resources |
| Converter reutilizado em varias paginas | Registre em App.xaml Resources (global) |
| Espacamento entre elementos especificos no Grid | Use Margin no elemento, nao ColumnSpacing |
| Debugging de converter | Coloque breakpoint no metodo Convert e inspecione value |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `Text="{Binding Username}"` quando precisa de iniciais | `Text="{Binding Username, Converter={StaticResource Key}}"` |
| Formatar valor no ViewModel so pra exibicao | Crie um IValueConverter reutilizavel |
| `ColumnSpacing="20"` para espacar apenas um par de colunas | `Margin="15,0,0,0"` no elemento especifico |
| Esquecer `x:Key` no converter registrado | Sempre atribua `x:Key="NomeDescritivo"` |
| Converter sem null-check | Sempre verifique `if value is null` antes de operar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
