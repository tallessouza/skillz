# Deep Explanation: Navegacao com Parametros e Hub no .NET MAUI

## Por que delegar a comunicacao do Hub para outra pagina?

O instrutor (Wilson) explica que a pagina onde o usuario digita o codigo de 6 digitos usa um pacote NuGet que nao da liberdade para ficar escondendo e mostrando elementos. Isso e uma limitacao pratica: quando voce usa componentes de terceiros, voce nao tem controle total sobre a UI.

A solucao e separar responsabilidades:
- **Pagina de input**: apenas coleta o codigo e navega
- **Pagina Joiner**: gerencia conexao com Hub, exibe status, processa resposta

Essa separacao segue o principio de Single Responsibility — cada pagina faz uma coisa bem feita.

## QueryProperty vs IQueryAttributable

O .NET MAUI oferece duas formas de receber parametros de navegacao:

1. **IQueryAttributable** (interface): implementa `ApplyQueryAttributes(IDictionary<string, object> query)` — mais flexivel, melhor para multiplos parametros ou logica complexa
2. **QueryProperty** (atributo): `[QueryProperty(nameof(Prop), "key")]` — mais simples, declarativo, ideal para 1-2 parametros

O instrutor escolhe QueryProperty por ser o caso mais simples (apenas um codigo string).

## nameof() no C#

O instrutor destaca o uso de `nameof(Code)` ao inves da string `"Code"`. A vantagem e que ao usar Rename (botao direito > Rename) no Visual Studio, todas as referencias sao atualizadas automaticamente. Com string literal, voce teria que encontrar e substituir manualmente.

## Fluxo completo de setup de uma nova pagina

1. Criar a ViewModel (partial, herda de ViewModelBase, recebe INavigationService)
2. Criar a Page (.xaml + .xaml.cs) na pasta correta (Views/Pages/User/Connection)
3. No XAML: adicionar namespaces (FontFamily, Models, ResourceText, Toolkit, ViewModels), x:DataType, x:Name
4. No code-behind: receber ViewModel no construtor, atribuir BindingContext
5. No MauiProgram: registrar Page + ViewModel com AddTransient associado a constante de rota
6. Criar constante de rota em RoutesPages

## Convencao de nomes x:Name

O combinado do curso e pegar o nome da classe e inverter — se a classe e `UserConnectionJoinerPage`, o x:Name seria `PageUserConnectionJoiner`. Isso ajuda a identificar rapidamente o tipo do elemento.

## StatusPage com sobrescrita usando new

A ViewModel base ja tem uma propriedade `StatusPage`. A nova ViewModel precisa de um StatusPage especifico (`ConnectionByCodeStatusPage`), entao usa a keyword `new` para deixar explicita a intencao de sobrescrever:

```csharp
public new ConnectionByCodeStatusPage StatusPage { get; set; }
```

## Refresh Token antes da conexao

Antes de conectar ao Hub, o codigo executa `_useRefreshTokenTemporaryCode.Execute()`. Isso garante que o access token esta valido antes de tentar a conexao, evitando falhas por token expirado.

## Caminho feliz

O instrutor deixa claro que nesta aula esta implementando apenas o "caminho feliz" — sem tratamento de erros. Isso e intencional para focar no fluxo principal primeiro e adicionar error handling depois.