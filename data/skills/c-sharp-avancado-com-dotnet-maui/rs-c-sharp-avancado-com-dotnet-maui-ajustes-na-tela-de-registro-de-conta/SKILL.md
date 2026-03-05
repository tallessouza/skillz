---
name: rs-csharp-maui-registro-conta
description: "Applies .NET MAUI registration page patterns when building user registration flows with models, view models, commands, and navigation. Use when user asks to 'create registration page', 'add signup form', 'implement account creation', 'build register screen in MAUI', or 'connect form fields to view model'. Enforces model separation (register vs profile), RelayCommand usage, INavigationService injection, and proper data binding. Make sure to use this skill whenever creating form-based pages in .NET MAUI with navigation and commands. Not for API integration, backend validation, or database operations."
---

# Registro de Conta em .NET MAUI

> Crie modelos específicos por contexto, vincule propriedades via ObservableProperty e use RelayCommand para ações de navegação e submissão.

## Rules

1. **Crie modelos específicos por operação** — `UserRegisterAccount` nao `User`, porque o registro tem nome+email+senha enquanto o perfil tem apenas nome+email (sem senha), e reutilizar causa confusão
2. **Inicialize strings com String.Empty** — evita warnings de nullable e garante que o binding nunca receba null
3. **Injete INavigationService no construtor** — armazene em `private readonly` com underscore prefix (`_navigationService`), porque é recomendação Microsoft para propriedades privadas
4. **Use RelayCommand para cada ação do usuário** — um comando para submissão do formulário, outro para navegação entre páginas
5. **Navegue com ".." para fechar a página atual** — `$"../{RoutePages.LoginPage}"` fecha a tela atual e abre a próxima, evitando empilhamento desnecessário no navigation stack
6. **Use string interpolation com constantes de rota** — nunca hardcode strings de navegação, porque centralizar rotas em constantes facilita manutenção

## How to write

### Model específico para registro

```csharp
public class UserRegisterAccount
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
```

### ViewModel com comandos e navegação

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
        // Lógica de registro aqui
    }
}
```

### Binding no XAML

```xml
<!-- Campos do formulário -->
<Entry Text="{Binding Model.Name}" Placeholder="Nome" />
<Entry Text="{Binding Model.Email}" Placeholder="E-mail" />
<Entry Text="{Binding Model.Password}" IsPassword="True" Placeholder="Senha" />

<!-- Botão de submissão -->
<Button Text="Criar minha conta" Command="{Binding RegisterAccountCommand}" />

<!-- Link de navegação com GestureRecognizer -->
<VerticalStackLayout>
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding GoToLoginCommand}" />
    </VerticalStackLayout.GestureRecognizers>
    <Label Text="Já possui uma conta? Faça login" />
</VerticalStackLayout>
```

## Example

**Before (model genérico, sem separação):**
```csharp
public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ImageUrl { get; set; } // mistura perfil com registro
}
```

**After (modelo específico por contexto):**
```csharp
// Para registro — tem senha
public class UserRegisterAccount
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

// Para perfil — sem senha, com imagem
public class UserProfile
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com campos diferentes do perfil | Crie model separado (ex: `UserRegisterAccount`) |
| Navegação que deve fechar a tela atual | Use `../{rota}` no GoToAsync |
| Link clicável que não é Button | Use VerticalStackLayout + TapGestureRecognizer para área tocável maior |
| Hot Reload disponível | Adicione bindings de Command sem parar a execução |
| Usuário pode inserir espaços indesejados | Trate com Trim() no backend (próximo passo) |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| `public class User` para tudo | `UserRegisterAccount`, `UserProfile` — modelos por contexto |
| `public string Name { get; set; }` sem default | `public string Name { get; set; } = string.Empty;` |
| `navigationService.GoToAsync("LoginPage")` | `navigationService.GoToAsync($"../{RoutePages.LoginPage}")` |
| Hardcode de rotas como strings | Constantes em `RoutePages` |
| Navegação sem `..` quando quer fechar tela | `$"../{rota}"` para fechar e navegar |
| `public INavigationService nav;` | `private readonly INavigationService _navigationService;` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
