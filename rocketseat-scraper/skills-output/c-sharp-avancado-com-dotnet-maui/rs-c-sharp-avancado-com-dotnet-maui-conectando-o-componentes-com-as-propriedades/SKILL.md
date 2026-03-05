---
name: rs-csharp-maui-binding-componentes
description: "Enforces correct property binding patterns in .NET MAUI custom components. Use when user asks to 'create a MAUI component', 'bind properties in XAML', 'connect code behind to XAML', 'create bindable properties', or 'build custom controls in MAUI'. Covers three binding approaches: propertyChanged callback, BindingContext as ViewModel, and x:Reference with BindingContext on layout. Make sure to use this skill whenever creating or modifying .NET MAUI custom components with BindableProperty. Not for ViewModel patterns in pages, navigation, or dependency injection."
---

# Conectando Componentes com Propriedades no .NET MAUI

> Ao criar componentes customizados em .NET MAUI, conecte elementos XAML às BindableProperties usando a abordagem mais concisa possível para o contexto.

## Rules

1. **Prefira x:Reference no layout** — use `BindingContext="{x:Reference this}"` no container em vez de setar `BindingContext = this` no code behind, porque reduz codigo e mantém a conexao declarativa no XAML
2. **Use propertyChanged apenas quando precisar validar ou reagir** — o callback `propertyChanged` recebe `(bindable, oldValue, newValue)` e serve para logica condicional, nao para simples binding
3. **Nomeie elementos XAML com x:Name para acesso no code behind** — `x:Name="LabelForEntry"` permite `component.LabelForEntry.Text = newValue.ToString()` no C#
4. **Use parametros nomeados ao pular opcionais** — `propertyChanged: MinhaFuncao` pula `defaultBindingMode` e `validateValue` sem conflito de ordem
5. **Faca cast do bindable para o tipo do componente** — o primeiro parametro do callback eh `BindableObject`, faca cast para `EntryLabelComponent` para acessar elementos nomeados
6. **Declare xmlns e x:DataType para IntelliSense** — ao usar BindingContext como ViewModel, adicione `xmlns:myComponent="namespace"` e `x:DataType="myComponent:EntryLabelComponent"` para autocomplete

## Tres abordagens

### Abordagem 1: Callback propertyChanged

Util quando precisa validar, transformar ou reagir a mudancas de valor.

```csharp
public static readonly BindableProperty TitleProperty = BindableProperty.Create(
    nameof(Title),
    typeof(string),
    typeof(EntryLabelComponent),
    string.Empty,
    propertyChanged: OnTitleChanged // parametro nomeado pula os opcionais
);

private static void OnTitleChanged(BindableObject bindable, object oldValue, object newValue)
{
    var component = (EntryLabelComponent)bindable;
    component.LabelForEntry.Text = newValue.ToString();
}
```

```xml
<!-- Dar nome ao elemento para acessar no code behind -->
<Label x:Name="LabelForEntry" />
```

### Abordagem 2: BindingContext = this no code behind

O code behind vira a "ViewModel" do componente.

```csharp
public EntryLabelComponent()
{
    InitializeComponent();
    BindingContext = this;
}
```

```xml
<ContentView xmlns:myComponent="clr-namespace:PlanShare.App.Views.Components.Inputs"
             x:DataType="myComponent:EntryLabelComponent">
    <VerticalStackLayout>
        <Label Text="{Binding Title}" />
        <Entry Placeholder="{Binding Placeholder}" Keyboard="{Binding Keyboard}" />
    </VerticalStackLayout>
</ContentView>
```

### Abordagem 3: x:Reference no layout (PREFERIDA)

Mais concisa — sem codigo no code behind, binding declarativo no XAML.

```xml
<ContentView x:Name="this">
    <VerticalStackLayout BindingContext="{x:Reference this}">
        <Label Text="{Binding Title}" />
        <Entry Placeholder="{Binding Placeholder}" Keyboard="{Binding Keyboard}" />
    </VerticalStackLayout>
</ContentView>
```

## Example

**Before (propriedades desconectadas):**
```xml
<ContentView>
    <VerticalStackLayout>
        <Label Text="Nome" />
        <Entry Placeholder="Digite seu nome" Keyboard="Default" />
    </VerticalStackLayout>
</ContentView>
```

**After (com binding via x:Reference):**
```xml
<ContentView x:Name="this">
    <VerticalStackLayout BindingContext="{x:Reference this}">
        <Label Text="{Binding Title}" />
        <Entry Placeholder="{Binding Placeholder}" Keyboard="{Binding Keyboard}" />
    </VerticalStackLayout>
</ContentView>
```

## Heuristics

| Situacao | Abordagem |
|----------|-----------|
| Componente simples, so exibir valores | x:Reference no layout (abordagem 3) |
| Precisa validar ou transformar valor antes de aplicar | Callback propertyChanged (abordagem 1) |
| Precisa reagir a mudanca alterando OUTRA propriedade junto | Callback propertyChanged (abordagem 1) |
| Quer IntelliSense completo no XAML | BindingContext = this + x:DataType (abordagem 2) |
| propertyChanging vs propertyChanged | `ing` = durante alteracao, `ed` = apos alteracao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Texto fixo no XAML quando tem BindableProperty | `{Binding Title}` conectado a propriedade |
| Criar ViewModel separada para componente | Use o code behind como ViewModel (ContentView herda GetValue/SetValue) |
| Passar parametros opcionais na ordem para chegar ao desejado | Use parametros nomeados: `propertyChanged: OnChanged` |
| Esquecer x:Name ao acessar elemento no code behind | Sempre declare `x:Name="NomeElemento"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
