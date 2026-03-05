---
name: rs-csharp-maui-bindable-properties
description: "Enforces correct BindableProperty pattern when creating parameterized .NET MAUI components. Use when user asks to 'create a MAUI component', 'add parameters to component', 'make bindable property', 'pass values to component', or 'create reusable XAML control'. Applies rules: static readonly BindableProperty with Create(), custom get/set with GetValue/SetValue, nameof for property names, correct default values per type. Make sure to use this skill whenever generating .NET MAUI custom components with parameters. Not for simple XAML layout, navigation, or non-component C# classes."
---

# BindableProperty em Componentes .NET MAUI

> Toda propriedade de componente que recebe valores externos deve ser uma BindableProperty com get/set customizado usando GetValue/SetValue.

## Rules

1. **Crie uma BindableProperty para cada parametro** — propriedades simples (get; set;) nao conectam valores entre pagina e componente, porque o MAUI precisa do sistema de binding para propagar valores
2. **Use `nameof()` para o nome da propriedade** — `nameof(Title)` ao inves de `"Title"` como string literal, porque renomeacoes automaticas (F2/Rename) propagam corretamente
3. **Use `typeof()` para returnType e declaringType** — returnType e o tipo da propriedade (string, Keyboard), declaringType e a classe do componente
4. **Defina defaultValue adequado ao tipo** — `string.Empty` para strings, `Keyboard.Default` para Keyboard, porque cada tipo tem seu zero-value correto
5. **Substitua get/set por GetValue/SetValue** — o get faz cast explicito do retorno de GetValue, o set usa SetValue com dois parametros (property, value), porque ContentView exige esse padrao para binding funcionar
6. **Nomeie a BindableProperty como `{Nome}Property`** — `TitleProperty`, `PlaceholderProperty`, porque e o padrao do .NET MAUI e ferramentas dependem dessa convencao

## How to write

### BindableProperty completa

```csharp
// 1. Propriedade estatica readonly com BindableProperty.Create
public static readonly BindableProperty TitleProperty = BindableProperty.Create(
    nameof(Title),                    // nome da propriedade
    typeof(string),                   // tipo de retorno
    typeof(EntryAndLabelComponent),   // classe que declara
    string.Empty                      // valor default
);

// 2. Propriedade publica com GetValue/SetValue
public string Title
{
    get => (string)GetValue(TitleProperty);
    set => SetValue(TitleProperty, value);
}
```

### Propriedade com tipo nao-string

```csharp
public static readonly BindableProperty KeyboardProperty = BindableProperty.Create(
    nameof(Keyboard),
    typeof(Keyboard),                  // tipo Microsoft.Maui.Keyboard
    typeof(EntryAndLabelComponent),
    Keyboard.Default                   // default do proprio MAUI, nao string.Empty
);

public Keyboard Keyboard
{
    get => (Keyboard)GetValue(KeyboardProperty);
    set => SetValue(KeyboardProperty, value);
}
```

## Example

**Before (nao funciona — propriedades nao conectaveis):**
```csharp
public partial class EntryAndLabelComponent : ContentView
{
    public string Title { get; set; }
    public string Placeholder { get; set; }
    public Keyboard Keyboard { get; set; }
}
```

**After (BindableProperties corretas):**
```csharp
public partial class EntryAndLabelComponent : ContentView
{
    public static readonly BindableProperty TitleProperty = BindableProperty.Create(
        nameof(Title), typeof(string), typeof(EntryAndLabelComponent), string.Empty);

    public static readonly BindableProperty PlaceholderProperty = BindableProperty.Create(
        nameof(Placeholder), typeof(string), typeof(EntryAndLabelComponent), string.Empty);

    public static readonly BindableProperty KeyboardProperty = BindableProperty.Create(
        nameof(Keyboard), typeof(Keyboard), typeof(EntryAndLabelComponent), Keyboard.Default);

    public string Title
    {
        get => (string)GetValue(TitleProperty);
        set => SetValue(TitleProperty, value);
    }

    public string Placeholder
    {
        get => (string)GetValue(PlaceholderProperty);
        set => SetValue(PlaceholderProperty, value);
    }

    public Keyboard Keyboard
    {
        get => (Keyboard)GetValue(KeyboardProperty);
        set => SetValue(KeyboardProperty, value);
    }

    public EntryAndLabelComponent()
    {
        InitializeComponent();
    }
}
```

**Uso na pagina XAML:**
```xml
<components:EntryAndLabelComponent Title="Nome" Placeholder="Bruce" />
<components:EntryAndLabelComponent Title="E-mail" Placeholder="bruce@mtec.com" Keyboard="Email" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade recebe texto simples | `typeof(string)`, default `string.Empty` |
| Propriedade controla layout de teclado | `typeof(Keyboard)`, default `Keyboard.Default` |
| Precisa descobrir o tipo de uma propriedade MAUI | Clique direito na propriedade → Go to Definition |
| Componente herda de ContentView | GetValue/SetValue ja estao disponiveis |
| Propriedade tem uma unica linha no get/set | Use arrow syntax `get => ...;` |
| Propriedade precisa logica condicional no get/set | Use bloco `get { return ...; }` com chaves |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `public string Title { get; set; }` (em componente) | BindableProperty + GetValue/SetValue |
| `BindableProperty.Create("Title", ...)` | `BindableProperty.Create(nameof(Title), ...)` |
| `Keyboard.Default` como default de string | `string.Empty` para strings |
| `string.Empty` como default de Keyboard | `Keyboard.Default` para Keyboard |
| `get => GetValue(TitleProperty);` sem cast | `get => (string)GetValue(TitleProperty);` |
| `set => SetValue(TitleProperty);` com 1 param | `set => SetValue(TitleProperty, value);` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
