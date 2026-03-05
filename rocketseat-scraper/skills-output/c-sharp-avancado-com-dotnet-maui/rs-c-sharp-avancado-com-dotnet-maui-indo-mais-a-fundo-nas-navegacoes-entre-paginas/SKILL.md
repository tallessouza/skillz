---
name: rs-csharp-maui-shell-navigation
description: "Applies .NET MAUI Shell navigation patterns when writing page navigation code. Use when user asks to 'navigate between pages', 'go back', 'pop page', 'push page', 'replace page in stack', or implements Shell.Current.GoToAsync in MAUI apps. Covers stack-based navigation with push/pop, multi-level back navigation, and page replacement using relative routes. Make sure to use this skill whenever implementing navigation logic in .NET MAUI Shell apps. Not for passing query parameters between pages, changing MainPage/root page, or non-Shell navigation approaches."
---

# Navegacao Shell no .NET MAUI

> Domine a navegacao baseada em pilha do Shell usando rotas relativas para empilhar, desempilhar e substituir paginas.

## Rules

1. **Use rotas relativas com `..` para desempilhar** — `".."` remove uma pagina, `"../.."` remove duas, porque o Shell trabalha com pilha (stack) de paginas
2. **Substitua paginas combinando `..` com rota** — `"../NomeDaRota"` desempilha a pagina atual e empilha a nova, porque evita acumulo desnecessario na pilha
3. **Registre todas as rotas em um local centralizado** — use uma classe estatica `RoutePages` com constantes, porque rotas como strings magicas causam erros silenciosos
4. **Evite `async void` exceto em event handlers** — `Button_Clicked` aceita apenas `async void`, mas em ViewModels use `async Task`, porque `async void` engole excecoes
5. **A MainPage sempre existe como base da pilha** — desempilhar todas as paginas volta para ela, e voltar na MainPage fecha o app
6. **Use `Shell.Current.GoToAsync` para toda navegacao** — e o metodo padrao do Shell, porque centraliza a logica de navegacao e suporta rotas relativas

## How to write

### Navegar para uma pagina (empilhar)

```csharp
await Shell.Current.GoToAsync(RoutePages.LOGIN_PAGE);
```

### Voltar uma pagina (desempilhar)

```csharp
await Shell.Current.GoToAsync("..");
```

### Voltar duas paginas

```csharp
await Shell.Current.GoToAsync("../..");
```

### Substituir pagina atual por outra

```csharp
// Remove a pagina atual da pilha e coloca outra no lugar
var rota = $"../{RoutePages.LOGIN_PAGE}";
await Shell.Current.GoToAsync(rota);
```

### Event handler com navegacao

```csharp
private async void Button_Clicked(object sender, EventArgs e)
{
    await Shell.Current.GoToAsync("..");
}
```

## Example

**Before (pilha acumulando paginas desnecessarias):**

```csharp
// Usuario esta em CreateAccount e quer ir para Login
// ERRADO: empilha Login em cima de CreateAccount
await Shell.Current.GoToAsync(RoutePages.LOGIN_PAGE);
// Pilha: MainPage > CreateAccount > Login
// Ao voltar do Login, usuario ve CreateAccount (indesejado)
```

**After (substituicao limpa de pagina):**

```csharp
// CORRETO: remove CreateAccount e coloca Login
var rota = $"../{RoutePages.LOGIN_PAGE}";
await Shell.Current.GoToAsync(rota);
// Pilha: MainPage > Login
// Ao voltar do Login, usuario ve MainPage (correto)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao "Voltar" ou "Fechar" | `GoToAsync("..")` para desempilhar uma pagina |
| "Ja tem conta? Faca login" dentro de CreateAccount | `GoToAsync("../{LoginRoute}")` para substituir |
| Apos login/cadastro com sucesso | Trocar a MainPage (nao coberto aqui, requer config extra) |
| Navegacao entre paginas irmas (mesmo nivel) | Sempre use `../` + rota para evitar pilha infinita |
| Voltar multiplos niveis de uma vez | Use `../../` quantos niveis precisar |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `GoToAsync("LoginPage")` sem registrar rota | Registre em `RoutePages` e use a constante |
| Empilhar pagina irma sem remover a atual | `GoToAsync($"../{RoutePages.LOGIN_PAGE}")` |
| `async Task` em event handler de Button | `async void` apenas para event handlers |
| Strings magicas espalhadas pelo codigo | Classe centralizada `RoutePages` com constantes |
| Navegar sem considerar o estado da pilha | Pense em qual pagina o usuario vera ao voltar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
