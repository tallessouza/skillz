# Code Examples: Data Binding Two-Way em Componentes .NET MAUI

## Exemplo completo: Componente EntryAndLabel

### Code-behind (EntryAndLabelComponent.xaml.cs)

```csharp
public partial class EntryAndLabelComponent : ContentView
{
    // BindableProperty para o titulo/label
    public static readonly BindableProperty TitleProperty = BindableProperty.Create(
        nameof(Title),
        typeof(string),
        typeof(EntryAndLabelComponent),
        string.Empty
    );

    public string Title
    {
        get => (string)GetValue(TitleProperty);
        set => SetValue(TitleProperty, value);
    }

    // BindableProperty para o valor do input — TwoWay!
    public static readonly BindableProperty TextValueProperty = BindableProperty.Create(
        nameof(TextValue),
        typeof(string),
        typeof(EntryAndLabelComponent),
        string.Empty,
        BindingMode.TwoWay  // Sem isso, valor digitado nao retorna para ViewModel
    );

    public string TextValue
    {
        get => (string)GetValue(TextValueProperty);
        set => SetValue(TextValueProperty, value);
    }

    // BindableProperty para tipo de teclado (OneWay e suficiente)
    public static readonly BindableProperty KeyboardProperty = BindableProperty.Create(
        nameof(Keyboard),
        typeof(Keyboard),
        typeof(EntryAndLabelComponent),
        Keyboard.Default
    );

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

### XAML do componente (EntryAndLabelComponent.xaml)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Components.EntryAndLabelComponent"
             x:Name="this">

    <VerticalStackLayout>
        <Label Text="{Binding Title, Source={x:Reference this}}" />
        <Entry Text="{Binding TextValue, Source={x:Reference this}}"
               Keyboard="{Binding Keyboard, Source={x:Reference this}}" />
    </VerticalStackLayout>

</ContentView>
```

### XAML do componente de senha (EntryAndLabelPasswordComponent.xaml)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Components.EntryAndLabelPasswordComponent"
             x:Name="this">

    <VerticalStackLayout>
        <Label Text="{Binding Title, Source={x:Reference this}}" />
        <Entry Text="{Binding TextValue, Source={x:Reference this}}"
               IsPassword="True" />
    </VerticalStackLayout>

</ContentView>
```

## Uso na pagina de Login

### LoginPage.xaml

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:components="clr-namespace:PlanShare.Components">

    <!-- Componente de email -->
    <components:EntryAndLabelComponent
        Title="{x:Static resources:ResourceStrings.EMAIL_LABEL}"
        TextValue="{Binding Model.Email}"
        Keyboard="Email" />

    <!-- Componente de senha -->
    <components:EntryAndLabelPasswordComponent
        Title="{x:Static resources:ResourceStrings.PASSWORD_LABEL}"
        TextValue="{Binding Model.Password}" />

    <Button Text="Login"
            Command="{Binding LoginCommand}" />

</ContentPage>
```

## Fluxo de dados visualizado

```
Usuario digita "ellison@gmail.com" na Entry
         │
         ▼
Entry.Text atualiza (binding interno do componente)
         │
         ▼
TextValueProperty recebe valor (BindingMode.TwoWay)
         │
         ▼
Model.Email na ViewModel recebe "ellison@gmail.com" (binding da pagina)
         │
         ▼
Ao clicar Login, ViewModel.Model.Email == "ellison@gmail.com" ✓
```

## Comparacao: OneWay vs TwoWay

### Com OneWay (default — QUEBRADO para inputs):

```
ViewModel inicializa Model.Email = ""
         │
         ▼ (OneWay: so vai)
Entry exibe "" (vazio)
         │
Usuario digita "ellison@gmail.com"
         │
         ✗ (sem caminho de volta)
ViewModel.Model.Email continua "" — VAZIO!
```

### Com TwoWay (CORRETO para inputs):

```
ViewModel inicializa Model.Email = ""
         │
         ▼ (ida)
Entry exibe "" (vazio)
         │
Usuario digita "ellison@gmail.com"
         │
         ▼ (volta)
ViewModel.Model.Email = "ellison@gmail.com" — CORRETO!
```

## Erro classico: copiar BindableProperty sem trocar tudo

```csharp
// ERRADO — copiou de KeyboardProperty e esqueceu de trocar
public string TextValue
{
    get => (string)GetValue(KeyboardProperty);  // BUG: deveria ser TextValueProperty
    set => SetValue(KeyboardProperty, value);   // BUG: deveria ser TextValueProperty
}

// CORRETO
public string TextValue
{
    get => (string)GetValue(TextValueProperty);
    set => SetValue(TextValueProperty, value);
}
```

## Checklist ao criar BindableProperty para inputs

- [ ] Criou `BindableProperty.Create()` com todos os 5 parametros?
- [ ] O `nameof()` aponta para a propriedade CLR correta?
- [ ] O `typeof` do returnType esta correto (string para texto)?
- [ ] O `typeof` do declaringType aponta para o componente certo?
- [ ] Incluiu `BindingMode.TwoWay` como 5o parametro?
- [ ] O getter usa `GetValue(PROPRIEDADE_CORRETA)`?
- [ ] O setter usa `SetValue(PROPRIEDADE_CORRETA)`?
- [ ] No XAML do componente, a Entry tem `Text="{Binding TextValue}"`?
- [ ] Na pagina, o componente tem `TextValue="{Binding Model.Propriedade}"`?