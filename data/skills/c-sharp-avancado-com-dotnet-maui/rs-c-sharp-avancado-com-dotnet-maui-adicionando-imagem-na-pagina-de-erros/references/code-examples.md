# Code Examples: Grid Image Overlay em .NET MAUI

## Exemplo 1: Namespace do Toolkit

Antes de usar `IconTintColorBehavior`, adicione o namespace na raiz da pagina XAML:

```xml
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

## Exemplo 2: Imagem com tag simplificada vs. tag extensa

**Tag simplificada (nao permite Behaviors):**
```xml
<Image Source="icon_circles.svg" />
```

**Tag extensa (necessaria para adicionar Behaviors):**
```xml
<Image Source="icon_circles.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior
            TintColor="{AppThemeBinding Light={StaticResource PrimaryColorLight},
                        Dark={StaticResource PrimaryColorDark}}" />
    </Image.Behaviors>
</Image>
```

## Exemplo 3: Estrutura completa da pagina de erros

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
             x:Class="PlanShare.Pages.ErrorsPage">

    <VerticalStackLayout>
        <!-- Grid para sobreposicao de imagens -->
        <Grid Margin="0,0,0,70">
            <!-- Camada 1: Circulos (fundo) -->
            <Image Source="icon_circles.svg">
                <Image.Behaviors>
                    <toolkit:IconTintColorBehavior
                        TintColor="{AppThemeBinding
                            Light={StaticResource PrimaryColorLight},
                            Dark={StaticResource PrimaryColorDark}}" />
                </Image.Behaviors>
            </Image>

            <!-- Camada 2: X (frente) -->
            <Image Source="icon_close.svg"
                   WidthRequest="72"
                   HeightRequest="72"
                   Margin="90,40,0,0">
                <Image.Behaviors>
                    <toolkit:IconTintColorBehavior
                        TintColor="{AppThemeBinding
                            Light={StaticResource DangerActionColorLight},
                            Dark={StaticResource DangerActionColorDark}}" />
                </Image.Behaviors>
            </Image>
        </Grid>

        <!-- Texto "Ups" e demais elementos -->
        <Label Text="Ups!" />
    </VerticalStackLayout>

</ContentPage>
```

## Exemplo 4: Comparacao — com e sem RowDefinitions/ColumnDefinitions

**Desnecessario (grid de celula unica):**
```xml
<Grid RowDefinitions="*" ColumnDefinitions="*">
    <Image Grid.Row="0" Grid.Column="0" Source="icon_circles.svg" />
    <Image Grid.Row="0" Grid.Column="0" Source="icon_close.svg" />
</Grid>
```

**Correto e limpo:**
```xml
<Grid>
    <Image Source="icon_circles.svg" />
    <Image Source="icon_close.svg" />
</Grid>
```

## Exemplo 5: Demonstracao do efeito da ordem

**X por cima (desejado):**
```xml
<Grid>
    <Image Source="icon_circles.svg" />  <!-- primeiro = fundo -->
    <Image Source="icon_close.svg" />    <!-- segundo = frente -->
</Grid>
```

**Circulos por cima (invertido):**
```xml
<Grid>
    <Image Source="icon_close.svg" />    <!-- primeiro = fundo -->
    <Image Source="icon_circles.svg" />  <!-- segundo = frente -->
</Grid>
```

## Exemplo 6: Debug visual com BackgroundColor no Grid

Para visualizar o espaco ocupado pelo Grid durante desenvolvimento:

```xml
<Grid BackgroundColor="Yellow">
    <Image Source="icon_circles.svg" />
    <Image Source="icon_close.svg"
           WidthRequest="72"
           HeightRequest="72"
           Margin="90,40,0,0" />
</Grid>
```

Remova o `BackgroundColor` apos confirmar o layout.

## Exemplo 7: Referencia — IconTintColorBehavior no componente de senha

Mesmo padrao usado no `EntryAndLabelPassword`:

```xml
<Image Source="icon_eye.svg">
    <Image.Behaviors>
        <toolkit:IconTintColorBehavior
            TintColor="{AppThemeBinding
                Light={StaticResource SomeColorLight},
                Dark={StaticResource SomeColorDark}}" />
    </Image.Behaviors>
</Image>
```

## Exemplo 8: Entendendo Margin

```
Margin="esquerda, cima, direita, baixo"

Margin="90,40,0,0"
  └─ 90 a esquerda → imagem desloca 90px para DIREITA
  └─ 40 acima      → imagem desloca 40px para BAIXO
  └─ 0 a direita   → sem deslocamento
  └─ 0 abaixo      → sem deslocamento
```

## Dica: Organizacao de SVGs no projeto

```
Resources/
└── Images/
    ├── icon_circles.svg    ← circulos (cor base: preta para visualizacao)
    ├── icon_close.svg      ← X de fechar (cor base: preta para visualizacao)
    └── ...outros icones
```

Mantenha SVGs em cor preta no arquivo — facilita visualizacao no explorador de arquivos. A cor sera trocada dinamicamente pelo `IconTintColorBehavior` no app.