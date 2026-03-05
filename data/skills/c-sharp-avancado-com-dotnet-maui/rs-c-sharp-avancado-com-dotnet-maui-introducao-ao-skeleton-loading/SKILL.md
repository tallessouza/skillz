---
name: rs-csharp-maui-skeleton-loading-intro
description: "Applies Skeleton Loading pattern when building .NET MAUI loading states. Use when user asks to 'add loading', 'skeleton screen', 'loading placeholder', 'improve UX while loading', or 'BoxView skeleton' in .NET MAUI apps. Enforces shape-matching principle: skeleton shapes must mirror final component shapes. Make sure to use this skill whenever implementing loading feedback in MAUI pages. Not for web skeleton libraries, Xamarin.Forms, or ActivityIndicator spinners."
---

# Skeleton Loading em .NET MAUI

> Skeleton loading simula a forma exata dos componentes finais enquanto dados carregam, transmitindo feedback visual correto ao usuario.

## Rules

1. **Mantenha o mesmo shape** — o skeleton deve ter exatamente a mesma forma do componente final (circulo para avatar, retangulo para texto), porque evita quebra visual na transicao
2. **Use BoxView como base** — BoxView do .NET MAUI desenha retangulos/quadrados e, com CornerRadius, circulos, porque e nativo e flexivel
3. **Circulo = quadrado + CornerRadius metade** — `WidthRequest=160, HeightRequest=160, CornerRadius=80`, porque arredondar todas as bordas pela metade transforma quadrado em circulo
4. **Crie classe herdando BoxView** — nao use BoxView diretamente, porque fixar cor e animacao num componente reutilizavel evita duplicacao
5. **Construtor define propriedades fixas** — cor e animacao sao setadas no construtor da classe, porque toda instancia deve ter comportamento identico
6. **Suporte Light/Dark mode** — use extension method para resolver cor por tema, porque skeleton cinza claro no light e cinza escuro no dark

## How to write

### SkeletonView component (C# puro, sem XAML)

```csharp
public class SkeletonView : BoxView
{
    public SkeletonView()
    {
        Color = Application.Current!.GetSkeletonViewColor();
        // Animacao adicionada separadamente
    }
}
```

### Extension method para cor por tema

```csharp
public static Color GetSkeletonViewColor(this Application application)
{
    var key = Application.Current!.IsLightMode()
        ? "SkeletonLoadingColorLight"
        : "SkeletonLoadingColorDark";

    return (Color)application.Resources[key];
}
```

### Usando SkeletonView no XAML

```xml
<!-- Skeleton circular para avatar -->
<local:SkeletonView
    WidthRequest="160"
    HeightRequest="160"
    CornerRadius="80" />

<!-- Skeleton retangular para texto -->
<local:SkeletonView
    WidthRequest="200"
    HeightRequest="20"
    CornerRadius="4" />
```

## Example

**Before (pagina sem loading):**
```xml
<!-- Elementos aparecem vazios enquanto API responde -->
<Image Source="{Binding AvatarUrl}" WidthRequest="160" HeightRequest="160" />
<Label Text="{Binding UserName}" />
```

**After (com skeleton loading):**
```xml
<!-- Skeleton visivel enquanto carrega, mesmo shape dos componentes finais -->
<local:SkeletonView
    WidthRequest="160" HeightRequest="160" CornerRadius="80"
    IsVisible="{Binding IsLoading}" />

<Image Source="{Binding AvatarUrl}"
    WidthRequest="160" HeightRequest="160"
    IsVisible="{Binding IsNotLoading}" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Avatar/foto circular | BoxView quadrado com CornerRadius = metade |
| Linha de texto | BoxView retangular baixo e largo, CornerRadius pequeno |
| Multiplos skeletons na pagina | Reutilize SkeletonView, varie apenas tamanho e CornerRadius |
| Componente complexo (Entry + Label) | Crie componente composto que usa SkeletonView internamente |
| Troca de tema em runtime | Extension method resolve cor dinamicamente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Skeleton quadrado para componente circular | Mesmo shape: circulo para circulo |
| BoxView direto no XAML com cor hardcoded | Classe SkeletonView com cor via extension method |
| Arquivo XAML para SkeletonView | Classe C# pura (precisa de codigo para animacoes) |
| Cor fixa sem suporte a tema | Extension method com Light/Dark mode |
| ActivityIndicator generico | Skeleton que espelha o layout final |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
