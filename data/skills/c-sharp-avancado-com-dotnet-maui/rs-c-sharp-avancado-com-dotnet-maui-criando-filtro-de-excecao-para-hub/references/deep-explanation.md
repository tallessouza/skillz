# Deep Explanation: Filtro de Exceção para SignalR Hub

## Por que tratar exceções no Hub?

O instrutor levanta um ponto crucial: mesmo que o código do Hub não lance exceções explicitamente (nenhum `throw new Exception`), exceções podem ocorrer de fontes externas — timeout de banco de dados, falha de rede, etc. A obrigação do desenvolvedor é estar preparado para o cenário infeliz.

## IHubFilter não é filtro, é middleware

Apesar do nome "filter", o `IHubFilter` funciona como um middleware/pipeline. O método `InvokeMethodAsync` é executado **sempre que qualquer método do Hub é invocado**. Isso significa:

1. Código pode executar **antes** do método do Hub (pré-processamento)
2. O `next(invocationContext)` continua o fluxo até o método real
3. Código pode executar **depois** do resultado (pós-processamento)
4. Exceções podem ser capturadas no caminho

O instrutor demonstra isso com breakpoints: ao chamar um método, o código bate primeiro no `InvokeMethodAsync`, depois segue para o método do Hub, e se uma exceção ocorre, cai no catch do filtro.

## Interface com implementação padrão (C# moderno)

O instrutor nota que a interface `IHubFilter` já possui implementações padrão nos seus métodos. Em versões mais recentes do C#/.NET, interfaces podem ter implementações — isso facilita o compartilhamento de código e não obriga classes a reimplementar a mesma lógica. A classe só precisa sobrescrever o que quer customizar.

## Global vs Per-Hub: decisão arquitetural

**Global** (`AddSignalR(options => options.AddFilter<T>())`):
- Aplica o filtro a TODOS os Hubs da API
- Bom quando o tratamento de erro é genérico

**Per-Hub** (`AddHubOptions<T>(options => options.AddFilter<F>())`):
- Aplica o filtro apenas ao Hub específico
- O instrutor prefere esta abordagem porque a lógica de notificação (avisar o outro usuário) é específica deste Hub
- Para múltiplos Hubs: encadeie múltiplos `AddHubOptions<T>()` — cada Hub com seu próprio filtro

O instrutor nomeou a classe `UserConnectionsExceptionHubFilter` propositalmente com nome longo para deixar claro que o filtro é específico para aquele Hub.

## O cenário do "usuário no vácuo"

Este é o insight mais valioso da aula. Considere o fluxo:

1. Pessoa A gera um código de conexão
2. Pessoa B usa o código e fica esperando aprovação
3. Pessoa A tenta aprovar → exceção é lançada

Se o filtro apenas retorna erro para quem chamou (Pessoa A), a Pessoa B fica eternamente esperando uma resposta que nunca virá — "no vácuo".

A solução: no catch, além de retornar erro para quem chamou, o filtro:
1. Pega o `ConnectionId` de quem gerou a exceção
2. Busca no dicionário o código associado àquela conexão
3. Remove a conexão (limpeza)
4. Notifica o outro usuário via `SendAsync("ConnectionErrorOccurrence")`

Isso garante que o aplicativo do outro lado pode tratar o erro e recomeçar o fluxo.

## Injeção de dependência no filtro

O filtro suporta injeção de dependência normalmente via construtor. O instrutor injeta o `ICodeConnectionService` para poder consultar e manipular as conexões ativas quando uma exceção ocorre.

## Acesso ao contexto do Hub dentro do filtro

Dentro do `InvokeMethodAsync`, é possível acessar:
- `invocationContext.Hub.Context.ConnectionId` — ID da conexão que chamou
- `invocationContext.Hub.Clients` — para enviar mensagens a outros clientes

Isso torna o filtro poderoso: ele tem acesso total ao contexto do Hub.