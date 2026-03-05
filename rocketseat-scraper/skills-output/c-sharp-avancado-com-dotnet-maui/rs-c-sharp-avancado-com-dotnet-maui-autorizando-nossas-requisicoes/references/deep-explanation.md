# Deep Explanation: Autorizando Requisicoes com DelegatingHandler

## Por que NAO usar o atributo Authorize do Refit

O Refit oferece o atributo `[Authorize("Bearer")]` como parametro em metodos da interface. Funciona, mas tem consequencias:

1. **Poluicao dos use cases** — cada use case que chama a API precisa receber `ITokenStorage` como dependencia, recuperar o token, e passa-lo como parametro. Isso espalha responsabilidade de autenticacao por toda a camada de dominio.

2. **Repetitividade** — toda funcao na interface Refit precisa do parametro adicional. Em um app com 20+ endpoints autenticados, sao 20+ parametros repetidos.

3. **Impossibilita refresh token transparente** — quando o access token expirar, cada use case precisaria lidar com a logica de retry. No handler, isso fica centralizado.

## O padrao DelegatingHandler

O `DelegatingHandler` e um conceito do `HttpClient` do .NET que permite interceptar requisicoes HTTP antes de serem enviadas. E o equivalente a um middleware/interceptor.

O instrutor faz uma analogia com o handler de cultura que ja existia no app (`PlainShareHandler`) — que injeta o idioma preferido em toda requisicao. A logica e identica: antes de disparar a chamada, adicione informacao ao header.

## Fluxo completo de uma requisicao

```
UseCase.Execute()
    → IUserAPI.GetProfile()        // Interface Refit (limpa)
        → DelegatingHandler         // Intercepta ANTES de enviar
            → Verifica token existe?
                → SIM: adiciona Authorization: Bearer {token}
                → NAO: envia sem header (endpoints publicos)
            → Envia requisicao HTTP
                → API recebe
                    → Filtro AuthenticateUserAttributes
                        → Extrai token do header
                        → Valida JWT (expirado? gerado pela API?)
                        → Extrai ID do usuario
                        → Verifica se existe no banco
                    → Executa endpoint
```

## Por que validar com IsNullOrWhiteSpace

Na primeira utilizacao do app, o usuario ainda nao fez login nem registro. Nesse momento:
- O `ITokenStorage.Get()` retorna um objeto com `AccessToken` como string vazia ou nula
- Se injetarmos um header `Authorization: Bearer ` (vazio), a API pode rejeitar com erro inesperado
- A validacao garante que so adicionamos o header quando ha um token real

Os unicos endpoints que funcionam sem token sao login e registro — que sao "publicos" na API.

## Spoiler: refresh token futuro

O instrutor menciona que futuramente o handler tambem vai lidar com refresh token:
1. Faz a chamada com access token
2. Se receber 401 (token expirado), usa refresh token para obter novo access token
3. Repete a chamada original com o novo token
4. Tudo transparente para o use case e para o usuario

Isso so e possivel porque a logica esta centralizada no handler.

## O filtro AuthenticateUserAttributes na API

Na API (backend), o endpoint `GET /users` tem o atributo `[AuthenticatedUser]`. Esse filtro:
1. Extrai o token do header `Authorization`
2. Remove o prefixo "Bearer " para obter o JWT puro
3. Valida o JWT (assinatura, expiracao)
4. Extrai o ID do usuario do token
5. Verifica se o usuario existe e esta ativo no banco
6. So entao permite a execucao do endpoint