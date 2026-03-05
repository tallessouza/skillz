---
name: rs-csharp-maui-criando-model-login
description: "Enforces model grouping pattern in .NET MAUI ViewModels when writing C# MVVM code. Use when user asks to 'create a ViewModel', 'add form bindings', 'connect view to properties', 'implement login form', or any MAUI data binding task. Applies rules: group related properties into Model classes instead of individual ViewModel properties, initialize models in constructor, use ObservableProperty only on the model reference not inner properties unless view notification is needed. Make sure to use this skill whenever creating ViewModels with multiple form fields in .NET MAUI. Not for API calls, navigation logic, or non-MVVM patterns."
---

# Model Grouping em ViewModels (.NET MAUI)

> Agrupe propriedades relacionadas em classes Model ao inves de poluir a ViewModel com propriedades individuais.

## Rules

1. **Agrupe propriedades de formulario em uma classe Model** — crie `Models/Login.cs` com `Email` e `Password`, nao `public string Email` direto na ViewModel, porque ViewModels com muitos campos (titulo, data, descricao, anexo) ficam poluidas e ilegíveis
2. **Inicialize o Model no construtor da ViewModel** — `Model = new Login()` no construtor, porque o valor default de um objeto e `null` e acessar `Model.Email` causara NullReferenceException
3. **Use ObservableProperty no Model inteiro, nao nas propriedades internas** — marque `[ObservableProperty] Login model` na ViewModel, nao `[ObservableProperty] string email` dentro da classe Login, porque voce so precisa notificar a View quando for estritamente necessario
4. **Nao transforme propriedades do Model em observaveis desnecessariamente** — se a View nao precisa reagir a mudancas em `Email` via codigo, nao use `[ObservableProperty]` nela, porque capturar valores de Entry funciona sem notificacao
5. **Resolva conflitos de namespace explicitamente** — se a classe e a pasta tem o mesmo nome (ex: `Login` classe e `Login` pasta), use `Models.Login` para resolver ambiguidade de namespace
6. **Inicialize strings como `string.Empty`** — nas propriedades do Model, use `= string.Empty` para evitar warnings de nullable

## How to write

### Classe Model

```csharp
// Models/Login.cs
public class Login
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

### ViewModel com Model agrupado

```csharp
public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty]
    Models.Login model;

    public DoLoginViewModel()
    {
        Model = new Models.Login();
    }

    [RelayCommand]
    private void HandleLogin()
    {
        // Model.Email e Model.Password ja contem os valores digitados
        var email = Model.Email;
        var password = Model.Password;
    }
}
```

### Binding no XAML

```xml
<Entry Placeholder="E-mail" Text="{Binding Model.Email}" />
<Entry Placeholder="Senha" Text="{Binding Model.Password}" IsPassword="True" />
```

## Example

**Before (propriedades individuais poluindo a ViewModel):**
```csharp
public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty] string email;
    [ObservableProperty] string password;
    // Imagina criar tarefa: titulo, data, descricao, responsaveis, anexo...
}
```

**After (agrupadas em Model):**
```csharp
public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty] Models.Login model;

    public DoLoginViewModel()
    {
        Model = new Models.Login();
    }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario com 2+ campos relacionados | Criar classe Model e agrupar |
| Propriedade so captura input do usuario | NAO precisa ser ObservableProperty dentro do Model |
| Propriedade precisa notificar a View (ex: label reativo) | Transformar em ObservableProperty com classe partial + heranca ObservableObject |
| Nome da classe conflita com nome da pasta | Usar namespace completo: `Models.Login` |
| ViewModel associada a um unico formulario | Nomear a propriedade como `Model` ao inves do nome da classe |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `[ObservableProperty] string email` na ViewModel (para cada campo) | `[ObservableProperty] Models.Login model` (agrupado) |
| `Model.Email` sem inicializar Model no construtor | `Model = new Models.Login()` no construtor |
| `[ObservableProperty] string email` dentro do Model (sem necessidade) | `public string Email { get; set; } = string.Empty` |
| `Login model` quando classe e pasta tem mesmo nome | `Models.Login model` com namespace explicito |
| Propriedades com valor default null para strings | `= string.Empty` para evitar nullable warnings |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
