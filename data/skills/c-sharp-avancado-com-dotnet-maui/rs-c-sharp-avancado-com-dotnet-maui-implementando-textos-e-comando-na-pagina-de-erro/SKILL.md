---
name: rs-csharp-maui-error-page-ui
description: "Applies .NET MAUI error page UI patterns when building XAML pages with buttons, labels, commands, and navigation. Use when user asks to 'create an error page', 'add a retry button', 'style MAUI labels', 'implement page navigation command', or 'close a modal page'. Enforces correct TextTransform, font overrides, margin ordering, HorizontalOptions centering, and RelayCommand binding. Make sure to use this skill whenever implementing XAML UI pages with navigation commands in .NET MAUI. Not for API error handling logic, HTTP clients, or backend exception middleware."
---

# Implementando UI de Página de Erro no .NET MAUI

> Construa páginas XAML com estilos sobrescritos, comandos de navegação e labels centralizados seguindo o padrão do MVVM Toolkit.

## Rules

1. **Sobrescreva estilos inline quando necessário** — defina `HeightRequest` e `CornerRadius` diretamente no elemento quando o estilo global não atende, porque o style default serve como base mas cada página pode precisar de ajustes específicos
2. **Use TextTransform="Uppercase" para botões em caixa alta** — nunca altere o texto manualmente para maiúsculas, porque `TextTransform` garante consistência independente do idioma
3. **Use RelayCommand como atributo na função** — decore a função com `[RelayCommand]` e o binding será `{NomeDoMetodo}Command` automaticamente, porque o MVVM Community Toolkit gera o command
4. **Feche páginas com GoToAsync("..")** — navegue "para trás" na pilha removendo a página atual, porque isso mantém a pilha de navegação consistente
5. **Propriedades privadas começam com underscore** — `_navigationService` não `navigationService`, porque é convenção Microsoft para campos privados readonly
6. **Margens seguem a ordem: esquerda, cima, direita, baixo** — `Margin="0,25,0,40"` significa 0 left, 25 top, 0 right, 40 bottom
7. **Centralize labels com HorizontalOptions="Center"** — não use layouts extras só para centralizar texto
8. **Textos universais vão direto no XAML, traduzíveis vão no Resource** — "Oops" é universal, "Os seguintes erros foram encontrados" precisa de tradução

## How to write

### Button com estilo sobrescrito e comando

```xml
<Button
    Text="TENTAR NOVAMENTE"
    Style="{StaticResource ButtonStyle}"
    HeightRequest="60"
    CornerRadius="20"
    TextTransform="Uppercase"
    Command="{Binding CloseCommand}" />
```

### ViewModel com comando de navegação

```csharp
public partial class ErrorsViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;

    public ErrorsViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    public async Task Close()
    {
        await _navigationService.GoToAsync("..");
    }
}
```

### Labels com fontes e margens

```xml
<Label
    Text="Oops!"
    FontFamily="{Static fonts:FontFamily.HallewayBlack}"
    FontSize="24"
    HorizontalOptions="Center" />

<Label
    Text="{x:Static resources:AppResources.FollowErrorsWereFound}"
    FontSize="18"
    Margin="0,25,0,40"
    HorizontalOptions="Center" />
```

## Example

**Before (estilos incorretos, sem comando):**
```xml
<Button Text="Tentar Novamente" />
<Label Text="oops" />
<Label Text="Os seguintes erros foram encontrados" />
```

**After (com this skill applied):**
```xml
<Button
    Text="TENTAR NOVAMENTE"
    HeightRequest="60"
    CornerRadius="20"
    TextTransform="Uppercase"
    Command="{Binding CloseCommand}" />

<Label
    Text="Oops!"
    FontFamily="{Static fonts:FontFamily.HallewayBlack}"
    FontSize="24"
    HorizontalOptions="Center" />

<Label
    Text="{x:Static resources:AppResources.FollowErrorsWereFound}"
    FontSize="18"
    Margin="0,25,0,40"
    HorizontalOptions="Center" />
```

## Heuristics

| Situação | Faça |
|----------|------|
| Texto não precisa de tradução (universal) | Coloque direto no atributo `Text` do XAML |
| Texto precisa de tradução | Use `{x:Static resources:AppResources.ChaveAqui}` |
| Estilo global não atende | Sobrescreva propriedades inline no elemento |
| Precisa fechar página modal | `GoToAsync("..")` remove da pilha |
| Font family igual ao default do label style | Não sobrescreva, deixe o estilo base aplicar |
| Espaçamento entre dois elementos | Prefira margin no elemento de baixo em vez de margins em ambos |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `Text="TENTAR NOVAMENTE"` (hardcoded caps) | `TextTransform="Uppercase"` com texto normal |
| `private INavigationService navigationService` | `private readonly INavigationService _navigationService` |
| `public void Close()` sem atributo | `[RelayCommand] public async Task Close()` |
| `Command="{Binding Close}"` | `Command="{Binding CloseCommand}"` (sufixo Command) |
| Margin em dois labels adjacentes para espaçar | Margin só no de baixo com valor top adequado |
| `Navigation.PopAsync()` direto | `_navigationService.GoToAsync("..")` via DI |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
