# Code Examples: Criando Converter para Avatar Name

## Exemplo completo do Converter

```csharp
// Converters/NameToAvatarNameConverter.cs
using System.Globalization;

namespace PlanShare.App.Converters;

public class NameToAvatarNameConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        // Protecao contra valores nulos
        if (value is null)
            return string.Empty;

        // Converte para string e remove espacos extras
        var name = value.ToString()!.Trim();

        // Quebra o nome completo em array usando espaco como separador
        // "Bruce Wayne" → ["Bruce", "Wayne"]
        // "Maria" → ["Maria"]
        var names = name.Split(' ');

        // Se so tem um nome, retorna a primeira letra em maiusculo
        if (names.Length == 1)
            return names[0][0].ToString().ToUpper();

        // Se tem mais de um nome, retorna iniciais dos dois primeiros
        // names[0][0] → primeira letra do primeiro nome
        // names[1][0] → primeira letra do segundo nome
        return $"{names[0][0].ToString().ToUpper()}{names[1][0].ToString().ToUpper()}";
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value; // Nao necessario — AvatarView e read-only
}
```

## Cenarios de entrada e saida

```
"Bruce Wayne"        → "BW"
"Wilson Arley"       → "WA"
"Maria"              → "M"
"Barbara Gordon"     → "BG"
"wilson arley"       → "WA"  (ToUpper garante maiusculas)
"  Bruce Wayne  "    → "BW"  (Trim remove espacos)
"Wilson Arley Vilaca" → "WA" (pega so os dois primeiros)
null                 → ""    (protecao contra nulo)
```

## Uso no XAML com binding

```xml
<!-- No XAML, referencia o converter e usa no binding -->
<AvatarView Text="{Binding Username, Converter={StaticResource NameToAvatarConverter}}" />
```

## Demonstracao do Split

```csharp
// Split com espaco como separador
var name = "Wilson Arley";
var names = name.Split(' ');
// names[0] = "Wilson"
// names[1] = "Arley"
// names.Length = 2

var nameSingle = "Maria";
var namesSingle = nameSingle.Split(' ');
// namesSingle[0] = "Maria"
// namesSingle.Length = 1
```

## Demonstracao de string como vetor de char

```csharp
var name = "Wilson";
// name[0] = 'W'  (char)
// name[1] = 'i'  (char)
// name[2] = 'l'  (char)

// char nao tem ToUpper() direto, precisa converter para string
char letra = name[0];        // 'W'
string letraStr = letra.ToString(); // "W"
string upper = letraStr.ToUpper();  // "W"
```