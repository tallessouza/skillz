# Code Examples: Cores para Cursor e Linha da Entry

## Exemplo 1: Acesso direto ao dicionario (basico)

```csharp
// Dentro do handler mapping function
var cursorColor = (Color)Application.Current!.Resources["PrimaryColorLight"];
```

Isso funciona, mas tem problema: a chave esta hardcoded para light mode.

## Exemplo 2: Verificando o valor com ToHex

```csharp
var cursorColor = (Color)Application.Current!.Resources["PrimaryColorLight"];
var hex = cursorColor.ToHex(); // Retorna o hexadecimal da cor
```

Util para debug — coloque um breakpoint e inspecione o valor hex.

## Exemplo 3: Estrutura completa da classe de extensao

```csharp
// Extensions/ApplicationExtensions.cs
namespace SeuApp.Extensions;

public static class ApplicationExtensions
{
    public static bool IsLightMode(this Application application)
        => application.RequestedTheme == AppTheme.Light;

    public static Color GetPrimaryColor(this Application application)
    {
        var isLightMode = application.IsLightMode();
        var key = isLightMode ? "PrimaryColorLight" : "PrimaryColorDark";
        return (Color)application.Resources[key];
    }

    public static Color GetLineColor(this Application application)
    {
        var isLightMode = application.IsLightMode();
        var key = isLightMode ? "LinesColorLight" : "LinesColorDark";
        return (Color)application.Resources[key];
    }
}
```

## Exemplo 4: Uso no Custom Entry Handler

```csharp
// No arquivo do CustomEntryHandler
using SeuApp.Extensions;

// Dentro da funcao de mapeamento do handler
static void MapCustomEntry(IEntryHandler handler, IEntry entry)
{
    var cursorColor = Application.Current!.GetPrimaryColor();
    var lineColor = Application.Current!.GetLineColor();

    // Usar cursorColor e lineColor para customizar a entry nativa
    // (implementacao especifica por plataforma na proxima aula)
}
```

## Exemplo 5: colors.xaml esperado

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ResourceDictionary xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <!-- Cursor colors -->
    <Color x:Key="PrimaryColorLight">#000000</Color>
    <Color x:Key="PrimaryColorDark">#FFFFFF</Color>

    <!-- Line colors (com transparencia) -->
    <Color x:Key="LinesColorLight">#33000000</Color>  <!-- Preto 20% opacidade -->
    <Color x:Key="LinesColorDark">#33FFFFFF</Color>    <!-- Branco 20% opacidade -->

</ResourceDictionary>
```

## Exemplo 6: Parametros da funcao de handler

```csharp
// handler: referencia ao platform handler para customizacao nativa
// entry: referencia a entry especifica (IEntry) sendo configurada
// Executa N vezes onde N = numero de entries na tela
static void MapCustomEntry(IEntryHandler handler, IEntry entry)
{
    // handler -> usado para acessar o controle nativo da plataforma
    // entry -> a entry MAUI sendo mapeada (pode usar para logica condicional)
}
```