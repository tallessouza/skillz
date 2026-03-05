# Code Examples: MVVM Toolkit e Partial Class

## Instalacao do pacote

```
NuGet > Install-Package CommunityToolkit.Mvvm -Version 8.4.0
```

No Visual Studio: botao direito no projeto > Manage NuGet Packages > Browse > pesquisar "communitytoolkit.mvvm" > Install.

## Exemplo completo: ViewModel antes do Toolkit

```csharp
using System.Windows.Input;

public class OnboardViewModel
{
    public ICommand LoginComEmailESenhaCommand { get; }
    public ICommand LoginComGoogleCommand { get; }

    public OnboardViewModel()
    {
        LoginComEmailESenhaCommand = new Command(LoginComEmailESenha);
        LoginComGoogleCommand = new Command(LoginComGoogle);
    }

    private void LoginComEmailESenha()
    {
        // logica de autenticacao com email e senha
    }

    private void LoginComGoogle()
    {
        // logica de autenticacao com Google
    }
}
```

## Exemplo completo: ViewModel com Toolkit

```csharp
using CommunityToolkit.Mvvm.Input;

public partial class OnboardViewModel
{
    [RelayCommand]
    private void LoginComEmailESenha()
    {
        // logica de autenticacao com email e senha
    }

    [RelayCommand]
    private void LoginComGoogle()
    {
        // logica de autenticacao com Google
    }
}
```

## XAML binding com os commands gerados

```xml
<!-- O nome do command = nome do metodo + "Command" -->
<Button Text="Login com e-mail e senha"
        Command="{Binding LoginComEmailESenhaCommand}" />

<Button Text="Continuar com Google"
        Command="{Binding LoginComGoogleCommand}" />
```

## Partial class em multiplos arquivos (exemplo da Microsoft)

### Employee_Part1.cs
```csharp
namespace MyNamespace
{
    public partial class Employee
    {
        public void DoWork()
        {
            // trabalho
        }
    }
}
```

### Employee_Part2.cs
```csharp
namespace MyNamespace
{
    public partial class Employee
    {
        public void GoToLunch()
        {
            // almoco
        }
    }
}
```

### Program.cs
```csharp
var employee = new Employee();
employee.DoWork();
employee.GoToLunch();
// Ambos os metodos disponiveis na mesma instancia
```

## Erros comuns

### Erro: classe sem partial com [RelayCommand]
```csharp
// ERRO — source generator nao consegue complementar a classe
public class OnboardViewModel
{
    [RelayCommand]
    private void Login() { }
}
```

### Correcao
```csharp
// CORRETO — partial permite o source generator atuar
public partial class OnboardViewModel
{
    [RelayCommand]
    private void Login() { }
}
```

### Erro: namespaces diferentes em partial class
```csharp
// Arquivo 1 — em ViewModels/
namespace PlanShare.App.ViewModels
{
    public partial class OnboardViewModel { }
}

// Arquivo 2 — em ViewModels/Subpasta/
namespace PlanShare.App.ViewModels.Subpasta  // DIFERENTE!
{
    public partial class OnboardViewModel { }  // NAO VAI FUNCIONAR
}
```