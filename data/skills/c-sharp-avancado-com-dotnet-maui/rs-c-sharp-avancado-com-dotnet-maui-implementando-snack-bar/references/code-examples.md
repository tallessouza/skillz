# Code Examples: SnackBar em .NET MAUI

## Exemplo 1: SnackBar completo com todas as opcoes

Este eh o exemplo construido passo a passo na aula, com todas as propriedades de customizacao:

```csharp
// Funcao que sera executada ao tocar no botao
private void Desfazer()
{
    // Logica de desfazer a operacao
}

// Criar fonte
var fonte = Microsoft.Maui.Font.OfSize("MainFontBlack", 14);

// Configurar opcoes visuais
var options = new SnackBarOptions
{
    BackgroundColor = Application.Current!.GetHighlightColor(),
    TextColor = Application.Current!.GetSecondaryColor(),
    ActionButtonTextColor = Application.Current!.GetSecondaryColor(),
    CornerRadius = 8,
    Font = fonte,
    ActionButtonFont = fonte,
    CharacterSpacing = 0.10
};

// Duracao
var duration = TimeSpan.FromSeconds(3);

// Criar SnackBar
var snackbar = SnackBar.Make(
    "Dados atualizados com sucesso",
    action: Desfazer,
    actionButtonText: "Desfazer",
    duration: duration,
    visualOptions: options
);

await snackbar.Show();
```

## Exemplo 2: SnackBar com botao que apenas fecha

Quando voce quer dar ao usuario a opcao de fechar o alerta antes do timeout, mas sem executar nenhuma logica:

```csharp
var snackbar = SnackBar.Make(
    "Dados atualizados com sucesso",
    action: null,
    actionButtonText: "Fechar"
);

await snackbar.Show();
```

Ao tocar em "Fechar", o SnackBar fecha automaticamente sem precisar de codigo adicional.

## Exemplo 3: SnackBar sem botao

Quando voce nao quer exibir nenhum botao — o SnackBar fica visivel ate o timeout:

```csharp
var snackbar = SnackBar.Make(
    "Dados atualizados com sucesso",
    action: null,
    actionButtonText: string.Empty
);

await snackbar.Show();
```

Neste caso o usuario nao pode interagir — precisa esperar a duracao expirar.

## Exemplo 4: ApplicationExtensions (contexto do projeto)

Metodos de extensao usados para buscar cores do resource dictionary:

```csharp
public static class ApplicationExtensions
{
    public static Color GetHighlightColor(this Application app)
    {
        // Busca HighlightColorLight ou HighlightColorDark
        // dependendo do tema atual
    }

    public static Color GetSecondaryColor(this Application app)
    {
        // Busca SecondaryColorLight ou SecondaryColorDark
    }

    public static Color GetPrimaryColor(this Application app) { ... }
    public static Color GetLineColor(this Application app) { ... }
}
```

## Exemplo 5: Constantes de fonte do projeto

```csharp
public static class FontConstants
{
    public const string MainFontLight = "MainFontLight";
    public const string MainFontRegular = "MainFontRegular";
    public const string MainFontBlack = "MainFontBlack";
}
```

Uso com SnackBarOptions:
```csharp
var fonte = Microsoft.Maui.Font.OfSize(FontConstants.MainFontRegular, 14);
```

## Comparacao: Toast vs SnackBar

```csharp
// Toast — sem customizacao
var toast = Toast.Make("Mensagem");
await toast.Show();

// SnackBar — com customizacao completa
var snackbar = SnackBar.Make(
    "Mensagem",
    action: MinhaFuncao,
    actionButtonText: "Desfazer",
    duration: TimeSpan.FromSeconds(3),
    visualOptions: new SnackBarOptions
    {
        BackgroundColor = Colors.Blue,
        TextColor = Colors.White,
        CornerRadius = 8
    }
);
await snackbar.Show();
```

## Assinatura do SnackBar.Make

```csharp
public static ISnackBar Make(
    string message,                    // Obrigatorio: texto da mensagem
    Action? action = null,             // Opcional: funcao executada ao tocar no botao
    string actionButtonText = "Ok",    // Opcional: texto do botao (default "Ok")
    TimeSpan? duration = null,         // Opcional: quanto tempo fica visivel
    SnackBarOptions? visualOptions = null, // Opcional: customizacao visual
    IView? anchor = null               // Opcional: componente de referencia para posicao
);
```