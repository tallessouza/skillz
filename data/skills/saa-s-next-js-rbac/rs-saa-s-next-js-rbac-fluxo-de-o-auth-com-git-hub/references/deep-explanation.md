# Deep Explanation: Fluxo de OAuth com GitHub

## Por que o callback vai para o front-end e nao para o back-end?

O instrutor explica uma decisao arquitetural importante: quando o callback do OAuth redireciona para o back-end, este back-end passa a ter responsabilidade sobre um fluxo especifico de um cliente especifico (a aplicacao web). Isso acopla o back-end a um front-end particular.

Redirecionando para o front-end:
1. O usuario clica em "Login com GitHub" e e redirecionado para o GitHub
2. Apos autorizar, volta rapidamente para o front-end
3. O front-end mostra um loading ("Estamos criando sua conta...")
4. O front-end chama o back-end enviando o `code`
5. O back-end troca o code por token, busca dados, cria usuario

Assim o front-end controla toda a UX do fluxo que e especifico para web. Se no futuro houver um app mobile, o back-end nao precisa mudar — apenas o mobile implementa seu proprio fluxo de callback.

## Por que a troca code → token deve ser no back-end?

Dois motivos:

1. **Banco de dados** — O back-end precisa salvar/atualizar o usuario no banco. Somente ele tem acesso.

2. **Client Secret** — A requisicao de troca exige o `client_secret`. Esse segredo nunca pode ser exposto no front-end. Se vazar, qualquer pessoa tem acesso a aplicacao no GitHub.

## O que e o `code`?

O `code` que vem nos search params apos o redirect nao e um JWT, nao e um ID, e um codigo aleatorio temporario gerado pelo GitHub. Ele serve apenas para ser trocado por um `access_token` em uma unica requisicao. E de uso unico e expira rapidamente.

## O que e o `access_token`?

Apos a troca, o `access_token` funciona como um Bearer token para acessar a API do GitHub em nome do usuario que fez login. Com ele, a aplicacao pode chamar `GET https://api.github.com/user` e obter nome, email, avatar, etc.

## Escopos (Scopes)

Os escopos definem quais permissoes a aplicacao solicita do usuario. O GitHub tem dezenas de escopos (repos, gists, admin, etc.), mas para login social, o escopo `user` e suficiente — ele permite acessar os dados do perfil publico do usuario.

## Fluxo completo em diagrama

```
[Usuario] → Clica "Login com GitHub"
    ↓
[Front-end] → Redireciona para github.com/login/oauth/authorize?client_id=X&redirect_uri=Y&scope=user
    ↓
[GitHub] → Usuario autoriza → Redireciona para Y?code=XXXXX
    ↓
[Front-end] → Recebe code → Mostra loading → POST /api/auth/github { code }
    ↓
[Back-end] → POST github.com/login/oauth/access_token { client_id, client_secret, code }
    ↓
[GitHub] → Retorna { access_token }
    ↓
[Back-end] → GET api.github.com/user (Authorization: Bearer access_token)
    ↓
[GitHub] → Retorna { email, name, avatar_url, ... }
    ↓
[Back-end] → Cria/atualiza usuario no banco → Gera JWT proprio → Retorna token
    ↓
[Front-end] → Salva token → Redireciona para dashboard
```