# Deep Explanation: Integração Refit GetProfile

## Por que ApiResponse e não o tipo direto?

O instrutor enfatiza o uso de `ApiResponse<T>` do Refit como wrapper porque ele encapsula toda a resposta HTTP — não apenas o body deserializado. Isso permite:
- Verificar `IsSuccessStatusCode` antes de processar
- Acessar o status code real para tratamento granular
- Usar a extension `GetResponseError()` já criada no projeto para extrair mensagens de erro

Se usasse `Task<T>` direto, qualquer erro HTTP viraria uma exceção não tratada.

## O padrão UseCase como camada de isolamento

O projeto segue uma arquitetura onde ViewModels nunca acessam APIs diretamente. O fluxo é:

```
ViewModel → UseCase → Refit Interface → HTTP → API
```

Cada UseCase:
1. Recebe dependências via construtor (injeção de dependência)
2. Tem uma função `Execute()` que orquestra a operação
3. Retorna um `Result` que indica sucesso ou erro
4. É registrado como `Transient` no DI container

## A armadilha dos usings no Visual Studio

O instrutor alerta especificamente sobre `Result` — é um nome comum que existe em múltiplos namespaces:
- `Android.App.Result`
- `Android.Database.Graphics.Result`
- `PlanShare.App.Models.ValueObjects.Result` (o correto)

O Visual Studio pode sugerir o using errado. Sempre verifique manualmente quando o IntelliSense não sugere o namespace esperado.

## Propriedade private readonly com underscore

O padrão adotado no projeto: campos privados readonly usam prefixo `_` (underscore). Isso diferencia visualmente campos de instância de parâmetros locais:

```csharp
private readonly IUserApi _userApi;  // campo

public GetProfileUseCase(IUserApi userApi)  // parâmetro
{
    _userApi = userApi;  // atribuição clara
}
```

## O que ficou pendente (spoilers do instrutor)

1. **Result genérico**: O `Result` atual não consegue devolver dados junto com o sucesso. Será necessário criar `Result<T>` para que o UseCase devolva o model (nome, email) quando a API responder com sucesso.

2. **Token de autenticação**: O endpoint `GET /users` precisa do token JWT para identificar o usuário logado. O Refit precisará de configuração adicional para enviar o token no header Authorization.

## Correção feita durante a aula

O instrutor corrigiu um erro no backend: o `ProducesResponseType` do endpoint GetProfile estava referenciando `ResponseHashtagUserJson` quando deveria ser `ResponseUserProfileJson`. Erro causado por copy-paste sem revisão.

## Por que o MauiProgram não precisa de alteração para o Refit?

A configuração do Refit com `IUserApi` já foi feita anteriormente. Como o Refit gera a implementação baseado na interface, adicionar novas funções à interface não requer reconfiguração — basta adicionar os métodos com os atributos corretos.