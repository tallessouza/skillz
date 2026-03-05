# Code Examples: XAML Value Converters no .NET MAUI

## Exemplo completo: NameToAvatarNameConverter

### A classe do converter

```csharp
using System.Globalization;

namespace PlanShare.App.Converters;

public class NameToAvatarNameConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        // Null check — binding pode ser chamado antes do ViewModel popular
        if (value is null)
            return string.Empty;

        // Cast de object para string
        var name = (string)value;

        // Split pelo espaco para separar primeiro e ultimo nome
        var names = name.Split(' ');

        // Se tem apenas um nome (ex: "Bruce"), retorna primeira letra
        if (names.Length == 1)
            return names[0][0].ToString().ToUpper();

        // Se tem mais de um nome (ex: "Bruce Wayne"), retorna iniciais
        // names[0][0] = 'B', names[^1][0] = 'W' → "BW"
        return $"{names[0][0]}{names[^1][0]}".ToUpper();
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
```

### Registro no XAML da pagina

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:converters="clr-namespace:PlanShare.App.Converters"
             x:Class="PlanShare.App.Pages.DashboardPage">

    <!-- Behaviors (ja existentes) -->
    <ContentPage.Behaviors>
        <!-- ... -->
    </ContentPage.Behaviors>

    <!-- Registro do converter com chave -->
    <ContentPage.Resources>
        <converters:NameToAvatarNameConverter x:Key="NameToAvatarName" />
    </ContentPage.Resources>

    <Grid>
        <!-- Avatar usando o converter -->
        <AvatarView
            Text="{Binding Username, Converter={StaticResource NameToAvatarName}}" />

        <!-- Texto de boas-vindas -->
        <VerticalStackLayout Margin="10,0,0,0">
            <Label Text="Bem vindo," />
            <Label Text="{Binding Username}" />
        </VerticalStackLayout>
    </Grid>
</ContentPage>
```

## Sintaxe do Binding com Converter — decomposta

```xml
<!-- Anatomia do binding com converter -->
Text="{Binding Username, Converter={StaticResource NameToAvatarName}}"
<!--     │                  │            │               │
         │                  │            │               └─ Chave (x:Key) do converter
         │                  │            └─ Busca nos Resources da pagina
         │                  └─ Parametro Converter do Binding
         └─ Propriedade do ViewModel sendo vinculada
-->
```

Nota: as chaves duplas sao intencionais:
- Chave externa: abre/fecha o `{Binding ...}`
- Chave interna: abre/fecha o `{StaticResource ...}`

## Ajuste de layout: Margin vs ColumnSpacing

```xml
<!-- ERRADO: afeta TODAS as colunas -->
<Grid ColumnSpacing="20">
    <!-- Espacamento de 20 entre avatar e texto (ok) -->
    <!-- Espacamento de 20 entre texto e icone (indesejado!) -->
</Grid>

<!-- CORRETO: afeta apenas o elemento especifico -->
<Grid>
    <AvatarView ... />
    <VerticalStackLayout Margin="10,0,0,0">
        <!-- 10px apenas a esquerda deste elemento -->
    </VerticalStackLayout>
</Grid>
```

## Tecnica de debug: forcando novo login

```csharp
// No AppShell.xaml.cs — limpa storage para forcar redirecionamento ao login
UserStorage.Clear();
// Isso forca o app a ir para a tela de onboard/login
// Util quando voce alterou dados direto no banco e precisa testar com valores novos
```

## Cenarios de teste do converter

| Input (Username) | Split resultado | Length == 1? | Output |
|-----------------|-----------------|--------------|--------|
| `"Bruce"` | `["Bruce"]` | Sim | `"B"` |
| `"Bruce Wayne"` | `["Bruce", "Wayne"]` | Nao | `"BW"` |
| `null` | — | — | `""` |
| `"Ana Maria Silva"` | `["Ana", "Maria", "Silva"]` | Nao | `"AS"` |