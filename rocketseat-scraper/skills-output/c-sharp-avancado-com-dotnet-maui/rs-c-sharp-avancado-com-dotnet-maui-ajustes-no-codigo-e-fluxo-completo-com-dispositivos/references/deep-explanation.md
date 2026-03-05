# Deep Explanation: MainThread e Navegação em Callbacks Real-Time

## Por que callbacks de hub não atualizam a UI?

No .NET MAUI, apenas a **thread principal** (UI thread) tem permissão para alterar elementos visuais — navegação, exibir alertas, modificar bindings visuais. Quando o SignalR recebe uma mensagem do servidor, ele executa o callback em uma **thread secundária** do thread pool.

O resultado visível desse problema é sutil e enganoso: o código executa sem exceção, mas **nada acontece na tela**. O loading continua girando, a página não fecha, o feedback não aparece. Parece que o app travou, mas na verdade a operação foi executada em uma thread que não tem acesso ao visual.

### A solução: MainThread.BeginInvokeOnMainThread

`MainThread` é uma classe do .NET MAUI que agenda a execução de um delegate na thread principal. O método `BeginInvokeOnMainThread` aceita uma `Action` (função anônima) e garante que todo o código dentro dela será executado na UI thread.

Padrão:
```csharp
MainThread.BeginInvokeOnMainThread(() =>
{
    // Tudo aqui executa na thread principal
});
```

Para código assíncrono dentro:
```csharp
MainThread.BeginInvokeOnMainThread(async () =>
{
    await AlgumaOperacaoAsync();
});
```

### Quando NÃO precisa

Commands (ICommand, RelayCommand, AsyncRelayCommand) do .NET MAUI **já executam na thread principal** automaticamente. Então em funções ligadas a botões via Command binding, não é necessário envolver em MainThread.

A regra é simples: **se o código é disparado por interação do usuário (tap, click) via Command → não precisa. Se é disparado por evento externo (hub, timer, push notification) → precisa.**

## Navegação com sintaxe ../

No Shell Navigation do .NET MAUI, a rota `"../NovaPagina"` tem um significado especial: **remove a página atual da stack de navegação e empurra a nova página**. É o equivalente a fazer Pop + Push em uma única operação atômica.

Sem isso, o instrutor mostrou o bug: a página do hub fechava, mas por baixo ficava a página anterior (de geração de código), que não era o destino desejado. Usando `"../"` antes da rota, a página atual é descartada antes da navegação.

## Tratamento condicional de erros

O instrutor demonstrou um padrão importante: nem todo erro deve fechar o fluxo. Quando o resultado da API traz um `ErrorCode` específico como `"INVALID_CODE"`, o app deve **permitir que o usuário tente novamente**, navegando de volta à página de input do código. Apenas erros irrecuperáveis (conexão perdida, erro de servidor) devem fechar completamente o fluxo.

Esse padrão de **erro recuperável vs. fatal** determina a navegação:
- Recuperável → `"../PaginaDeInput"` (volta para tentar de novo)
- Fatal → `ClosePage()` + feedback de erro

## Idioma nas mensagens do Hub

O SignalR Hub no servidor pode retornar mensagens localizadas, mas **precisa saber o idioma do cliente**. Se nenhum idioma for enviado na conexão, o hub usa o default (inglês). A solução é adicionar o header `Accept-Language` com o idioma do dispositivo nas opções de conexão do HubConnectionBuilder.