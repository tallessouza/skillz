# Deep Explanation: SnackBar e Centralização no Navigation Service

## Por que centralizar no NavigationService?

O instrutor (Ellison) explica o problema com uma analogia prática: imagine que cada ViewModel tem sua própria cópia da configuração do SnackBar. Se você precisa mudar uma cor, uma fonte, ou o tempo de duração, precisa caçar em todas as ViewModels. Pior: diferentes desenvolvedores podem configurar de formas diferentes, gerando alertas visualmente inconsistentes no app.

O princípio é **Single Point of Change**: mude em um lugar, reflita em todos.

## A questão do nome "NavigationService"

O próprio instrutor reconhece que o nome "NavigationService" não é perfeito para abrigar lógica de alertas — "a gente não tá navegando pra uma alerta". Mas o foco da lição é o princípio de não repetir código, não a nomenclatura perfeita. Se preferir, crie um `FeedbackService` ou `AlertService` separado.

## Por que encapsular sintaxes Shell

A navegação Shell do .NET MAUI usa strings como `".."` para voltar e `"//PageName"` para trocar a página raiz. Ellison destaca dois problemas:

1. **Legibilidade**: `".."` não comunica nada para quem não conhece a sintaxe. `ClosePage()` é imediatamente compreensível.
2. **Manutenibilidade**: se a Microsoft mudar a sintaxe, você altera em um lugar só no NavigationService.

## O bug do ClosePage fora do if

Ellison admite um erro de aulas anteriores: o `GoToAsync("..")` estava no final da função, fora do bloco `if (success)`. Resultado: a página fechava tanto no sucesso quanto no erro. O lugar correto é dentro do `if (success)`, porque no erro o usuário precisa ver a página para corrigir.

## Ajustes visuais iterativos

O instrutor demonstrou ajuste iterativo do `CharacterSpacing` (de 0.10 para 0.3, depois para 0.1) e da duração (testou 15 segundos, voltou para 3). Isso mostra que valores de UI são refinados por teste visual — não há "valor correto" universal.

## Interface obrigatória

Toda vez que um método é adicionado ao NavigationService, a assinatura precisa ir para INavigationService. Sem isso, a ViewModel não consegue chamar o método via injeção de dependência. Ellison esqueceu disso ao vivo e corrigiu imediatamente — reforçando que é um erro comum.