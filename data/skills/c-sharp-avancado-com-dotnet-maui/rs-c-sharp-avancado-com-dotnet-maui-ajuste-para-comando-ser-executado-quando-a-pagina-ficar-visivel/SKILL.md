---
name: rs-csharp-maui-event-command-binding
description: "Enforces correct EventToCommandBehavior binding syntax in .NET MAUI XAML when commands fail to trigger. Use when user asks to 'bind a command to page appearing', 'fix command not firing', 'EventToCommandBehavior not working', 'execute command on page visible', or 'bind ViewModel command in XAML behavior'. Applies Path + Source pattern with x:Name reference to ContentPage. Make sure to use this skill whenever writing EventToCommandBehavior bindings in MAUI XAML. Not for button Command bindings, standard property bindings, or code-behind event handlers."
---

# EventToCommandBehavior — Binding com Path e Source

> Ao usar EventToCommandBehavior em .NET MAUI, sempre especifique Path com BindingContext e Source com referencia a pagina nomeada, porque o behavior nao resolve automaticamente o BindingContext da pagina.

## Rules

1. **Nunca use binding simples em EventToCommandBehavior** — `Command="{Binding InitializeCommand}"` nao funciona porque o behavior nao sabe de qual BindingContext pegar o comando
2. **Sempre use Path com BindingContext explícito** — `Path=BindingContext.InitializeCommand` porque varios elementos (VerticalStackLayout, Border, AvatarView) possuem BindingContext proprio
3. **Sempre especifique Source com Reference** — `Source={Reference pageNome}` para eliminar ambiguidade de qual BindingContext usar
4. **Nomeie ContentPage com prefixo page** — `x:Name="pageUserProfile"` e nao `x:Name="UserProfilePage"` porque usar o mesmo nome da classe causa bugs conhecidos no MAUI
5. **Associe ViewModel no code-behind via BindingContext** — a propriedade BindingContext do ContentPage e o que permite acessar comandos da ViewModel no XAML

## How to write

### Nomear a pagina

```xml
<ContentPage xmlns="..."
             x:Name="pageUserProfile"
             x:Class="App.Views.UserProfilePage">
```

### EventToCommandBehavior correto

```xml
<ContentPage.Behaviors>
    <xct:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding Path=BindingContext.InitializeCommand,
                          Source={Reference pageUserProfile}}" />
</ContentPage.Behaviors>
```

### Code-behind (associacao ViewModel)

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

## Example

**Before (comando nao executa):**
```xml
<ContentPage.Behaviors>
    <xct:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding InitializeCommand}" />
</ContentPage.Behaviors>
```

**After (comando executa corretamente):**
```xml
<ContentPage x:Name="pageUserProfile" ...>
    <ContentPage.Behaviors>
        <xct:EventToCommandBehavior
            EventName="Appearing"
            Command="{Binding Path=BindingContext.InitializeCommand,
                              Source={Reference pageUserProfile}}" />
    </ContentPage.Behaviors>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Comando em Button/Label | Binding simples `{Binding Command}` funciona |
| Comando em EventToCommandBehavior | Obrigatorio usar Path + Source |
| Nomear ContentPage | `x:Name="page{NomeSemPage}"` — inverta o sufixo Page para prefixo |
| Breakpoint nao bate na ViewModel | Verificar se o binding do behavior esta com Path + Source |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Command="{Binding InitializeCommand}"` em Behavior | `Command="{Binding Path=BindingContext.InitializeCommand, Source={Reference pageName}}"` |
| `x:Name="UserProfilePage"` (mesmo nome da classe) | `x:Name="pageUserProfile"` (prefixo page + nome invertido) |
| Behavior sem Source | Behavior com `Source={Reference pageName}` explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
