# Deep Explanation: Navegacao Shell no .NET MAUI

## Modelo mental: a pilha de paginas

O instrutor usa a analogia de empilhamento fisico. A MainPage (pagina principal) e como o fundo de uma mesa — ela sempre esta la. Cada `GoToAsync` coloca uma nova pagina "por cima". O botao voltar remove a pagina do topo, revelando a de baixo.

Pontos-chave do raciocinio:

1. **A MainPage nunca sai da pilha** — ela pode ser *trocada* (substituida por outra MainPage), mas sempre existe uma. Se o usuario voltar na MainPage, o app fecha (sai para a tela do dispositivo).

2. **Empilhar vs substituir** — o cenario classico e a tela "Criar Conta" com link "Ja tem conta? Faca login". Nao faz sentido empilhar Login em cima de CreateAccount, porque ao voltar o usuario veria CreateAccount de novo. A solucao e `"../{rota}"` que desempilha e empilha em uma unica operacao.

3. **Duas possiveis MainPages** — no app do curso, tanto Onboard quanto Dashboard podem ser MainPage. A logica de decisao (verificar sessao ativa) determina qual aparece ao abrir o app. Ambas precisam estar declaradas no `AppShell.xaml`.

## Sobre `async void`

O instrutor faz questao de alertar: `async void` e necessario para event handlers como `Button_Clicked` porque a assinatura do evento exige `void`. Porem, em ViewModels com Commands, deve-se usar `async Task` sempre, porque `async void` engole excecoes e dificulta debugging.

## Cenarios nao cobertos (mencionados para futuro)

- **Passagem de parametros**: pode-se passar parametros tanto ao navegar para frente quanto ao voltar (para a pagina atras na pilha). Sera coberto quando necessario na trilha.
- **Troca da MainPage**: requer configuracoes especificas. Acontece apos login/cadastro com sucesso, quando o app deve trocar de Onboard para Dashboard como pagina principal.

## Personalizacao do botao voltar

O instrutor demonstra brevemente que e possivel customizar o icone do botao voltar usando `Shell.BackButtonBehavior` dentro de uma ContentPage:

```xml
<Shell.BackButtonBehavior>
    <BackButtonBehavior IconOverride="icon.png" />
</Shell.BackButtonBehavior>
```

Ele confessa nunca ter precisado usar isso na pratica, mas mostra que a possibilidade existe.

## Referencia oficial

A documentacao recomendada pelo instrutor: [Navegacao do Shell do .NET MAUI](https://learn.microsoft.com/pt-br/dotnet/maui/fundamentals/shell/navigation?view=net-maui-9.0)