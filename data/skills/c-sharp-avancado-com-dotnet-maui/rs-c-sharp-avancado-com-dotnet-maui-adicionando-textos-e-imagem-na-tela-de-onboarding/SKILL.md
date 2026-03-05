---
name: rs-csharp-maui-textos-imagem-onboarding
description: "Applies .NET MAUI XAML layout and text formatting patterns when building mobile UI screens. Use when user asks to 'create a screen', 'add text and image', 'build onboarding page', 'format label', or 'use VerticalStackLayout in MAUI'. Covers layouts (Vertical/Horizontal StackLayout, Grid, ScrollView), Image source with SVG-to-PNG conversion, and FormattedText with Spans for mixed-style labels. Make sure to use this skill whenever generating .NET MAUI XAML UI code. Not for backend logic, API calls, or non-MAUI frameworks."
---

# Textos e Imagens em .NET MAUI

> Construa telas MAUI usando layouts empilhados, imagens SVG referenciadas como .png, e labels formatados com Spans para estilos mistos.

## Rules

1. **Toda ContentPage precisa de exatamente um layout raiz** — use `VerticalStackLayout`, `HorizontalStackLayout`, `Grid` ou `ScrollView`, porque ContentPage aceita apenas um filho direto
2. **Use VerticalStackLayout quando elementos estao empilhados de cima para baixo** — a ordem no XAML define a ordem visual, porque o layout le de cima para baixo
3. **Referencie imagens SVG com extensao .png** — o .NET MAUI converte SVG para PNG internamente, porque iOS nao renderiza SVG diretamente
4. **Prefira SVG como formato de origem** — porque permite redimensionar sem perder qualidade e alterar cores via codigo
5. **Use FormattedText com Spans para textos com estilos mistos** — porque um Label simples aceita apenas um estilo uniforme
6. **Adicione um Span vazio com espaco para separar textos** — `<Span Text=" " />` entre spans, porque concatenacao direta cola os textos

## How to write

### Imagem em VerticalStackLayout

```xml
<ContentPage ...>
    <VerticalStackLayout>
        <Image Source="hero_image.png" />
    </VerticalStackLayout>
</ContentPage>
```

### Label simples centralizado

```xml
<Label
    FontSize="18"
    HorizontalOptions="Center"
    Text="Tarefas pequenas, grandes resultados" />
```

### Label formatado com Spans (estilos mistos)

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

## Example

**Before (label unico sem formatacao mista):**

```xml
<Label Text="Nao tem uma conta? Crie a sua"
       FontSize="18"
       HorizontalOptions="Center" />
```

**After (com FormattedText para estilo misto):**

```xml
<Label FontSize="18" HorizontalOptions="Center">
    <Label.FormattedText>
        <FormattedString>
            <Span Text="Nao tem uma conta?" />
            <Span Text=" " />
            <Span Text="Crie a sua" TextColor="#4A90D9" />
        </FormattedString>
    </Label.FormattedText>
</Label>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elementos um abaixo do outro | `VerticalStackLayout` |
| Elementos lado a lado | `HorizontalStackLayout` |
| Linhas e colunas complexas | `Grid` |
| Conteudo maior que a tela | `ScrollView` envolvendo o layout |
| Texto com uma unica cor/fonte | Label simples com `Text=` |
| Texto com cores/fontes mistas | `Label.FormattedText` com `Span` |
| Imagem SVG no projeto | Coloque SVG em Resources/Images, referencie como .png |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|----------------|
| `<Image Source="hero.svg" />` | `<Image Source="hero.png" />` (MAUI converte internamente) |
| Dois layouts raiz no ContentPage | Um unico layout raiz |
| `<Label Text="A B" TextColor="Blue"/>` para estilo parcial | `FormattedText` com Spans individuais |
| Spans colados sem separador | `<Span Text=" " />` entre eles |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
