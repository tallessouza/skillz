---
name: rs-csharp-maui-change-password-page
description: "Follows the .NET MAUI page creation workflow when user asks to 'create a new page', 'add a password change screen', 'implement a MAUI view', or 'connect ViewModel to page'. Enforces the 3-step binding pattern: CodeBehind constructor binding, XAML namespace reference, and MauiProgram DI registration. Make sure to use this skill whenever creating new .NET MAUI pages or connecting ViewModels. Not for API integration, business logic, or non-MAUI UI frameworks."
---

# Criando Páginas .NET MAUI com ViewModel

> Toda nova página MAUI exige 3 passos obrigatórios: bind no CodeBehind, referência XAML, e registro no MauiProgram.

## Rules

1. **Sempre use partial class na ViewModel** — `partial class` permite que o source generator do CommunityToolkit gere comandos e propriedades observáveis automaticamente
2. **Herde de ViewModelBase** — repasse o `INavigationService` via construtor para manter navegação consistente
3. **Nunca esqueça os 3 passos de binding** — pular qualquer um causa falha silenciosa na navegação ou no data binding
4. **Crie a página via .NET MAUI Content Page (XAML)** — nunca use ContentPage genérico, porque perde o CodeBehind e o suporte a XAML
5. **Registre rota como constante** — use uma classe `RoutesPages` com constantes string para evitar typos em navegação
6. **Reutilize componentes de páginas similares** — copie e adapte de páginas existentes (ex: registro → alterar senha), porque mantém consistência visual

## Steps

### Step 1: Criar a ViewModel

```csharp
// ViewModels/Pages/{Feature}/ChangeUserPasswordViewModel.cs
public partial class ChangeUserPasswordViewModel : ViewModelBase
{
    public ChangeUserPasswordViewModel(INavigationService navigationService)
        : base(navigationService) { }

    [ObservableProperty]
    private ChangePassword _model = new();
}
```

Use `sealed` apenas se quiser bloquear herança. Para ViewModels normais, use `partial`.

### Step 2: Criar a Page (XAML + CodeBehind)

**CodeBehind — Bind da ViewModel:**
```csharp
public partial class ChangeUserPasswordPage : ContentPage
{
    public ChangeUserPasswordPage(ChangeUserPasswordViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

**XAML — Referência ao namespace da ViewModel:**
```xml
<ContentPage xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Pages.User.ChangePassword">
    <ContentPage.BindingContext>
        <x:DataType Type="viewmodel:ChangeUserPasswordViewModel" />
    </ContentPage.BindingContext>
    <!-- componentes aqui -->
</ContentPage>
```

### Step 3: Registrar no MauiProgram

```csharp
// MauiProgram.cs
builder.Services.AddTransient<ChangeUserPasswordViewModel>();
builder.Services.AddTransient<ChangeUserPasswordPage>();

// Registrar rota
Routing.RegisterRoute(RoutesPages.UserChangePasswordPage, typeof(ChangeUserPasswordPage));
```

**Rota como constante:**
```csharp
public static class RoutesPages
{
    public const string UserChangePasswordPage = "userChangePasswordPage";
}
```

## Navegação

```csharp
// Na ViewModel de origem (ex: UserProfileViewModel)
[RelayCommand]
public async Task ChangePassword()
{
    await _navigationService.NavigateToAsync(RoutesPages.UserChangePasswordPage);
}
```

**No XAML da página de origem:**
```xml
<Button Command="{Binding ChangePasswordCommand}" />
```

## Heuristics

| Situação | Faça |
|----------|------|
| Página nova com formulário | Copie estrutura de página similar existente e adapte |
| Precisa de animação de loading | Inclua componente de animação com `IsVisible=false` |
| Model com 2+ campos | Crie classe Model separada com propriedades tipadas |
| Espaçamento entre elementos | Use `Spacing` no StackLayout (ex: 30) e `Margin` para ajustes finos |
| Teste de navegação | Teste com label placeholder antes de implementar componentes completos |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Criar página sem registrar no MauiProgram | Sempre registre ViewModel + Page + Rota |
| Usar `sealed` na ViewModel sem motivo | Use `partial` para permitir source generation |
| Hardcodar string de rota na navegação | Use constante em `RoutesPages` |
| Criar ContentPage sem selecionar XAML | Selecione ".NET MAUI Content Page (XAML)" |
| Esquecer `BindingContext = viewModel` no CodeBehind | Sempre faça bind no construtor |

## Verification

- F5 e navegue até a nova página — deve exibir sem crash
- Verifique que todos os componentes visuais aparecem conforme o design
- Confirme que o botão de voltar funciona (navegação padrão MAUI)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
