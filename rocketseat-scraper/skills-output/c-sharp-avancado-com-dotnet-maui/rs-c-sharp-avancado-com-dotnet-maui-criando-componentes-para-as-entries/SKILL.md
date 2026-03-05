---
name: rs-csharp-maui-criando-componentes-entries
description: "Enforces reusable component creation patterns in .NET MAUI using ContentView. Use when user asks to 'create a component', 'reuse entry', 'custom input', 'ContentView MAUI', or 'avoid duplicating XAML code'. Applies rules: ContentView over ContentPage for components, organized folder structure (Views/Components/Inputs), VerticalStackLayout required for multiple children, xmlns using for component referencing. Make sure to use this skill whenever creating reusable UI components in .NET MAUI. Not for page creation, navigation, or data binding with BindableProperty."
---

# Criando Componentes Reutilizaveis no .NET MAUI

> Ao identificar elementos visuais repetidos (titulo + entry), extraia-os em um ContentView reutilizavel dentro de uma estrutura organizada de pastas.

## Rules

1. **Use ContentView, nao ContentPage** — componentes reutilizaveis sao views, nao paginas, porque ContentView e projetado para ser embarcado dentro de outras paginas
2. **Organize em pastas por categoria** — `Views/Components/Inputs/` para componentes de entrada, porque facilita localizar e manter componentes conforme o projeto cresce
3. **Sempre use um layout container** — ContentView com mais de um elemento filho exige VerticalStackLayout (ou outro layout), porque sem ele o XAML lanca erro ao tentar setar multiplos filhos como content
4. **Registre o xmlns no XAML consumidor** — use `xmlns:component="clr-namespace:Namespace.Views.Components.Inputs"` para referenciar o componente, porque sem o using a tag customizada nao e reconhecida
5. **Corrija margem da Entry no Android** — aplique `Margin="4,0,0,0"` no estilo da Entry para alinhar com o Label, porque o Android adiciona margem interna automatica que o iOS nao tem

## How to write

### Estrutura de pastas

```
Views/
├── Pages/
│   └── RegisterPage.xaml
└── Components/
    └── Inputs/
        └── EntryAndLabelComponent.xaml
        └── EntryAndLabelComponent.xaml.cs
```

### ContentView do componente

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="App.Views.Components.Inputs.EntryAndLabelComponent">
    <VerticalStackLayout>
        <Label Text="Nome" Style="{StaticResource LabelStyle}" />
        <Entry Placeholder="Bruce Wayne" Style="{StaticResource EntryStyle}" />
    </VerticalStackLayout>
</ContentView>
```

### Consumindo o componente na pagina

```xml
<ContentPage xmlns:component="clr-namespace:App.Views.Components.Inputs">
    <!-- Reutilize quantas vezes precisar -->
    <component:EntryAndLabelComponent />
    <component:EntryAndLabelComponent />
    <component:EntryAndLabelComponent />
</ContentPage>
```

### Correcao de margem Android na Entry

```xml
<Style TargetType="Entry" x:Key="EntryStyle">
    <Setter Property="Margin" Value="4,0,0,0" />
</Style>
```

## Example

**Before (codigo duplicado na pagina):**
```xml
<Label Text="Nome" />
<Entry Placeholder="Bruce Wayne" />
<Label Text="E-mail" />
<Entry Placeholder="bruce@wayne.com" Keyboard="Email" />
<Label Text="Senha" />
<Entry Placeholder="********" IsPassword="True" />
```

**After (componente reutilizavel):**
```xml
<component:EntryAndLabelComponent />
<component:EntryAndLabelComponent />
<component:EntryAndLabelComponent />
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Mesmo par Label+Entry aparece 2+ vezes | Extrair para ContentView |
| Componente tem um unico filho | Layout container e opcional (mas recomendado) |
| Componente precisa de variacoes (placeholder, titulo) | Usar BindableProperty (proxima aula) |
| Margem da Entry desalinhada no Android | Aplicar Margin="4,0,0,0" no estilo |
| Componente de senha com icone toggle | Criar componente separado, nao reaproveitar o generico |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Duplicar Label+Entry em cada pagina | Criar ContentView reutilizavel |
| Colocar 2+ filhos direto no ContentView sem layout | Envolver em VerticalStackLayout |
| Criar componente dentro de Pages/ | Criar em Views/Components/{Categoria}/ |
| Fixar textos no componente sem parametrizacao | Receber via BindableProperty (quando aplicavel) |
| Renomear classe sem atualizar x:Class no XAML | Manter classe e x:Class sincronizados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
