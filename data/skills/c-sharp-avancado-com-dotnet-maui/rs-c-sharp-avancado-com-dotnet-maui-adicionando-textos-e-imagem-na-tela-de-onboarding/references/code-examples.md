# Code Examples: Textos e Imagens em .NET MAUI

## Estrutura basica de uma ContentPage com layout

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Views.Onboarding">

    <VerticalStackLayout>
        <!-- Elementos empilhados verticalmente -->
    </VerticalStackLayout>

</ContentPage>
```

## Adicionando imagem

```xml
<VerticalStackLayout>
    <Image Source="hero_image.png" />
</VerticalStackLayout>
```

**Nota:** A imagem `hero_image.svg` fica em `Resources/Images/`. No XAML, referencia-se como `.png` porque o .NET MAUI converte internamente.

## Label simples

```xml
<Label
    Text="Tarefas pequenas, grandes resultados"
    FontSize="18"
    HorizontalOptions="Center" />
```

Propriedades demonstradas:
- `Text` — conteudo do texto
- `FontSize` — tamanho da fonte (18 neste caso)
- `HorizontalOptions="Center"` — alinha o texto no centro horizontal

## Propriedades de cor em Label

```xml
<!-- Cor do texto -->
<Label Text="Exemplo" TextColor="Red" />

<!-- Cor de fundo do texto -->
<Label Text="Exemplo" BackgroundColor="Yellow" />

<!-- Cor hexadecimal -->
<Label Text="Exemplo" TextColor="#4A90D9" />
```

## Label formatado completo (FormattedText com Spans)

```xml
<Label
    FontSize="18"
    HorizontalOptions="Center">
    <Label.FormattedText>
        <FormattedString>
            <Span Text="Nao tem uma conta?" />
            <Span Text=" " />
            <Span Text="Crie a sua" TextColor="#4A90D9" />
        </FormattedString>
    </Label.FormattedText>
</Label>
```

### Passo a passo da construcao:

1. Crie o Label sem a propriedade `Text` inline
2. Abra a tag `Label` (nao feche com `/>`)
3. Adicione `<Label.FormattedText>`
4. Dentro, adicione `<FormattedString>`
5. Adicione cada `<Span>` com seu texto e estilo
6. Use `<Span Text=" " />` para espacos entre spans

## Exemplo com tres Spans de cores diferentes

```xml
<Label FontSize="18" HorizontalOptions="Center">
    <Label.FormattedText>
        <FormattedString>
            <Span Text="Texto vermelho" TextColor="Red" />
            <Span Text=" " />
            <Span Text="Texto azul" TextColor="#4A90D9" />
            <Span Text=" " />
            <Span Text="Texto W" TextColor="Green" />
        </FormattedString>
    </Label.FormattedText>
</Label>
```

Os spans sao renderizados na mesma linha, cada um com sua formatacao individual.

## Tela de onboarding completa (ate esta aula)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Views.Onboarding">

    <VerticalStackLayout>

        <Image Source="hero_image.png" />

        <Label
            Text="Tarefas pequenas, grandes resultados"
            FontSize="18"
            HorizontalOptions="Center" />

        <Label
            FontSize="18"
            HorizontalOptions="Center">
            <Label.FormattedText>
                <FormattedString>
                    <Span Text="Nao tem uma conta?" />
                    <Span Text=" " />
                    <Span Text="Crie a sua" TextColor="#4A90D9" />
                </FormattedString>
            </Label.FormattedText>
        </Label>

    </VerticalStackLayout>

</ContentPage>
```

## Organizacao de imagens no projeto

```
Resources/
└── Images/
    └── hero_image.svg    ← arquivo original SVG
```

Para adicionar imagens:
- Via Visual Studio: selecione a pasta Images, Ctrl+V
- Via Windows Explorer: navegue ate `Resources/Images/` e cole o arquivo

O .NET MAUI automaticamente processa imagens SVG em `Resources/Images` e as converte para PNG no build.