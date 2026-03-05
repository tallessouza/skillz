# Deep Explanation: Testes de Unidade para ViewModel de Error

## Por que verificar Times.Once() no ClosePage

O instrutor enfatiza que verificar se `ClosePage` foi chamado **exatamente uma vez** e crucial porque, no .NET MAUI, chamar `ClosePage` (ou `GoToAsync("..")`) mais de uma vez pode fechar paginas adicionais da navigation stack. Se o comando disparar duas vezes (por double-tap do usuario, por exemplo), voce pode acabar fechando uma pagina que deveria permanecer aberta.

## Correcao do GoToAsync("..") para ClosePage

Durante a aula, o instrutor corrige um erro onde a ViewModel de erro ainda usava `NavigationService.GoToAsync("..")` diretamente, em vez do metodo `ClosePage()` que foi criado em aulas anteriores para encapsular essa logica. A licao: quando voce cria uma abstracao, use-a consistentemente. O `ClosePage` existe justamente para que a logica de "fechar pagina" fique em um unico lugar.

## IQueryAttributable e o padrao de navegacao MAUI

A interface `IQueryAttributable` do .NET MAUI permite que ViewModels recebam parametros de navegacao. Quando uma pagina navega para outra, ela pode passar um dicionario de parametros. O MAUI chama automaticamente `ApplyQueryAttributes` na ViewModel associada a pagina de destino.

No caso da ViewModel de erros, a pagina que detecta erros navega para a pagina de erros passando uma lista de mensagens. A funcao `ApplyQueryAttributes` recebe esse dicionario, extrai a lista de erros pela chave "errors", e popula a `ObservableCollection` para a UI exibir.

## ObservableProperty e Source Generators

O atributo `[ObservableProperty]` do CommunityToolkit.Mvvm usa source generators para criar automaticamente uma propriedade publica com notificacao de mudanca. O campo privado `errorsList` (camelCase) gera a propriedade publica `ErrorsList` (PascalCase).

O instrutor destaca que testar essa propriedade gerada e importante porque valida nao apenas a logica da funcao, mas tambem que a geracao de codigo esta funcionando corretamente.

## Debate sobre Assert antes do Act (AAA)

O instrutor mostra inicialmente um assert verificando que `ErrorsList` e nulo antes de chamar `ApplyQueryAttributes`. Depois, remove esse assert por duas razoes:

1. **Manter o padrao AAA limpo** — Arrange, Act, Assert devem estar claramente separados
2. **Valor questionavel** — verificar que algo e nulo antes de ser inicializado nao traz informacao util. O que importa e que **apos** chamar a funcao, a propriedade **nao seja nula**

A conclusao: asserts pre-Act sao validos tecnicamente, mas na maioria dos casos nao agregam valor e poluem o teste.

## ShouldSatisfy — agrupando condicoes

O metodo `ShouldSatisfy` permite agrupar multiplas verificacoes em um unico bloco. As condicoes sao executadas em ordem (de cima para baixo), e na primeira falha, a execucao para. Isso e util para:

- Validar count da colecao
- Verificar presenca de elementos especificos
- Manter todos os asserts relacionados juntos