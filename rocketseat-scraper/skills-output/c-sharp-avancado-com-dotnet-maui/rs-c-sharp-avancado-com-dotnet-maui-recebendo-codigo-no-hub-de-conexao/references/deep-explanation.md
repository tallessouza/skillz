# Deep Explanation: Hub de Conexao com Codigos

## Por que separar Use Case do Hub

O instrutor enfatiza: "Eu nao quero que o meu Hub acesse banco de dados." Mesmo que o Use Case pareca simples agora (apenas buscar usuario logado), ele sera expandido para validar se duas pessoas ja estao conectadas, evitando duplicatas. O Hub deve apenas orquestrar o fluxo de conexao SignalR.

## TryGetValue e a palavra-chave `out`

### Como funciona
`TryGetValue` retorna **dois valores**:
1. **Booleano** (return normal) — `true` se a chave existe, `false` se nao
2. **O valor associado** (via parametro `out`) — preenchido dentro da funcao

### A palavra `out` em C#
`out` e uma palavra reservada que indica parametro de saida. A funcao e **obrigada** a preencher esse parametro antes de retornar. O codigo nao compila se voce marcar um parametro como `out` e nao atribuir valor a ele.

### Exemplo didatico do instrutor
```csharp
// Sem out — parametro normal de entrada
public bool Teste(string nome) { return true; }

// Com out — obrigatorio preencher antes de retornar
public bool Teste(out string nome)
{
    nome = "Ellison"; // obrigatorio
    return true;
}
```

### Opiniao do instrutor
"Na vida real, eu confesso que eu particularmente nao gosto muito disso. Eu acho uma sintaxe muito estranha — voce passa como parametro uma coisa para ter um retorno." Ele recomenda conhecer porque cai em entrevistas, mas pessoalmente evita criar funcoes com `out`.

### Simplificacao com `out var`
Em vez de:
```csharp
UserConnectionsDto userConnection;
_connections.TryGetValue(code, out userConnection);
```
Use:
```csharp
_connections.TryGetValue(code, out var userConnection);
```
Economiza uma linha e declara a variavel inline.

## Referencia vs Copia: Classe vs Record

Ponto critico da aula: quando `GetConnectionByCode` retorna um objeto, o que voce recebe depende do tipo:

- **Classe** → retorna **referencia** ao objeto original no dicionario. Alteracoes no objeto retornado refletem no dicionario.
- **Record** → retorna **copia**. Alteracoes nao refletem no original.

Por isso o DTO `UserConnectionsDto` e uma **classe**, nao um record. O Hub preenche `ConnectingUserId` e `ConnectingUserConnectionId` diretamente, e essas alteracoes se propagam para o objeto dentro do dicionario `_connections`.

## Nomenclatura: Connecting vs Connected

O instrutor corrigiu um erro proprio: havia nomeado como `ConnectedUserId`, mas a conexao ainda nao foi aprovada. O correto e `ConnectingUserId` — a pessoa esta **no processo de conectar**, nao esta conectada ainda. A aprovacao vem em etapa posterior.

## Fluxo completo da conexao

1. **Pessoa 1** chama `GenerateCode` → recebe codigo, dados armazenados no dicionario Singleton
2. **Pessoa 2** chama `JoinWithCodes(codigo)` → busca dados do dicionario, chama Use Case, preenche IDs
3. **Proximo passo** (proxima aula): retornar para Pessoa 1 as informacoes de Pessoa 2 para aprovacao/recusa

## Nullable return type (`?`)

O `?` em `UserConnectionsDto?` e uma forma de avisar: "esse valor pode ser nulo." Se o codigo informado nao existe no dicionario, `TryGetValue` preenche o `out` como `null` sem lancar excecao. O chamador deve tratar esse cenario.