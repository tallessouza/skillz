# Code Examples: Criando Entries no .NET MAUI

## Exemplo 1: Entry minima

A entry mais simples possivel, sem estilizacao:

```xml
<Label Text="Nome" />
<Entry />
```

Resultado: um label "Nome" e uma linha onde o usuario pode clicar e digitar. Aparece o teclado padrao.

## Exemplo 2: Entry com placeholder

```xml
<Entry Placeholder="Bruce Wayne" />
```

Exibe "Bruce Wayne" em texto claro quando a entry esta vazia. Desaparece quando o usuario comeca a digitar.

## Exemplo 3: Estilizacao de placeholder e texto

```xml
<Entry
    Placeholder="Bruce Wayne"
    PlaceholderColor="#808080"
    TextColor="Black" />
```

Placeholder cinza claro, texto digitado preto. O instrutor primeiro demonstrou com `PlaceholderColor="Red"` para mostrar a diferenca visual.

## Exemplo 4: Entry com Keyboard de e-mail

```xml
<Entry
    Placeholder="bruce@wayne.com"
    Keyboard="Email" />
```

Altera o layout do teclado para incluir tecla `@`, facilitando digitacao de e-mail.

## Exemplo 5: Todos os tipos de Keyboard

```xml
<!-- Padrao -->
<Entry Keyboard="Default" />

<!-- E-mail: adiciona @ -->
<Entry Keyboard="Email" />

<!-- Numerico: so numeros -->
<Entry Keyboard="Numeric" />

<!-- Telefone -->
<Entry Keyboard="Telephone" />

<!-- URL: adiciona / e .com -->
<Entry Keyboard="Url" />

<!-- Chat -->
<Entry Keyboard="Chat" />
```

## Exemplo 6: Entry de senha

```xml
<Entry
    Placeholder="********"
    IsPassword="True" />
```

`IsPassword="True"` esconde caracteres com asteriscos. Trocar para `False` revela o texto.

## Exemplo 7: Formulario completo de registro

```xml
<!-- Nome -->
<Label
    Text="Nome"
    Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="Bruce Wayne"
    PlaceholderColor="#808080"
    TextColor="Black" />

<!-- E-mail -->
<Label
    Text="E-mail"
    Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="bruce@wayne.com"
    Keyboard="Email"
    PlaceholderColor="#808080"
    TextColor="Black" />

<!-- Senha -->
<Label
    Text="Senha"
    Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="********"
    IsPassword="True"
    PlaceholderColor="#808080"
    TextColor="Black" />
```

## Exemplo 8: Estilo reutilizavel no ResourceDictionary

```xml
<!-- Em Styles.xaml ou CustomStyles.xaml -->
<Style x:Key="TitleForEntry" TargetType="Label">
    <Setter Property="FontSize" Value="11" />
    <Setter Property="FontFamily" Value="MainFontThin" />
</Style>
```

Uso:
```xml
<Label Text="Nome" Style="{StaticResource TitleForEntry}" />
```

## Exemplo 9: Margem no botao (contexto da pagina)

```xml
<Button
    Text="Criar conta"
    Margin="0,70,0,70" />
```

Formato: `esquerda, cima, direita, baixo`. O instrutor usou Alt+mouse no Figma para medir 50px de espacamento do label e 70px para o botao.