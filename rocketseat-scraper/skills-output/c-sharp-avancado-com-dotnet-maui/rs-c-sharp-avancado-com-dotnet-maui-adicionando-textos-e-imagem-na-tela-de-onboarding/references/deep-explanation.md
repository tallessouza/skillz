# Deep Explanation: Textos e Imagens em .NET MAUI

## Por que apenas um layout raiz?

O ContentPage do .NET MAUI aceita apenas um Content filho. Se voce tentar colocar dois layouts raiz (ex: um VerticalStackLayout e um HorizontalStackLayout lado a lado), o codigo nao compila. A solucao e sempre ter um unico layout raiz e aninhar outros layouts dentro dele.

## VerticalStackLayout como pilha visual

O instrutor usa a analogia de **pilha**: tudo que voce coloca dentro do VerticalStackLayout e empilhado de cima para baixo, na ordem em que aparece no XAML. Se voce move uma tag para cima no arquivo, o elemento sobe na tela. A ordem no XAML **e** a ordem visual.

Opcoes de layout disponíveis:
- **VerticalStackLayout** — pilha vertical (um abaixo do outro)
- **HorizontalStackLayout** — pilha horizontal (um ao lado do outro)
- **Grid** — divide a tela em linhas e colunas, associando elementos a posicoes especificas
- **ScrollView** — permite scroll quando o conteudo excede o tamanho da tela. Precisa conter um layout interno (VerticalStackLayout, Grid, etc.)

### Quando usar ScrollView

Se o dispositivo for pequeno e o conteudo nao couber, o VerticalStackLayout sozinho **corta** o conteudo. Envolvendo-o com ScrollView, o usuario pode rolar. Porem, para telas pequenas como onboarding com poucos elementos, ScrollView e desnecessario.

## SVG vs PNG no .NET MAUI

O instrutor explica o fluxo interno:
1. Voce coloca a imagem SVG na pasta `Resources/Images`
2. No XAML, referencia como `.png` (ex: `hero_image.png`)
3. O .NET MAUI internamente converte SVG para PNG no build
4. Isso funciona tanto no Android quanto no iOS

**Por que SVG como fonte?**
- Redimensionamento sem perda de qualidade
- Possibilidade de trocar cor via codigo
- Flexibilidade para diferentes tamanhos de tela

**Por que referenciar como .png?**
- iOS nao suporta SVG diretamente
- Android suporta SVG mas o .NET MAUI padroniza a conversao para ambas plataformas

## Tag simplificada vs estendida em XAML

O XAML oferece duas formas de declarar propriedades:

**Forma simplificada** (para valores simples):
```xml
<Label Text="Hello" FontSize="18" />
```

**Forma estendida** (para valores complexos):
```xml
<Label FontSize="18">
    <Label.FormattedText>
        <!-- conteudo complexo aqui -->
    </Label.FormattedText>
</Label>
```

Use a forma estendida quando precisa acessar sub-propriedades como `FormattedText`, que contem `FormattedString`, que contem multiplos `Span`.

## FormattedText: a hierarquia

```
Label
  └── Label.FormattedText
        └── FormattedString
              ├── Span (texto 1, estilo A)
              ├── Span (espaco separador)
              └── Span (texto 2, estilo B)
```

Cada Span pode ter suas proprias propriedades: `Text`, `TextColor`, `FontSize`, `FontAttributes`, etc. Todos os Spans ficam na mesma linha por padrao.

## Direitos autorais de imagens

O instrutor enfatiza: **imagens tem direitos autorais**. Antes de usar qualquer imagem:
- Verifique se e gratuita (filtro "free" nos sites)
- Ou pague pela licenca

Sites recomendados:
- **flaticon.com** — icones (selecionar filtro "free")
- **freepik.com** — ilustracoes (selecionar "free" e "ilustracoes")

## Hot Reload

O .NET MAUI suporta Hot Reload: ao salvar o arquivo XAML, o app no emulador/dispositivo atualiza automaticamente sem precisar recompilar. Isso acelera muito o desenvolvimento de UI.

## Cores hexadecimais

Para descobrir cores do design (Figma), o instrutor usa PowerToys (Windows) com `Win+Shift+C` para capturar a cor hexadecimal de qualquer pixel na tela. No XAML, cores hexadecimais sempre comecam com `#` (ex: `#4A90D9`).