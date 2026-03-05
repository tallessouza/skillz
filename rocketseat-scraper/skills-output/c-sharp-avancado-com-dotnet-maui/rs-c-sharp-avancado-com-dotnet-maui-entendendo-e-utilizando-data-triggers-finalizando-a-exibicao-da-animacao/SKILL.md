---
name: rs-csharp-maui-data-triggers
description: "Applies .NET MAUI Data Trigger patterns when writing XAML conditional visibility or property changes. Use when user asks to 'show/hide elements conditionally', 'toggle visibility in XAML', 'use triggers in MAUI', 'conditional UI without code-behind', or 'bind visibility to state'. Enforces correct DataTrigger syntax with TargetType, Binding, Value, and Setter. Make sure to use this skill whenever generating XAML that conditionally changes element properties based on ViewModel state. Not for code-behind event handlers, animations, or CSS-based styling."
---

# Data Triggers no .NET MAUI

> Use DataTrigger como condicional declarativa no XAML para alterar propriedades visuais com base no estado do ViewModel.

## Rules

1. **Use DataTrigger para condicionais no XAML** — funciona como um `if` declarativo que observa uma propriedade e executa Setters quando o valor corresponde, porque elimina code-behind para lógica de visibilidade
2. **Sempre defina IsVisible="False" como padrão** — o DataTrigger só troca para `True` quando a condição é atendida; quando a condição deixa de ser verdadeira, volta ao valor padrão definido no elemento, porque não existe "else" no trigger
3. **Acesse enums no XAML via x:Static** — use `{x:Static models:StatusPage.Default}` com namespace declarado, porque XAML não resolve enums por string automaticamente
4. **TargetType deve corresponder ao elemento pai** — se o trigger está em um `VerticalStackLayout`, use `TargetType="VerticalStackLayout"`; em um `ContentView` customizado, use o tipo do componente, porque tipo errado causa erro silencioso
5. **Use sintaxe estendida para triggers** — abra a tag completa `<Element.Triggers>` em vez da sintaxe auto-fechante, porque a sintaxe curta não permite filhos

## How to write

### DataTrigger básico para visibilidade

```xml
<VerticalStackLayout IsVisible="False">
    <VerticalStackLayout.Triggers>
        <DataTrigger TargetType="VerticalStackLayout"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Default}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </VerticalStackLayout.Triggers>
    <!-- Conteúdo aqui -->
</VerticalStackLayout>
```

### DataTrigger em componente customizado

```xml
<components:AnimationSendInformationComponent IsVisible="False">
    <components:AnimationSendInformationComponent.Triggers>
        <DataTrigger TargetType="components:AnimationSendInformationComponent"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Sending}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </components:AnimationSendInformationComponent.Triggers>
</components:AnimationSendInformationComponent>
```

### Declaração do namespace para enums

```xml
<ContentPage xmlns:models="clr-namespace:PlanShare.App.Models">
```

## Example

**Before (sem triggers — visibilidade fixa):**
```xml
<VerticalStackLayout IsVisible="True">
    <Label Text="Nome" />
    <Entry Placeholder="Digite seu nome" />
</VerticalStackLayout>
```

**After (com DataTrigger controlando visibilidade):**
```xml
<VerticalStackLayout IsVisible="False">
    <VerticalStackLayout.Triggers>
        <DataTrigger TargetType="VerticalStackLayout"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Default}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </VerticalStackLayout.Triggers>
    <Label Text="Nome" />
    <Entry Placeholder="Digite seu nome" />
</VerticalStackLayout>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Alternar visibilidade por estado | DataTrigger com IsVisible |
| Múltiplas condições (AND) | Use MultiTrigger |
| Reagir a evento (foco, clique) | Use Trigger ou EventTrigger |
| Múltiplos Setters por condição | Adicione vários `<Setter>` dentro do mesmo DataTrigger |
| Componente customizado (ContentView) | TargetType = tipo completo do componente com namespace |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Value="Default"` (string para enum) | `Value="{x:Static models:StatusPage.Default}"` |
| `<VerticalStackLayout IsVisible="False" />` com triggers | Tag aberta `<VerticalStackLayout.Triggers>` com sintaxe estendida |
| `TargetType="VerticalStackLayout"` em componente custom | `TargetType="components:MeuComponente"` |
| Controlar visibilidade via code-behind | DataTrigger declarativo no XAML |
| Esquecer `IsVisible="False"` no elemento | Sempre definir o padrão como False quando trigger troca para True |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
