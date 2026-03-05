# Code Examples: Navegacao Shell no .NET MAUI

## Exemplo 1: Botao que navega para outra pagina

Na pagina de CreateAccount (`UserRegisterPage`), um botao que abre a pagina de Login:

```xml
<!-- UserRegisterPage.xaml -->
<Button Text="Abrir Login" FontSize="27" Clicked="Button_Clicked" />
```

```csharp
// UserRegisterPage.xaml.cs
private async void Button_Clicked(object sender, EventArgs e)
{
    await Shell.Current.GoToAsync(RoutePages.LOGIN_PAGE);
}
```

**Resultado:** Empilha LoginPage em cima de CreateAccount. Ao clicar voltar, usuario ve CreateAccount novamente.

## Exemplo 2: Botao "Fechar" que desempilha uma pagina

```csharp
// LoginPage.xaml.cs
private async void BtnFechar_Clicked(object sender, EventArgs e)
{
    await Shell.Current.GoToAsync("..");
}
```

**Resultado:** Remove LoginPage da pilha. Equivalente ao botao de voltar nativo.

## Exemplo 3: Desempilhar duas paginas de uma vez

```csharp
private async void BtnFechar_Clicked(object sender, EventArgs e)
{
    await Shell.Current.GoToAsync("../..");
}
```

**Resultado:** Se a pilha era `MainPage > CreateAccount > Login`, volta direto para MainPage.

## Exemplo 4: Substituir pagina atual (desempilhar + empilhar)

O cenario mais importante — trocar CreateAccount por Login sem acumular na pilha:

```csharp
// UserRegisterPage.xaml.cs
private async void BtnAbrirLogin_Clicked(object sender, EventArgs e)
{
    var rota = $"../{RoutePages.LOGIN_PAGE}";
    await Shell.Current.GoToAsync(rota);
}
```

**Antes da navegacao:**
```
Pilha: OnboardPage > CreateAccountPage
```

**Depois da navegacao:**
```
Pilha: OnboardPage > LoginPage
```

**Ao clicar voltar no LoginPage:** usuario ve OnboardPage (correto), nao CreateAccount.

## Exemplo 5: Classe centralizada de rotas

```csharp
public static class RoutePages
{
    public const string LOGIN_PAGE = "LoginPage";
    public const string REGISTER_PAGE = "UserRegisterPage";
    public const string DASHBOARD_PAGE = "DashboardPage";
    public const string ONBOARD_PAGE = "OnboardPage";
}
```

## Exemplo 6: Registro de rotas no AppShell

```csharp
// AppShell.xaml.cs
public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        Routing.RegisterRoute(RoutePages.LOGIN_PAGE, typeof(LoginPage));
        Routing.RegisterRoute(RoutePages.REGISTER_PAGE, typeof(UserRegisterPage));
    }
}
```

## Exemplo 7: Customizacao do botao voltar (mencionado)

```xml
<ContentPage>
    <Shell.BackButtonBehavior>
        <BackButtonBehavior IconOverride="icon_voltar.png" />
    </Shell.BackButtonBehavior>
    <!-- conteudo da pagina -->
</ContentPage>
```

## Resumo visual da pilha

```
Acao                          | Pilha resultante
------------------------------|----------------------------------
App abre                      | [OnboardPage]
GoToAsync("CreateAccount")    | [OnboardPage, CreateAccount]
GoToAsync("Login")            | [OnboardPage, CreateAccount, Login]
GoToAsync("..")               | [OnboardPage, CreateAccount]
GoToAsync("../..")            | [OnboardPage]
GoToAsync("../Login")         | [OnboardPage, Login]  (substitui)
Voltar na MainPage            | App fecha
```