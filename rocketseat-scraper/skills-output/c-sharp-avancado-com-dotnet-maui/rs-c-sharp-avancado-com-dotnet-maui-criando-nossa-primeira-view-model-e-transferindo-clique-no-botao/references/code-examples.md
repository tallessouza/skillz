# Code Examples: ViewModel e Commands no .NET MAUI

## 1. Criacao da classe ViewModel

```csharp
// ViewModels/Pages/Onboarding/OnboardingViewModel.cs
namespace PlanShare.App.ViewModels.Pages.Onboarding;

public class OnboardingViewModel
{
    public ICommand LoginWithEmailAndPasswordCommand { get; set; }

    public OnboardingViewModel()
    {
        LoginWithEmailAndPasswordCommand = new Command(LoginWithEmailAndPassword);
    }

    public void LoginWithEmailAndPassword()
    {
        // Regra de negocio, validacao, chamada API
    }
}
```

**Detalhes:**
- Namespace usa ponto-e-virgula (file-scoped) em vez de chaves — preferencia do instrutor
- `Ctrl+R G` no Visual Studio remove usings nao utilizados
- Classe deve ser `public`
- ICommand vem de `System.Windows.Input`

## 2. Code-behind com BindingContext

```csharp
// Views/Pages/Onboarding/OnboardingPage.xaml.cs
using PlanShare.App.ViewModels.Pages.Onboarding;

public partial class OnboardingPage : ContentPage
{
    public OnboardingPage()
    {
        InitializeComponent();
        BindingContext = new OnboardingViewModel();
    }
}
```

**Detalhes:**
- Remova os event handlers antigos (`ButtonLoginClicked`, etc.)
- O `using` da ViewModel e necessario — use "Show potential fix" do IDE
- Futuramente sera substituido por injecao de dependencia

## 3. XAML completo com binding

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlanShare.App.ViewModels.Pages.Onboarding"
             x:DataType="viewModel:OnboardingViewModel"
             x:Class="PlanShare.App.Views.Pages.Onboarding.OnboardingPage">

    <!-- ANTES: Clicked="ButtonLoginClicked" -->
    <!-- DEPOIS: Command com Binding -->
    <Button Text="Login com e-mail e senha"
            Command="{Binding LoginWithEmailAndPasswordCommand}" />
</ContentPage>
```

**Detalhes:**
- `xmlns:viewModel` declara o namespace — nome e livre, mas `viewModel` e recomendado
- `x:DataType` habilita autocomplete, nao faz binding
- `{Binding NomeDoCommand}` conecta o botao ao ICommand da ViewModel
- Remova `Clicked="..."` ao migrar para Command

## 4. Antes vs Depois — code-behind completo

### Antes (sem ViewModel)

```csharp
public partial class OnboardingPage : ContentPage
{
    public OnboardingPage()
    {
        InitializeComponent();
    }

    private void ButtonLoginClicked(object sender, EventArgs e)
    {
        // Logica aqui — acoplada a View
    }

    private void ButtonGoogleClicked(object sender, EventArgs e)
    {
        // Mais logica acoplada
    }
}
```

### Depois (com ViewModel)

```csharp
// Code-behind limpo
public partial class OnboardingPage : ContentPage
{
    public OnboardingPage()
    {
        InitializeComponent();
        BindingContext = new OnboardingViewModel();
    }
}

// ViewModel com toda a logica
public class OnboardingViewModel
{
    public ICommand LoginWithEmailAndPasswordCommand { get; set; }
    public ICommand LoginWithGoogleCommand { get; set; }

    public OnboardingViewModel()
    {
        LoginWithEmailAndPasswordCommand = new Command(LoginWithEmailAndPassword);
        LoginWithGoogleCommand = new Command(LoginWithGoogle);
    }

    public void LoginWithEmailAndPassword() { /* ... */ }
    public void LoginWithGoogle() { /* ... */ }
}
```

## 5. Variacao: multiplos botoes (problema de boilerplate)

```csharp
// Para cada botao: 1 funcao + 1 ICommand + 1 atribuicao
public class TelaComMuitosBotoesViewModel
{
    public ICommand AcaoUmCommand { get; set; }
    public ICommand AcaoDoisCommand { get; set; }
    public ICommand AcaoTresCommand { get; set; }
    public ICommand AcaoQuatroCommand { get; set; }

    public TelaComMuitosBotoesViewModel()
    {
        AcaoUmCommand = new Command(AcaoUm);
        AcaoDoisCommand = new Command(AcaoDois);
        AcaoTresCommand = new Command(AcaoTres);
        AcaoQuatroCommand = new Command(AcaoQuatro);
    }

    public void AcaoUm() { }
    public void AcaoDois() { }
    public void AcaoTres() { }
    public void AcaoQuatro() { }
}
```

Este boilerplate sera reduzido com CommunityToolkit.Mvvm na proxima aula.