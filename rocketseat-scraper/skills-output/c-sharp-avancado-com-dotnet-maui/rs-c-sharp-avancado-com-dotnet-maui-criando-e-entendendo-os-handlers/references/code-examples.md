# Code Examples: Handlers no .NET MAUI

## Estrutura de arquivos

```
Resources/
└── Styles/
    └── Handler/
        └── CustomEntryHandler.cs
MauiProgram.cs
```

## CustomEntryHandler completo

```csharp
// Resources/Styles/Handler/CustomEntryHandler.cs
namespace PlanShareApp.Resources.Styles.Handler;

public class CustomEntryHandler
{
    public static void Customize()
    {
        Microsoft.Maui.Handlers.EntryHandler
            .Mapper
            .AppendToMapping("PlanShareEntry", (handler, view) =>
            {
                // Proxima aula: manipulacao de cores nativas aqui
            });
    }
}
```

## MauiProgram com handler registrado

```csharp
// MauiProgram.cs
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                // configuracao de fontes
            })
            .ConfigureMauiHandlers(_ =>
            {
                CustomEntryHandler.Customize();
            });

        return builder.Build();
    }
}
```

## Action vs Func — exemplos comparativos

```csharp
// Action: funcao sem retorno
Action<int, int> soma = (a, b) =>
{
    Console.WriteLine(a + b); // nao retorna, apenas executa
};

// Func: funcao com retorno (ultimo tipo = retorno)
Func<int, int> dobro = (n) =>
{
    return n * 2; // retorna int
};

Func<int, string> converter = (n) =>
{
    return n.ToString(); // recebe int, retorna string
};
```

## Mapeamento visual: Virtual → Handler → Nativo

```
Entry (Virtual View, .NET MAUI)
  │
  ├── EntryHandler (iOS/Mac)    → UITextField
  ├── EntryHandler (Android)    → AppCompatEditText
  └── EntryHandler (Windows)    → TextBox
```

## Padrao para outros controles

```csharp
// Mesmo padrao funciona para qualquer controle
Microsoft.Maui.Handlers.ButtonHandler
    .Mapper
    .AppendToMapping("MeuAppButton", (handler, view) =>
    {
        // customizacoes do botao nativo
    });

Microsoft.Maui.Handlers.CheckBoxHandler
    .Mapper
    .AppendToMapping("MeuAppCheckBox", (handler, view) =>
    {
        // customizacoes do checkbox nativo
    });
```