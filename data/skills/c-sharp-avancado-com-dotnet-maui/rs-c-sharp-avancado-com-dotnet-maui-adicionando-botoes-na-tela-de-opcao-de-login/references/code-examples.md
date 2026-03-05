# Code Examples: Botoes e Estilizacao no .NET MAUI

## Exemplo 1: Botao basico

O ponto de partida — apenas a tag Button com texto:

```xml
<Button Text="Login com e-mail e senha" />
```

Resultado: botao com estilo padrao do sistema, sem customizacao.

## Exemplo 2: Adicionando cores

```xml
<Button
    Text="Login com e-mail e senha"
    TextColor="White"
    BackgroundColor="Black" />
```

## Exemplo 3: Fonte customizada

```xml
<Button
    Text="Login com e-mail e senha"
    TextColor="White"
    BackgroundColor="Black"
    FontSize="18"
    FontFamily="Raleway-Black" />
```

## Exemplo 4: Altura e borda arredondada

```xml
<Button
    Text="Login com e-mail e senha"
    TextColor="White"
    BackgroundColor="Black"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20" />
```

## Exemplo 5: Botao com cor hexadecimal e imagem

```xml
<Button
    Text="Continuar com o Google"
    TextColor="Black"
    BackgroundColor="#E8E8E8"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20"
    ImageSource="google_logo.png" />
```

## Exemplo 6: Margin com valor unico (todas as direcoes)

```xml
<Label Text="Exemplo" Margin="80" />
<!-- 80px em todas as direcoes: esquerda, cima, direita, baixo -->
```

## Exemplo 7: Margin com 4 valores

```xml
<!-- Margin="esquerda, cima, direita, baixo" -->
<Label
    Text="Tarefas pequenas, grandes resultados"
    Margin="0,30,0,40" />
```

Efeito: 0 na esquerda, 30 para cima (espaco entre label e imagem acima), 0 na direita, 40 para baixo (espaco entre label e botao abaixo).

## Exemplo 8: Layout completo da tela de Onboard

```xml
<!-- Imagem do onboard (aulas anteriores) -->
<Image Source="onboard_image.png" />

<!-- Texto motivacional -->
<Label
    Text="Tarefas pequenas, grandes resultados"
    Margin="0,30,0,40" />

<!-- Botao login e-mail/senha -->
<Button
    Text="Login com e-mail e senha"
    TextColor="White"
    BackgroundColor="Black"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20"
    Margin="0,20,0,40" />

<!-- Botao Google -->
<Button
    Text="Continuar com o Google"
    TextColor="Black"
    BackgroundColor="#E8E8E8"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20"
    ImageSource="google_logo.png" />
```

## Adicionando imagem ao projeto

Caminho: `Resources/Images/google_logo.svg`

Regras para nome do arquivo:
- Tudo minusculo: `google_logo.svg` (nunca `Google_Logo.svg`)
- Sem espacos: `google_logo.svg` (nunca `google logo.svg`)
- Separar palavras com underline

Apos adicionar, referenciar no XAML como `.png` (o MAUI converte automaticamente):
```xml
ImageSource="google_logo.png"
```