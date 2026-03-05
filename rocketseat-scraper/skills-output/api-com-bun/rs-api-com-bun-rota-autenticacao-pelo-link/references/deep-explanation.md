# Deep Explanation: Autenticacao por Magic Link (ElysiaJS)

## Por que a rota e GET e nao POST?

Quando o usuario recebe um email com um link de autenticacao e clica nele, o navegador faz uma requisicao GET. Nao ha como fazer o navegador enviar um POST ao clicar num link. Por isso, a rota de autenticacao por link deve ser GET.

## Arquitetura modular do ElysiaJS — por que o auth.ts existe

O ElysiaJS tem uma arquitetura onde cada `new Elysia()` e uma instancia isolada. Quando voce registra um plugin (como JWT) no server principal, ele **nao** fica automaticamente disponivel em todas as rotas que sao instancias separadas.

Isso e diferente do Express, onde middlewares globais afetam todas as rotas. No ElysiaJS, cada rota que precisa de JWT ou cookies precisa explicitamente fazer `.use(auth)`.

A solucao e criar um modulo `auth.ts` que exporta uma instancia Elysia com os plugins necessarios, e cada rota que precisa de autenticacao faz `.use(auth)` antes de definir seus endpoints.

O instrutor destaca: "Essa maneira do Elysia ser modular acaba sendo bom e acaba sendo ruim" — bom porque cada rota e independente e testavel, ruim porque voce precisa lembrar de registrar os modulos em cada rota.

## httpOnly: seguranca vs flexibilidade

O `httpOnly: true` no cookie impede que JavaScript client-side acesse o cookie. Isso protege contra:
- Extensoes maliciosas que varrem cookies do navegador
- Ataques XSS que tentam roubar tokens

O tradeoff: o frontend JavaScript nao consegue ler o cookie diretamente. Mas como o cookie e enviado automaticamente em requests HTTP, o backend sempre recebe o token. O frontend nao precisa ler o token, apenas fazer requests que o browser automaticamente anexa o cookie.

## Expiracao do link — por que 7 dias?

O instrutor usa dayjs para calcular a diferenca em dias entre a data de criacao do link e agora. Se passar de 7 dias, o link e considerado expirado. Isso e uma medida de seguranca — links de autenticacao nao devem ser eternos porque:
- Emails podem ser acessados por terceiros
- Links antigos representam superficie de ataque desnecessaria

## Single-use links

Apos autenticacao bem-sucedida, o auth link e deletado do banco de dados. Isso garante que cada link so pode ser usado uma vez. Se alguem interceptar o link depois do uso, ele ja nao funciona.

## Cookie path = '/'

O `path: '/'` significa que todas as rotas da aplicacao podem acessar o cookie. Se voce colocasse `/api`, apenas rotas que comecam com `/api` receberiam o cookie. Para autenticacao geral, '/' e o padrao correto.

## maxAge em segundos

O `maxAge` do cookie e definido em segundos (nao milissegundos). O padrao `60 * 60 * 24 * 7` e idiomatico e mais legivel que `604800`. O comentario `// 7 days` e essencial para clareza.

## Atualizacao do ElysiaJS — cookies nativos

Nas versoes mais recentes do ElysiaJS, o pacote `@elysiajs/cookie` nao e mais necessario. Cookies fazem parte do framework diretamente. A forma de acessar mudou de `setCookie('name', value, options)` para acessar via `cookie: { auth }` na desestruturacao e setar propriedades individualmente:

```typescript
auth.value = token
auth.httpOnly = true
auth.maxAge = 60 * 60 * 24 * 7
auth.path = '/'
```

## Verificacao do JWT

O instrutor demonstra no jwt.io que o token contem `sub` (userId) e `restaurantId`, assinado com HS256. A verificacao com a secret key confirma que o token e valido — `Signature Verified`.