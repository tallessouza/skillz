---
name: rs-csharp-maui-criando-converter-nome
description: "Applies IValueConverter pattern in .NET MAUI when transforming bound data for display. Use when user asks to 'create a converter', 'transform binding value', 'show initials', 'avatar name', or 'convert data in XAML binding'. Implements IValueConverter with Convert/ConvertBack, string splitting, and char extraction. Make sure to use this skill whenever creating value converters or transforming bound properties in .NET MAUI. Not for general string manipulation outside XAML bindings or ViewModel-level data transformation."
---

# ValueConverter no .NET MAUI

> Crie converters para transformar dados no binding, mantendo a logica reutilizavel e fora da ViewModel.

## Rules

1. **Nunca coloque logica de conversao de exibicao na ViewModel** — crie um IValueConverter, porque a ViewModel nao deve ter propriedades extras so para formatacao visual e o converter e reutilizavel em qualquer tela
2. **Implemente IValueConverter em uma classe dentro da pasta Converters/** — porque o .NET MAUI chama Convert automaticamente quando o valor de origem muda no binding
3. **Sempre trate value nulo no Convert** — retorne `string.Empty` se value for null, porque o binding pode enviar valores nulos inesperados
4. **Use Trim() apos ToString()** — porque nomes podem ter espacos no inicio ou fim que quebram a logica de split
5. **ConvertBack geralmente retorna o proprio value** — porque na maioria dos cenarios (exibicao read-only) a conversao reversa nao e necessaria nem possivel
6. **Faca ToUpper() via ToString() primeiro** — porque char nao tem ToUpper() direto, apenas string tem

## How to write

### Estrutura do Converter

```csharp
// Converters/NameToAvatarNameConverter.cs
public class NameToAvatarNameConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is null)
            return string.Empty;

        var name = value.ToString()!.Trim();
        var names = name.Split(' ');

        if (names.Length == 1)
            return names[0][0].ToString().ToUpper();

        return $"{names[0][0].ToString().ToUpper()}{names[1][0].ToString().ToUpper()}";
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value;
}
```

### Uso no XAML (binding com Converter)

```xml
<AvatarView Text="{Binding Username, Converter={StaticResource NameToAvatarConverter}}" />
```

## Example

**Before (logica na ViewModel — errado):**
```csharp
public class DashboardViewModel
{
    public string Username { get; set; }
    public string AvatarName { get; set; } // propriedade extra desnecessaria

    void SetAvatar()
    {
        var names = Username.Split(' ');
        AvatarName = names.Length == 1
            ? names[0][0].ToString().ToUpper()
            : $"{names[0][0]}{names[1][0]}".ToUpper();
    }
}
```

**After (com Converter — correto):**
```csharp
// Converter reutilizavel, ViewModel limpa
public class DashboardViewModel
{
    public string Username { get; set; }
    // Sem propriedade extra — o Converter cuida da transformacao
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Transformar dado para exibicao sem alterar ViewModel | Crie um IValueConverter |
| Logica de exibicao usada em mais de uma tela | Converter (reutilizavel) em vez de propriedade na VM |
| ConvertBack nao faz sentido logico | Retorne o proprio value |
| String vinda do binding pode ser nula | Verifique `value is null` antes de qualquer operacao |
| Precisa extrair caractere de string | Use indexador `[0]` + `.ToString()` antes de `.ToUpper()` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Propriedade extra na ViewModel so para formatacao | IValueConverter no binding |
| `throw new NotImplementedException()` no ConvertBack | `=> value;` retornando o proprio valor |
| Chamar `.ToUpper()` direto em char | `char.ToString().ToUpper()` |
| Esquecer `.Trim()` antes de `.Split()` | `value.ToString()!.Trim().Split(' ')` |
| Duplicar logica de iniciais em cada ViewModel | Um converter na pasta Converters/ |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
