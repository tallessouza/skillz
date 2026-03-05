# Code Examples: Model Grouping em ViewModels

## Exemplo 1: Classe Login basica

```csharp
// Models/Login.cs
namespace PlanShare.App.Models;

public class Login
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

## Exemplo 2: ViewModel com Model agrupado

```csharp
// ViewModels/DoLoginViewModel.cs
namespace PlanShare.App.ViewModels;

public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty]
    Models.Login model;

    public DoLoginViewModel()
    {
        Model = new Models.Login();
    }

    [RelayCommand]
    private void Login()
    {
        // Acessar Model.Email e Model.Password aqui
        // Valores ja capturados via binding
    }
}
```

## Exemplo 3: XAML binding com Model

```xml
<!-- Binding com propriedade aninhada -->
<Entry Placeholder="E-mail" Text="{Binding Model.Email}" />
<Entry Placeholder="Senha" Text="{Binding Model.Password}" IsPassword="True" />
<Button Text="Login" Command="{Binding LoginCommand}" />
```

## Exemplo 4: ERRADO — Substituir Model inteiro para notificar

```csharp
// Funciona, mas NAO e recomendado para alteracoes simples
[RelayCommand]
private void Login()
{
    // Isso notifica a View porque Model inteiro mudou
    Model = new Models.Login
    {
        Email = "bruce@tech.com"
    };
}
```

## Exemplo 5: Quando PRECISA de ObservableProperty nas propriedades internas

```csharp
// SO faca isso se a View precisa reagir a mudancas individuais
public partial class Login : ObservableObject
{
    [ObservableProperty]
    string email = string.Empty;

    [ObservableProperty]
    string password = string.Empty;
}
// Nota: classe precisa ser partial + herdar ObservableObject
```

## Exemplo 6: Escalando para formularios maiores

```csharp
// Models/TaskItem.cs — muitos campos justificam ainda mais o agrupamento
public class TaskItem
{
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> Assignees { get; set; } = new();
    public string AttachmentPath { get; set; } = string.Empty;
}

// ViewModel fica limpa
public partial class CreateTaskViewModel : ObservableObject
{
    [ObservableProperty]
    Models.TaskItem model;

    public CreateTaskViewModel()
    {
        Model = new Models.TaskItem();
    }
}
```