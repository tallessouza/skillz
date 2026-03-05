# Deep Explanation: Armazenamento e DI no .NET MAUI

## Por que Singleton para Storage?

O instrutor escolhe `AddSingleton` explicitamente porque as classes de storage (`UserStorage` e `TokensStorage`) nao possuem estado mutavel que cause problemas de concorrencia. Elas sao wrappers finos sobre `Preferences` e `SecureStorage` do MAUI, que ja gerenciam seu proprio estado internamente. Recriar instancias a cada injecao (Transient) seria desperdicio sem beneficio.

## Extension Methods para Organizacao

O padrao de criar `AddStorage()` como extension method de `MauiAppBuilder` segue a convencao do proprio .NET (`AddAuthentication()`, `AddDbContext()`, etc.). Isso mantem o `MauiProgram.cs` limpo e agrupa registros por dominio. O instrutor enfatiza: **nao esqueca de chamar o extension method** — e um erro silencioso que resulta em `NullReferenceException` em runtime quando o DI tenta resolver a dependencia.

## Duplicacao Intencional entre Login e Registro

O instrutor reconhece abertamente que o codigo de armazenamento e duplicado entre `LoginUseCase` e `RegisterAccountUseCase`. Ele justifica: sao casos de uso distintos com fluxos independentes. Ambos precisam armazenar user e tokens apos sucesso da API porque ambos redirecionam para o Dashboard. Extrair isso para uma classe compartilhada criaria acoplamento desnecessario entre dois fluxos que podem evoluir independentemente.

## Records Intermediarios

Em vez de passar `response.Tokens.AccessToken` diretamente para o storage, o instrutor cria records (`Models.ValueObjects.User`, `Models.ValueObjects.Tokens`) intermediarios. Isso:
- Desacopla o formato da API do formato de armazenamento
- Torna o codigo mais legivel com variaveis nomeadas
- Facilita debugging (breakpoint mostra valores estruturados)

## Padronizacao de Nomenclatura

O instrutor faz um refactor durante a aula para padronizar:
- Parametros de use case sempre chamados `model` (nao `user`, `request`, etc.)
- Isso cria consistencia entre todos os use cases do projeto

## Peculiaridade: iOS vs Android

O codigo apresentado funciona perfeitamente no Android. O instrutor avisa que no **simulador iOS** o `SecureStorage` vai falhar — e necessaria configuracao adicional (Entitlements/Keychain). No dispositivo fisico iOS funciona normalmente. Essa e uma armadilha comum do MAUI.

## Bug do Visual Studio

O instrutor encontra um bug visual do Visual Studio durante debugging: ao passar o mouse sobre a variavel `Id`, o debugger mostra "Bruce" (o nome). No Immediate Window, o valor correto aparece. Isso e um glitch conhecido do VS — nao afeta a execucao.

## Caminho Feliz

Todo o codigo desta aula considera apenas o caminho feliz (sucesso da API). O tratamento de erros (API retornando erro, dados invalidos) sera implementado em aulas futuras. O instrutor deixa isso explicito para nao confundir.