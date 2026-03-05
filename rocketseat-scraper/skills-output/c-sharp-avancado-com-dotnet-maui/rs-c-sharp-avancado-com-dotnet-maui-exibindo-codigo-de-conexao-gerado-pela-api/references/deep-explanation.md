# Deep Explanation: Exibindo Codigo de Conexao Gerado pela API

## Por que validar o token antes do StartAsync

O metodo `StartAsync` executa o handshake com o Hub. Nesse momento, a mensagem de handshake inclui o access token no header. Se o token estiver expirado, a conexao falha. O instrutor demonstrou isso ao vivo — ele sabia que seu token havia expirado entre sessoes de desenvolvimento.

A solucao temporaria foi injetar o `IUseRefreshTokenUseCase` e chamar `ExecuteSilent` antes do `StartAsync`. Isso garante um token fresco. Porem, esse codigo e **temporario** porque:

- No fluxo final, a tela de Dashboard (home) sera o ponto de entrada
- O Dashboard executara a validacao de token no seu proprio evento Appearing
- Ao navegar do Dashboard para a tela de conexao, o token ja estara valido
- Se o refresh token falhar no Dashboard, o mecanismo de renovacao automatica (implementado em aulas anteriores) cuidara disso

O instrutor enfatizou varias vezes que esse codigo e temporario para evitar que alunos o considerem padrao de producao.

## Como InvokeAsync funciona

`InvokeAsync<T>` faz tres coisas:
1. Envia uma mensagem ao Hub com o nome do metodo como string
2. Aguarda a resposta assincrona
3. Deserializa o retorno para o tipo `T`

O tipo generico e fundamental — sem ele, voce nao recebe o resultado tipado. Como o projeto de comunicacao (shared) contem `HubOperationResult<T>`, tanto o app quanto a API tem acesso ao mesmo tipo, garantindo compatibilidade na deserializacao.

## O pattern EventToCommandBehavior

O MAUI Community Toolkit fornece `EventToCommandBehavior` para vincular eventos de pagina (como `Appearing`) a Commands no ViewModel. O instrutor mostrou que esse pattern ja existia na pagina UserProfile e foi replicado para a pagina de conexao.

Pontos importantes:
- O `EventName` deve ser `"Appearing"` (evento da ContentPage)
- O `Command` faz binding com `InitializeCommand` (gerado pelo `[RelayCommand]`)
- O namespace do toolkit precisa estar declarado no XAML

## Sobre o refresh token expirado

Se o aluno estiver com o refresh token expirado (mais de 7 dias desde o ultimo login), a unica saida e desinstalar o app e reinstalar. Isso porque sem um refresh token valido, nao ha como obter um novo access token sem fazer login novamente.

## StatusPage como maquina de estados

O instrutor usa um enum `StatusPage` para controlar visibilidade de elementos na UI:
- `GeneratingCode` — estado de carregamento
- `ConnectionByCode` — codigo gerado, aguardando alguem usar

Esse pattern sera expandido na proxima aula com Skeleton Loading e controle de visibilidade baseado no status.