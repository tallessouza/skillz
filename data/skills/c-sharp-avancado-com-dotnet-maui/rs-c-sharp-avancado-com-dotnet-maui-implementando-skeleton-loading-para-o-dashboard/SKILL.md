---
name: rs-csharp-maui-skeleton-loading-dashboard
description: "Applies skeleton loading patterns in .NET MAUI dashboards and data-driven pages. Use when user asks to 'add loading state', 'implement skeleton', 'show placeholder while loading', 'improve loading UX', or 'add shimmer effect' in XAML/.NET MAUI apps. Enforces dual VerticalStackLayout approach with DataTrigger visibility toggling and fixed x:Array items for CollectionView skeletons. Make sure to use this skill whenever building MAUI pages that fetch API data. Not for web/React skeleton libraries, Blazor, or WPF loading indicators."
---

# Skeleton Loading para Dashboard (.NET MAUI)

> Duplicar o layout real com SkeletonView nos mesmos tamanhos garante que o skeleton ocupe exatamente o espaco dos elementos finais, eliminando layout shift.

## Rules

1. **Dois VerticalStackLayouts irmaos** — um para skeleton, outro para dados reais, ambos dentro de um VerticalStackLayout pai, porque ContentPage so aceita um filho direto
2. **Copiar dimensoes dos elementos reais** — SkeletonView deve ter mesma altura, largura e CornerRadius do elemento que substitui, porque isso garante transicao suave sem salto visual
3. **Usar DataTrigger com StatusPage** — alternar visibilidade via binding em StatusPage (Load/Default), porque evita logica imperativa no code-behind
4. **CollectionView com x:Array fixo** — em vez de binding numa lista vazia, passar itens fixos via `CollectionView.ItemsSource > x:Array`, porque lista vazia nao renderiza item templates
5. **Remover interacoes do skeleton** — GestureRecognizer e comandos devem ser removidos do template skeleton, porque usuario nao deve interagir com placeholders
6. **Remover codigo temporario** — ao integrar com API real, limpar workarounds de refresh token e codigo de teste, porque codigo morto gera confusao

## How to write

### Estrutura pai com dois layouts

```xml
<ContentPage>
  <VerticalStackLayout>

    <!-- Layout dos dados reais -->
    <VerticalStackLayout IsVisible="False">
      <VerticalStackLayout.Triggers>
        <DataTrigger TargetType="VerticalStackLayout"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Default}">
          <Setter Property="IsVisible" Value="True"/>
        </DataTrigger>
      </VerticalStackLayout.Triggers>
      <!-- elementos reais aqui -->
    </VerticalStackLayout>

    <!-- Layout do skeleton -->
    <VerticalStackLayout IsVisible="False">
      <VerticalStackLayout.Triggers>
        <DataTrigger TargetType="VerticalStackLayout"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:StatusPage.Load}">
          <Setter Property="IsVisible" Value="True"/>
        </DataTrigger>
      </VerticalStackLayout.Triggers>
      <!-- skeleton views aqui -->
    </VerticalStackLayout>

  </VerticalStackLayout>
</ContentPage>
```

### SkeletonView substituindo AvatarView

```xml
<!-- Real: AvatarView HeightRequest=62 WidthRequest=62 CornerRadius=31 -->
<!-- Skeleton: -->
<skeleton:SkeletonView HeightRequest="62"
                       WidthRequest="62"
                       CornerRadius="31"/>
```

### CollectionView com itens fixos para skeleton

```xml
<CollectionView>
  <CollectionView.ItemsSource>
    <x:Array Type="{x:Type x:String}">
      <x:String>1</x:String>
      <x:String>2</x:String>
      <x:String>3</x:String>
    </x:Array>
  </CollectionView.ItemsSource>
  <CollectionView.ItemTemplate>
    <DataTemplate>
      <VerticalStackLayout Spacing="8">
        <skeleton:SkeletonView HeightRequest="50"
                               WidthRequest="50"
                               CornerRadius="25"/>
        <skeleton:SkeletonView HeightRequest="15"
                               WidthRequest="50"
                               HorizontalOptions="Center"/>
      </VerticalStackLayout>
    </DataTemplate>
  </CollectionView.ItemTemplate>
</CollectionView>
```

## Example

**Before (tela em branco durante carregamento):**
```xml
<VerticalStackLayout>
  <AvatarView HeightRequest="62" WidthRequest="62" CornerRadius="31"/>
  <Label Text="{Binding UserName}"/>
  <CollectionView ItemsSource="{Binding Connections}">
    <!-- item template com dados reais -->
  </CollectionView>
</VerticalStackLayout>
```

**After (skeleton + dados com transicao via DataTrigger):**
```xml
<VerticalStackLayout>
  <!-- Dados reais (visivel quando StatusPage=Default) -->
  <VerticalStackLayout IsVisible="False">
    <VerticalStackLayout.Triggers>
      <DataTrigger TargetType="VerticalStackLayout"
                   Binding="{Binding StatusPage}"
                   Value="{x:Static models:StatusPage.Default}">
        <Setter Property="IsVisible" Value="True"/>
      </DataTrigger>
    </VerticalStackLayout.Triggers>
    <AvatarView HeightRequest="62" WidthRequest="62" CornerRadius="31"/>
    <Label Text="{Binding UserName}"/>
    <CollectionView ItemsSource="{Binding Connections}"/>
  </VerticalStackLayout>

  <!-- Skeleton (visivel quando StatusPage=Load) -->
  <VerticalStackLayout IsVisible="False">
    <VerticalStackLayout.Triggers>
      <DataTrigger TargetType="VerticalStackLayout"
                   Binding="{Binding StatusPage}"
                   Value="{x:Static models:StatusPage.Load}">
        <Setter Property="IsVisible" Value="True"/>
      </DataTrigger>
    </VerticalStackLayout.Triggers>
    <skeleton:SkeletonView HeightRequest="62" WidthRequest="62" CornerRadius="31"/>
    <skeleton:SkeletonView HeightRequest="15" WidthRequest="110" HorizontalOptions="Start"/>
    <CollectionView>
      <CollectionView.ItemsSource>
        <x:Array Type="{x:Type x:String}">
          <x:String>1</x:String>
          <x:String>2</x:String>
          <x:String>3</x:String>
        </x:Array>
      </CollectionView.ItemsSource>
    </CollectionView>
  </VerticalStackLayout>
</VerticalStackLayout>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento circular (avatar) | CornerRadius = metade da altura/largura |
| Label de texto curto (nome) | SkeletonView com largura ~50-110, altura ~15 |
| CollectionView horizontal | Manter ItemSpacing, usar x:Array com 3 itens fixos |
| Elementos estaticos (icones fixos, labels fixos) | Manter no skeleton sem substituir |
| GestureRecognizer no template | Remover do skeleton, manter no template real |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Binding numa lista vazia para skeleton de CollectionView | `x:Array` com itens fixos no ItemsSource |
| Controlar visibilidade via code-behind | DataTrigger com binding em StatusPage |
| Skeleton com tamanhos diferentes do elemento real | Copiar HeightRequest, WidthRequest, CornerRadius do elemento real |
| Deixar GestureRecognizer no template skeleton | Remover toda interacao do layout skeleton |
| Um unico layout alternando conteudo | Dois layouts irmaos com visibilidade alternada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
