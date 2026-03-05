---
name: rs-csharp-maui-tela-perfil-navegacao
description: "Applies .NET MAUI page creation and navigation patterns when building new pages with ViewModels, binding context, route registration, and gesture-based navigation. Use when user asks to 'create a MAUI page', 'add navigation', 'register a route', 'bind ViewModel', or 'add tap gesture'. Make sure to use this skill whenever creating new .NET MAUI content pages or setting up page navigation. Not for API integration, data persistence, or business logic implementation."
---

# Criando Paginas .NET MAUI com ViewModel e Navegacao

> Toda nova pagina segue o pipeline: criar ViewModel → criar Page → vincular BindingContext → registrar rota → conectar navegacao via comando.

## Rules

1. **Sempre crie ViewModel antes da Page** — ViewModel herda de `ViewModelBase` com `partial class`, porque o binding context depende dela existir primeiro
2. **Registre pagina e ViewModel no MauiProgram** — use `addPages` para injecao de dependencia, porque sem registro o DI container nao resolve a pagina
3. **Use constantes para rotas** — `RoutePages.UserUpdateProfilePage` nao string hardcoded, porque evita erros silenciosos de navegacao
4. **Remova o Title padrao do XAML** — paginas novas vem com `Title="..."` que nao sera usado, porque polui o header
5. **Declare x:DataType no XAML** — permite autocompletar propriedades e comandos da ViewModel no editor
6. **Nunca deixe codigo de teste em producao** — linhas como `UsersStorage.Clear()` devem ser removidas antes de commit, porque forcam login toda vez

## How to write

### ViewModel (partial class)

```csharp
public partial class UserProfileViewModel : ViewModelBase
{
    // Propriedades e comandos aqui
}
```

### Page CodeBehind (binding context via DI)

```csharp
public partial class UserProfilePage : ContentPage
{
    public UserProfilePage(UserProfileViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

### XAML com DataType

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewModel="clr-namespace:PlainShare.App.ViewModels.Pages.User.Profile"
             x:Class="PlainShare.App.Pages.User.Profile.UserProfilePage"
             x:DataType="viewModel:UserProfileViewModel">
</ContentPage>
```

### Registro no MauiProgram

```csharp
builder.Services.AddTransient<UserProfilePage>();
builder.Services.AddTransient<UserProfileViewModel>();

Routing.RegisterRoute(RoutePages.UserUpdateProfilePage, typeof(UserProfilePage));
```

### Comando de navegacao na ViewModel

```csharp
[RelayCommand]
private async Task CProfile()
{
    await _navigationService.GoToAsync(RoutePages.UserUpdateProfilePage);
}
```

### Gesture Recognizer no XAML

```xml
<!-- Em VerticalStackLayout -->
<VerticalStackLayout.GestureRecognizers>
    <TapGestureRecognizer Command="{Binding CProfileCommand}" />
</VerticalStackLayout.GestureRecognizers>

<!-- Em AvatarView -->
<AvatarView HeightRequest="62" WidthRequest="62">
    <AvatarView.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding CProfileCommand}" />
    </AvatarView.GestureRecognizers>
</AvatarView>
```

## Example

**Before (navegacao sem comando, hardcoded):**
```csharp
// Na page diretamente
await Shell.Current.GoToAsync("userUpdateProfilePage");
```

**After (com ViewModel, comando e rota tipada):**
```csharp
// ViewModel com comando
[RelayCommand]
private async Task CProfile()
{
    await _navigationService.GoToAsync(RoutePages.UserUpdateProfilePage);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo elemento precisa responder a toque | Use `GestureRecognizers` com `TapGestureRecognizer` |
| Mesmo comando em multiplos elementos | Reutilize o mesmo Command binding sem problema |
| ViewModel precisa navegar | Injete `INavigationService` via construtor |
| Erro no InitializeComponent apos criar page | Ignore, e manuquice do Visual Studio com classe recem-criada |
| Adicionou arquivo novo ao projeto | Build vai demorar mais na primeira compilacao |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|-------------|
| String hardcoded para rotas | Use constantes em `RoutePages` |
| Navegar diretamente da Page | Crie comando na ViewModel |
| Esquecer `x:DataType` no XAML | Sempre declare para ter autocompletar |
| Deixar `UsersStorage.Clear()` no codigo | Remova apos testar, nunca commite |
| Fechar tag de forma simplificada quando precisa de GestureRecognizers | Use tag por extenso para adicionar filhos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
