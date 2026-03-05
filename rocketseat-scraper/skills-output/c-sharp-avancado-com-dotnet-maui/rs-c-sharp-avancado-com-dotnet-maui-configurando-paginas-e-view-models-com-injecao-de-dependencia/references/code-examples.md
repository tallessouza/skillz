# Code Examples: DI em Pages e ViewModels (.NET MAUI)

## Configuracao completa no MauiProgram.cs

### Antes (sem DI, registro manual de rota)

```csharp
var builder = MauiApp.CreateBuilder();

// ... configuracoes

// Registro de rota separado
Routing.RegisterRoute(RoutesPages.LoginPage, typeof(DoLoginPage));

var app = builder.Build();
```

### Depois (com DI via CommunityToolkit)

```csharp
var builder = MauiApp.CreateBuilder();

// ... configuracoes

// Tudo em um: DI + rota
builder.Services.AddTransientWithShellRoute<DoLoginPage, DoLoginViewModel>(RoutesPages.LoginPage);

var app = builder.Build();
```

## Code-behind: antes vs depois

### Antes

```csharp
public partial class DoLoginPage : ContentPage
{
    public DoLoginPage()
    {
        InitializeComponent();
        BindingContext = new DoLoginViewModel(); // acoplamento direto
    }
}
```

### Depois

```csharp
public partial class DoLoginPage : ContentPage
{
    public DoLoginPage(DoLoginViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel; // injetado pelo container
    }
}
```

## Comparacao de ciclos de vida

### Singleton (problema com estado)

```csharp
// ViewModel criada UMA vez — estado persiste entre navegacoes
builder.Services.AddSingletonWithShellRoute<DoLoginPage, DoLoginViewModel>(RoutesPages.LoginPage);
```

Comportamento: usuario digita dados → volta → navega de novo → dados ainda la.

### Transient (correto para forms)

```csharp
// ViewModel criada SEMPRE que a pagina e aberta — estado limpo
builder.Services.AddTransientWithShellRoute<DoLoginPage, DoLoginViewModel>(RoutesPages.LoginPage);
```

Comportamento: usuario digita dados → volta → navega de novo → campos vazios.

## Registrando multiplas pages (padrao para o app)

```csharp
// Cada page com sua ViewModel e rota
builder.Services.AddTransientWithShellRoute<DoLoginPage, DoLoginViewModel>(RoutesPages.LoginPage);
builder.Services.AddTransientWithShellRoute<CreateTaskPage, CreateTaskViewModel>(RoutesPages.CreateTaskPage);
builder.Services.AddTransientWithShellRoute<TaskListPage, TaskListViewModel>(RoutesPages.TaskListPage);
```