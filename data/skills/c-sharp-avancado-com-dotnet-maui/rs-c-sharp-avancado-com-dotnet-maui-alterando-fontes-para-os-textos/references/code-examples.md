# Code Examples: Fontes em .NET MAUI

## Estrutura de arquivos de fonte no projeto

```
Resources/
└── Fonts/
    ├── Halloway-Black.ttf
    ├── Halloway-Regular.ttf
    ├── Halloway-Thin.ttf
    ├── WorkSans-Black.ttf
    └── WorkSans-Regular.ttf
```

Importante: deletar as fontes default que vem com o template do projeto antes de adicionar as suas.

## Registro completo no MauiProgram.cs

```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                // Parametro 1: nome do arquivo TTF (com extensao)
                // Parametro 2: alias para usar no XAML
                fonts.AddFont("Halloway-Black.ttf", "HallowayBlack");
                fonts.AddFont("Halloway-Regular.ttf", "HallowayRegular");
                fonts.AddFont("Halloway-Thin.ttf", "HallowayThin");
                fonts.AddFont("WorkSans-Black.ttf", "WorkSansBlack");
                fonts.AddFont("WorkSans-Regular.ttf", "WorkSansRegular");
            });

        return builder.Build();
    }
}
```

## Uso basico no XAML

### Titulo com fonte destaque (Black)

```xml
<Label
    Text="Tarefas pequenas, grandes resultados"
    FontFamily="HallowayBlack"
    FontSize="18"
    HorizontalOptions="Center" />
```

### Texto com fonte regular

```xml
<Label
    Text="Organize suas tarefas do dia"
    FontFamily="WorkSansRegular"
    FontSize="14" />
```

### Texto com fonte bold

```xml
<Label
    Text="Destaque importante"
    FontFamily="WorkSansBlack"
    FontSize="14" />
```

## Truque de verificacao de fonte

Para confirmar visualmente que a fonte foi aplicada, coloque dois Labels lado a lado — um com FontFamily e outro sem:

```xml
<!-- Com fonte customizada -->
<Label
    Text="W"
    FontFamily="HallowayBlack"
    FontSize="80"
    HorizontalOptions="Center" />

<!-- Sem fonte (usa default do Android) -->
<Label
    Text="W"
    FontSize="80"
    HorizontalOptions="Center" />
```

Compare caracteres como W e R que costumam ter desenhos visivelmente distintos entre fontes.

## Verificacao de Build Action

Apos adicionar arquivos TTF ao projeto:
1. Clique com botao direito no arquivo TTF
2. Selecione **Properties**
3. Confirme que **Build Action** esta marcado como **MauiFont**

O Visual Studio geralmente configura automaticamente ao colocar na pasta `Resources/Fonts/`, mas sempre confirme.

## Combinacao tipica em uma pagina

```xml
<VerticalStackLayout Spacing="10" Padding="20">

    <!-- Titulo: fonte display, peso black -->
    <Label
        Text="Tarefas pequenas, grandes resultados"
        FontFamily="HallowayBlack"
        FontSize="24"
        HorizontalOptions="Center" />

    <!-- Subtitulo: fonte texto, peso regular -->
    <Label
        Text="Organize e conquiste seus objetivos"
        FontFamily="WorkSansRegular"
        FontSize="16"
        HorizontalOptions="Center" />

    <!-- Botao com fonte texto, peso bold -->
    <Button
        Text="COMECAR AGORA"
        FontFamily="WorkSansBlack"
        FontSize="14" />

</VerticalStackLayout>
```