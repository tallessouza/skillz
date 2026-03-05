# Deep Explanation: Refresh Token Error Handling em .NET MAUI

## Por que a navegacao nao mata a execucao

Este e o insight mais importante da aula. Quando voce chama `GoToOnboardingPage()`, a intuicao diz que todas as ViewModels, UseCases e execucoes em andamento deveriam morrer. **Isso nao acontece.**

O fluxo de execucao continua normalmente apos a navegacao. O codigo percorre cada linha ate encontrar um `return` ou o final da funcao. So depois que a funcao termina que o MAUI remove da memoria a ViewModel anterior e efetiva a pagina de onboarding.

Na pratica, o que acontece:
1. O handler detecta falha no refresh token
2. Navega para onboarding
3. **Mas o fluxo continua** — retorna o `response` da primeira requisicao (com token expirado)
4. O UseCase de GetUserProfile recebe esse response com erro
5. A ViewModel de UserProfile processa o erro e mostra a error page
6. So ai o MAUI remove a ViewModel antiga e coloca onboarding por baixo
7. Resultado: usuario ve a error page por cima do onboarding

## O problema da persistencia de sessao

O AppShell decide a pagina inicial com `isLoggedIn`, que verifica se existe um ID no local storage. Se voce nao limpar o storage apos falha de refresh, o usuario reabra o app e vai direto para o dashboard — onde todas as requisicoes vao falhar novamente.

A solucao e tratar a falha de refresh como um "logout forcado": limpar `userStorage` e `tokensStorage`. Isso garante que `isLoggedIn` retorna falso e o AppShell mostra onboarding na proxima abertura.

## Por que centralizar a supressao de erro

O instrutor enfatiza a importancia de ter "codigo bem organizado, compartilhado, pra gente nao gerar duplicidade." A funcao `GoToPageWithErrors` e chamada por todas as ViewModels. Ao colocar o `if (results.Messages.Contains("Token expired"))` nessa funcao unica, voce resolve o problema para **todas** as paginas de uma vez, sem precisar adicionar tratamento em cada ViewModel individual.

## Fluxo completo do cenario de erro

```
1. App abre → dashboard (storage tem dados)
2. Requisicao para /users → 401 Unauthorized (token expirado)
3. Handler intercepta → tenta refresh token
4. API rejeita refresh token → falha
5. Handler limpa storage + navega para onboarding
6. MAS: execucao continua → retorna response original com erro
7. UseCase processa → erro "Token expired"
8. ViewModel chama GoToPageWithErrors
9. GoToPageWithErrors ve "Token expired" → return (suprime)
10. Error page NAO aparece
11. Onboarding aparece corretamente
12. Proximo app open → isLoggedIn = false → onboarding direto
```

## Estrategia de teste

Para simular falha de refresh token sem alterar codigo:
1. Deixe o app armazenar tokens normalmente
2. Va ao banco de dados e delete o registro do refresh token
3. Aguarde o access token expirar (ou force expiracao)
4. O app vai tentar usar o refresh token, a API rejeita, e o fluxo de erro e acionado