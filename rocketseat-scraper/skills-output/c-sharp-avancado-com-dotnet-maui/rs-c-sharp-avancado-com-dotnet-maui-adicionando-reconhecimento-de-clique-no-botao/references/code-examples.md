# Code Examples: Eventos de Clique em Botoes no .NET MAUI

## Exemplo 1: Adicionando Clicked no XAML

No arquivo XAML da pagina de onboarding, adicione a propriedade `Clicked` ao botao:

```xml
<!-- Botao de login com Google -->
<Button
    Text="Continuar com o Google"
    Clicked="ButtonGoogle_Clicked" />

<!-- Botao de login com e-mail -->
<Button
    Text="Login com e-mail e senha"
    Clicked="ButtonLogin_Clicked" />
```

## Exemplo 2: Handlers no Code-Behind

No arquivo `.xaml.cs` (code-behind):

```csharp
public partial class OnboardingPage : ContentPage
{
    public OnboardingPage()
    {
        InitializeComponent();
    }

    private void ButtonGoogle_Clicked(object sender, EventArgs e)
    {
        // Acao ao clicar no botao Google
    }

    private void ButtonLogin_Clicked(object sender, EventArgs e)
    {
        // Acao ao clicar no botao de login
    }
}
```

## Exemplo 3: Usando sender para manipular o botao

Demonstracao do instrutor — casting de sender para acessar propriedades:

```csharp
private void ButtonGoogle_Clicked(object sender, EventArgs e)
{
    var button = (Button)sender;
    button.Text = "Oi, eu sou o Goku"; // Troca o texto do botao
}
```

Resultado: ao clicar no botao "Continuar com o Google", o texto muda para "Oi, eu sou o Goku".

## Exemplo 4: Criando handler manualmente (para usuarios de Rider)

Se a IDE nao sugerir criar o handler automaticamente:

1. No code-behind, crie a funcao com a assinatura exata:

```csharp
private void ButtonGoogle_Clicked(object sender, EventArgs e)
{
    // Sua logica aqui
}
```

2. No XAML, referencie pelo nome:

```xml
<Button Text="Continuar com o Google" Clicked="ButtonGoogle_Clicked" />
```

## Exemplo 5: Desabilitando botao apos clique (caso pratico)

```csharp
private void ButtonLogin_Clicked(object sender, EventArgs e)
{
    var button = (Button)sender;
    button.IsEnabled = false;
    button.Text = "Carregando...";

    // Processar login...
}
```

## Exemplo 6: Mesmo handler para multiplos botoes

```xml
<Button Text="Opcao A" Clicked="ButtonOption_Clicked" />
<Button Text="Opcao B" Clicked="ButtonOption_Clicked" />
```

```csharp
private void ButtonOption_Clicked(object sender, EventArgs e)
{
    var button = (Button)sender;
    // Identificar qual botao pelo texto ou outro atributo
    if (button.Text == "Opcao A")
    {
        // Logica para opcao A
    }
    else
    {
        // Logica para opcao B
    }
}
```

## Assinatura obrigatoria — referencia rapida

```csharp
// ESTA e a assinatura que o evento Clicked exige:
private void NomeDescritivo_Clicked(object sender, EventArgs e)
//          ^^^^^^^^^^^^^^^^^        ^^^^^^        ^^^^^^^^^
//          nome descritivo          objeto que     obrigatorio
//                                   disparou       (sem dados uteis)
```