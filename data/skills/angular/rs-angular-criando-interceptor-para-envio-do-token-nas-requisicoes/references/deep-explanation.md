# Deep Explanation: Interceptor HTTP para Token

## O que e um interceptor

O interceptor e uma funcao que e disparada **antes** da requisicao HTTP acontecer. Ele intercepta a request, pode modifica-la (adicionando headers, por exemplo), e so entao permite que ela siga para o servidor.

## Por que usar interceptor em vez de adicionar token manualmente

O instrutor explica que ao longo da aplicacao, **varias requisicoes** precisam do token de autorizacao. Se toda vez que precisar incluir o token fizer de forma manual, adiciona muito codigo repetido. O interceptor centraliza essa logica em um unico lugar.

## Fluxo completo

1. Um service faz `this.http.get('/api/filmes')`
2. Antes da request sair, o interceptor e executado
3. O interceptor verifica se existe token no localStorage (via `UserTokenStore`)
4. Se existe: clona a request adicionando header `Authorization: Bearer {token}`
5. Se nao existe: deixa a request seguir como esta
6. O `next()` dispara a request para o servidor

## Por que clonar a request

Requests HTTP no Angular sao **imutaveis por design**. O metodo `clone()` cria uma copia com as modificacoes desejadas. Isso e importante porque:
- Multiplos interceptors podem estar encadeados
- Cada um recebe a request do anterior
- Mutar diretamente causaria efeitos colaterais

## Requests que nao precisam de token

O instrutor destaca um ponto importante: requisicoes de **cadastro** e **login** nao tem token — o usuario ainda nao fez login. O backend sabe lidar com isso:
- Endpoints que nao exigem token aceitam a request normalmente
- Endpoints que exigem token verificam o header Authorization
- Se nao tiver token e o endpoint exige, o backend rejeita

## Onde colocar o interceptor

O instrutor classifica interceptors como funcoes **core** da aplicacao — sao essenciais para o funcionamento correto. Por isso ficam em `core/interceptors/`.

## Registro obrigatorio

Criar o arquivo do interceptor **nao e suficiente**. E necessario registra-lo no `app.config.ts` usando `provideHttpClient(withInterceptors([...]))`. Sem isso, o Angular nao sabe que o interceptor existe.

## Padrao Bearer Token

O header segue o padrao HTTP: `Authorization: Bearer {token}`. Esse e o formato padrao para JWT (JSON Web Tokens) usado pela maioria das APIs REST.