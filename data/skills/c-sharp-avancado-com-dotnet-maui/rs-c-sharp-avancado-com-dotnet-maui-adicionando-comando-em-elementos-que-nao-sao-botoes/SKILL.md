---
name: rs-csharp-maui-tap-gesture-commands
description: "Enforces TapGestureRecognizer patterns for non-button clickable elements in .NET MAUI XAML. Use when user asks to 'add click to label', 'make text tappable', 'handle tap on image', 'gesture recognizer', or 'increase tap area'. Applies GestureRecognizers on wrapper layouts with expanded hit areas for usability. Make sure to use this skill whenever adding touch interaction to non-button MAUI elements. Not for button Command bindings, navigation architecture, or dependency injection."
---

# Comandos em Elementos Não-Botão (.NET MAUI)

> Usar GestureRecognizers em wrappers com área de toque ampliada, nunca diretamente em elementos pequenos.

## Rules

1. **Use TapGestureRecognizer para elementos não-botão** — Labels, Images e outros elementos não possuem propriedade `Command`, porque apenas Button/ImageButton têm binding de comando nativo
2. **Envolva o elemento em um layout wrapper** — Coloque o TapGestureRecognizer no VerticalStackLayout/Grid wrapper, não no Label/Image diretamente, porque dedos são imprecisos e a área de toque precisa ser maior que o elemento visual
3. **Defina altura mínima no wrapper** — Use `HeightRequest="40"` ou mais no layout wrapper, porque áreas de toque menores que 40px causam problemas de usabilidade em dispositivos móveis
4. **Use padding para centralizar o conteúdo** — Ajuste com `Padding="0,7,0,0"` ao invés de `VerticalOptions="Center"`, porque há bug conhecido no .NET MAUI com VerticalOptions em Label dentro de VerticalStackLayout
5. **Centralize rotas em constantes** — Crie classe `RoutPages` com `public const string`, porque hardcode de rotas em strings espalhadas é impossível de manter
6. **Organize páginas em pastas por domínio** — `Views/Pages/User/Register/`, `Views/Pages/User/Update/`, porque facilita localização e mantém padrão previsível

## How to write

### TapGestureRecognizer em wrapper (padrão correto)

```xml
<VerticalStackLayout HeightRequest="40" Padding="0,7,0,0">
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding RegisterUserAccountCommand}" />
    </VerticalStackLayout.GestureRecognizers>

    <Label Text="Não tem uma conta? Crie a sua conta" />
</VerticalStackLayout>
```

### Command na ViewModel (uma linha com arrow function)

```csharp
[RelayCommand]
async Task GoToRegisterUserAccount() =>
    await Shell.Current.GoToAsync(RoutePages.UserRegisterAccountPage);
```

### Classe de rotas centralizadas

```csharp
public class RoutePages
{
    public const string OnboardPage = "OnboardingPage";
    public const string LoginPage = "LoginPage";

    public const string UserRegisterAccountPage = "RegisterUserAccountPage";
}
```

### Registro de rota no Program.cs

```csharp
Routing.RegisterRoute(RoutePages.UserRegisterAccountPage, typeof(RegisterUserAccountPage));
```

### Uso de constante de rota no AppShell.xaml

```xml
<ShellContent
    Route="{x:Static navigation:RoutePages.OnboardPage}"
    ContentTemplate="{DataTemplate pages:OnboardPage}" />
```

## Example

**Before (problema de usabilidade):**
```xml
<!-- Área de toque minúscula, apenas o texto -->
<Label Text="Não tem uma conta? Crie a sua conta">
    <Label.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding RegisterCommand}" />
    </Label.GestureRecognizers>
</Label>
```

**After (área de toque ampliada):**
```xml
<!-- Área de toque de 40px, muito mais fácil de acertar com o dedo -->
<VerticalStackLayout HeightRequest="40" Padding="0,7,0,0">
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Command="{Binding RegisterCommand}" />
    </VerticalStackLayout.GestureRecognizers>

    <Label Text="Não tem uma conta? Crie a sua conta" />
</VerticalStackLayout>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Label/texto clicável | Wrapper com HeightRequest >= 40 |
| Ícone pequeno (ex: olho de senha) | Wrapper com área de toque ainda maior (48-56px) |
| NumberOfTapsRequired | Deixe default (1), só use múltiplos taps se UX exigir |
| Centralizar label no wrapper | Use Padding, não VerticalOptions (bug MAUI) |
| Nova rota de página | Adicione constante em RoutePages, nunca hardcode |
| Organizar páginas por domínio | `User/Register/`, `User/Update/`, `User/Delete/` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Label.GestureRecognizers` em texto pequeno | Wrapper layout com GestureRecognizers e HeightRequest |
| `GoToAsync("RegisterPage")` hardcoded | `GoToAsync(RoutePages.UserRegisterAccountPage)` |
| `Command` direto em Label (não existe) | `TapGestureRecognizer` dentro de GestureRecognizers |
| Páginas soltas em `Views/Pages/` | Subpastas por domínio: `Pages/User/Register/` |
| `VerticalOptions="Center"` em Label dentro de VerticalStackLayout | `Padding="0,7,0,0"` para ajuste fino |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
