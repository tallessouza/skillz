# Code Examples: Conectando Componentes com Propriedades

## Estrutura base do componente (code behind)

```csharp
public partial class EntryLabelComponent : ContentView
{
    public static readonly BindableProperty TitleProperty = BindableProperty.Create(
        nameof(Title),
        typeof(string),
        typeof(EntryLabelComponent),
        string.Empty
    );

    public static readonly BindableProperty PlaceholderProperty = BindableProperty.Create(
        nameof(Placeholder),
        typeof(string),
        typeof(EntryLabelComponent),
        string.Empty
    );

    public static readonly BindableProperty KeyboardProperty = BindableProperty.Create(
        nameof(Keyboard),
        typeof(Keyboard),
        typeof(EntryLabelComponent),
        Keyboard.Default
    );

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

    public EntryLabelComponent()
    {
        InitializeComponent();
    }
}
```

## Abordagem 1: Callback propertyChanged completo

```csharp
public static readonly BindableProperty TitleProperty = BindableProperty.Create(
    nameof(Title),
    typeof(string),
    typeof(EntryLabelComponent),
    string.Empty,
    propertyChanged: OnTitleChanged // parametro nomeado
);

private static void OnTitleChanged(BindableObject bindable, object oldValue, object newValue)
{
    var component = (EntryLabelComponent)bindable;
    component.LabelForEntry.Text = newValue.ToString();
}
```

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.Views.Components.Inputs.EntryLabelComponent">
    <VerticalStackLayout>
        <Label x:Name="LabelForEntry" />
        <Entry />
    </VerticalStackLayout>
</ContentView>
```

## Abordagem 2: BindingContext = this com DataType

```csharp
public EntryLabelComponent()
{
    InitializeComponent();
    BindingContext = this; // code behind vira ViewModel
}
```

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:myComponent="clr-namespace:PlanShare.App.Views.Components.Inputs"
             x:DataType="myComponent:EntryLabelComponent"
             x:Class="PlanShare.App.Views.Components.Inputs.EntryLabelComponent">
    <VerticalStackLayout>
        <Label Text="{Binding Title}" />
        <Entry Placeholder="{Binding Placeholder}" Keyboard="{Binding Keyboard}" />
    </VerticalStackLayout>
</ContentView>
```

## Abordagem 3: x:Reference (preferida pelo instrutor)

```xml
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Name="this"
             x:Class="PlanShare.App.Views.Components.Inputs.EntryLabelComponent">
    <VerticalStackLayout BindingContext="{x:Reference this}">
        <Label Text="{Binding Title}" />
        <Entry Placeholder="{Binding Placeholder}" Keyboard="{Binding Keyboard}" />
    </VerticalStackLayout>
</ContentView>
```

Nenhuma mudanca no code behind — o construtor fica limpo:

```csharp
public EntryLabelComponent()
{
    InitializeComponent();
}
```

## Uso do componente na pagina

```xml
<inputs:EntryLabelComponent Title="Nome" Placeholder="Bruce Wayne" />
<inputs:EntryLabelComponent Title="E-mail" Placeholder="bruce@wayne.tech" Keyboard="Email" />
```

## Exemplo com validacao no callback

```csharp
private static void OnTitleChanged(BindableObject bindable, object oldValue, object newValue)
{
    var component = (EntryLabelComponent)bindable;
    var title = newValue.ToString();

    // Exemplo: aplicar uppercase automaticamente
    component.LabelForEntry.Text = title.ToUpper();

    // Exemplo: alterar outra propriedade em resposta
    if (string.IsNullOrEmpty(title))
    {
        component.LabelForEntry.TextColor = Colors.Red;
    }
}
```

## Comparacao lado a lado das declaracoes xmlns

```xml
<!-- Para IntelliSense com DataType (abordagem 2) -->
xmlns:myComponent="clr-namespace:PlanShare.App.Views.Components.Inputs"
x:DataType="myComponent:EntryLabelComponent"

<!-- Para x:Reference (abordagem 3) — nao precisa xmlns extra -->
x:Name="this"
<!-- No layout filho: -->
BindingContext="{x:Reference this}"
```