# Deep Explanation: Eventos de Clique em Botoes no .NET MAUI

## Por que o handler precisa dessa assinatura?

O .NET MAUI (e o .NET em geral) usa o padrao de delegates para eventos. O evento `Clicked` de um `Button` espera um delegate do tipo `EventHandler`, que tem a assinatura fixa:

```csharp
public delegate void EventHandler(object sender, EventArgs e);
```

Isso significa que qualquer funcao vinculada ao evento `Clicked` DEVE ter exatamente `(object sender, EventArgs e)` como parametros. Nao e opcional — e uma exigencia do sistema de tipos do C#.

## O que e o `sender`?

O instrutor demonstrou ao vivo: `sender` e sempre uma referencia ao objeto que disparou o evento. No caso de um botao, e o proprio botao. Como chega tipado como `object`, voce precisa fazer cast:

```csharp
var button = (Button)sender;
```

A partir dai, voce tem acesso a todas as propriedades do botao: `Text`, `IsEnabled`, `BackgroundColor`, etc.

O instrutor fez uma demonstracao divertida trocando o texto para "Oi, eu sou o Goku" para provar que o `sender` realmente referencia o botao clicado.

## Por que `EventArgs` nao serve pra nada aqui?

O instrutor foi direto: "Pra que ele vai servir? Nada. Ele nao vai servir para nada aqui."

O `EventArgs` esta presente apenas para cumprir a assinatura do delegate. No evento `Clicked` de um botao, nenhuma informacao adicional e passada. Em outros contextos do .NET (como eventos customizados), voce pode criar classes que herdam de `EventArgs` para carregar dados — mas nao e o caso aqui.

## Por que code-behind e temporario?

O instrutor alertou explicitamente: "O code-behind de uma tela deveria ser exclusivo para comportamentos referentes a tela. Nao disparar uma funcao de um toque no botao que vai disparar uma regra de negocio."

Isso aponta para o padrao MVVM (Model-View-ViewModel), onde:
- **View** (XAML + code-behind): apenas apresentacao e comportamento visual
- **ViewModel**: logica de interacao, commands, binding
- **Model**: dados e regras de negocio

No MVVM, ao inves de `Clicked="Handler"`, voce usa `Command="{Binding GoogleLoginCommand}"` com `CommandParameter` para passar dados.

## Visual Studio vs Rider

O instrutor observou que o Visual Studio sugere automaticamente criar handlers ao digitar `Clicked` no XAML. O Rider (JetBrains) pode nao oferecer a mesma facilidade. Nesse caso, basta criar a funcao manualmente no code-behind com a assinatura correta:

```csharp
private void ButtonGoogle_Clicked(object sender, EventArgs e)
{
}
```

E referenciar no XAML. Funciona identicamente.

## Renomeando handlers

Quando o Visual Studio cria automaticamente, ele gera nomes genericos como `Button_Clicked`. O instrutor enfatizou renomear imediatamente para algo descritivo. Porem, ao renomear no code-behind, voce DEVE atualizar tambem no XAML — o Visual Studio nao sincroniza automaticamente.

## Dois botoes, mesmo handler ou handlers separados?

O instrutor mostrou que dois botoes podem apontar para o mesmo handler. Nesse caso, use `sender` para identificar qual botao disparou. Porem, ele optou por criar handlers separados para clareza — `ButtonGoogle_Clicked` e `ButtonLogin_Clicked`.