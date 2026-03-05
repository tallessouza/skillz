# Deep Explanation: Navigation Service para Isolar Navegacao

## Por que Shell.Current e problematico

O instrutor Welleson identifica um problema sutil mas critico: `Shell.Current` so existe quando o aplicativo .NET MAUI esta em execucao. Em ambiente de teste de unidade, nao ha app executando, entao `Shell.Current` retorna nulo e qualquer teste que exercite um comando de navegacao vai quebrar.

A reflexao chave: "Esse Shell.Current ele so vai existir se e somente se o aplicativo estiver executando." Isso significa que qualquer ViewModel que chame `Shell.Current` diretamente se torna **intestavel**.

## A estrategia de isolamento

O padrao aplicado e classico de inversao de dependencia (DIP - SOLID):

1. **Extrair contrato** — criar `INavigationService` com os mesmos metodos que Shell oferece
2. **Implementar wrapper** — `NavigationService` implementa a interface e internamente chama `Shell.Current`
3. **Registrar no DI** — configurar no `MauiProgram.cs`
4. **Injetar via construtor** — ViewModel recebe a interface, nunca a implementacao concreta

## Detalhe importante: ShellNavigationState vs string

O instrutor faz questao de mostrar por que nao se pode simplesmente usar `string` como parametro na interface. Ele navega ate o codigo fonte do Shell (Ctrl+Click em GoToAsync) e mostra que o metodo espera um `ShellNavigationState`, nao uma `string`. Existe uma conversao implicita quando voce passa string diretamente no Shell, mas se voce declarar sua interface com `string`, pode nao funcionar corretamente.

A recomendacao: copie a assinatura exata do metodo do Shell para sua interface.

## Por que Singleton e nao Transient

O instrutor questiona: "Para que a gente vai utilizar um transient para toda hora ficar criando uma instancia desse servico?" O NavigationService nao tem estado interno que mude entre chamadas — ele e um wrapper puro. Criar nova instancia a cada uso e desperdicio. Singleton reutiliza a mesma instancia durante todo o ciclo de vida do app (do momento que abre ate fechar).

## Convencao Microsoft para propriedades privadas

O instrutor menciona explicitamente: "A Microsoft recomenda que propriedades privadas comecem com underline e a primeira letra minuscula." Entao:
- `private readonly INavigationService _navigationService;`
- Atribuicao no construtor: `_navigationService = navigationService;`

## Beneficio futuro: Mock em testes

Quando testes de unidade forem escritos, basta criar um mock de `INavigationService` e passar para a ViewModel. O mock nao chama `Shell.Current`, entao o teste executa sem precisar de um app MAUI rodando. O instrutor enfatiza: "Eu passo aqui na instancia dessa ViewModel um mock. E ai tudo vai funcionar."

## Organizacao do projeto

A interface e classe ficam dentro da pasta `navigation/` que ja existia no projeto. O instrutor havia criado essa pasta anteriormente e mencionado que "futuramente vai ficar mais claro a importancia dela."