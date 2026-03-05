---
name: rs-csharp-maui-navegacao-paginas
description: "Applies .NET MAUI Shell navigation patterns when writing page routing, registration, and ViewModel navigation code. Use when user asks to 'navigate between pages', 'create a new page', 'register routes', 'add Shell navigation', or 'implement page routing in MAUI'. Covers Routing.RegisterRoute, Shell.Current.GoToAsync, extension methods for route registration, and NavBar visibility. Make sure to use this skill whenever implementing navigation in .NET MAUI projects. Not for styling pages, creating UI components, or non-MAUI navigation frameworks."
---

# Navegacao de Paginas no .NET MAUI

> Toda pagina no .NET MAUI precisa estar associada a uma rota unica, e a navegacao acontece via Shell usando essas rotas.

## Rules

1. **Toda pagina tem uma rota** — registre com `Routing.RegisterRoute` antes de navegar, porque sem rota registrada a navegacao lanca excecao
2. **Rotas sao unicas** — duas paginas com a mesma rota causam excecao em runtime, porque o Shell nao sabe resolver ambiguidade
3. **Nomeie a rota igual a pagina** — `nameof(DoLoginPage)` ou string identica ao nome da classe, porque facilita rastreabilidade e evita typos
4. **Registre rotas no MauiProgram** — crie um metodo de extensao `AddPages` no `MauiAppBuilder`, porque centraliza toda configuracao de rotas
5. **Navegue pela ViewModel, nunca pelo code-behind** — use `Shell.Current.GoToAsync` na ViewModel, porque mantem separacao de responsabilidades
6. **Use await no GoToAsync** — a funcao e async, o comando que a chama deve retornar `Task` em vez de `void`, porque navegacao sem await causa comportamento imprevisivel
7. **Nao esconda NavBar em paginas com retorno** — `Shell.NavBarIsVisible="False"` so em paginas raiz (onboard, dashboard), porque paginas internas precisam do botao de voltar

## How to write

### Registrar rotas com metodo de extensao

```csharp
// MauiProgram.cs — metodo de extensao para registrar todas as rotas
private static MauiAppBuilder AddPages(this MauiAppBuilder appBuilder)
{
    Routing.RegisterRoute(nameof(DoLoginPage), typeof(DoLoginPage));
    // Adicione novas rotas aqui
    return appBuilder;
}
```

### Chamar AddPages no pipeline

```csharp
// MauiProgram.cs — encadear com os demais builders
var builder = MauiApp.CreateBuilder();
builder
    .UseMauiApp<App>()
    .AddPages()
    .ConfigureFonts(fonts =>
    {
        fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
    });
```

### Navegar na ViewModel

```csharp
// OnboardViewModel.cs
[RelayCommand]
private async Task LoginWithEmailAndPassword()
{
    await Shell.Current.GoToAsync(nameof(DoLoginPage));
}
```

## Example

**Before (hardcode duplicado, comando void):**
```csharp
// ViewModel
[RelayCommand]
private void Login()
{
    Shell.Current.GoToAsync("doLoginPage"); // sem await, string hardcoded
}

// MauiProgram — sem organizacao
Routing.RegisterRoute("doLoginPage", typeof(DoLoginPage));
```

**After (extensao organizada, async correto):**
```csharp
// MauiProgram.cs
private static MauiAppBuilder AddPages(this MauiAppBuilder appBuilder)
{
    Routing.RegisterRoute(nameof(DoLoginPage), typeof(DoLoginPage));
    return appBuilder;
}

// ViewModel
[RelayCommand]
private async Task LoginWithEmailAndPassword()
{
    await Shell.Current.GoToAsync(nameof(DoLoginPage));
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Pagina e a primeira do app (onboard/dashboard) | Registre no AppShell.xaml como ShellContent |
| Pagina e acessada por navegacao (login, detalhes) | Registre com `Routing.RegisterRoute` no MauiProgram |
| Pagina nao precisa de botao voltar | Use `Shell.NavBarIsVisible="False"` |
| Pagina precisa de botao voltar | Nao esconda a NavBar |
| Rota usada em mais de um lugar | Extraia para constante (igual FontFamily) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `Shell.Current.GoToAsync("doLoginPage")` com string hardcoded | `Shell.Current.GoToAsync(nameof(DoLoginPage))` |
| Comando de navegacao retornando `void` | Retorne `async Task` com `await` |
| Registrar rotas espalhadas pelo codigo | Centralizar em `AddPages` no MauiProgram |
| Duas paginas com mesma rota | Cada pagina tem rota unica |
| Navegar no code-behind da page | Navegar na ViewModel |
| Esconder NavBar em pagina interna | So esconder em paginas raiz |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
