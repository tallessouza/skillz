---
name: rs-csharp-maui-intro-mvvm
description: "Enforces MVVM pattern structure when building .NET MAUI applications. Use when user asks to 'create a MAUI app', 'add a page', 'implement a feature in MAUI', 'organize MAUI project', or 'separate logic from UI in MAUI'. Applies rules: no business logic in Code Behind, Views only know ViewModels, ViewModels expose properties and commands, Models encapsulate domain logic. Make sure to use this skill whenever structuring or reviewing .NET MAUI code. Not for web frameworks, Blazor, or non-MAUI .NET projects."
---

# MVVM em .NET MAUI

> Separar a logica de negocio da interface visual atraves de tres componentes com responsabilidades bem definidas: Model, View e ViewModel.

## Rules

1. **Views sao apenas visuais** — arquivos XAML + Code Behind definem layout e aparencia, nunca regra de negocio, porque acoplar logica na View impede reutilizacao e testes de unidade
2. **Code Behind so aceita logica de UI** — calculos visuais (proporcao de tela, animacoes) podem ficar no Code Behind, porque nao sao regras de negocio, sao comportamentos visuais dificeis de expressar em XAML
3. **Nunca habilite/desabilite elementos no Code Behind** — use propriedades booleanas na ViewModel (ex: `IsAdmin`), porque a View deve reagir a dados, nao conter decisoes
4. **ViewModel expoe propriedades e comandos** — a ViewModel prepara os dados, a View decide COMO exibir (fonte, cor, tamanho), porque responsabilidades separadas permitem testes independentes
5. **View conhece ViewModel, ViewModel NAO conhece View** — a seta vai apenas de View para ViewModel, notificacoes acontecem via eventos internos do MAUI (change notification), porque isso mantem o desacoplamento
6. **ViewModel conhece Model, Model NAO conhece ViewModel** — Models encapsulam entidades, DTOs, regras de validacao, use cases e comunicacao com APIs, porque o dominio e independente da apresentacao

## How to write

### Estrutura de pastas MVVM

```
MeuApp/
├── Models/          # Entidades, DTOs, Use Cases, validacao
├── Views/           # Arquivos .xaml + .xaml.cs (Code Behind)
└── ViewModels/      # Propriedades, comandos, notificacoes
```

### ViewModel com propriedade e comando

```csharp
public class LoginViewModel : INotifyPropertyChanged
{
    private string email;
    public string Email
    {
        get => email;
        set { email = value; OnPropertyChanged(); }
    }

    public ICommand LoginCommand { get; }

    public LoginViewModel()
    {
        LoginCommand = new Command(ExecuteLogin);
    }

    private async void ExecuteLogin()
    {
        // Chama o Model/service — nunca manipula UI aqui
        var result = await authService.Login(Email, Password);
    }
}
```

### View conectada via DataBinding

```xml
<ContentPage xmlns="...">
    <Entry Text="{Binding Email}" />
    <Button Text="Login" Command="{Binding LoginCommand}" />
    <!-- Elemento visivel apenas para admin — controlado pela ViewModel -->
    <Label Text="Admin Panel" IsVisible="{Binding IsAdmin}" />
</ContentPage>
```

### Code Behind aceitavel (logica visual)

```csharp
public partial class BannerPage : ContentPage
{
    public BannerPage()
    {
        InitializeComponent();
        // OK: calculo visual proporcional, nao e regra de negocio
        var screenWidth = DeviceDisplay.MainDisplayInfo.Width;
        bannerImage.HeightRequest = screenWidth * 0.5;
    }
}
```

## Example

**Before (logica no Code Behind — problematico):**
```csharp
public partial class LoginPage : ContentPage
{
    private async void OnLoginClicked(object sender, EventArgs e)
    {
        var email = emailEntry.Text;
        var password = passwordEntry.Text;
        var result = await api.Login(email, password);
        if (result.IsAdmin)
            adminPanel.IsVisible = true;
    }
}
```

**After (MVVM aplicado):**
```csharp
// ViewModel
public class LoginViewModel : INotifyPropertyChanged
{
    private bool isAdmin;
    public bool IsAdmin { get => isAdmin; set { isAdmin = value; OnPropertyChanged(); } }
    public string Email { get; set; }
    public string Password { get; set; }
    public ICommand LoginCommand => new Command(async () =>
    {
        var result = await authService.Login(Email, Password);
        IsAdmin = result.IsAdmin;
    });
}
```
```xml
<!-- View -->
<Entry Text="{Binding Email}" />
<Entry Text="{Binding Password}" IsPassword="True" />
<Button Text="Login" Command="{Binding LoginCommand}" />
<StackLayout IsVisible="{Binding IsAdmin}">
    <!-- Admin content -->
</StackLayout>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa executar acao ao tocar botao | Crie um `ICommand` na ViewModel |
| Precisa mostrar/esconder elemento | Use propriedade booleana na ViewModel + `IsVisible="{Binding ...}"` |
| Precisa calcular dimensao proporcional a tela | Code Behind e aceitavel (logica visual) |
| Precisa validar dados do formulario | Model com regras de validacao |
| Precisa chamar API | Model/Service chamado pela ViewModel |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Regra de negocio no Code Behind | Mova para ViewModel ou Model |
| `adminPanel.IsVisible = true` no Code Behind | `IsVisible="{Binding IsAdmin}"` no XAML |
| Evento `OnClicked` com logica no Code Behind | `Command="{Binding LoginCommand}"` |
| ViewModel referenciando elementos da View | ViewModel expoe propriedades, View faz binding |
| Model importando namespaces de UI | Model e puramente dominio, sem dependencias visuais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
