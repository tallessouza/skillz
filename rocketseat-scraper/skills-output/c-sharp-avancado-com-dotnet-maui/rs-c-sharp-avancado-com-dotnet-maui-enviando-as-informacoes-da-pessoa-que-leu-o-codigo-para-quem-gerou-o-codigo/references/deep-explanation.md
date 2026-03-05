# Deep Explanation: Envio de Mensagens no SignalR Hub

## Como funciona o SendAsync

O `SendAsync` e o metodo principal para enviar mensagens de volta aos clientes conectados no Hub. Ele recebe:

1. **Primeiro parametro (obrigatorio):** o nome do metodo que sera executado no cliente. Esse nome precisa corresponder exatamente ao metodo registrado no cliente (ex: frontend JavaScript ou app mobile).
2. **Parametros adicionais (opcionais):** argumentos que serao passados para o metodo do cliente. Podem ser strings, numeros, objetos — qualquer coisa serializavel.

```csharp
await Clients.All.SendAsync("teste", "Wellison", 7);
// No cliente: metodo "teste" sera chamado com ("Wellison", 7)
```

## Propriedade Clients do Hub

O Hub ja fornece a propriedade `Clients` automaticamente. Nao precisa injetar nada. Atraves dela voce acessa:

- **`Clients.All`** — todas as conexoes ativas naquele instante
- **`Clients.Caller`** — a conexao que invocou o metodo atual
- **`Clients.Client(connectionId)`** — uma conexao especifica pelo ID
- **`Clients.Clients(listOfIds)`** — varias conexoes por uma lista de IDs

## Mensagens NAO sao retroativas

Ponto critico enfatizado pelo instrutor: apenas quem esta conectado NO MOMENTO do envio recebe a mensagem. Se alguem se conectar depois, nao recebera mensagens anteriores. Nao existe replay automatico — isso precisaria ser implementado separadamente se necessario.

## Por que criar um Response DTO separado

O instrutor explica que ja existia um DTO (`ConnectingUserDTO`) com Name, ProfileImageUrl e tambem o ID do usuario. Porem, expor o ID interno de outro usuario para o cliente (app, site) e um risco de seguranca. A solucao foi criar `ResponseConnectingUserJson` apenas com Name e ProfileImageUrl.

> "O ID da propria pessoa, tudo bem, mas o ID de outra pessoa, no banco de dados, nao quero fazer isso."

## Connection IDs sao unicos e efemeros

Cada vez que um usuario se conecta ao Hub, um novo Connection ID e gerado. Mesmo que o mesmo usuario se conecte multiplas vezes, cada conexao tera um ID diferente. Por isso o sistema armazena o Connection ID junto com as informacoes do usuario em um dicionario.

## Referencia por objeto (dicionario)

O instrutor destaca que o `UserConnections` armazenado no dicionario e uma referencia (classe, nao struct). Quando voce modifica o objeto, a alteracao reflete diretamente no dicionario sem precisar reatribuir. Isso simplifica o codigo de atualizacao.

## Teste pratico com Postman

Para testar WebSockets com Postman:
1. Criar uma tab de WebSocket para cada usuario
2. Configurar o header com o token de autenticacao de cada usuario
3. Conectar cada tab ao Hub
4. Enviar a mensagem de handshake manualmente (necessaria para SignalR)
5. Disparar mensagens e observar quem recebe em cada tab

O instrutor usou 3 usuarios (Ellison, Edeline, William) para demonstrar que `Clients.All` envia para todos, `Clients.Caller` so para quem chamou, e `Clients.Client(id)` para um especifico.