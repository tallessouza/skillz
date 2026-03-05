---
name: rs-csharp-maui-binding-twoway
description: "Enforces correct two-way data binding between .NET MAUI custom components and ViewModels. Use when user asks to 'create a custom entry component', 'bind entry to viewmodel', 'connect input to model', 'pass data between component and page', or 'fix binding not updating'. Applies BindableProperty with BindingMode.TwoWay for input components, nested binding chains through custom components. Make sure to use this skill whenever creating or debugging MAUI input components with data binding. Not for simple label bindings, navigation, or non-input UI elements."
---

# Data Binding Two-Way em Componentes .NET MAUI

> Ao criar componentes de input customizados em .NET MAUI, sempre configure BindableProperty com BindingMode.TwoWay para que alteracoes no input reflitam na ViewModel e vice-versa.

## Rules

1. **Sempre use BindingMode.TwoWay em inputs** — o default e OneWay, que apenas envia valor da ViewModel para o componente, nunca retorna o que o usuario digitou, porque OneWay significa "via de mao unica"
2. **Crie BindableProperty no code-behind do componente** — para que a pagina possa passar bindings ao componente customizado, porque sem BindableProperty o XAML nao reconhece a propriedade
3. **Conecte a Entry interna ao BindableProperty** — dentro do XAML do componente, faca `Text="{Binding TextValue}"` apontando para a propriedade do code-behind, porque sem isso o valor digitado nao chega ate a BindableProperty
4. **Use a cadeia completa de binding** — Page vincula `TextValue="{Binding Model.Email}"` → componente armazena em BindableProperty → Entry interna vincula com `Text="{Binding TextValue}"`, porque e um "passa-repassa" de conexoes

## How to write

### BindableProperty no code-behind do componente

```csharp
// EntryAndLabelComponent.xaml.cs
public partial class EntryAndLabelComponent : ContentView
{
    public static readonly BindableProperty TextValueProperty = BindableProperty.Create(
        nameof(TextValue),           // propertyName
        typeof(string),              // returnType
        typeof(EntryAndLabelComponent), // declaringType
        string.Empty,                // defaultValue
        BindingMode.TwoWay           // CRITICO: sem isso, input nao retorna valor
    );

    public string TextValue
    {
        get => (string)GetValue(TextValueProperty);
        set => SetValue(TextValueProperty, value);
    }
}
```

### Binding na Entry interna do componente (XAML)

```xml
<!-- EntryAndLabelComponent.xaml -->
<Entry Text="{Binding TextValue, Source={x:Reference this}}" />
```

### Uso na pagina

```xml
<!-- LoginPage.xaml -->
<components:EntryAndLabelComponent
    TextValue="{Binding Model.Email}" />

<components:EntryAndLabelPasswordComponent
    TextValue="{Binding Model.Password}" />
```

## Example

**Before (binding OneWay — valor digitado nunca chega na ViewModel):**

```csharp
// BindingMode.OneWay e o DEFAULT — valor so vai, nunca volta
public static readonly BindableProperty TextValueProperty = BindableProperty.Create(
    nameof(TextValue),
    typeof(string),
    typeof(EntryAndLabelComponent),
    string.Empty
    // sem BindingMode.TwoWay → usuario digita mas ViewModel fica vazia
);
```

**After (binding TwoWay — valor vai e volta):**

```csharp
public static readonly BindableProperty TextValueProperty = BindableProperty.Create(
    nameof(TextValue),
    typeof(string),
    typeof(EntryAndLabelComponent),
    string.Empty,
    BindingMode.TwoWay  // agora a Entry envia valor de volta para a ViewModel
);
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente customizado com Entry/input | Sempre BindingMode.TwoWay |
| Componente apenas exibe texto (Label) | OneWay e suficiente |
| ViewModel nao recebe valor digitado | Verificar se BindingMode e TwoWay |
| Entry dentro de componente nao mostra valor | Verificar se Entry.Text tem binding para a BindableProperty |
| Propriedade nao reconhecida no XAML | Verificar se BindableProperty foi criada no code-behind |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `BindableProperty.Create(...)` sem BindingMode em inputs | `BindableProperty.Create(..., BindingMode.TwoWay)` |
| `GetValue(KeyboardProperty)` copiado sem trocar | `GetValue(TextValueProperty)` — troque TODAS as referencias |
| Entry sem binding no XAML do componente | `<Entry Text="{Binding TextValue}" />` |
| Esquecer a propriedade no componente de senha | Copie e adapte para cada componente que recebe input |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
