# Deep Explanation: Autorizacao de Hub SignalR

## Por que o handler bloqueia sem excecao?

Diferente de filtros MVC (como `AuthenticatedUserFilter`), onde a ausencia de um `context.Result` permite o fluxo continuar, o authorization handler do ASP.NET Core exige confirmacao **explicita** de sucesso. Se voce nao chama `context.Succeed(requirement)`, o handler assume que a autorizacao nao foi concedida — mesmo que nenhuma excecao tenha sido lancada. O resultado e um erro 500 silencioso, sem mensagem util.

## Analogia do instrutor: A balada

O handler e como o seguranca na entrada de uma balada:
- **Na entrada:** voce mostra seu ingresso (token) e identidade. O seguranca valida.
- **Dentro da balada:** ninguem fica pedindo seu ingresso de novo. Voce pode ir a qualquer lugar, chamar qualquer funcao.
- **Se sair:** precisa mostrar o ingresso de novo na proxima entrada.

Isso significa que o custo computacional da validacao acontece **uma unica vez** por conexao WebSocket, nao por mensagem.

## Por que nao lancar excecoes?

No contexto de um handler de autorizacao para SignalR:

1. **Excecoes sao desnecessarias** — `context.Fail()` + `return` faz o mesmo trabalho de forma mais limpa
2. **O SignalR nao repassa mensagens de erro** — qualquer mensagem que voce colocar em `AuthorizationFailureReason` ou em uma excecao sera descartada pelo SignalR antes de responder ao cliente
3. **O cliente sempre recebe apenas erro 500** — sem corpo, sem mensagem, sem razao

O instrutor enfatiza que isso nao e um bug — e comportamento intencional do SignalR que existe ha anos e nao ha indicacao de mudanca.

## Diferenca entre handler e filtro MVC

| Aspecto | Filtro MVC | Authorization Handler (Hub) |
|---------|-----------|---------------------------|
| Sem resultado explicito | Fluxo continua | Conexao bloqueada (500) |
| Para bloquear | `context.Result = new UnauthorizedObjectResult(...)` | `context.Fail()` |
| Para permitir | Nao fazer nada | `context.Succeed(requirement)` |
| Mensagem de erro chega ao cliente | Sim | Nao (SignalR descarta) |

## Token expirado — como resolver?

O instrutor menciona um "truquezinho safadinho" no aplicativo cliente: renovar o access token imediatamente antes de iniciar a conexao WebSocket, garantindo que ele nunca chegue expirado ao handler. Isso e necessario porque:
- O handler executa apenas uma vez
- Nao ha como "re-autenticar" uma conexao WebSocket existente
- O SignalR nao informa ao cliente que o motivo da falha foi token expirado

## Fluxo de handshake

Apos a conexao ser aceita pelo handler:
1. Conexao parcial e estabelecida (campos ficam bloqueados no Postman)
2. Cliente deve enviar mensagem de handshake do SignalR (uma unica vez)
3. Apos handshake, `OnConnectedAsync` e executado no hub
4. A partir dai, o cliente pode invocar qualquer funcao do hub sem revalidacao