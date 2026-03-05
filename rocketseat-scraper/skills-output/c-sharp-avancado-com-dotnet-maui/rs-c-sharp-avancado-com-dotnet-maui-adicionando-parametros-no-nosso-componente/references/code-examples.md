# Code Examples: BindableProperty em Componentes .NET MAUI

## Exemplo completo do componente da aula

### Code-behind (EntryAndLabelComponent.xaml.cs)

```csharp
using Microsoft.Maui.Controls;

namespace PlanShare.Components;

public partial class EntryAndLabelComponent : ContentView
{
    // BindableProperties — definicoes estaticas readonly
    public static readonly BindableProperty TitleProperty = BindableProperty.Create(
        nameof(Title),
        typeof(string),
        typeof(EntryAndLabelComponent),
        string.Empty
    );

    public static readonly BindableProperty PlaceholderProperty = BindableProperty.Create(
        nameof(Placeholder),
        typeof(string),
        typeof(EntryAndLabelComponent),
        string.Empty
    );

    public static readonly BindableProperty KeyboardProperty = BindableProperty.Create(
        nameof(Keyboard),
        typeof(Keyboard),
        typeof(EntryAndLabelComponent),
        Keyboard.Default
    );

    // Propriedades publicas com GetValue/SetValue
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

### Uso na pagina XAML

```xml
<!-- Instancia 1: campo de nome com teclado padrao -->
<components:EntryAndLabelComponent
    Title="Nome"
    Placeholder="Bruce" />

<!-- Instancia 2: campo de email com teclado de email -->
<components:EntryAndLabelComponent
    Title="E-mail"
    Placeholder="bruce@mtec.com"
    Keyboard="Email" />
```

## Evolucao passo a passo

### Passo 1: Propriedades simples (NAO FUNCIONA)

```csharp
// Isso compila mas os valores nao sao propagados
public string Title { get; set; }
public string Placeholder { get; set; }
public Keyboard Keyboard { get; set; }
```

### Passo 2: Adicionar BindableProperty para cada propriedade

```csharp
public static readonly BindableProperty TitleProperty = BindableProperty.Create(
    nameof(Title), typeof(string), typeof(EntryAndLabelComponent), string.Empty);
```

### Passo 3: Substituir get/set por GetValue/SetValue

```csharp
// De:
public string Title { get; set; }

// Para:
public string Title
{
    get => (string)GetValue(TitleProperty);
    set => SetValue(TitleProperty, value);
}
```

## Variacao: getter com logica condicional (forma expandida)

```csharp
public string Title
{
    get
    {
        var value = (string)GetValue(TitleProperty);
        if (value == null)
            return "Sem titulo";
        return value;
    }
    set => SetValue(TitleProperty, value);
}
```

## Tipos de Keyboard disponiveis no MAUI

```csharp
Keyboard.Default    // teclado padrao
Keyboard.Email      // teclado otimizado para email
Keyboard.Numeric    // teclado numerico
Keyboard.Chat       // teclado de chat
Keyboard.Telephone  // teclado telefonico
Keyboard.Url        // teclado para URLs
```

## Padrao para outros tipos de propriedade

### Propriedade bool

```csharp
public static readonly BindableProperty IsRequiredProperty = BindableProperty.Create(
    nameof(IsRequired), typeof(bool), typeof(EntryAndLabelComponent), false);

public bool IsRequired
{
    get => (bool)GetValue(IsRequiredProperty);
    set => SetValue(IsRequiredProperty, value);
}
```

### Propriedade Color

```csharp
public static readonly BindableProperty BorderColorProperty = BindableProperty.Create(
    nameof(BorderColor), typeof(Color), typeof(EntryAndLabelComponent), Colors.Gray);

public Color BorderColor
{
    get => (Color)GetValue(BorderColorProperty);
    set => SetValue(BorderColorProperty, value);
}
```

### Propriedade int

```csharp
public static readonly BindableProperty MaxLengthProperty = BindableProperty.Create(
    nameof(MaxLength), typeof(int), typeof(EntryAndLabelComponent), 100);

public int MaxLength
{
    get => (int)GetValue(MaxLengthProperty);
    set => SetValue(MaxLengthProperty, value);
}
```