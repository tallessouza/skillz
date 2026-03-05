# Deep Explanation: Autenticacao com BetterAuth

## Como o BetterAuth funciona no backend

O BetterAuth integra com o Drizzle ORM e o banco de dados da aplicacao. Ele cria automaticamente uma serie de rotas quando configurado:

```typescript
// No backend: todas as rotas POST e GET com /auth/* sao delegadas ao BetterAuth
app.on(['POST', 'GET'], '/auth/*', betterAuthHandler)
```

Isso significa que voce nao precisa criar rotas de autenticacao manualmente — o BetterAuth lida com tudo: criacao de sessao, validacao de token, OAuth flow, etc.

### Tabelas do banco de dados

O BetterAuth requer 4 tabelas no schema:

1. **users** — dados basicos do usuario (nome, email, imagem)
2. **sessions** — sessoes ativas quando o usuario faz login (cada device/browser = 1 sessao)
3. **accounts** — providers de login (GitHub, Google, email/senha). Um usuario pode ter multiplos accounts
4. **verifications** — sistema automatizado de verificacao de email (opcional, nao usado neste projeto)

### Middleware de autenticacao

No backend, o instrutor usa um hook `requireAuth` que:
1. Busca a sessao do usuario a partir do cookie
2. Se nao existir, retorna 401 Unauthorized
3. Se existir, disponibiliza `user` para a rota

```typescript
// Exemplo: rota de criar comentario exige auth
app.use('/comments', requireAuth)
// Dentro da rota, user esta garantido
```

## Por que separar auth client do server auth

O BetterAuth tem dois modulos distintos:
- `better-auth` — configuracao server-side (banco, providers, segredos)
- `better-auth/react` — client-side hooks e funcoes (useSession, signIn, signOut)

Misturar os dois no mesmo arquivo causa problemas de bundle — o server-side nao pode ser importado no browser.

## Como funciona o flow de login social

1. Usuario clica no botao → `signIn.social({ provider: 'github' })`
2. BetterAuth client redireciona para GitHub OAuth
3. GitHub pede autorizacao ao usuario
4. GitHub redireciona de volta para o backend do BetterAuth
5. BetterAuth cria/atualiza o usuario no banco, cria sessao
6. BetterAuth seta cookies (SessionToken + State)
7. Redireciona para `callbackURL` (ex: `/`)

Todo esse flow acontece "por baixo dos panos" — voce so chama uma funcao.

## O hook useSession

Quando o usuario da F5 na aplicacao, o browser so tem o cookie de sessao (um token opaco). O `useSession()` faz uma requisicao `getSession` para o backend que:
1. Valida o token do cookie
2. Retorna os dados do usuario (nome, email, imagem)
3. Enquanto isso, `isPending` e `true`

Por isso e essencial tratar o estado de loading — sem isso, o usuario veria um flash do botao de login antes dos dados chegarem.

## Decisao de UI: ternarios encadeados

O instrutor menciona que "nao ve tanto problema" em ternarios encadeados para 3 estados. A alternativa seria extrair um componente ou usar early returns, mas para 3 estados simples (loading/logado/deslogado), o ternario encadeado e pragmatico e legivel.

## Variaveis de ambiente no Next.js

No Next.js, apenas variaveis com prefixo `NEXT_PUBLIC_` sao expostas ao client-side. Isso e uma medida de seguranca — variaveis como `DATABASE_URL` ou `AUTH_SECRET` nunca chegam ao browser. A URL da API e segura para expor porque e publica por natureza.