---
name: rs-csharp-maui-binding-entry-viewmodel
description: "Enforces correct data binding between View and ViewModel in .NET MAUI using ObservableProperty and ObservableObject. Use when user asks to 'bind entry to viewmodel', 'connect view to viewmodel', 'create observable property', 'notify property changed in MAUI', or 'two-way binding MAUI'. Applies rules: ObservableObject inheritance, lowercase field with ObservableProperty attribute, BindingContext in code-behind, xmlns datatype reference. Make sure to use this skill whenever creating ViewModels with bindable properties in .NET MAUI. Not for Blazor binding, WPF binding, or non-MAUI XAML frameworks."
---

# Binding de Entry a Propriedade na ViewModel (.NET MAUI)

> Toda propriedade que precisa notificar a View sobre mudancas deve ser uma ObservableProperty dentro de uma classe que herda de ObservableObject.

## Rules

1. **Herde de ObservableObject** — a ViewModel DEVE herdar de `ObservableObject`, porque sem essa heranca o atributo `[ObservableProperty]` nao funciona e a View nunca sera notificada
2. **Campo privado com letra minuscula** — declare `[ObservableProperty] string texto;` com inicial minuscula, porque o Community Toolkit gera automaticamente a propriedade publica `Texto` com inicial maiuscula
3. **Classe parcial obrigatoria** — a ViewModel deve ser `partial class`, porque o source generator precisa criar codigo complementar
4. **BindingContext no code-behind** — conecte a ViewModel via `BindingContext = new SuaViewModel();` no construtor da page
5. **Binding no XAML usa propriedade maiuscula** — no XAML escreva `Text="{Binding Texto}"` referenciando a propriedade gerada (T maiusculo), nunca o campo privado
6. **Estrutura de pastas espelha Pages** — a pasta da ViewModel replica a mesma hierarquia da pasta da Page para manter padrao e facilitar manutencao

## How to write

### ViewModel com ObservableProperty

```csharp
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace App.ViewModels.Pages.Login.DoLogin;

public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty]
    string email;

    [ObservableProperty]
    string senha;

    [RelayCommand]
    async Task DoLogin()
    {
        // email e senha ja contem os valores digitados na View
        var emailDigitado = Email;
        var senhaDigitada = Senha;
        // validar e chamar API
    }
}
```

### Code-behind conectando ViewModel

```csharp
public partial class DoLoginPage : ContentPage
{
    public DoLoginPage()
    {
        InitializeComponent();
        BindingContext = new DoLoginViewModel();
    }
}
```

### XAML com Binding

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:App.ViewModels.Pages.Login.DoLogin"
             x:DataType="viewModel:DoLoginViewModel">

    <Entry Placeholder="Digite seu e-mail" Text="{Binding Email}" />
    <Entry Placeholder="Digite sua senha" Text="{Binding Senha}" IsPassword="True" />
    <Button Text="Login" Command="{Binding DoLoginCommand}" />
</ContentPage>
```

## Example

**Before (sem notificacao — View nunca atualiza):**

```csharp
public class DoLoginViewModel
{
    public string Texto { get; set; }
}
```

O Label com `{Binding Texto}` fica vazio mesmo apos digitar na Entry, porque ninguem notifica a View que a propriedade mudou. A conexao acontece uma unica vez no momento do `new`, quando o valor ainda e string vazia.

**After (com ObservableProperty — notificacao automatica):**

```csharp
public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty]
    string texto;
}
```

Agora cada caractere digitado na Entry notifica a View. Um Label com `{Binding Texto}` atualiza em tempo real.

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade precisa refletir na UI em tempo real | Use `[ObservableProperty]` + heranca `ObservableObject` |
| Propriedade e somente leitura interna | `get; set;` normal, sem ObservableProperty |
| Funcao precisa ser chamada por botao | Use `[RelayCommand]` + `partial class` |
| Visual Studio nao mostra propriedade no XAML | Adicione `xmlns` + `x:DataType` apontando para a ViewModel |
| Propriedade gerada nao aparece no IntelliSense | Bug do Visual Studio — apague e redigite, funciona normalmente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `public string Texto { get; set; }` sem notificacao | `[ObservableProperty] string texto;` |
| ViewModel sem heranca de `ObservableObject` | `public partial class VM : ObservableObject` |
| Campo com inicial maiuscula `[ObservableProperty] string Texto;` | Campo com inicial minuscula `string texto;` |
| Binding referenciando campo minusculo `{Binding texto}` | Referencia propriedade gerada `{Binding Texto}` |
| ViewModel sem `partial` | Sempre `partial class` quando usa atributos do Toolkit |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
