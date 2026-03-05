# Deep Explanation: Validações em Métodos de Hub SignalR

## Por que extrair validações para Use Cases mesmo quando são simples?

O instrutor apresenta dois motivos concretos para criar Use Cases mesmo com poucas linhas:

1. **Acesso ao ILoggedUser**: O Hub por si só não tem acesso direto ao usuário logado da mesma forma que um Use Case via injeção de dependência. O Use Case recebe o `ILoggedUser` no construtor e pode verificar se quem está invocando o método é realmente o dono do recurso.

2. **Preparação para migração de armazenamento**: O projeto atual usa um dicionário em memória (`ConcurrentDictionary`) para armazenar códigos de conexão. Se no futuro o desenvolvedor decidir usar banco de dados, Redis, ou qualquer outro mecanismo de persistência, ter um Use Case já pronto facilita essa migração — basta alterar a implementação do Use Case sem mexer no Hub.

## Cuidado com o contexto do ILoggedUser em diferentes métodos

O instrutor enfatiza um ponto sutil mas crítico: o significado de "usuário logado" muda conforme o método do Hub:

- **No JoinWithCode**: o `loggedUser` é a pessoa que está **tentando se conectar** (usando o código de outra pessoa)
- **No ConfirmCode/CancelCode**: o `loggedUser` é a pessoa que **gerou o código** (o proprietário)

Se você fizer Ctrl+C/Ctrl+V entre esses métodos, vai confundir os nomes das variáveis e as comparações de IDs. O instrutor sugere usar nomes explícitos como `codeOwner` e `joinerUser` para evitar essa confusão.

## O padrão if ternário para Guid nullable

Quando o `ConnectingUserId` é um `Guid?` (nullable), o instrutor usa um padrão específico:

```csharp
var joinerUser = dto.ConnectingUserId.HasValue
    ? await _userRepository.GetById(dto.ConnectingUserId.Value)
    : null;
```

Isso permite na sequência fazer `if (joinerUser is null)` para validar se alguém realmente se conectou com aquele código. É mais legível do que encadear verificações de `HasValue` com chamadas ao repositório.

## Traduções funcionam automaticamente no Hub

O middleware de cultura (`CultureMiddleware`) que já existia na API também funciona para conexões SignalR sem nenhum código adicional. O header `Accept-Language` (com hífen, não junto como no C#) é lido na conexão inicial do Hub.

Porém, há uma limitação importante: uma vez que a conexão WebSocket é estabelecida, não é possível trocar o idioma. O cliente precisaria desconectar e reconectar com um novo header para mudar a cultura.

## Ordem das validações no Use Case de aceitar conexão

O instrutor segue uma ordem deliberada nas 4 validações:

1. **Propriedade** (mais barato — só compara IDs em memória)
2. **Existência do usuário conectado** (requer ida ao banco — só faz se passou a validação 1)
3. **Auto-conexão** (compara IDs — depende do resultado de 2)
4. **Conexão já existente** (requer query ao banco — só faz se passou 1, 2 e 3)

Essa ordem minimiza chamadas ao banco de dados em cenários de falha.

## String.Format para mensagens com parâmetros

Na validação de "já conectados", o instrutor usa `string.Format` para inserir o nome da pessoa na mensagem:

```csharp
string.Format(ResourceErrorMessages.ALREADY_CONNECTED, joinerUser.Name)
```

O Resource file tem algo como: `"Você já está conectado(a) com {0}."` — o `{0}` é substituído pelo nome do usuário.

## Retorno de string vazia em Use Cases sem dados de resposta

Ao invés de criar um `HubOperationResult` sem tipo genérico (como foi feito no app mobile), o instrutor optou por manter `HubOperationResult<string>` com `string.Empty` como valor de sucesso. A justificativa é que são poucos cenários no Hub e não vale a complexidade adicional de ter duas variantes do tipo.