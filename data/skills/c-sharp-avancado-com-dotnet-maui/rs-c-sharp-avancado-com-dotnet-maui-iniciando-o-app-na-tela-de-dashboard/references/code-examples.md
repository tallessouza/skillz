# Code Examples: Roteamento Condicional de Startup no .NET MAUI

## Exemplo completo do XAML (AppShell.xaml)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Shell x:Name="ShellPlanShareApp"
       xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
       xmlns:views="clr-namespace:PlanShareApp.Views">

    <ShellSection x:Name="onBoardSection">
        <ShellContent ContentTemplate="{DataTemplate views:OnBoardingPage}" />
    </ShellSection>

    <ShellSection x:Name="dashboardSection">
        <ShellContent ContentTemplate="{DataTemplate views:DashboardPage}" />
    </ShellSection>

</Shell>
```

## Exemplo completo do CodeBehind (AppShell.xaml.cs)

```csharp
public partial class AppShell : Shell
{
    public AppShell(IUserStorage userStorage)
    {
        InitializeComponent();

        if (userStorage.IsLoggedIn())
        {
            ShellPlanShareApp.CurrentItem = dashboardSection;
        }
        else
        {
            ShellPlanShareApp.CurrentItem = onBoardSection;
        }
    }
}
```

## Exemplo completo do App.xaml.cs

```csharp
public partial class App : Application
{
    private readonly IUserStorage _userStorage;

    public App(IUserStorage userStorage)
    {
        InitializeComponent();
        _userStorage = userStorage;
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell(_userStorage));
    }
}
```

## Interface IUserStorage (adicao)

```csharp
public interface IUserStorage
{
    void Save(string id, string name);
    string GetId();
    string GetName();
    void Clear();
    bool IsLoggedIn(); // Nova funcao adicionada nesta aula
}
```

## Implementacao do IsLoggedIn

```csharp
public class UserStorage : IUserStorage
{
    // ... metodos existentes ...

    public bool IsLoggedIn()
    {
        return Preferences.Default.ContainsKey("userId");
    }
}
```

## Por que ContainsKey e nao Get

```csharp
// CORRETO — sincrono, retorna bool direto
public bool IsLoggedIn()
{
    return Preferences.Default.ContainsKey("userId");
}

// ERRADO — Get retorna string, precisa de tratamento extra
public bool IsLoggedIn()
{
    var id = Preferences.Default.Get("userId", "");
    return !string.IsNullOrEmpty(id);
}
// Funciona mas ContainsKey e mais semantico e direto
```

## Cenario de teste que o instrutor demonstrou

```csharp
// Para simular primeiro acesso (temporario, remover depois):
public AppShell(IUserStorage userStorage)
{
    InitializeComponent();

    userStorage.Clear(); // TEMPORARIO — forca ir pro onboard

    if (userStorage.IsLoggedIn())
    {
        ShellPlanShareApp.CurrentItem = dashboardSection;
    }
    else
    {
        ShellPlanShareApp.CurrentItem = onBoardSection;
    }
}
```

## Fluxo completo de verificacao

```
App inicia
  → Construtor de App recebe IUserStorage via DI
  → CreateWindow cria AppShell passando userStorage
  → Construtor de AppShell:
      → IsLoggedIn() verifica Preferences.ContainsKey("userId")
      → true  → CurrentItem = dashboardSection
      → false → CurrentItem = onBoardSection
  → UI renderiza a secao correta
```