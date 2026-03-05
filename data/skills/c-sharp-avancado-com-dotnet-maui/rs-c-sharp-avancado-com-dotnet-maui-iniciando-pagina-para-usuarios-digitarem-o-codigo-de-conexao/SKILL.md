---
name: rs-csharp-maui-pin-code-page-setup
description: "Generates .NET MAUI pin code input pages using PinCodes.Authorization.Maui NuGet package. Use when user asks to 'create pin code page', 'add code input screen', 'implement connection code page', 'setup pin entry in MAUI', or 'use PinCodes.Authorization library'. Applies correct XAML inheritance (CodePage), callback command binding with x:Name convention, and ViewModel relay command pattern. Make sure to use this skill whenever building code/pin input screens in .NET MAUI projects. Not for general XAML page creation, navigation setup, or SignalR real-time connection logic."
---

# Pagina de Codigo de Conexao com PinCodes.Authorization.Maui

> Utilize a biblioteca PinCodes.Authorization.Maui para paginas de entrada de codigo PIN, nunca construa do zero.

## Rules

1. **Use PinCodes.Authorization.Maui** — instale via NuGet (`PinCodes.Authorization.Maui`), porque construir input de PIN do zero e trabalhoso e propenso a erros
2. **Atualize NuGet packages antes de instalar novos** — va em Updates e atualize tudo antes, porque versoes conflitantes entre dependencias causam erros de build
3. **Troque ContentPage por CodePage** — tanto no XAML (`pinCode:CodePage`) quanto no CodeBehind (heranca `PinCodes.Authorization.Views.Pages.CodePage`), porque e o tipo base da biblioteca
4. **Nomeie x:Name com prefixo Page** — convencao: `Page` + nome da classe sem sufixo Page, ex: `PageUserCodeConnection`, porque o callback binding referencia esse nome
5. **Callback command usa sufixo Command** — no binding, o nome da funcao relay command + `Command` no final, porque o MAUI CommunityToolkit gera a propriedade com esse sufixo
6. **Uma pagina, uma responsabilidade** — a pagina de codigo so recebe o codigo, nao esconde/mostra elementos extras, porque simplifica manutencao e separacao de concerns

## How to write

### XAML — CodePage com callback

```xml
<?xml version="1.0" encoding="utf-8" ?>
<pinCode:CodePage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:pinCode="clr-namespace:PinCodes.Authorization.Views.Pages;assembly=PinCodes.Authorization"
    xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
    xmlns:fonts="clr-namespace:PlainShare.App.Resources.Fonts"
    xmlns:resource="clr-namespace:PlainShare.App.Resources"
    xmlns:viewModel="clr-namespace:PlainShare.App.ViewModels.Pages.User.Connection"
    x:DataType="viewModel:UserCodeConnectionViewModel"
    x:Class="PlainShare.App.Views.Pages.User.Connection.UserCodeConnectionPage"
    x:Name="PageUserCodeConnection"
    CallbackCodeFinishCommand="{Binding Source={x:Reference PageUserCodeConnection}, Path=BindingContext.CodeCompletedCommand}">
</pinCode:CodePage>
```

### CodeBehind — heranca CodePage

```csharp
using PinCodes.Authorization.Views.Pages;

namespace PlainShare.App.Views.Pages.User.Connection;

public partial class UserCodeConnectionPage : CodePage
{
    public UserCodeConnectionPage(UserCodeConnectionViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### ViewModel — RelayCommand recebendo codigo

```csharp
public partial class UserCodeConnectionViewModel : ViewModelBase
{
    public UserCodeConnectionViewModel(INavigationService navigationService)
        : base(navigationService) { }

    [RelayCommand]
    private async Task CodeCompleted(string code)
    {
        // code contem o PIN digitado pelo usuario
        // navegar para proxima pagina ou processar conexao
    }
}
```

### MauiProgram — registro da pagina

```csharp
builder.Services.AddTransient<UserCodeConnectionPage>();
builder.Services.AddTransient<UserCodeConnectionViewModel>();

// Em RoutePages:
public const string UserCodeConnectionPage = "UserCodeConnectionPage";
```

## Example

**Before (tentando criar do zero):**
```xml
<ContentPage>
    <StackLayout>
        <Entry MaxLength="1" Keyboard="Numeric" />
        <Entry MaxLength="1" Keyboard="Numeric" />
        <Entry MaxLength="1" Keyboard="Numeric" />
        <Entry MaxLength="1" Keyboard="Numeric" />
    </StackLayout>
</ContentPage>
```

**After (com PinCodes.Authorization):**
```xml
<pinCode:CodePage
    x:Name="PageUserCodeConnection"
    CallbackCodeFinishCommand="{Binding Source={x:Reference PageUserCodeConnection}, Path=BindingContext.CodeCompletedCommand}">
</pinCode:CodePage>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de input de codigo/PIN | Use PinCodes.Authorization.Maui, nunca crie do zero |
| Quer customizar cores e fontes | Faca na proxima etapa, primeiro configure a estrutura |
| Callback apos digitacao completa | Use `CallbackCodeFinishCommand` com binding via x:Reference |
| Renomeou o RelayCommand | Atualize o binding no XAML adicionando sufixo `Command` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Criar inputs individuais para cada digito | Usar `pinCode:CodePage` da biblioteca |
| Manter heranca `ContentPage` ao usar PinCodes | Trocar para `CodePage` no XAML e CodeBehind |
| Usar `x:Name="PagePinCodes"` da doc generica | Usar `Page` + nome semantico: `PageUserCodeConnection` |
| Instalar NuGet sem atualizar packages existentes | Atualizar todos os packages antes de instalar novos |
| Colocar logica de conexao na mesma pagina do PIN | Separar responsabilidades: uma pagina = uma funcao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
