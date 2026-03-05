# Code Examples: Binding de Entry a Propriedade na ViewModel

## Exemplo 1: ViewModel basica sem notificacao (problema)

```csharp
// DoLoginViewModel.cs — ERRADO: sem notificacao
public class DoLoginViewModel
{
    public string Texto { get; set; }

    // O breakpoint mostra que Texto recebe o valor digitado,
    // mas a View nunca e notificada da mudanca
    public void DoLogin()
    {
        var textoDigitado = Texto; // funciona no breakpoint
    }
}
```

```xml
<!-- DoLoginPage.xaml -->
<Entry Placeholder="Digite aqui" Text="{Binding Texto}" />
<Label Text="{Binding Texto}" />  <!-- NUNCA ATUALIZA -->
<Button Text="Login" />
```

Resultado: Entry captura o texto (visivel via breakpoint), mas o Label permanece vazio. Mesmo alterando `Texto` via codigo (`Texto = "Ellison Arley"`), nem Entry nem Label atualizam.

## Exemplo 2: ViewModel com ObservableProperty (correto)

```csharp
// DoLoginViewModel.cs — CORRETO
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace PlanShare.App.ViewModels.Pages.Login.DoLogin;

public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty]
    string texto;

    [RelayCommand]
    async Task DoLogin()
    {
        var textoDigitado = Texto; // Texto com T maiusculo
        // Pode alterar e a View reflete:
        Texto = "Ellison Arley"; // Entry e Label atualizam
    }
}
```

```xml
<!-- DoLoginPage.xaml -->
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.Login.DoLogin"
             x:DataType="viewModel:DoLoginViewModel">

    <VerticalStackLayout>
        <Label Text="{Binding Texto}" />
        <Entry Placeholder="Digite aqui" Text="{Binding Texto}" />
        <Button Text="Login" Command="{Binding DoLoginCommand}" />
    </VerticalStackLayout>
</ContentPage>
```

Resultado: cada caractere digitado na Entry aparece imediatamente no Label. Alteracoes via codigo tambem refletem na UI.

## Exemplo 3: Code-behind conectando ViewModel

```csharp
// DoLoginPage.xaml.cs
namespace PlanShare.App.Pages.Login.DoLogin;

public partial class DoLoginPage : ContentPage
{
    public DoLoginPage()
    {
        InitializeComponent();
        BindingContext = new DoLoginViewModel();
    }
}
```

## Exemplo 4: Cenario real de login com email e senha

```csharp
public partial class DoLoginViewModel : ObservableObject
{
    [ObservableProperty]
    string email;

    [ObservableProperty]
    string senha;

    [RelayCommand]
    async Task DoLogin()
    {
        // Validacoes
        if (string.IsNullOrWhiteSpace(Email))
            return;

        if (string.IsNullOrWhiteSpace(Senha))
            return;

        // Chamar API com Email e Senha
        // Receber token
        // Navegar para proxima tela
    }
}
```

```xml
<VerticalStackLayout Spacing="16" Padding="24">
    <Entry Placeholder="E-mail"
           Text="{Binding Email}"
           Keyboard="Email" />

    <Entry Placeholder="Senha"
           Text="{Binding Senha}"
           IsPassword="True" />

    <Button Text="Fazer Login"
            Command="{Binding DoLoginCommand}" />
</VerticalStackLayout>
```

## Estrutura de pastas demonstrada

```
PlanShare.App/
├── Pages/
│   └── Login/
│       └── DoLogin/
│           ├── DoLoginPage.xaml
│           └── DoLoginPage.xaml.cs
└── ViewModels/
    └── Pages/
        └── Login/
            └── DoLogin/
                └── DoLoginViewModel.cs
```