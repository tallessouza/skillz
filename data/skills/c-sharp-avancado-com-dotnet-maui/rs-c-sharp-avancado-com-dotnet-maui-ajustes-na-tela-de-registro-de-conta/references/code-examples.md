# Code Examples: Ajustes na Tela de Registro de Conta

## 1. Model UserRegisterAccount completo

```csharp
// Models/UserRegisterAccount.cs
public class UserRegisterAccount
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

**Por que `string.Empty`?** Sem isso, o compilador mostra warning de nullable (highlight verde no Visual Studio). É a forma idiomática de inicializar strings não-nullable em C#.

## 2. ViewModel completo

```csharp
public partial class RegisterUserAccountViewModel : ObservableObject
{
    [ObservableProperty]
    public UserRegisterAccount model;

    private readonly INavigationService _navigationService;

    public RegisterUserAccountViewModel(INavigationService navigationService)
    {
        Model = new UserRegisterAccount();
        _navigationService = navigationService;
    }

    [RelayCommand]
    async Task GoToLogin()
    {
        await _navigationService.GoToAsync($"../{RoutePages.LoginPage}");
    }

    [RelayCommand]
    async Task RegisterAccount()
    {
        // Futuro: integração com API
        var x = Model; // temporário para debug com breakpoint
    }
}
```

### Anatomia do construtor:

```csharp
// 1. Recebe INavigationService por injeção de dependência
public RegisterUserAccountViewModel(INavigationService navigationService)
{
    // 2. Inicializa o model
    Model = new UserRegisterAccount();
    // 3. Armazena o serviço em propriedade privada readonly
    _navigationService = navigationService;
}
```

## 3. Navegação com fechamento de página

```csharp
// ERRADO — empilha páginas
await _navigationService.GoToAsync(RoutePages.LoginPage);

// CORRETO — fecha atual e navega
await _navigationService.GoToAsync($"../{RoutePages.LoginPage}");
```

**Resultado da navegação correta:**
- Stack antes: `[Onboarding, Register]`
- Após GoToLogin: `[Onboarding, Login]`
- Usuário clica "voltar": vai para Onboarding (correto!)

**Resultado da navegação errada:**
- Stack antes: `[Onboarding, Register]`
- Após GoToLogin: `[Onboarding, Register, Login]`
- Usuário clica "voltar": vai para Register (errado!)

## 4. XAML — Bindings dos campos

```xml
<!-- Campo Nome -->
<Entry Text="{Binding Model.Name}" Placeholder="Nome" />

<!-- Campo Email -->
<Entry Text="{Binding Model.Email}" Placeholder="E-mail" />

<!-- Campo Senha com toggle de visibilidade -->
<Entry Text="{Binding Model.Password}" IsPassword="True" Placeholder="Senha" />
```

## 5. XAML — Comando no botão

```xml
<Button Text="Criar minha conta" Command="{Binding RegisterAccountCommand}" />
```

**Nota:** o nome do comando no XAML é `RegisterAccountCommand` (com sufixo `Command`), mesmo que no C# o método se chame `RegisterAccount`. O `[RelayCommand]` gera automaticamente a propriedade com o sufixo.

## 6. XAML — TapGestureRecognizer para navegação

```xml
<VerticalStackLayout>
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding GoToLoginCommand}" />
    </VerticalStackLayout.GestureRecognizers>
    <Label Text="Já possui uma conta? Faça login" />
</VerticalStackLayout>
```

**Por que VerticalStackLayout em vez de Label com Gesture?** Área tocável maior = melhor UX em dispositivos móveis.

## 7. Debug com breakpoint (temporário)

```csharp
[RelayCommand]
async Task RegisterAccount()
{
    var x = Model; // Coloque breakpoint aqui
    // Passe o mouse em cima de 'x' para ver:
    // - x.Name = "Ellison"
    // - x.Email = "ellison@gmail.com"
    // - x.Password = "123456789"
}
```

Essa técnica é útil para validar que os bindings estão funcionando antes de implementar a lógica real. Remova após verificar.