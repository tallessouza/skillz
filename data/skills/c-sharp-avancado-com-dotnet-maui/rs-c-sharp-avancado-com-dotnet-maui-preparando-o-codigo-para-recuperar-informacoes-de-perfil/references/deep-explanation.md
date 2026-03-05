# Deep Explanation: Inicializacao Async de ViewModels

## Por que NUNCA async em construtores

O instrutor (Wellison) e enfatico: mesmo que voce encontre artigos na internet mostrando workarounds para chamadas assincronas em construtores, **esta errado**. Os problemas incluem:

- **Performance degradada** — bloqueia a thread principal esperando a task completar
- **Travamento do app** — deadlock quando o contexto de sincronizacao tenta retomar na mesma thread bloqueada
- **Comportamento imprevisivel** — o objeto pode ser usado antes da inicializacao async terminar

A solucao correta e simples: extrair para um metodo `public async Task Initialize()` que pode ser chamado de forma async normalmente.

## OnAppearing: quando exatamente executa

O `OnAppearing` e um metodo virtual da `ContentPage` que executa **uma vez** cada vez que a pagina fica visivel. Dois cenarios:

1. **Primeira abertura** — usuario navega para a pagina, ela aparece, `OnAppearing` dispara
2. **Retorno da pilha** — a pagina estava embaixo de outra na pilha de navegacao. Quando a pagina de cima e removida (botao voltar, pop), a pagina debaixo fica visivel novamente e `OnAppearing` dispara de novo

Isso cria um **refresh automatico e transparente**: dados sao recarregados sem que o usuario precise fazer nada.

### Sistema de pilha do .NET MAUI

```
[Pagina C]  ← visivel (OnAppearing executou)
[Pagina B]  ← escondida
[Pagina A]  ← escondida

Usuario clica "voltar":

[Pagina B]  ← visivel novamente (OnAppearing executa DE NOVO)
[Pagina A]  ← escondida
```

## O padrao Result com generics

O Use Case retorna `Result<Models.User>`, nao `Models.User` diretamente. Isso significa:

- `result.IsSuccess` — indica se a operacao deu certo
- `result.Response` — propriedade generica (TResponse), so tem valor quando `IsSuccess == true`
- `result.Response!` — o `!` (null-forgiving operator) diz ao compilador "eu sei que nao e nulo aqui"

O compilador sabe o tipo concreto de `Response` porque foi especificado via generics: `Result<Models.User>` faz `TResponse = Models.User`.

## Importancia da consistencia de nomenclatura

O instrutor percebeu que `GetProfileUseCase` quebrava o padrao estabelecido (`RegisterUserUseCase` = Verbo + Entidade + UseCase). A correcao:

- `GetProfileUseCase` → `GetUserProfileUseCase`
- `IGetProfileUseCase` → `IGetUserProfileUseCase`

O Visual Studio propaga o rename automaticamente para todas as referencias (interface, classe, injecao de dependencia). Sempre use o rename da IDE, nao renomeie manualmente.

## Checklist ao renomear via IDE

1. Botao direito no arquivo → Rename
2. Visual Studio pergunta se quer renomear a classe tambem → **Yes**
3. Faca o mesmo para a interface
4. Verifique se campos privados com underscore tambem foram atualizados (ex: `_getUserProfile` → `_getUserProfileUseCase`)