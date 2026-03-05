---
name: rs-csharp-maui-skeleton-triggers
description: "Applies skeleton loading and XAML DataTrigger patterns when building .NET MAUI pages that load async data. Use when user asks to 'add loading state', 'show skeleton', 'add XAML triggers', 'conditional visibility MAUI', or 'feedback while loading'. Enforces proper DataTrigger binding with enum values, skeleton placeholders during async operations, and String.Join with ToCharArray for spaced display. Make sure to use this skill whenever implementing loading states in MAUI XAML pages. Not for Blazor, WPF, or non-MAUI frameworks."
---

# Skeleton Loading e DataTriggers no .NET MAUI

> Sempre forneça feedback visual ao usuario durante operacoes assincronas usando skeleton loading controlado por DataTriggers vinculados a enums de status da pagina.

## Rules

1. **Nunca exiba pagina vazia durante carga assincrona** — use skeleton loading como placeholder, porque pagina vazia transmite impressao de erro ao usuario
2. **Controle visibilidade via DataTrigger, nao via code-behind** — vincule `IsVisible` a um enum de status da pagina, porque mantem a logica declarativa no XAML
3. **Use enums para status da pagina** — `GeneratingCode`, `WaitingForJoiner`, etc., porque DataTrigger.Value precisa de valor definido em tempo de compilacao
4. **Converta string para char array antes de String.Join** — `String.Join(" ", str.ToCharArray())`, porque String.Join com string direta nao separa caracteres individuais
5. **Defina IsVisible=False como default** — e use DataTrigger para setar True quando a condicao for atendida, porque evita flash de conteudo antes do estado correto

## How to write

### DataTrigger para controlar visibilidade

```xml
<!-- No XAML, importe o namespace do enum -->
xmlns:models="clr-namespace:SeuApp.Models"

<!-- Label visivel apenas quando status = WaitingForJoiner -->
<Label Text="{Binding ConnectionCode}" IsVisible="False">
    <Label.Triggers>
        <DataTrigger TargetType="Label"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:ConnectionByCodeStatusPage.WaitingForJoiner}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </Label.Triggers>
</Label>
```

### Skeleton loading com DataTrigger

```xml
<!-- Skeleton visivel apenas durante GeneratingCode -->
<skeletons:SkeletonView IsVisible="False" HeightRequest="50" WidthRequest="230">
    <skeletons:SkeletonView.Triggers>
        <DataTrigger TargetType="skeletons:SkeletonView"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:ConnectionByCodeStatusPage.GeneratingCode}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </skeletons:SkeletonView.Triggers>
</skeletons:SkeletonView>
```

### String.Join com ToCharArray

```csharp
// CORRETO: separa cada caractere com espaco
ConnectionCode = String.Join(" ", result.Response.ToCharArray());
// Resultado: "7 1 0 5 6 8"

// ERRADO: nao separa caracteres
ConnectionCode = String.Join(" ", result.Response);
// Resultado: "710568" (sem separacao)
```

## Example

**Before (pagina sem feedback):**
```xml
<Label Text="{Binding ConnectionCode}" />
<!-- Pagina fica vazia enquanto codigo e gerado -->
```

```csharp
ConnectionCode = result.Response;
// Numeros colados: "710568"
```

**After (com skeleton e separacao):**
```xml
<skeletons:SkeletonView IsVisible="False" HeightRequest="50" WidthRequest="230" Margin="...">
    <skeletons:SkeletonView.Triggers>
        <DataTrigger TargetType="skeletons:SkeletonView"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:ConnectionByCodeStatusPage.GeneratingCode}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </skeletons:SkeletonView.Triggers>
</skeletons:SkeletonView>

<Label Text="{Binding ConnectionCode}" IsVisible="False" Margin="...">
    <Label.Triggers>
        <DataTrigger TargetType="Label"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:ConnectionByCodeStatusPage.WaitingForJoiner}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </Label.Triggers>
</Label>
```

```csharp
ConnectionCode = String.Join(" ", result.Response.ToCharArray());
// Resultado: "7 1 0 5 6 8"
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina executa comando async no Initialize | Adicione skeleton loading como placeholder |
| Precisa trocar visibilidade baseado em estado | Use DataTrigger com enum, nao code-behind |
| DataTrigger.Value precisa ser dinamico | Nao e possivel — Value exige valor em tempo de compilacao |
| String.Join nao separa caracteres | Converta para char array com `.ToCharArray()` |
| Skeleton muito grande ou pequeno | Ajuste HeightRequest/WidthRequest iterativamente, copie Margin do elemento real |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `IsVisible="{Binding IsCodeReady}"` (bool na VM so pra visibilidade) | DataTrigger vinculado ao enum de status |
| `String.Join(" ", minhaString)` | `String.Join(" ", minhaString.ToCharArray())` |
| Pagina sem feedback durante async | Skeleton loading com DataTrigger |
| Tag simplificada `<Label ... />` quando precisa de Triggers | Tag estendida `<Label>...</Label>` com `.Triggers` |
| `xmlns:enums` apontando para namespace de enums generico | `xmlns:models` apontando para o namespace correto do enum de status |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
