# Deep Explanation: Implementacao do Refresh Token

## Por que o refresh token existe

O JWT de acesso tem vida curta (ex: 10 minutos) por seguranca — se vazar, o dano e limitado no tempo. Mas o usuario nao quer fazer login a cada 10 minutos. O refresh token resolve isso: ele tem vida longa (ex: 7 dias), fica armazenado em cookie HttpOnly (inacessivel via JavaScript, protegido contra XSS), e serve apenas para gerar novos tokens de acesso.

## O fluxo completo

1. Usuario faz login → recebe JWT (body) + refresh token (cookie)
2. Frontend usa JWT no header Authorization para cada request
3. JWT expira (10 min) → backend retorna 401
4. Frontend detecta 401 → chama PATCH /token/refresh (sem header Authorization)
5. Backend le refresh token do cookie → valida → gera novo JWT + novo refresh token
6. Frontend recebe novo JWT → continua operando normalmente
7. Se refresh token tambem expirou → usuario precisa fazer login novamente

## Por que PATCH e nao POST

O instrutor explica que PATCH e semanticamente mais adequado porque estamos **atualizando** um recurso existente (o token), nao criando um recurso novo. E uma atualizacao de informacao unica. Porem, ele ressalta que POST tambem seria aceitavel — nao existe apenas um certo e um errado nesse caso.

## Por que `onlyCookie: true`

O metodo `request.jwtVerify()` por padrao olha para o header `Authorization: Bearer <token>`. Mas na rota de refresh, o token do header ja expirou — e justamente por isso o frontend esta chamando essa rota. O parametro `onlyCookie: true` instrui o Fastify a ignorar o header e validar apenas o token que esta nos cookies da requisicao.

Se o `jwtVerify` com `onlyCookie` passar sem erro, significa que:
- O refresh token existe nos cookies
- Ele e um JWT valido (assinatura correta)
- Ele ainda nao expirou

## Por que nao bate no banco de dados

A validacao e puramente criptografica (JWT). Isso torna a rota extremamente rapida e leve. O instrutor menciona que uma estrategia futura seria **salvar o refresh token no banco de dados** — isso permitiria invalidar o login de um usuario especifico a qualquer momento, bastando marcar o registro do refresh token como invalido no banco.

## Rotacao de tokens

A cada chamada de refresh, **ambos** os tokens sao regenerados:
- Novo JWT de acesso (mais 10 minutos)
- Novo refresh token como cookie (mais 7 dias)

Isso cria uma janela deslizante — enquanto o usuario estiver ativo, ele nunca perde o login. Apenas se ficar 7 dias sem usar a aplicacao o refresh token expira.

## A rota pode ser chamada infinitamente

O instrutor demonstra que a rota de refresh pode ser chamada quantas vezes quiser — sempre gera tokens atualizados. Como nao acessa banco de dados, e muito rapida e nao consome recursos significativos.

## Sobre o teste E2E

O teste segue o padrao: criar usuario → fazer login → capturar cookies → chamar refresh → validar resposta. O ponto chave e usar `getSetCookie` (ou `get('Set-Cookie')`) para capturar os cookies da resposta de autenticacao e envia-los na chamada de refresh. A validacao verifica:
1. Status 200
2. Novo token no body
3. Novo refresh token no cookie (string contendo `refreshToken=`)