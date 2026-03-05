# Deep Explanation: Guard para Rotas Autenticadas

## Por que o Guard funcional e nao class-based?

O Angular moderno favorece guards funcionais (`CanActivateFn`) em vez de classes com `@Injectable`. A funcao e mais simples, mais composivel e alinha com a tendencia do Angular de usar funcoes standalone.

## O tipo de retorno MaybeAsync<GuardResult>

O retorno do guard aceita multiplos tipos:
- **boolean** — `true` permite acesso, `false` bloqueia
- **URLTree** — redireciona para outra rota (criado via `router.createUrlTree()`)
- **Observable<boolean | URLTree>** — Angular se inscreve automaticamente
- **Promise<boolean | URLTree>** — Angular resolve automaticamente

Isso e o que o tipo `MaybeAsync<GuardResult>` representa. `MaybeAsync` significa que pode ser sincrono ou assincrono (Observable ou Promise). `GuardResult` e `boolean | URLTree | RedirectCommand`.

## Fluxo completo de autenticacao

O guard nao funciona sozinho. Ele faz parte de um fluxo:

1. **TokenStore** — Service que gerencia token no localStorage (hasToken, getToken, removeToken)
2. **Interceptor** — Adiciona o token no header Authorization de toda requisicao HTTP
3. **Guard** — Verifica se o token existe e se e valido via API
4. **API ValidateToken** — Endpoint que retorna sucesso ou erro baseado no token

Quando o guard chama `userApi.validateToken()`, o interceptor automaticamente inclui o token no header. Se a API retorna sucesso, o guard permite o acesso. Se retorna erro (401), o guard limpa o token e redireciona.

## Por que verificar hasToken ANTES de chamar a API?

Otimizacao simples: se nao ha token nenhum no localStorage, nao faz sentido fazer uma requisicao HTTP que vai falhar. Redirecionamos imediatamente, economizando uma chamada de rede.

## Por que usar createUrlTree em vez de router.navigate?

`router.navigate()` e imperativo — ele executa a navegacao como efeito colateral. `createUrlTree()` retorna um objeto URLTree que o Angular interpreta declarativamente. Quando o guard retorna URLTree, o Angular gerencia o redirect dentro do seu ciclo de routing, o que e mais previsivel e testavel.

## RxJS no guard: map + catchError

- **map** — So executa se o Observable emitir valor de sucesso. No caso do `validateToken()`, se a API retorna 200. Retornamos `true` para liberar a rota.
- **catchError** — Executa se o Observable emitir erro (ex: 401 Unauthorized). Limpamos o token e retornamos `of(loginRoute)` — um novo Observable que emite o URLTree de redirect.

A funcao `of()` do RxJS cria um Observable que emite um unico valor e completa. Precisamos dela porque `catchError` deve retornar um Observable.

## Analogia do instrutor

O guard funciona como um seguranca na porta: antes de deixar voce entrar, ele verifica se voce tem credencial (token existe?) e se a credencial e valida (API confirma?). Se nao tem credencial, nem perde tempo verificando — ja redireciona. Se tem mas e falsa, confisca (remove do storage) e redireciona.

## Cenarios de teste demonstrados

1. **Token valido** — Acessar /create, /favorites, /explore, /details/1 — todos funcionam normalmente
2. **Token invalido** — Colocar "test" no localStorage — API rejeita, guard redireciona para /auth/login e limpa o token
3. **Sem token** — localStorage vazio — guard redireciona imediatamente sem fazer requisicao HTTP