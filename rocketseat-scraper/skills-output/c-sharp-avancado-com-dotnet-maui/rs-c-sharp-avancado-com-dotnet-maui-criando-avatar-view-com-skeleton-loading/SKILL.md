---
name: rs-csharp-maui-avatar-skeleton-loading
description: "Applies Skeleton Loading pattern to avatar components in .NET MAUI apps. Use when user asks to 'add skeleton loading', 'loading placeholder', 'avatar loading state', 'shimmer effect', or 'improve loading feedback' in XAML/MAUI projects. Enforces shape-matching between skeleton and real component, StatusPage enum-based visibility triggers, and consistent visual transitions. Make sure to use this skill whenever implementing loading states for profile or avatar views in MAUI. Not for web skeleton loaders, React/CSS shimmer effects, or non-MAUI platforms."
---

# AvatarView com Skeleton Loading (.NET MAUI)

> Substitua componentes reais por SkeletonView de mesmo shape/tamanho durante o carregamento, controlado por StatusPage enum via DataTrigger.

## Rules

1. **Mantenha o shape identico** — o SkeletonView deve ter exatamente a mesma altura, largura e CornerRadius do componente real, porque a transicao deve parecer apenas "tirar uma capa" sem mudanca brusca na tela
2. **Controle visibilidade via StatusPage enum** — use DataTrigger com binding em StatusPage (propriedade da ViewModelBase), porque centraliza o controle de estado em um unico lugar observavel
3. **Adicione o valor Loading ao enum** — o enum StatusPage precisa de `Default = 0`, `Sending = 1`, `Loading = 2`, porque cada estado visual da pagina precisa de um valor explicito
4. **Troque status no inicio e fim da funcao** — primeira linha: `StatusPage = Loading`, ultima linha: `StatusPage = Default`, porque garante que o skeleton aparece durante todo o carregamento
5. **ContentPage aceita apenas um filho** — envolva tudo em um VerticalStackLayout pai contendo dois filhos (skeleton e conteudo real), cada um com seu proprio DataTrigger
6. **Nao esqueca o xmlns import** — declare `xmlns:skeleton="clr-namespace:..."` no XAML para usar o componente SkeletonView

## How to write

### Enum StatusPage

```csharp
public enum StatusPage
{
    Default = 0,
    Sending = 1,
    Loading = 2
}
```

### ViewModel — controle de status

```csharp
public async Task Initialize()
{
    StatusPage = Models.StatusPage.Loading; // primeira coisa

    // ... carregar dados da API ...

    StatusPage = Models.StatusPage.Default; // ultima coisa
}
```

### XAML — estrutura com DataTrigger

```xml
<ContentPage>
    <VerticalStackLayout>

        <!-- Conteudo real (visivel quando Default) -->
        <VerticalStackLayout IsVisible="False">
            <VerticalStackLayout.Triggers>
                <DataTrigger TargetType="VerticalStackLayout"
                             Binding="{Binding StatusPage}"
                             Value="{x:Static models:StatusPage.Default}">
                    <Setter Property="IsVisible" Value="True"/>
                </DataTrigger>
            </VerticalStackLayout.Triggers>

            <controls:AvatarView HeightRequest="100"
                                 WidthRequest="100"
                                 CornerRadius="50"/>
        </VerticalStackLayout>

        <!-- Skeleton (visivel quando Loading) -->
        <VerticalStackLayout IsVisible="False">
            <VerticalStackLayout.Triggers>
                <DataTrigger TargetType="VerticalStackLayout"
                             Binding="{Binding StatusPage}"
                             Value="{x:Static models:StatusPage.Loading}">
                    <Setter Property="IsVisible" Value="True"/>
                </DataTrigger>
            </VerticalStackLayout.Triggers>

            <skeleton:SkeletonView HeightRequest="100"
                                   WidthRequest="100"
                                   CornerRadius="50"/>
        </VerticalStackLayout>

    </VerticalStackLayout>
</ContentPage>
```

## Example

**Before (sem skeleton — tela vazia durante loading):**
```xml
<VerticalStackLayout>
    <controls:AvatarView HeightRequest="100" WidthRequest="100" CornerRadius="50"/>
    <Label Text="{Binding UserName}"/>
</VerticalStackLayout>
```

**After (com skeleton loading suave):**
```xml
<VerticalStackLayout>
    <!-- Real content -->
    <VerticalStackLayout IsVisible="False">
        <VerticalStackLayout.Triggers>
            <DataTrigger TargetType="VerticalStackLayout"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static models:StatusPage.Default}">
                <Setter Property="IsVisible" Value="True"/>
            </DataTrigger>
        </VerticalStackLayout.Triggers>
        <controls:AvatarView HeightRequest="100" WidthRequest="100" CornerRadius="50"/>
        <Label Text="{Binding UserName}"/>
    </VerticalStackLayout>

    <!-- Skeleton -->
    <VerticalStackLayout IsVisible="False">
        <VerticalStackLayout.Triggers>
            <DataTrigger TargetType="VerticalStackLayout"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static models:StatusPage.Loading}">
                <Setter Property="IsVisible" Value="True"/>
            </DataTrigger>
        </VerticalStackLayout.Triggers>
        <skeleton:SkeletonView HeightRequest="100" WidthRequest="100" CornerRadius="50"/>
        <skeleton:SkeletonView HeightRequest="20" WidthRequest="150" CornerRadius="4"/>
    </VerticalStackLayout>
</VerticalStackLayout>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Componente circular (avatar) | CornerRadius = metade da altura/largura |
| Componente tem overlay (icone de editar) | Duplique o overlay no skeleton, so troque o fundo por SkeletonView |
| Ctrl-C/Ctrl-V do componente real | Confira spacing — nao traga propriedades extras como Spacing que nao existiam |
| API responde rapido demais pra ver skeleton | Use breakpoint ou delay artificial para validar visualmente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| SkeletonView com tamanho diferente do real | Copie HeightRequest, WidthRequest e CornerRadius do componente original |
| IsVisible controlado por code-behind | Use DataTrigger com Binding em StatusPage |
| StatusPage setado so no inicio | Sete Loading no inicio E Default no final da funcao |
| Skeleton e conteudo no mesmo VerticalStackLayout | Separe em dois VerticalStackLayouts irmaos, cada um com seu Trigger |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
