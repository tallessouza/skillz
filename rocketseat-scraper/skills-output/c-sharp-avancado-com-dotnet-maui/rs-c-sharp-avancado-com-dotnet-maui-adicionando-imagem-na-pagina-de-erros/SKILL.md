---
name: rs-csharp-maui-grid-image-overlay
description: "Applies Grid-based image overlay technique in .NET MAUI when user needs to 'stack images', 'overlap elements', 'layer UI elements', or 'place one image on top of another'. Enforces correct element ordering, explicit sizing for smaller elements, and margin-based positioning. Make sure to use this skill whenever building layouts with overlapping visual elements in .NET MAUI. Not for general Grid layouts with rows/columns, nor for non-overlapping image placement."
---

# Grid Image Overlay em .NET MAUI

> Para sobrepor elementos visuais em .NET MAUI, coloque-os no mesmo Grid sem definir row/column — a ordem de declaracao determina a camada de exibicao.

## Rules

1. **Use Grid para sobreposicao** — coloque elementos na mesma linha 0 e coluna 0 do Grid, porque Grid permite empilhamento natural quando elementos compartilham a mesma celula
2. **Ordem de declaracao = ordem de camada** — o ultimo elemento declarado no XAML fica por cima, porque o Grid renderiza na sequencia de declaracao
3. **Nao defina RowDefinitions/ColumnDefinitions para grid de camada unica** — se ha apenas 1 linha e 1 coluna, omita essas propriedades, porque o padrao ja e uma unica celula
4. **Defina tamanho explicito no elemento menor** — use `WidthRequest` e `HeightRequest`, porque o Grid redimensiona todos os filhos para ocupar o espaco da maior imagem
5. **Use Margin para posicionamento relativo** — `Margin="esquerda,cima,direita,baixo"` desloca o elemento dentro da celula, porque valores do Figma podem precisar de ajuste fino
6. **Separe imagens que precisam de cores dinamicas diferentes** — divida uma imagem composta em partes quando cada parte precisa de cor independente entre Light/Dark mode, porque `IconTintColorBehavior` aplica uma unica cor a toda a imagem

## How to write

### Sobreposicao basica de duas imagens

```xml
<Grid>
    <!-- Elemento de fundo (declarado primeiro = camada inferior) -->
    <Image Source="icon_circles.svg">
        <Image.Behaviors>
            <toolkit:IconTintColorBehavior
                TintColor="{AppThemeBinding Light={StaticResource PrimaryColorLight},
                            Dark={StaticResource PrimaryColorDark}}" />
        </Image.Behaviors>
    </Image>

    <!-- Elemento de frente (declarado segundo = camada superior) -->
    <Image Source="icon_close.svg"
           WidthRequest="72"
           HeightRequest="72"
           Margin="90,40,0,0">
        <Image.Behaviors>
            <toolkit:IconTintColorBehavior
                TintColor="{AppThemeBinding Light={StaticResource DangerActionColorLight},
                            Dark={StaticResource DangerActionColorDark}}" />
        </Image.Behaviors>
    </Image>
</Grid>
```

### Margem no Grid para espaçamento externo

```xml
<Grid Margin="0,0,0,70">
    <!-- imagens sobrepostas aqui -->
</Grid>
```

## Example

**Before (imagens empilhadas verticalmente):**
```xml
<VerticalStackLayout>
    <Image Source="icon_circles.svg" />
    <Image Source="icon_close.svg" />
</VerticalStackLayout>
```

**After (imagens sobrepostas com Grid):**
```xml
<Grid Margin="0,0,0,70">
    <Image Source="icon_circles.svg">
        <Image.Behaviors>
            <toolkit:IconTintColorBehavior
                TintColor="{AppThemeBinding Light={StaticResource PrimaryColorLight},
                            Dark={StaticResource PrimaryColorDark}}" />
        </Image.Behaviors>
    </Image>
    <Image Source="icon_close.svg"
           WidthRequest="72"
           HeightRequest="72"
           Margin="90,40,0,0">
        <Image.Behaviors>
            <toolkit:IconTintColorBehavior
                TintColor="{AppThemeBinding Light={StaticResource DangerActionColorLight},
                            Dark={StaticResource DangerActionColorDark}}" />
        </Image.Behaviors>
    </Image>
</Grid>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Duas imagens precisam de cores dinamicas diferentes | Separe em dois SVGs, use IconTintColorBehavior independente |
| Elemento menor fica gigante no Grid | Defina WidthRequest e HeightRequest explicitamente |
| Posicao do elemento nao bate com Figma | Ajuste Margin manualmente — valores do Figma nem sempre sao exatos |
| Grid com uma unica celula | Nao declare RowDefinitions nem ColumnDefinitions |
| Precisa de espaco entre o Grid e o proximo elemento | Use Margin no proprio Grid |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `ColumnDefinitions="*"` em grid de camada unica | Omita — o padrao ja e uma celula |
| Elemento de frente declarado primeiro | Declare o elemento de fundo primeiro, frente por ultimo |
| Imagem composta unica com cores diferentes por regiao | Separe em SVGs independentes |
| `Grid.Column="0" Grid.Row="0"` explicito | Omita — 0 e o valor padrao |
| VerticalStackLayout para elementos sobrepostos | Use Grid sem row/column definitions |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
